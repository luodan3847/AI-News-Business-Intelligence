import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const sourceTypeEnum = pgEnum("source_type", [
  "official_blog",
  "release_feed",
  "community",
  "video",
  "tooling",
]);

export const signalTypeEnum = pgEnum("signal_type", [
  "news",
  "release",
  "tool_update",
  "use_case_signal",
  "market_signal",
]);

export const recordStatusEnum = pgEnum("record_status", [
  "draft",
  "approved",
  "archived",
]);

export const predictionStatusEnum = pgEnum("prediction_status", [
  "draft_ai",
  "under_review",
  "approved",
  "rejected",
]);

export const impactAreaEnum = pgEnum("impact_area", [
  "strategy",
  "product",
  "operations",
  "engineering",
  "customer_experience",
  "risk",
]);

export const implementationLevelEnum = pgEnum("implementation_level", [
  "pilot",
  "team_ready",
  "production",
  "enterprise_scale",
]);

export const maturityLevelEnum = pgEnum("maturity_level", [
  "emerging",
  "validated",
  "scaling",
  "mainstream",
]);

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  type: sourceTypeEnum("type").notNull(),
  baseUrl: text("base_url").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  priority: integer("priority").notNull().default(50),
});

export const rawIngestions = pgTable("raw_ingestions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  externalId: varchar("external_id", { length: 255 }).notNull(),
  url: text("url").notNull(),
  titleRaw: text("title_raw").notNull(),
  contentRaw: text("content_raw").notNull(),
  payloadJson: jsonb("payload_json").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull(),
  hash: varchar("hash", { length: 128 }).notNull(),
});

export const signals = pgTable("signals", {
  id: uuid("id").defaultRandom().primaryKey(),
  rawIngestionId: uuid("raw_ingestion_id")
    .notNull()
    .references(() => rawIngestions.id, { onDelete: "cascade" }),
  signalType: signalTypeEnum("signal_type").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  sourceName: varchar("source_name", { length: 120 }).notNull(),
  url: text("url").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  vendors: text("vendors")
    .array()
    .notNull()
    .default([]),
  technologies: text("technologies")
    .array()
    .notNull()
    .default([]),
  industries: text("industries")
    .array()
    .notNull()
    .default([]),
  functions: text("functions")
    .array()
    .notNull()
    .default([]),
  impactScore: integer("impact_score").notNull().default(50),
  noveltyScore: integer("novelty_score").notNull().default(50),
  confidenceScore: integer("confidence_score").notNull().default(50),
  businessImpact: text("business_impact").notNull(),
  implementationHint: text("implementation_hint").notNull(),
  status: recordStatusEnum("status").notNull().default("draft"),
});

export const useCases = pgTable("use_cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  industry: varchar("industry", { length: 120 }).notNull(),
  businessFunction: varchar("business_function", { length: 120 }).notNull(),
  problem: text("problem").notNull(),
  solutionPattern: text("solution_pattern").notNull(),
  tools: text("tools")
    .array()
    .notNull()
    .default([]),
  implementationLevel: implementationLevelEnum("implementation_level").notNull(),
  expectedValue: text("expected_value").notNull(),
  risks: text("risks").notNull(),
  businessImpact: text("business_impact").notNull(),
  maturity: maturityLevelEnum("maturity").notNull(),
  sourceSignalIds: uuid("source_signal_ids")
    .array()
    .notNull()
    .default([]),
  status: recordStatusEnum("status").notNull().default("draft"),
});

export const predictions = pgTable("predictions", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  statement: text("statement").notNull(),
  timeframe: varchar("timeframe", { length: 8 }).notNull(),
  confidence: integer("confidence").notNull().default(60),
  rationale: text("rationale").notNull(),
  impactArea: impactAreaEnum("impact_area").notNull(),
  supportingSignalIds: uuid("supporting_signal_ids")
    .array()
    .notNull()
    .default([]),
  aiDraft: text("ai_draft").notNull(),
  analystRevision: text("analyst_revision").notNull(),
  status: predictionStatusEnum("status").notNull().default("draft_ai"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportDate: varchar("report_date", { length: 10 }).notNull(),
  executiveSummary: text("executive_summary").notNull(),
  topSignalIds: uuid("top_signal_ids")
    .array()
    .notNull()
    .default([]),
  topUseCaseIds: uuid("top_use_case_ids")
    .array()
    .notNull()
    .default([]),
  strategicTakeaways: text("strategic_takeaways")
    .array()
    .notNull()
    .default([]),
  businessImpactSummary: text("business_impact_summary").notNull(),
  predictionUpdates: text("prediction_updates")
    .array()
    .notNull()
    .default([]),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
});

export const sourceRelations = relations(sources, ({ many }) => ({
  rawIngestions: many(rawIngestions),
}));

export const rawIngestionRelations = relations(rawIngestions, ({ one, many }) => ({
  source: one(sources, {
    fields: [rawIngestions.sourceId],
    references: [sources.id],
  }),
  signals: many(signals),
}));

export const signalRelations = relations(signals, ({ one }) => ({
  rawIngestion: one(rawIngestions, {
    fields: [signals.rawIngestionId],
    references: [rawIngestions.id],
  }),
}));
