import fs from "node:fs/promises";
import path from "node:path";
import { desc, eq } from "drizzle-orm";
import { db, hasDatabaseConnection } from "../db/client";
import {
  predictions,
  rawIngestions,
  reports,
  signals,
  sources,
  useCases,
} from "../db/schema";
import { buildCoverageAudit } from "./audit";
import { seedDashboardData, seedData } from "./seed-data";
import { buildToolTrackingEntries } from "./tool-tracking";
import type {
  AuditRecord,
  DashboardData,
  NewsFilters,
  NormalizedSignal,
  PredictionRecord,
  ReportRecord,
  ToolTrackingEntry,
  UseCaseFilters,
  UseCaseRecord,
} from "./types";

async function readPublishedJson<T>(filename: string): Promise<T | null> {
  try {
    const target = path.join(process.cwd(), "data", "published", filename);
    const raw = await fs.readFile(target, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function describeError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function withDatabaseFallback<T>(
  label: string,
  loadFromDb: () => Promise<T>,
  loadFallback: () => Promise<T> | T
) {
  if (!hasDatabaseConnection() || !db) {
    return await loadFallback();
  }

  try {
    return await loadFromDb();
  } catch (error) {
    console.warn(
      `[repository] Database read failed for ${label}; falling back to published artifacts.`,
      describeError(error)
    );
    return await loadFallback();
  }
}

async function readPipelineRawCount() {
  try {
    const target = path.join(process.cwd(), "data", "pipeline", "raw-ingestions.json");
    const raw = await fs.readFile(target, "utf8");
    const payload = JSON.parse(raw) as { itemCount?: number; items?: unknown[] };
    return payload.itemCount ?? payload.items?.length ?? null;
  } catch {
    return null;
  }
}

function withinPublishedRange(
  publishedAt: string,
  anchorPublishedAt: string,
  range: NewsFilters["publishedRange"] = "all"
) {
  if (!range || range === "all") {
    return true;
  }

  const end = new Date(anchorPublishedAt);
  const current = new Date(`${end.toISOString().slice(0, 10)}T23:59:59.000Z`);
  const candidate = new Date(publishedAt);
  const days =
    range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
  const boundary = new Date(current);
  boundary.setUTCDate(boundary.getUTCDate() - days);
  return candidate >= boundary;
}

function filterSignals(items: NormalizedSignal[], filters: NewsFilters = {}) {
  const anchorPublishedAt =
    items
      .map((item) => item.publishedAt)
      .sort((left, right) => right.localeCompare(left))[0] ??
    seedData.reports[0]?.publishedAt ??
    new Date().toISOString();

  return items.filter((item) => {
    if (filters.source && filters.source !== "all" && item.sourceName !== filters.source) {
      return false;
    }

    if (
      filters.vendor &&
      filters.vendor !== "all" &&
      !item.vendors.includes(filters.vendor)
    ) {
      return false;
    }

    if (
      filters.signalType &&
      filters.signalType !== "all" &&
      item.signalType !== filters.signalType
    ) {
      return false;
    }

    if (
      typeof filters.minImpactScore === "number" &&
      item.impactScore < filters.minImpactScore
    ) {
      return false;
    }

    if (!withinPublishedRange(item.publishedAt, anchorPublishedAt, filters.publishedRange)) {
      return false;
    }

    return true;
  });
}

function filterUseCases(items: UseCaseRecord[], filters: UseCaseFilters = {}) {
  return items.filter((item) => {
    if (filters.industry && filters.industry !== "all" && item.industry !== filters.industry) {
      return false;
    }

    if (
      filters.businessFunction &&
      filters.businessFunction !== "all" &&
      item.businessFunction !== filters.businessFunction
    ) {
      return false;
    }

    if (filters.tool && filters.tool !== "all" && !item.tools.includes(filters.tool)) {
      return false;
    }

    if (
      filters.implementationLevel &&
      filters.implementationLevel !== "all" &&
      item.implementationLevel !== filters.implementationLevel
    ) {
      return false;
    }

    if (filters.maturity && filters.maturity !== "all" && item.maturity !== filters.maturity) {
      return false;
    }

    return true;
  });
}

function buildToolTracking(
  signalItems: NormalizedSignal[],
  useCaseItems: UseCaseRecord[]
): ToolTrackingEntry[] {
  return buildToolTrackingEntries(signalItems, useCaseItems);
}

function buildReportShell(
  signalsList: NormalizedSignal[],
  useCaseList: UseCaseRecord[],
  predictionList: PredictionRecord[]
): ReportRecord {
  const topSignals = signalsList.slice(0, 4);
  const topUseCases = useCaseList.slice(0, 3);
  const reportDate =
    topSignals[0]?.publishedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10);

  return {
    id: `report-shell-${reportDate}`,
    reportDate,
    executiveSummary:
      topSignals[0]?.businessImpact ??
      "No analyst-authored report is published yet, so this dashboard is showing the current approved signal layer.",
    topSignalIds: topSignals.map((signal) => signal.id),
    topUseCaseIds: topUseCases.map((useCase) => useCase.id),
    strategicTakeaways: [
      "Signal quality is higher when multiple vendor, tool, and community sources point in the same direction.",
      "Use cases become strategically meaningful when they are tied to a repeatable workflow and a business function.",
      "Predictions should be reviewed through supporting signals before they are treated as planning input.",
    ],
    businessImpactSummary:
      topSignals
        .slice(0, 2)
        .map((signal) => signal.businessImpact)
        .join(" ") || seedDashboardData.dailyBrief.businessImpactSummary,
    predictionUpdates: predictionList.slice(0, 3).map((prediction) => prediction.title),
    publishedAt: new Date(`${reportDate}T18:00:00.000Z`).toISOString(),
  };
}

function buildDashboardData(
  latestReport: ReportRecord,
  signalsList: NormalizedSignal[],
  useCaseList: UseCaseRecord[],
  predictionList: PredictionRecord[]
): DashboardData {
  const topSignals = signalsList
    .filter((signal) => latestReport.topSignalIds.includes(signal.id))
    .concat(
      signalsList.filter((signal) => !latestReport.topSignalIds.includes(signal.id)).slice(0, 6)
    )
    .slice(0, 6);

  const topUseCases = useCaseList
    .filter((useCase) => latestReport.topUseCaseIds.includes(useCase.id))
    .concat(
      useCaseList
        .filter((useCase) => !latestReport.topUseCaseIds.includes(useCase.id))
        .slice(0, 6)
    )
    .slice(0, 6);

  return {
    dailyBrief: latestReport,
    topSignals,
    useCases: topUseCases,
    businessSignals: signalsList
      .filter((signal) => signal.impactScore >= 85)
      .slice(0, 5),
    tools: buildToolTracking(signalsList, useCaseList).slice(0, 6),
    predictions: predictionList.slice(0, 6),
  };
}

async function getDbSignals(): Promise<NormalizedSignal[]> {
  if (!db) {
    return [];
  }

  const rows = await db
    .select()
    .from(signals)
    .where(eq(signals.status, "approved"))
    .orderBy(desc(signals.publishedAt));

  return rows.map((row) => ({
    id: row.id,
    rawIngestionId: row.rawIngestionId,
    signalType: row.signalType,
    title: row.title,
    summary: row.summary,
    sourceName: row.sourceName,
    url: row.url,
    publishedAt: row.publishedAt.toISOString(),
    vendors: row.vendors,
    technologies: row.technologies,
    industries: row.industries,
    functions: row.functions,
    impactScore: row.impactScore,
    noveltyScore: row.noveltyScore,
    confidenceScore: row.confidenceScore,
    businessImpact: row.businessImpact,
    implementationHint: row.implementationHint,
    status: row.status,
  }));
}

async function getDbUseCases(): Promise<UseCaseRecord[]> {
  if (!db) {
    return [];
  }

  const rows = await db
    .select()
    .from(useCases)
    .where(eq(useCases.status, "approved"))
    .orderBy(desc(useCases.title));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    industry: row.industry,
    businessFunction: row.businessFunction,
    problem: row.problem,
    solutionPattern: row.solutionPattern,
    tools: row.tools,
    implementationLevel: row.implementationLevel,
    expectedValue: row.expectedValue,
    risks: row.risks,
    businessImpact: row.businessImpact,
    maturity: row.maturity,
    sourceSignalIds: row.sourceSignalIds,
    status: row.status,
  }));
}

