import {
  detectThemesForSignal,
  getPrimaryFunction,
  getPrimaryIndustry,
} from "./rebalance";
import type {
  AuditDistributionItem,
  AuditRecord,
  NormalizedSignal,
  PredictionRecord,
  ReportRecord,
  UseCaseRecord,
} from "./types";

function countBy<T>(items: T[], getKey: (item: T) => string) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count);
}

function share(count: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Number((count / total).toFixed(4));
}

function appendConcentrationWarning(
  warnings: string[],
  items: AuditDistributionItem[],
  total: number,
  threshold: number,
  label: string
) {
  if (!items[0]) {
    return;
  }

  const concentration = share(items[0].count, total);
  if (concentration > threshold) {
    warnings.push(
      `${label} concentration is high: ${items[0].name} accounts for ${Math.round(
        concentration * 100
      )}% of published items.`
    );
  }
}

export function buildCoverageAudit(input: {
  signals: NormalizedSignal[];
  useCases: UseCaseRecord[];
  predictions: PredictionRecord[];
  reports: ReportRecord[];
  generatedAt?: string;
}): AuditRecord {
  const { generatedAt, predictions, reports, signals, useCases } = input;
  const signalSources = countBy(signals, (signal) => signal.sourceName);
  const signalTypes = countBy(signals, (signal) => signal.signalType);
  const signalFunctions = countBy(signals, (signal) => getPrimaryFunction(signal));
  const signalIndustries = countBy(signals, (signal) => getPrimaryIndustry(signal));
  const signalThemes = countBy(
    signals,
    (signal) => detectThemesForSignal(signal)[0]?.label ?? "Unclassified"
  );
  const useCaseIndustries = countBy(useCases, (useCase) => useCase.industry);
  const useCaseFunctions = countBy(useCases, (useCase) => useCase.businessFunction);
  const predictionImpactAreas = countBy(predictions, (prediction) => prediction.impactArea);

  const warnings: string[] = [];
  const totalSignals = signals.length;

  appendConcentrationWarning(warnings, signalSources, totalSignals, 0.35, "Source");
  appendConcentrationWarning(warnings, signalTypes, totalSignals, 0.6, "Signal-type");

  if (signalFunctions.length < 4) {
    warnings.push(
      `Function coverage is narrow: only ${signalFunctions.length} primary functions appear in the published signal set.`
    );
  }

  if (signalIndustries.length < 6) {
    warnings.push(
      `Industry coverage is narrow: only ${signalIndustries.length} primary industries appear in the published signal set.`
    );
  }

  if (signalThemes.length < 5) {
    warnings.push(
      `Theme coverage is narrow: only ${signalThemes.length} primary themes appear in the published signal set.`
    );
  }

  if (predictionImpactAreas.length < 4) {
    warnings.push(
      `Prediction coverage is narrow: only ${predictionImpactAreas.length} impact areas appear across approved predictions.`
    );
  }

  if (useCaseIndustries.length < 8) {
    warnings.push(
      `Use case diversity is limited: only ${useCaseIndustries.length} industries appear across approved use cases.`
    );
  }

  return {
    generatedAt: generatedAt ?? new Date().toISOString(),
    passed: warnings.length === 0,
    summary: {
      signalCount: signals.length,
      useCaseCount: useCases.length,
      predictionCount: predictions.length,
      reportCount: reports.length,
      distinctSources: signalSources.length,
      distinctThemes: signalThemes.length,
      distinctFunctions: signalFunctions.length,
      distinctIndustries: signalIndustries.length,
    },
    distributions: {
      signalSources,
      signalTypes,
      signalFunctions,
      signalIndustries,
      signalThemes,
      useCaseIndustries,
      useCaseFunctions,
      predictionImpactAreas,
    },
    warnings,
  };
}
