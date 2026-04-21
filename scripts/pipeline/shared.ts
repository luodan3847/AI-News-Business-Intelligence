import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import { db } from "../../lib/db/client";
import {
  predictions,
  rawIngestions,
  reports,
  signals,
  sources,
  useCases,
} from "../../lib/db/schema";
import { seedData } from "../../lib/intelligence/seed-data";
import type {
  NormalizedSignal,
  PredictionRecord,
  RawSignal,
  ReportRecord,
  SourceRecord,
  UseCaseRecord,
} from "../../lib/intelligence/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const pipelineDir = path.join(rootDir, "data", "pipeline");
const publishedDir = path.join(rootDir, "data", "published");

export const pipelinePaths = {
  raw: path.join(pipelineDir, "raw-ingestions.json"),
  normalized: path.join(pipelineDir, "normalized-signals.json"),
  analyzed: path.join(pipelineDir, "analyzed-signals.json"),
  proposals: path.join(pipelineDir, "proposals.json"),
  latestReport: path.join(publishedDir, "latest-report.json"),
  signals: path.join(publishedDir, "signals.json"),
  useCases: path.join(publishedDir, "use-cases.json"),
  predictions: path.join(publishedDir, "predictions.json"),
  reports: path.join(publishedDir, "reports.json"),
  dashboard: path.join(publishedDir, "dashboard.json"),
  audit: path.join(publishedDir, "audit.json"),
};

export async function ensurePipelineDirs() {
  await mkdir(pipelineDir, { recursive: true });
  await mkdir(publishedDir, { recursive: true });
}

