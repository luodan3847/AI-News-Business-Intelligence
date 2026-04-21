import {
  buildSignalScore,
  detectThemesForSignal,
  getPrimaryFunction,
  getPrimaryIndustry,
  getPrimaryTheme,
  themeDefinitions,
} from "../../lib/intelligence/rebalance";
import { seedData } from "../../lib/intelligence/seed-data";
import type {
  ImpactArea,
  NormalizedSignal,
  PredictionRecord,
  ReportRecord,
  UseCaseRecord,
} from "../../lib/intelligence/types";
import { pipelinePaths, readJson, writeJson } from "./shared";

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Map<string, T>();
  items.forEach((item) => {
    if (!seen.has(item.id)) {
      seen.set(item.id, item);
    }
  });
  return Array.from(seen.values());
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildUseCaseTitle(
  themeId: string,
  industry: string,
  businessFunction: string
) {
  switch (themeId) {
    case "frontier_research":
      return `${industry} research monitoring and benchmark triage`;
    case "model_platforms":
      return `${industry} AI platform evaluation cockpit`;
    case "open_source_stack":
      return `Open-source AI stack evaluation for ${industry.toLowerCase()} teams`;
    case "workflow_orchestration":
      return `${industry} workflow orchestration assistant`;
    case "knowledge_systems":
      return `${industry} knowledge retrieval and synthesis assistant`;
    case "governance_and_controls":
      return `${industry} AI governance and approval layer`;
    case "document_intelligence":
      return `${industry} document review and obligation extraction workflow`;
    case "customer_operations":
      return `${industry} customer operations copilot`;
    case "multimodal_field_ops":
      return `${industry} multimodal operations review assistant`;
    case "executive_intelligence":
      return "Executive AI market and implementation brief";
    default:
      return `${industry} ${titleCase(businessFunction)} intelligence workflow`;
  }
}

function buildProblemStatement(
  businessFunction: string,
  industry: string,
  themeId: string
) {
  switch (businessFunction) {
    case "strategy":
      return `Teams in ${industry} need a consistent way to turn fast-moving AI signals into portfolio, platform, and investment decisions.`;
    case "product":
      return `Product teams in ${industry} struggle to translate fragmented AI movement into clear roadmap and feature decisions.`;
    case "engineering":
      return `Engineering teams in ${industry} need a practical way to evaluate tools, frameworks, and model infrastructure without creating stack sprawl.`;
    case "customer_experience":
      return `Customer-facing teams in ${industry} need to move from passive summaries to guided actions, routing, and service consistency.`;
    case "risk":
      return `Risk and control owners in ${industry} need AI workflows that preserve traceability, approvals, and clear action boundaries.`;
    default:
      return themeId === "frontier_research"
        ? `Teams need a way to translate frontier AI research into operating decisions before it gets lost in technical noise.`
        : `Teams in ${industry} need to convert AI signal movement into measurable operational workflows instead of ad hoc experimentation.`;
  }
}

function buildSolutionPattern(
  signal: NormalizedSignal,
  themeId: string,
  businessFunction: string
) {
  const base = signal.implementationHint || "Pilot the workflow in one measurable team process before scaling.";

  if (themeId === "frontier_research") {
    return `Track the signal in a research watchlist, compare it to adjacent papers or platform releases, and translate implications into a short operator brief. ${base}`;
  }

  if (themeId === "governance_and_controls") {
    return `Attach the signal to an approval model with action tiers, audit visibility, and explicit escalation gates. ${base}`;
  }

  if (businessFunction === "customer_experience") {
    return `Connect summarization, routing, and recommendation steps into one reviewed service workflow. ${base}`;
  }

  if (businessFunction === "engineering") {
    return `Evaluate the signal inside one bounded toolchain or developer workflow before adopting it across the broader stack. ${base}`;
  }

  return `Turn the signal into one repeatable workflow with measurable ownership, review rules, and clear downstream value. ${base}`;
}

function buildRiskStatement(themeId: string, businessFunction: string) {
  if (themeId === "frontier_research") {
    return "Weak translation from research signal to business relevance, overreaction to benchmarks, and unclear adoption timing.";
  }

  if (businessFunction === "risk") {
    return "Weak approval design, poor traceability, and automation boundaries that are unclear to operators.";
  }

  if (businessFunction === "engineering") {
    return "Tool sprawl, brittle integrations, and low-confidence outputs entering core engineering workflows too early.";
  }

  if (businessFunction === "customer_experience") {
    return "Bad routing, policy mismatch, and over-automation in moments that still need human judgment.";
  }

  return "Weak ownership, low-quality source data, and unclear review loops that undermine trust in the workflow.";
}

