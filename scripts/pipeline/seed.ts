import { seedData } from "../../lib/intelligence/seed-data";
import { exportPublishedArtifacts, hydrateDatabase } from "./shared";

async function main() {
  console.log("\n== Seeding AI News & Business Intelligence ==\n");

  await exportPublishedArtifacts({
    signals: seedData.signals,
    useCases: seedData.useCases,
    predictions: seedData.predictions.filter((prediction) => prediction.status === "approved"),
    reports: seedData.reports,
  });

  const result = await hydrateDatabase(seedData);
  if (result.inserted) {
    console.log("Database seed complete:", result);
  } else {
    console.log("Skipped database seed:", result.reason);
  }

  console.log("Published JSON fallback exported to data/published/.");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