async function getDbPredictions(): Promise<PredictionRecord[]> {
  if (!db) {
    return [];
  }

  const rows = await db
    .select()
    .from(predictions)
    .where(eq(predictions.status, "approved"))
    .orderBy(desc(predictions.createdAt));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    statement: row.statement,
    timeframe: row.timeframe as PredictionRecord["timeframe"],
    confidence: row.confidence,
    rationale: row.rationale,
    impactArea: row.impactArea,
    supportingSignalIds: row.supportingSignalIds,
    aiDraft: row.aiDraft,
    analystRevision: row.analystRevision,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));
}

async function getDbReports(): Promise<ReportRecord[]> {
  if (!db) {
    return [];
  }

  const rows = await db.select().from(reports).orderBy(desc(reports.reportDate));

  return rows.map((row) => ({
    id: row.id,
    reportDate: row.reportDate,
    executiveSummary: row.executiveSummary,
    topSignalIds: row.topSignalIds,
    topUseCaseIds: row.topUseCaseIds,
    strategicTakeaways: row.strategicTakeaways,
    businessImpactSummary: row.businessImpactSummary,
    predictionUpdates: row.predictionUpdates,
    publishedAt: row.publishedAt.toISOString(),
  }));
}

export async function getAllSources() {
  return withDatabaseFallback(
    "sources",
    async () => {
      const rows = await db!.select().from(sources).orderBy(desc(sources.priority));
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        baseUrl: row.baseUrl,
        enabled: row.enabled,
        priority: row.priority,
      }));
    },
    () => seedData.sources
  );
}