function deriveImplementationLevel(signal: NormalizedSignal, themeId: string): UseCaseRecord["implementationLevel"] {
  if (themeId === "frontier_research" || themeId === "open_source_stack") {
    return signal.confidenceScore >= 84 ? "team_ready" : "pilot";
  }

  if (signal.signalType === "use_case_signal" && signal.confidenceScore >= 80) {
    return "production";
  }

  if (signal.impactScore >= 90 && signal.confidenceScore >= 84) {
    return "production";
  }

  return signal.impactScore >= 82 ? "team_ready" : "pilot";
}

function deriveMaturity(signal: NormalizedSignal, themeId: string): UseCaseRecord["maturity"] {
  if (themeId === "frontier_research") {
    return signal.confidenceScore >= 82 ? "validated" : "emerging";
  }

  if (signal.signalType === "use_case_signal" || signal.impactScore >= 90) {
    return "validated";
  }

  return signal.confidenceScore >= 84 ? "scaling" : "emerging";
}

function selectBalancedSignals(signals: NormalizedSignal[], limit: number) {
  const ranked = [...signals].sort((left, right) => buildSignalScore(right) - buildSignalScore(left));
  const selected: NormalizedSignal[] = [];
  const selectedIds = new Set<string>();
  const sourceCounts = new Map<string, number>();
  const typeCounts = new Map<string, number>();
  const themeCounts = new Map<string, number>();
  const functionCounts = new Map<string, number>();

  const tryAdd = (
    signal: NormalizedSignal,
    caps: { source: number; type: number; theme: number; businessFunction: number }
  ) => {
    if (selectedIds.has(signal.id) || selected.length >= limit) {
      return false;
    }

    const primaryTheme = getPrimaryTheme(signal).id;
    const primaryFunction = getPrimaryFunction(signal);

    if ((sourceCounts.get(signal.sourceName) ?? 0) >= caps.source) {
      return false;
    }
    if ((typeCounts.get(signal.signalType) ?? 0) >= caps.type) {
      return false;
    }
    if ((themeCounts.get(primaryTheme) ?? 0) >= caps.theme) {
      return false;
    }
    if ((functionCounts.get(primaryFunction) ?? 0) >= caps.businessFunction) {
      return false;
    }

    selected.push(signal);
    selectedIds.add(signal.id);
    increment(sourceCounts, signal.sourceName);
    increment(typeCounts, signal.signalType);
    increment(themeCounts, primaryTheme);
    increment(functionCounts, primaryFunction);
    return true;
  };

  for (const theme of themeDefinitions) {
    const candidate = ranked.find((signal) =>
      detectThemesForSignal(signal).some((entry) => entry.id === theme.id)
    );
    if (candidate) {
      tryAdd(candidate, { source: 2, type: 2, theme: 1, businessFunction: 1 });
    }
  }

  for (const businessFunction of [
    "strategy",
    "operations",
    "risk",
    "product",
    "engineering",
    "customer_experience",
  ]) {
    const candidate = ranked.find((signal) => getPrimaryFunction(signal) === businessFunction);
    if (candidate) {
      tryAdd(candidate, { source: 2, type: 2, theme: 2, businessFunction: 1 });
    }
  }

  for (const signal of ranked) {
    if (selected.length >= limit) {
      break;
    }

    tryAdd(signal, { source: 3, type: 5, theme: 2, businessFunction: 3 });
  }

  for (const signal of ranked) {
    if (selected.length >= limit) {
      break;
    }

    if (!selectedIds.has(signal.id)) {
      selected.push(signal);
      selectedIds.add(signal.id);
    }
  }

  return selected;
}

function deriveUseCase(signal: NormalizedSignal, index: number): UseCaseRecord {
  const theme = getPrimaryTheme(signal);
  const industry = getPrimaryIndustry(signal);
  const businessFunction = getPrimaryFunction(signal) as UseCaseRecord["businessFunction"];
  const tools = Array.from(new Set([...signal.technologies, ...signal.vendors])).slice(0, 4);

  return {
    id: `derived-usecase-${index + 1}`,
    title: buildUseCaseTitle(theme.id, industry, businessFunction),
    industry,
    businessFunction,
    problem: buildProblemStatement(businessFunction, industry, theme.id),
    solutionPattern: buildSolutionPattern(signal, theme.id, businessFunction),
    tools,
    implementationLevel: deriveImplementationLevel(signal, theme.id),
    expectedValue: `Creates clearer operating leverage for ${titleCase(
      businessFunction
    )} teams by turning signal movement into a repeatable workflow with measurable ownership.`,
    risks: buildRiskStatement(theme.id, businessFunction),
    businessImpact: signal.businessImpact,
    maturity: deriveMaturity(signal, theme.id),
    sourceSignalIds: [signal.id],
    status: signal.status,
  };
}

