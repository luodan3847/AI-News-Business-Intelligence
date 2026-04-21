import { seedData } from "../../lib/intelligence/seed-data";
import {
  inferFunctionsFromText,
  inferIndustriesFromText,
} from "../../lib/intelligence/rebalance";
import type { NormalizedSignal, RawSignal, SignalType } from "../../lib/intelligence/types";
import { pipelinePaths, readJson, stableHash, writeJson } from "./shared";

const vendorRules = [
  "Anthropic",
  "OpenAI",
  "Google",
  "Google DeepMind",
  "DeepMind",
  "Microsoft",
  "Meta",
  "Meta AI",
  "GitHub",
  "Hugging Face",
  "NVIDIA",
  "xAI",
  "HubSpot",
  "Notion",
  "Open Source",
];

const technologyRules = [
  "Claude Code",
  "Claude",
  "OpenAI",
  "Gemini",
  "Llama",
  "Transformers",
  "reasoning",
  "multimodal",
  "retrieval",
  "RAG",
  "inference",
  "benchmarks",
  "open weights",
  "GitHub Copilot",
  "VS Code",
  "agents",
  "workflow automation",
  "structured outputs",
  "observability",
  "MCP",
  "knowledge assistants",
];

const industryRules = [
  "Software",
  "Enterprise",
  "Consulting",
  "Financial Services",
  "Retail",
  "Support",
  "Legal",
  "Healthcare",
  "Manufacturing",
  "Education",
  "Research",
  "SaaS",
];

const functionRules = [
  "engineering",
  "operations",
  "strategy",
  "product",
  "customer experience",
  "risk",
];

function classifySignalType(item: RawSignal): SignalType {
  const haystack = `${item.titleRaw} ${item.contentRaw}`.toLowerCase();
  const sourceName = mapSourceName(item.sourceId);

  if (sourceName === "GitHub Releases") {
    return "release";
  }

  if (sourceName === "Hacker News" || sourceName === "Reddit") {
    return "market_signal";
  }

  if (sourceName === "YouTube/Bilibili") {
    return "use_case_signal";
  }

  if (haystack.includes("release") || haystack.includes("changelog") || haystack.includes("announces")) {
    return "release";
  }
  if (
    haystack.includes("paper") ||
    haystack.includes("research") ||
    haystack.includes("arxiv") ||
    haystack.includes("benchmark") ||
    haystack.includes("preprint")
  ) {
    return "news";
  }
  if (
    haystack.includes("copilot") ||
    haystack.includes("editor") ||
    haystack.includes("vscode") ||
    haystack.includes("claude code") ||
    haystack.includes("tool")
  ) {
    return "tool_update";
  }
  if (
    haystack.includes("case study") ||
    haystack.includes("workflow") ||
    haystack.includes("implementation") ||
    haystack.includes("customer story") ||
    haystack.includes("demo") ||
    haystack.includes("operations") ||
    haystack.includes("support") ||
    haystack.includes("review")
  ) {
    return "use_case_signal";
  }
  if (haystack.includes("discussion") || haystack.includes("market") || haystack.includes("debate")) {
    return "market_signal";
  }
  return "news";
}

function extractTerms(text: string, rules: string[]) {
  const haystack = text.toLowerCase();
  return rules.filter((rule) => haystack.includes(rule.toLowerCase()));
}

function buildSummary(item: RawSignal) {
  const content = item.contentRaw.replace(/\s+/g, " ").trim();
  if (!content) {
    return item.titleRaw;
  }
  return content.slice(0, 220);
}

function calculateImpact(item: RawSignal) {
  const haystack = `${item.titleRaw} ${item.contentRaw}`.toLowerCase();
  let score = 65;
  if (haystack.includes("enterprise") || haystack.includes("production")) score += 10;
  if (haystack.includes("agent") || haystack.includes("workflow")) score += 8;
  if (haystack.includes("paper") || haystack.includes("research") || haystack.includes("benchmark")) score += 5;
  if (haystack.includes("release") || haystack.includes("control")) score += 6;
  return Math.min(score, 95);
}

function calculateNovelty(item: RawSignal) {
  const haystack = `${item.titleRaw} ${item.contentRaw}`.toLowerCase();
  let score = 60;
  if (haystack.includes("new") || haystack.includes("first")) score += 8;
  if (haystack.includes("paper") || haystack.includes("research") || haystack.includes("open source")) score += 6;
  if (haystack.includes("platform") || haystack.includes("control")) score += 6;
  return Math.min(score, 90);
}

function calculateConfidence(item: RawSignal) {
  const source = seedData.sources.find((record) => record.id === item.sourceId);
  if (!source) {
    return 70;
  }
  if (source.type === "official_blog" || source.type === "release_feed") {
    return 86;
  }
  if (source.type === "tooling") {
    return 82;
  }
  return 74;
}

function mapSourceName(sourceId: string) {
  return seedData.sources.find((record) => record.id === sourceId)?.name ?? "Unknown source";
}

function normalizeItem(item: RawSignal): NormalizedSignal {
  const text = `${item.titleRaw} ${item.contentRaw}`;
  const literalFunctions = extractTerms(text, functionRules).map((value) =>
    value.replace("customer experience", "customer_experience")
  );
  const inferredFunctions = inferFunctionsFromText(text);
  const functions = Array.from(new Set([...literalFunctions, ...inferredFunctions])).slice(0, 3);
  const industries = Array.from(
    new Set([...extractTerms(text, industryRules), ...inferIndustriesFromText(text)])
  ).slice(0, 3);

  return {
    id: stableHash(`signal:${item.externalId}`).slice(0, 12),
    rawIngestionId: item.id,
    signalType: classifySignalType(item),
    title: item.titleRaw,
    summary: buildSummary(item),
    sourceName: mapSourceName(item.sourceId),
    url: item.url,
    publishedAt: item.publishedAt,
    vendors: extractTerms(text, vendorRules),
    technologies: extractTerms(text, technologyRules),
    industries,
    functions,
    impactScore: calculateImpact(item),
    noveltyScore: calculateNovelty(item),
    confidenceScore: calculateConfidence(item),
    businessImpact:
      "Business impact will be enriched in the analyze stage using either AI-generated or fallback analyst logic.",
    implementationHint:
      "Implementation guidance will be enriched in the analyze stage.",
    status: "draft",
  };
}

async function main() {
  console.log("\n== Pipeline step 2: normalize ==\n");

  const rawPayload = await readJson<{ generatedAt: string; itemCount: number; items: RawSignal[] }>(
    pipelinePaths.raw
  );

  const deduped = new Map<string, RawSignal>();
  for (const item of rawPayload.items) {
    const key = `${item.sourceId}:${item.externalId}:${item.url}`;
    if (!deduped.has(key)) {
      deduped.set(key, item);
    }
  }

  const normalized = Array.from(deduped.values()).map(normalizeItem);
  await writeJson(pipelinePaths.normalized, {
    generatedAt: new Date().toISOString(),
    itemCount: normalized.length,
    items: normalized,
  });

  console.log(`Normalized ${normalized.length} deduplicated signals.`);
}

main().catch((error) => {
  console.error("Normalize step failed:", error);
  process.exit(1);
});