export async function getRawIngestionCount() {
  return withDatabaseFallback(
    "raw ingestion count",
    async () => {
      const rows = await db!.select().from(rawIngestions);
      return rows.length;
    },
    async () => (await readPipelineRawCount()) ?? seedData.rawIngestions.length
  );
}

export async function listSignals(filters: NewsFilters = {}) {
  const publishedSignals = await readPublishedJson<NormalizedSignal[]>("signals.json");
  const items = await withDatabaseFallback(
    "signals",
    () => getDbSignals(),
    () => publishedSignals ?? seedData.signals
  );
  return filterSignals(items, filters);
}

export async function listUseCases(filters: UseCaseFilters = {}) {
  const publishedUseCases = await readPublishedJson<UseCaseRecord[]>("use-cases.json");
  const items = await withDatabaseFallback(
    "use cases",
    () => getDbUseCases(),
    () => publishedUseCases ?? seedData.useCases
  );
  return filterUseCases(items, filters);
}

export async function listPredictions() {
  const publishedPredictions =
    await readPublishedJson<PredictionRecord[]>("predictions.json");
  return withDatabaseFallback(
    "predictions",
    () => getDbPredictions(),
    () =>
      publishedPredictions ??
      seedData.predictions.filter((prediction) => prediction.status === "approved")
  );
}

export async function listReports() {
  const publishedReports = await readPublishedJson<ReportRecord[]>("reports.json");
  return withDatabaseFallback(
    "reports",
    () => getDbReports(),
    () => publishedReports ?? seedData.reports
  );
}

export async function getLatestReport() {
  const reportsList = await listReports();
  return reportsList.sort((a, b) => b.reportDate.localeCompare(a.reportDate))[0] ?? null;
}

export async function getReportByDate(reportDate: string) {
  const reportsList = await listReports();
  return reportsList.find((report) => report.reportDate === reportDate) ?? null;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [signalsList, useCaseList, predictionList, latestReport] = await Promise.all([
    listSignals({}),
    listUseCases({}),
    listPredictions(),
    getLatestReport(),
  ]);

  if (signalsList.length === 0 && useCaseList.length === 0 && predictionList.length === 0) {
    return seedDashboardData;
  }

  return buildDashboardData(
    latestReport ?? buildReportShell(signalsList, useCaseList, predictionList),
    signalsList,
    useCaseList,
    predictionList
  );
}

export async function getToolTrackingEntries() {
  const [signalsList, useCaseList] = await Promise.all([
    listSignals({}),
    listUseCases({}),
  ]);
  return buildToolTracking(signalsList, useCaseList);
}

export async function getCoverageAudit(): Promise<AuditRecord | null> {
  const publishedAudit = await readPublishedJson<AuditRecord>("audit.json");
  if (publishedAudit) {
    return publishedAudit;
  }

  const [signalsList, useCaseList, predictionList, reportList] = await Promise.all([
    listSignals({}),
    listUseCases({}),
    listPredictions(),
    listReports(),
  ]);

  if (
    signalsList.length === 0 &&
    useCaseList.length === 0 &&
    predictionList.length === 0 &&
    reportList.length === 0
  ) {
    return buildCoverageAudit({
      signals: seedData.signals,
      useCases: seedData.useCases,
      predictions: seedData.predictions,
      reports: seedData.reports,
    });
  }

  return buildCoverageAudit({
    signals: signalsList,
    useCases: useCaseList,
    predictions: predictionList,
    reports: reportList,
  });
}