export async function writeJson<T>(target: string, value: T) {
  await ensurePipelineDirs();
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readJson<T>(target: string): Promise<T> {
  const raw = await readFile(target, "utf8");
  return JSON.parse(raw) as T;
}

export function nowIso() {
  return new Date().toISOString();
}

export function stableHash(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function toRawSignal(
  sourceId: string,
  input: {
    externalId: string;
    url: string;
    titleRaw: string;
    contentRaw: string;
    payloadJson?: Record<string, unknown>;
    publishedAt?: string;
  }
): RawSignal {
  const publishedAt = input.publishedAt ?? nowIso();

  return {
    id: randomUUID(),
    sourceId,
    externalId: input.externalId,
    url: input.url,
    titleRaw: input.titleRaw,
    contentRaw: input.contentRaw,
    payloadJson: input.payloadJson ?? {},
    publishedAt,
    fetchedAt: nowIso(),
    hash: stableHash(`${sourceId}:${input.externalId}:${input.url}:${input.titleRaw}`),
  };
}

export async function exportPublishedArtifacts(data: {
  signals: NormalizedSignal[];
  useCases: UseCaseRecord[];
  predictions: PredictionRecord[];
  reports: ReportRecord[];
}) {
  await writeJson(pipelinePaths.signals, data.signals);
  await writeJson(pipelinePaths.useCases, data.useCases);
  await writeJson(pipelinePaths.predictions, data.predictions);
  await writeJson(pipelinePaths.reports, data.reports);
  await writeJson(pipelinePaths.latestReport, data.reports[0] ?? null);
  await writeJson(pipelinePaths.dashboard, {
    generatedAt: nowIso(),
    topSignalCount: data.signals.length,
    topUseCaseCount: data.useCases.length,
    predictionCount: data.predictions.length,
    reportDate: data.reports[0]?.reportDate ?? null,
  });
}

type PersistablePayload = {
  sources: SourceRecord[];
  rawIngestions: RawSignal[];
  signals: NormalizedSignal[];
  useCases: UseCaseRecord[];
  predictions: PredictionRecord[];
  reports: ReportRecord[];
};

export async function hydrateDatabase(payload: PersistablePayload = seedData) {
  if (!db) {
    return { inserted: false, reason: "DATABASE_URL or SUPABASE_DB_URL not configured" };
  }

  const sourceIdMap = new Map<string, string>();
  const rawIdMap = new Map<string, string>();
  const signalIdMap = new Map<string, string>();
  const useCaseIdMap = new Map<string, string>();

  await db.delete(reports);
  await db.delete(predictions);
  await db.delete(useCases);
  await db.delete(signals);
  await db.delete(rawIngestions);
  await db.delete(sources);

  const sourceRows = payload.sources.map((source) => ({
    id: randomUUID(),
    name: source.name,
    type: source.type,
    baseUrl: source.baseUrl,
    enabled: source.enabled,
    priority: source.priority,
  }));
  await db.insert(sources).values(sourceRows);
  sourceRows.forEach((row, index) => {
    sourceIdMap.set(payload.sources[index].id, row.id);
  });

  const rawRows = payload.rawIngestions.map((rawSignal) => ({
    id: randomUUID(),
    sourceId: sourceIdMap.get(rawSignal.sourceId) ?? sourceRows[0].id,
    externalId: rawSignal.externalId,
    url: rawSignal.url,
    titleRaw: rawSignal.titleRaw,
    contentRaw: rawSignal.contentRaw,
    payloadJson: rawSignal.payloadJson,
    publishedAt: new Date(rawSignal.publishedAt),
    fetchedAt: new Date(rawSignal.fetchedAt),
    hash: rawSignal.hash,
  }));
  await db.insert(rawIngestions).values(rawRows);
  rawRows.forEach((row, index) => {
    rawIdMap.set(payload.rawIngestions[index].id, row.id);
  });

  const signalRows = payload.signals.map((signal) => ({
    id: randomUUID(),
    rawIngestionId: rawIdMap.get(signal.rawIngestionId) ?? rawRows[0].id,
    signalType: signal.signalType,
    title: signal.title,
    summary: signal.summary,
    sourceName: signal.sourceName,
    url: signal.url,
    publishedAt: new Date(signal.publishedAt),
    vendors: signal.vendors,
    technologies: signal.technologies,
    industries: signal.industries,
    functions: signal.functions,
    impactScore: signal.impactScore,
    noveltyScore: signal.noveltyScore,
    confidenceScore: signal.confidenceScore,
    businessImpact: signal.businessImpact,
    implementationHint: signal.implementationHint,
    status: signal.status,
  }));
  await db.insert(signals).values(signalRows);
  signalRows.forEach((row, index) => {
    signalIdMap.set(payload.signals[index].id, row.id);
  });

  const useCaseRows = payload.useCases.map((useCase) => ({
    id: randomUUID(),
    title: useCase.title,
    industry: useCase.industry,
    businessFunction: useCase.businessFunction,
    problem: useCase.problem,
    solutionPattern: useCase.solutionPattern,
    tools: useCase.tools,
    implementationLevel: useCase.implementationLevel,
    expectedValue: useCase.expectedValue,
    risks: useCase.risks,
    businessImpact: useCase.businessImpact,
    maturity: useCase.maturity,
    sourceSignalIds: useCase.sourceSignalIds
      .map((id) => signalIdMap.get(id))
      .filter((value): value is string => Boolean(value)),
    status: useCase.status,
  }));
  await db.insert(useCases).values(useCaseRows);
  useCaseRows.forEach((row, index) => {
    useCaseIdMap.set(payload.useCases[index].id, row.id);
  });

  await db.insert(predictions).values(
    payload.predictions.map((prediction) => ({
      id: randomUUID(),
      title: prediction.title,
      statement: prediction.statement,
      timeframe: prediction.timeframe,
      confidence: prediction.confidence,
      rationale: prediction.rationale,
      impactArea: prediction.impactArea,
      supportingSignalIds: prediction.supportingSignalIds
        .map((id) => signalIdMap.get(id))
        .filter((value): value is string => Boolean(value)),
      aiDraft: prediction.aiDraft,
      analystRevision: prediction.analystRevision,
      status: prediction.status,
      createdAt: new Date(prediction.createdAt),
    }))
  );

  await db.insert(reports).values(
    payload.reports.map((report) => ({
      id: randomUUID(),
      reportDate: report.reportDate,
      executiveSummary: report.executiveSummary,
      topSignalIds: report.topSignalIds
        .map((id) => signalIdMap.get(id))
        .filter((value): value is string => Boolean(value)),
      topUseCaseIds: report.topUseCaseIds
        .map((id) => useCaseIdMap.get(id))
        .filter((value): value is string => Boolean(value)),
      strategicTakeaways: report.strategicTakeaways,
      businessImpactSummary: report.businessImpactSummary,
      predictionUpdates: report.predictionUpdates,
      publishedAt: new Date(report.publishedAt),
    }))
  );

  return {
    inserted: true,
    sourceCount: sourceRows.length,
    rawCount: rawRows.length,
    signalCount: signalRows.length,
    useCaseCount: payload.useCases.length,
    predictionCount: payload.predictions.length,
    reportCount: payload.reports.length,
  };
}

export function getSeedSources(): SourceRecord[] {
  return seedData.sources;
}