function derivePredictions(signals: NormalizedSignal[]) {
  const rankedSignals = [...signals].sort(
    (left, right) => buildSignalScore(right) - buildSignalScore(left)
  );

  const derived: PredictionRecord[] = [];

  for (const theme of themeDefinitions) {
    const relatedSignals = rankedSignals.filter((signal) =>
      detectThemesForSignal(signal).some((entry) => entry.id === theme.id)
    );

    if (relatedSignals.length < 2) {
      continue;
    }

    const supportingSignals = selectBalancedSignals(relatedSignals, 4);
    const averageConfidence = Math.round(
      supportingSignals.reduce((total, signal) => total + signal.confidenceScore, 0) /
        supportingSignals.length
    );
    const sourceDiversity = new Set(supportingSignals.map((signal) => signal.sourceName)).size;

    derived.push({
      id: `derived-prediction-${theme.id}`,
      title: theme.predictionTitle,
      statement: theme.predictionStatement,
      timeframe: theme.timeframe,
      confidence: Math.min(92, averageConfidence + Math.min(8, sourceDiversity * 2)),
      rationale: supportingSignals
        .slice(0, 2)
        .map((signal) => signal.businessImpact)
        .join(" "),
      impactArea: theme.impactArea as ImpactArea,
      supportingSignalIds: supportingSignals.map((signal) => signal.id),
      aiDraft: theme.aiDraft,
      analystRevision: theme.analystRevision,
      status: averageConfidence >= 76 ? "approved" : "under_review",
      createdAt: new Date().toISOString(),
    });
  }

  return derived;
}

function rankUseCase(useCase: UseCaseRecord) {
  const maturityScore = {
    emerging: 1,
    validated: 2,
    scaling: 3,
    mainstream: 4,
  }[useCase.maturity];

  const implementationScore = {
    pilot: 1,
    team_ready: 2,
    production: 3,
    enterprise_scale: 4,
  }[useCase.implementationLevel];

  const derivedBonus = useCase.id.startsWith("derived-") ? 2 : 0;
  return maturityScore * 10 + implementationScore * 5 + useCase.sourceSignalIds.length + derivedBonus;
}

function selectUseCasePortfolio(useCases: UseCaseRecord[], limit: number) {
  const ranked = uniqueById(useCases).sort((left, right) => rankUseCase(right) - rankUseCase(left));
  const selected: UseCaseRecord[] = [];
  const industryCounts = new Map<string, number>();
  const functionCounts = new Map<string, number>();

  for (const useCase of ranked) {
    if (selected.length >= limit) {
      break;
    }

    if ((industryCounts.get(useCase.industry) ?? 0) >= 3) {
      continue;
    }
    if ((functionCounts.get(useCase.businessFunction) ?? 0) >= 4) {
      continue;
    }

    selected.push(useCase);
    increment(industryCounts, useCase.industry);
    increment(functionCounts, useCase.businessFunction);
  }

  for (const useCase of ranked) {
    if (selected.length >= limit) {
      break;
    }

    if (!selected.some((entry) => entry.id === useCase.id)) {
      selected.push(useCase);
    }
  }

  return selected;
}

function rankPrediction(prediction: PredictionRecord) {
  return (
    prediction.confidence +
    (prediction.status === "approved" ? 10 : 0) +
    (prediction.id.startsWith("derived-") ? 5 : 0)
  );
}

function selectPredictionPortfolio(predictions: PredictionRecord[], limit: number) {
  const ranked = uniqueById(predictions).sort(
    (left, right) => rankPrediction(right) - rankPrediction(left)
  );
  const selected: PredictionRecord[] = [];
  const impactAreaCounts = new Map<string, number>();
  const timeframeCounts = new Map<string, number>();

  for (const prediction of ranked) {
    if (selected.length >= limit) {
      break;
    }

    if ((impactAreaCounts.get(prediction.impactArea) ?? 0) >= 3) {
      continue;
    }
    if ((timeframeCounts.get(prediction.timeframe) ?? 0) >= 5) {
      continue;
    }

    selected.push(prediction);
    increment(impactAreaCounts, prediction.impactArea);
    increment(timeframeCounts, prediction.timeframe);
  }

  for (const prediction of ranked) {
    if (selected.length >= limit) {
      break;
    }

    if (!selected.some((entry) => entry.id === prediction.id)) {
      selected.push(prediction);
    }
  }

  return selected;
}

