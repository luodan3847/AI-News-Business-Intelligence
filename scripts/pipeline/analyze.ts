import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { NormalizedSignal } from "../../lib/intelligence/types";
import { pipelinePaths, readJson, writeJson } from "./shared";

const analysisSchema = z.array(
  z.object({
    id: z.string(),
    summary: z.string(),
    businessImpact: z.string(),
    implementationHint: z.string(),
    status: z.enum(["draft", "approved", "archived"]),
  })
);

function fallbackAnalysis(signal: NormalizedSignal): NormalizedSignal {
  const focus =
    signal.functions[0]?.replace(/_/g, " ") ??
    signal.industries[0] ??
    "business operations";

  return {
    ...signal,
    summary:
      signal.summary.length > 240
        ? signal.summary.slice(0, 240)
        : `${signal.summary} This matters most for ${focus}.`,
    businessImpact:
      signal.businessImpact.includes("Business impact will be enriched")
        ? `This signal matters because it changes how teams in ${focus} can structure AI-assisted execution, evaluation, or governance.`
        : signal.businessImpact,
    implementationHint:
      signal.implementationHint.includes("Implementation guidance")
        ? `Start by testing this signal in one repeatable workflow where ${focus} outcomes can be measured week to week.`
        : signal.implementationHint,
    status: signal.confidenceScore >= 72 ? "approved" : "draft",
  };
}

async function analyzeWithClaude(signals: NormalizedSignal[]) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || signals.length === 0) {
    return [] as z.infer<typeof analysisSchema>;
  }

  const client = new Anthropic({ apiKey });
  const payload = signals.map((signal) => ({
    id: signal.id,
    title: signal.title,
    signalType: signal.signalType,
    sourceName: signal.sourceName,
    summary: signal.summary,
    vendors: signal.vendors,
    technologies: signal.technologies,
    industries: signal.industries,
    functions: signal.functions,
    impactScore: signal.impactScore,
    confidenceScore: signal.confidenceScore,
  }));

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `You are enriching normalized AI market signals for an intelligence dashboard.

Return a JSON array only. For each item:
- tighten the summary into 1-2 sentences
- write a businessImpact field aimed at operators, strategists, or product leaders
- write an implementationHint field explaining where to pilot or apply the insight
- set status to "approved" when the signal is strong enough for public publication, otherwise "draft"

Signals:
${JSON.stringify(payload, null, 2)}`,
      },
    ],
  });

  const text = message.content
    .map((block) => ("text" in block ? block.text : ""))
    .join("\n")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "");

  return analysisSchema.parse(JSON.parse(text));
}

async function main() {
  console.log("\n== Pipeline step 3: analyze ==\n");

  const normalizedPayload = await readJson<{
    generatedAt: string;
    itemCount: number;
    items: NormalizedSignal[];
  }>(pipelinePaths.normalized);

  const fallbackAnalyzed = normalizedPayload.items.map(fallbackAnalysis);
  let aiEnrichment: z.infer<typeof analysisSchema> = [];

  try {
    aiEnrichment = await analyzeWithClaude(normalizedPayload.items.slice(0, 20));
  } catch (error) {
    console.warn("Claude enrichment unavailable, using fallback analysis only.", error);
  }

  const aiMap = new Map(aiEnrichment.map((entry) => [entry.id, entry]));
  const analyzed = fallbackAnalyzed.map((signal) => {
    const enriched = aiMap.get(signal.id);
    if (!enriched) {
      return signal;
    }
    return {
      ...signal,
      summary: enriched.summary,
      businessImpact: enriched.businessImpact,
      implementationHint: enriched.implementationHint,
      status: enriched.status,
    };
  });

  await writeJson(pipelinePaths.analyzed, {
    generatedAt: new Date().toISOString(),
    itemCount: analyzed.length,
    items: analyzed,
  });

  console.log(`Analyzed ${analyzed.length} signals.`);
}

main().catch((error) => {
  console.error("Analyze step failed:", error);
  process.exit(1);
});
