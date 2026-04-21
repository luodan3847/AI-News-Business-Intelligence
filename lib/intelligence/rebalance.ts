import type { ImpactArea, NormalizedSignal, PredictionRecord } from "./types";

export type ThemeDefinition = {
  id: string;
  label: string;
  keywords: string[];
  defaultIndustry: string;
  defaultFunction: string;
  impactArea: ImpactArea;
  timeframe: PredictionRecord["timeframe"];
  predictionTitle: string;
  predictionStatement: string;
  aiDraft: string;
  analystRevision: string;
  takeaway: string;
};

export const functionKeywordMap = [
  {
    value: "strategy",
    keywords: [
      "strategy",
      "market",
      "forecast",
      "planning",
      "intelligence",
      "analyst",
      "benchmark",
      "competitive",
      "adoption",
      "executive",
    ],
  },
  {
    value: "product",
    keywords: [
      "product",
      "prd",
      "roadmap",
      "feature",
      "discovery",
      "backlog",
      "user research",
      "requirements",
    ],
  },
  {
    value: "engineering",
    keywords: [
      "engineering",
      "developer",
      "code",
      "repo",
      "copilot",
      "sdk",
      "debug",
      "incident",
      "framework",
      "inference",
      "serving",
      "observability",
    ],
  },
  {
    value: "operations",
    keywords: [
      "operations",
      "ops",
      "workflow",
      "automation",
      "orchestration",
      "queue",
      "execution",
      "procurement",
      "supply chain",
      "knowledge",
      "reporting",
      "productivity",
      "planning brief",
    ],
  },
  {
    value: "customer_experience",
    keywords: [
      "support",
      "customer",
      "service",
      "ticket",
      "crm",
      "sales",
      "success",
      "call transcript",
      "account team",
    ],
  },
  {
    value: "risk",
    keywords: [
      "risk",
      "governance",
      "permission",
      "permissioning",
      "policy",
      "compliance",
      "legal",
      "audit",
      "approval",
      "safety",
      "control",
      "security",
    ],
  },
];

export const industryKeywordMap = [
  {
    value: "Research",
    keywords: [
      "research",
      "paper",
      "benchmark",
      "arxiv",
      "preprint",
      "reasoning model",
      "multimodal",
      "eval",
    ],
  },
  {
    value: "Software",
    keywords: [
      "software",
      "developer",
      "code",
      "repo",
      "copilot",
      "sdk",
      "framework",
      "vscode",
      "github",
      "open source",
    ],
  },
  {
    value: "Enterprise",
    keywords: [
      "enterprise",
      "internal",
      "knowledge assistant",
      "back-office",
      "workflow",
      "operations",
      "productivity",
    ],
  },
  {
    value: "Financial Services",
    keywords: [
      "finance",
      "financial",
      "bank",
      "trading",
      "close cycle",
      "variance",
      "compliance note",
    ],
  },
  {
    value: "Healthcare",
    keywords: [
      "healthcare",
      "clinical",
      "patient",
      "medical",
      "hospital",
      "care delivery",
    ],
  },
  {
    value: "Manufacturing",
    keywords: [
      "manufacturing",
      "factory",
      "industrial",
      "inspection",
      "field service",
      "supply chain",
      "maintenance",
    ],
  },
  {
    value: "Retail",
    keywords: ["retail", "inventory", "merchandising", "campaign", "store operations"],
  },
  {
    value: "Support",
    keywords: ["support", "ticket", "service desk", "customer success", "queue"],
  },
  {
    value: "Legal",
    keywords: ["legal", "contract", "clause", "policy review", "obligation"],
  },
  {
    value: "Consulting",
    keywords: ["consulting", "advisory", "executive brief", "market memo"],
  },
  {
    value: "Education",
    keywords: ["education", "learning", "tutor", "course", "curriculum"],
  },
  {
    value: "SaaS",
    keywords: ["saas", "crm", "product-led", "subscription", "b2b software"],
  },
];

