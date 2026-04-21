import { seedData } from "../../lib/intelligence/seed-data";
import { ingestAllSources } from "./source-catalog";
import { pipelinePaths, writeJson } from "./shared";

async function main() {
  console.log("\n== Pipeline step 1: ingest ==\n");

  const ingested = await ingestAllSources();
  const items = ingested.length > 0 ? ingested : seedData.rawIngestions;

  await writeJson(pipelinePaths.raw, {
    generatedAt: new Date().toISOString(),
    itemCount: items.length,
    items,
  });

  console.log(`Ingested ${items.length} raw signals.`);
  if (ingested.length === 0) {
    console.log("No live sources available, exported seed raw ingestions instead.");
  }
}

main().catch((error) => {
  console.error("Ingest step failed:", error);
  process.exit(1);
});
