export type SourceType =
  | "official_blog"
  | "release_feed"
  | "community"
  | "video"
  | "tooling";

export type SignalType =
  | "news"
  | "release"
  | "tool_update"
  | "use_case_signal"
  | "market_signal";

export type RecordStatus = "draft" | "approved" | "archived";

export type PredictionStatus =
  | "draft_ai"
  | "under_review"
  | "approved"
  | "rejected";

export type ImpactArea =
  | "strategy"
  | "product"
  | "operations"
  | "engineering"
  | "customer_experience"
  | "risk";

export type ImplementationLevel =
  | "pilot"
  | "team_ready"
  | "production"
  | "enterprise_scale";

export type MaturityLevel = "emerging" | "validated" | "scaling" | "mainstream";

export type SourceRecord = {
  id: string;
  name: string;
  type: SourceType;
  baseUrl: string;
  enabled: boolean;
  priority: number;
};

export type RawSignal = {
  id: string;
  sourceId: string;
  externalId: string;
  url: string;
  titleRaw: string;
  contentRaw: string;
  payloadJson: Record<string, unknown>;
  publishedAt: string;
  fetchedAt: string;
  hash: string;
};

export type NormalizedSignal = {
  id: string;
  rawIngestionId: string;
  signalType: SignalType;
  title: string;
  summary: string;
  sourceName: string;
  url: string;
  publishedAt: string;
  vendors: string[];
  technologies: string[];
  industries: string[];
  functions: string[];
  impactScore: number;
  noveltyScore: number;
  confidenceScore: number;
  businessImpact: string;
  implementationHint: string;
  status: RecordStatus;
};

export type UseCaseRecord = {
  id: string;
  title: string;
  industry: string;
  businessFunction: string;
  problem: string;
  solutionPattern: string;
  tools: string[];
  implementationLevel: ImplementationLevel;
  expectedValue: string;
  risks: string;
  businessImpact: string;
  maturity: MaturityLevel;
  sourceSignalIds: string[];
  status: RecordStatus;
};

export type PredictionRecord = {
  id: string;
  title: string;
  statement: string;
  timeframe: "30d" | "90d" | "180d";
  confidence: number;
  rationale: string;
  impactArea: ImpactArea;
  supportingSignalIds: string[];
  aiDraft: string;
  analystRevision: string;
  status: PredictionStatus;
  createdAt: string;
};

export type ReportRecord = {
  id: string;
  reportDate: string;
  executiveSummary: string;
  topSignalIds: string[];
  topUseCaseIds: string[];
  strategicTakeaways: string[];
  businessImpactSummary: string;
  predictionUpdates: string[];
  publishedAt: string;
};

export type PublishedInsight =
  | {
      kind: "signal";
      id: string;
      title: string;
      summary: string;
      publishedAt: string;
    }
  | {
      kind: "use_case";
      id: string;
      title: string;
      summary: string;
      publishedAt: string;
    }
  | {
      kind: "prediction";
      id: string;
      title: string;
      summary: string;
      publishedAt: string;
    }
  | {
      kind: "report";
      id: string;
      title: string;
      summary: string;
      publishedAt: string;
    };

export type NewsFilters = {
  source?: string;
  vendor?: string;
  signalType?: SignalType | "all";
  minImpactScore?: number;
  publishedRange?: "7d" | "30d" | "90d" | "all";
};

export type UseCaseFilters = {
  industry?: string;
  businessFunction?: string;
  tool?: string;
  implementationLevel?: ImplementationLevel | "all";
  maturity?: MaturityLevel | "all";
};

export type ToolTrackingEntry = {
  name: string;
  vendor: string;
  category: string;
  overview: string;
  latestSignals: NormalizedSignal[];
  relatedUseCases: UseCaseRecord[];
  adoptionSignal: string;
  impactSummary: string;
};

export type AuditDistributionItem = {
  name: string;
  count: number;
};

export type AuditRecord = {
  generatedAt: string;
  passed: boolean;
  summary: {
    signalCount: number;
    useCaseCount: number;
    predictionCount: number;
    reportCount: number;
    distinctSources: number;
    distinctThemes: number;
    distinctFunctions: number;
    distinctIndustries: number;
  };
  distributions: {
    signalSources: AuditDistributionItem[];
    signalTypes: AuditDistributionItem[];
    signalFunctions: AuditDistributionItem[];
    signalIndustries: AuditDistributionItem[];
    signalThemes: AuditDistributionItem[];
    useCaseIndustries: AuditDistributionItem[];
    useCaseFunctions: AuditDistributionItem[];
    predictionImpactAreas: AuditDistributionItem[];
  };
  warnings: string[];
};

export type DashboardData = {
  dailyBrief: ReportRecord;
  topSignals: NormalizedSignal[];
  useCases: UseCaseRecord[];
  businessSignals: NormalizedSignal[];
  tools: ToolTrackingEntry[];
  predictions: PredictionRecord[];
};
