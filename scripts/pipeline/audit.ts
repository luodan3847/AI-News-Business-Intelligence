import { buildCoverageAudit } from "../../lib/intelligence/audit";
import type {
  AuditRecord,
  NormalizedSignal,
  PredictionRecord,
  ReportRecord,
  UseCaseRecord,
} from "../../lib/intelligence/types";
import { pipelinePaths, readJson, writeJson } from "./shared";

async function main() {
  console.log("\n== Pipeline step 6: audit ==\n");

  const [signals, useCases, predictions, reports] = await Promise.all([
    readJson<NormalizedSignal[]>(pipelinePaths.signals),
    readJson<UseCaseRecord[]>(pipelinePaths.useCases),
    readJson<PredictionRecord[]>(pipelinePaths.predictions),
    readJson<ReportRecord[]>(pipelinePaths.reports),
  ]);

  const audit: AuditRecord = buildCoverageAudit({
    signals,
    useCases,
    predictions,
    reports,
  });

  await writeJson(pipelinePaths.audit, audit);

  if (audit.warnings.length === 0) {
    console.log("Coverage audit passed with no warnings.");
  } else {
    console.log(`Coverage audit produced ${audit.warnings.length} warning(s).`);
    audit.warnings.forEach((warning) => console.log(`- ${warning}`));
  }
}

main().catch((error) => {
  console.error("Audit step failed:", error);
  process.exit(1);
});