export const themeDefinitions: ThemeDefinition[] = [
  {
    id: "frontier_research",
    label: "Frontier Research",
    keywords: ["paper", "research", "benchmark", "arxiv", "preprint", "reasoning", "multimodal", "eval"],
    defaultIndustry: "Research",
    defaultFunction: "strategy",
    impactArea: "strategy",
    timeframe: "180d",
    predictionTitle:
      "Research progress will matter most when it changes deployment economics and evaluation standards",
    predictionStatement:
      "Within 180 days, the most important AI research announcements will be the ones that reshape multimodal capability, reasoning reliability, or evaluation standards for real-world deployment.",
    aiDraft:
      "Research impact is shifting from benchmark theater toward changes that vendors and enterprises can operationalize.",
    analystRevision:
      "Watch for research that changes the operating baseline for cost, quality, multimodality, or evaluability rather than only producing another headline benchmark.",
    takeaway:
      "Research matters most when it changes the product and deployment baseline, not only leaderboard positioning.",
  },
  {
    id: "model_platforms",
    label: "Model Platforms",
    keywords: ["model", "platform", "api", "release", "openai", "anthropic", "gemini", "deepmind", "meta ai"],
    defaultIndustry: "Enterprise",
    defaultFunction: "strategy",
    impactArea: "strategy",
    timeframe: "90d",
    predictionTitle:
      "Platform competition will shift toward reliability, controls, and integration depth",
    predictionStatement:
      "Within 90 days, major AI platform launches will lean harder on reliability, governance, and enterprise integration rather than raw model novelty alone.",
    aiDraft:
      "Foundation model vendors are moving toward platform completeness rather than isolated model claims.",
    analystRevision:
      "The next wave of platform competition is likely to be won through operational trust and ecosystem fit, not just capability marketing.",
    takeaway:
      "Vendor differentiation is moving from model access to operational trust, controls, and ecosystem depth.",
  },
  {
    id: "open_source_stack",
    label: "Open-Source Stack",
    keywords: ["open source", "transformers", "ollama", "autogen", "langchain", "mcp", "open weights", "inference", "serving"],
    defaultIndustry: "Software",
    defaultFunction: "engineering",
    impactArea: "engineering",
    timeframe: "90d",
    predictionTitle:
      "Open-source AI infrastructure will compress time-to-prototype for serious teams",
    predictionStatement:
      "Within 90 days, open-source model serving, orchestration, and evaluation tooling will make it easier for teams to prototype and govern AI systems without locking into one vendor too early.",
    aiDraft:
      "The open stack is becoming a practical acceleration layer, not just an experimentation layer.",
    analystRevision:
      "Expect the open-source ecosystem to matter most where teams want optionality, stack visibility, and faster experimentation with lower vendor dependency.",
    takeaway:
      "The open-source layer is turning into a strategic option set for AI stack design, not only a hobbyist ecosystem.",
  },
  {
    id: "workflow_orchestration",
    label: "Workflow Orchestration",
    keywords: [
      "orchestration",
      "multi-agent",
      "memory",
      "handoff",
      "delegation",
      "routing",
      "coordination",
      "workflow system",
    ],
    defaultIndustry: "Enterprise",
    defaultFunction: "operations",
    impactArea: "operations",
    timeframe: "90d",
    predictionTitle:
      "Workflow orchestration will become the core design layer for operational AI",
    predictionStatement:
      "Within 90 days, more AI systems will be evaluated on how well they coordinate tasks, memory, review, and handoffs across workflows instead of on isolated one-step outputs.",
    aiDraft:
      "Operational value is converging around orchestration quality rather than single-response capability.",
    analystRevision:
      "The strongest AI products will increasingly look like workflow systems with AI inside them, not AI demos with thin wrappers.",
    takeaway:
      "Execution architecture is becoming more important than one-shot generation quality in operational AI.",
  },
  {
    id: "knowledge_systems",
    label: "Knowledge Systems",
    keywords: ["knowledge", "retrieval", "search", "rag", "assistant", "citation", "workspace", "documents"],
    defaultIndustry: "Enterprise",
    defaultFunction: "operations",
    impactArea: "operations",
    timeframe: "180d",
    predictionTitle:
      "Knowledge systems will become shared internal infrastructure rather than side projects",
    predictionStatement:
      "Within 180 days, internal retrieval and knowledge assistants will increasingly be funded and operated as shared productivity infrastructure rather than isolated innovation experiments.",
    aiDraft:
      "Knowledge systems are becoming a default AI layer for large organizations.",
    analystRevision:
      "The strongest adoption pattern here is not chatbot novelty but durable retrieval infrastructure with access control, freshness, and citation discipline.",
    takeaway:
      "Retrieval quality, freshness, and trust are becoming core operational requirements for internal AI systems.",
  },
  {
    id: "governance_and_controls",
    label: "Governance and Controls",
    keywords: ["governance", "permission", "permissioning", "policy", "risk", "audit", "approval", "control", "safety", "compliance"],
    defaultIndustry: "Enterprise",
    defaultFunction: "risk",
    impactArea: "risk",
    timeframe: "90d",
    predictionTitle:
      "Governance controls will become a hard gating layer for enterprise AI rollout",
    predictionStatement:
      "Within 90 days, enterprises will treat permissioning, evaluation, and action controls as hard rollout requirements for AI systems rather than optional safety extras.",
    aiDraft:
      "Operational governance is becoming a prerequisite for adoption at scale.",
    analystRevision:
      "The real enterprise question is increasingly about action boundaries, review points, and traceability, not just whether the model can produce an answer.",
    takeaway:
      "Governance is moving from compliance overlay to product requirement for deployable AI.",
  },
  {
    id: "document_intelligence",
    label: "Document Intelligence",
    keywords: ["document", "contract", "policy", "clause", "review", "compliance", "procurement", "legal", "obligation"],
    defaultIndustry: "Financial Services",
    defaultFunction: "risk",
    impactArea: "operations",
    timeframe: "180d",
    predictionTitle:
      "Document-heavy workflows will remain among the clearest near-term AI ROI categories",
    predictionStatement:
      "Within 180 days, document-heavy workflows such as legal review, procurement analysis, and compliance monitoring will continue to outperform novelty AI use cases on measurable ROI.",
    aiDraft:
      "Structured document workflows remain one of the best operational fits for enterprise AI.",
    analystRevision:
      "These workflows keep winning because the source material is repetitive, the review loop is clear, and the business bottleneck is easy to measure.",
    takeaway:
      "Document-heavy categories continue to be the most reliable bridge from AI capability to operational value.",
  },
  {
    id: "customer_operations",
    label: "Customer Operations",
    keywords: ["support", "ticket", "crm", "customer", "sales", "service", "call", "routing", "follow-up"],
    defaultIndustry: "Support",
    defaultFunction: "customer_experience",
    impactArea: "customer_experience",
    timeframe: "90d",
    predictionTitle:
      "Customer-facing AI will move from summarization into guided action layers",
    predictionStatement:
      "Within 90 days, customer-facing AI products will increasingly connect summaries to routing, recommendations, policy checks, and next-best actions.",
    aiDraft:
      "Customer AI is evolving from content generation into guided action orchestration.",
    analystRevision:
      "Watch for stronger products to attach policy logic, queue routing, and recommended follow-up steps to the summarization layer.",
    takeaway:
      "Customer operations AI is shifting from note-taking to controlled action recommendation and orchestration.",
  },
  {
    id: "multimodal_field_ops",
    label: "Multimodal Operations",
    keywords: ["vision", "image", "voice", "video", "field", "inspection", "speech", "transcript", "sensor"],
    defaultIndustry: "Manufacturing",
    defaultFunction: "operations",
    impactArea: "operations",
    timeframe: "180d",
    predictionTitle:
      "Multimodal systems will unlock more operational AI in physical workflows",
    predictionStatement:
      "Within 180 days, multimodal AI will show more durable value in inspection, field service, and documentation-heavy physical workflows than in generic consumer demos.",
    aiDraft:
      "Multimodal systems are becoming more valuable when tied to messy physical operations rather than novelty experiences.",
    analystRevision:
      "The practical win condition here is better documentation, faster triage, and stronger human review in workflows that already blend text, image, or voice.",
    takeaway:
      "Multimodal AI becomes more strategic when it reduces friction in physical and documentation-heavy operations.",
  },
  {
    id: "executive_intelligence",
    label: "Executive Intelligence",
    keywords: ["strategy", "market", "intelligence", "analyst", "forecast", "trend", "brief", "executive"],
    defaultIndustry: "Consulting",
    defaultFunction: "strategy",
    impactArea: "strategy",
    timeframe: "90d",
    predictionTitle:
      "AI intelligence products will differentiate through structured analyst framing",
    predictionStatement:
      "Within 90 days, AI monitoring products that combine structured data, business framing, and prediction discipline will stand out more than products that only aggregate links.",
    aiDraft:
      "Information products are moving up the stack from aggregation to judgment and prioritization.",
    analystRevision:
      "Aggregation is table stakes. Durable differentiation is more likely to come from prioritization, business interpretation, and explicit reasoning about implications.",
    takeaway:
      "Judgment, framing, and prioritization are becoming the differentiated layer in AI intelligence products.",
  },
];

