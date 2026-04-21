import type {
  NormalizedSignal,
  PredictionRecord,
  RawSignal,
  ReportRecord,
  SourceRecord,
  UseCaseRecord,
} from "../../lib/intelligence/types";
import {
  exportPublishedArtifacts,
  hydrateDatabase,
  pipelinePaths,
  readJson,
} from "./shared";

async function main() {
  console.log("\n== Pipeline step 5: publish ==\n");

  const proposal = await readJson<{
    generatedAt: string;
    sources: SourceRecord[];
    rawIngestions: RawSignal[];
    signals: NormalizedSignal[];
    useCases: UseCaseRecord[];
    predictions: PredictionRecord[];
    reports: ReportRecord[];
  }>(pipelinePaths.proposals);

  const publishable = {
    sources: proposal.sources,
    rawIngestions: proposal.rawIngestions,
    signals: proposal.signals.filter((signal) => signal.status === "approved"),
    useCases: proposal.useCases.filter((useCase) => useCase.status === "approved"),
    predictions: proposal.predictions.filter(
      (prediction) => prediction.status === "approved"
    ),
    reports: proposal.reports,
  };

  await exportPublishedArtifacts({
    signals: publishable.signals,
    useCases: publishable.useCases,
    predictions: publishable.predictions,
    reports: publishable.reports,
  });

  const result = await hydrateDatabase(publishable);
  if (result.inserted) {
    console.log("Published to database:", result);
  } else {
    console.log("Published JSON fallback only:", result.reason);
  }

  console.log("Public artifacts exported to data/published/.");
}

main().catch((error) => {
  console.error("Publish step failed:", error);
  process.exit(1);
});