function summarizeThemes(signals: NormalizedSignal[]) {
  const themeCounts = new Map<string, number>();

  for (const signal of signals) {
    const theme = getPrimaryTheme(signal);
    increment(themeCounts, theme.id);
  }

  return themeDefinitions
    .map((theme) => ({
      theme,
      count: themeCounts.get(theme.id) ?? 0,
    }))
    .filter((entry) => entry.count > 0)
    .sort((left, right) => right.count - left.count);
}

function buildDailyReport(
  reportDate: string,
  signals: NormalizedSignal[],
  useCases: UseCaseRecord[],
  predictions: PredictionRecord[]
): ReportRecord {
  const topSignals = selectBalancedSignals(signals, 6).slice(0, 4);
  const topUseCases = selectUseCasePortfolio(useCases, 6).slice(0, 3);
  const approvedPredictions = predictions.filter((prediction) => prediction.status === "approved");
  const topThemes = summarizeThemes(topSignals).slice(0, 3);
  const themeSummary = topThemes.map((entry) => entry.theme.label.toLowerCase()).join(", ");

  return {
    id: `report-${reportDate}`,
    reportDate,
    executiveSummary:
      topThemes.length > 0
        ? `Today's AI picture is being shaped by ${themeSummary}. The strongest signals point to a market where research progress, platform controls, and workflow execution are converging into more operational buying criteria.`
        : "Today's report highlights how AI market movement is translating into operational systems, platform decisions, and business workflow redesign.",
    topSignalIds: topSignals.map((signal) => signal.id),
    topUseCaseIds: topUseCases.map((useCase) => useCase.id),
    strategicTakeaways:
      topThemes.map((entry) => entry.theme.takeaway).slice(0, 3).length > 0
        ? topThemes.map((entry) => entry.theme.takeaway).slice(0, 3)
        : [
            "Research, platforms, and workflow systems should be evaluated together rather than as separate narratives.",
            "Operational trust is becoming as important as model quality in enterprise adoption.",
            "Business value is strongest when signals are translated into reviewable systems rather than one-off experiments.",
          ],
    businessImpactSummary:
      topSignals
        .slice(0, 2)
        .map((signal) => signal.businessImpact)
        .join(" ") ||
      "The strongest business implication is that AI value is becoming more tied to execution design, governance, and operational embedding.",
    predictionUpdates: approvedPredictions.slice(0, 3).map((prediction) => prediction.title),
    publishedAt: new Date(`${reportDate}T18:00:00.000Z`).toISOString(),
  };
}

async function main() {
  console.log("\n== Pipeline step 4: propose ==\n");

  const rawPayload = await readJson<{ items: typeof seedData.rawIngestions }>(pipelinePaths.raw);
  const analyzedPayload = await readJson<{ items: NormalizedSignal[] }>(pipelinePaths.analyzed);

  const approvedSignals = analyzedPayload.items
    .filter((signal) => signal.status === "approved")
    .sort((left, right) => buildSignalScore(right) - buildSignalScore(left));

  const balancedSignals = selectBalancedSignals(approvedSignals, 12);
  const derivedUseCases = balancedSignals.slice(0, 10).map(deriveUseCase);
  const mergedUseCases = selectUseCasePortfolio(
    [...derivedUseCases, ...seedData.useCases],
    24
  );

  const derivedPredictions = derivePredictions(approvedSignals);
  const mergedPredictions = selectPredictionPortfolio(
    [...derivedPredictions, ...seedData.predictions],
    15
  );

  const reportDate =
    approvedSignals[0]?.publishedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const dailyReport = buildDailyReport(
    reportDate,
    approvedSignals,
    mergedUseCases,
    mergedPredictions
  );
  const mergedReports = uniqueById([dailyReport, ...seedData.reports]).sort((left, right) =>
    right.reportDate.localeCompare(left.reportDate)
  );

  const proposal = {
    generatedAt: new Date().toISOString(),
    sources: seedData.sources,
    rawIngestions: rawPayload.items,
    signals: approvedSignals,
    useCases: mergedUseCases,
    predictions: mergedPredictions,
    reports: mergedReports,
  };

  await writeJson(pipelinePaths.proposals, proposal);
  console.log(
    `Proposed ${proposal.useCases.length} use cases, ${proposal.predictions.length} predictions, and ${proposal.reports.length} reports.`
  );
}

main().catch((error) => {
  console.error("Propose step failed:", error);
  process.exit(1);
});