export function normalizeContent(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function countKeywordMatches(haystack: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => score + (haystack.includes(keyword) ? 1 : 0), 0);
}

function includesAny(values: string[], options: string[]) {
  return values.some((value) => options.includes(value));
}

export function inferFunctionsFromText(text: string) {
  const haystack = normalizeContent(text);
  return functionKeywordMap
    .map((entry) => ({
      value: entry.value,
      score: countKeywordMatches(haystack, entry.keywords),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.value);
}

export function inferIndustriesFromText(text: string) {
  const haystack = normalizeContent(text);
  return industryKeywordMap
    .map((entry) => ({
      value: entry.value,
      score: countKeywordMatches(haystack, entry.keywords),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.value);
}

export function buildSignalText(signal: Pick<
  NormalizedSignal,
  | "title"
  | "summary"
  | "businessImpact"
  | "implementationHint"
  | "vendors"
  | "technologies"
  | "industries"
  | "functions"
  | "sourceName"
>) {
  return normalizeContent(
    [
      signal.title,
      signal.summary,
      signal.businessImpact,
      signal.implementationHint,
      signal.sourceName,
      signal.vendors.join(" "),
      signal.technologies.join(" "),
      signal.industries.join(" "),
      signal.functions.join(" "),
    ].join(" ")
  );
}

export function detectThemesForSignal(signal: Pick<
  NormalizedSignal,
  | "title"
  | "summary"
  | "businessImpact"
  | "implementationHint"
  | "vendors"
  | "technologies"
  | "industries"
  | "functions"
  | "sourceName"
>) {
  const haystack = buildSignalText(signal);
  const sourceName = signal.sourceName.toLowerCase();
  const technologies = signal.technologies.map((value) => normalizeContent(value));
  const industries = signal.industries.map((value) => normalizeContent(value));
  const functions = signal.functions.map((value) => normalizeContent(value));
  const vendors = signal.vendors.map((value) => normalizeContent(value));

  return themeDefinitions
    .map((theme) => ({
      theme,
      score:
        countKeywordMatches(haystack, theme.keywords) +
        (() => {
          switch (theme.id) {
            case "frontier_research":
              return (sourceName.includes("arxiv") ? 5 : 0) + (industries.includes("research") ? 2 : 0);
            case "model_platforms":
              return includesAny(vendors, ["openai", "anthropic", "google", "google deepmind", "hugging face"])
                ? 3
                : 0;
            case "open_source_stack":
              return (sourceName.includes("github releases") ? 2 : 0) +
                (includesAny(technologies, [
                  "mcp",
                  "transformers",
                  "inference",
                  "open weights",
                  "ollama",
                ])
                  ? 3
                  : 0);
            case "workflow_orchestration":
              return includesAny(technologies, ["agents", "workflow automation"]) ? 2 : 0;
            case "knowledge_systems":
              return (industries.includes("enterprise") ? 1 : 0) +
                (includesAny(technologies, ["retrieval", "rag", "knowledge assistants"]) ? 3 : 0);
            case "governance_and_controls":
              return (functions.includes("risk") ? 2 : 0) +
                (haystack.includes("sandbox") || haystack.includes("permission") || haystack.includes("audit")
                  ? 2
                  : 0);
            case "document_intelligence":
              return industries.includes("legal") || haystack.includes("document")
                ? 3
                : 0;
            case "customer_operations":
              return (functions.includes("customer_experience") ? 3 : 0) +
                (industries.includes("support") ? 2 : 0);
            case "multimodal_field_ops":
              return (haystack.includes("voice") ||
                haystack.includes("image") ||
                haystack.includes("video") ||
                haystack.includes("transcript"))
                ? 3
                : 0;
            case "executive_intelligence":
              return (functions.includes("strategy") ? 1 : 0) +
                (haystack.includes("forecast") || haystack.includes("executive") || haystack.includes("brief")
                  ? 3
                  : 0);
            default:
              return 0;
          }
        })(),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.theme);
}

export function getPrimaryTheme(signal: NormalizedSignal) {
  return detectThemesForSignal(signal)[0] ?? themeDefinitions.find((theme) => theme.id === "model_platforms")!;
}

export function getPrimaryFunction(signal: NormalizedSignal) {
  return signal.functions[0] ?? getPrimaryTheme(signal).defaultFunction;
}

export function getPrimaryIndustry(signal: NormalizedSignal) {
  return signal.industries[0] ?? getPrimaryTheme(signal).defaultIndustry;
}

export function buildSignalScore(signal: NormalizedSignal) {
  return signal.impactScore * 0.55 + signal.confidenceScore * 0.3 + signal.noveltyScore * 0.15;
}
