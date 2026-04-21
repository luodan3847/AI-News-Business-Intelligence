import type {
  DashboardData,
  NormalizedSignal,
  PredictionRecord,
  RawSignal,
  ReportRecord,
  SourceRecord,
  UseCaseRecord,
} from "./types";
import { buildToolTrackingEntries } from "./tool-tracking";

const sourceSeeds: SourceRecord[] = [
  {
    id: "source-anthropic",
    name: "Anthropic",
    type: "official_blog",
    baseUrl: "https://www.anthropic.com/news",
    enabled: true,
    priority: 95,
  },
  {
    id: "source-openai",
    name: "OpenAI",
    type: "official_blog",
    baseUrl: "https://openai.com/news",
    enabled: true,
    priority: 95,
  },
  {
    id: "source-google",
    name: "Google AI",
    type: "official_blog",
    baseUrl: "https://blog.google/technology/ai/",
    enabled: true,
    priority: 90,
  },
  {
    id: "source-deepmind",
    name: "Google DeepMind",
    type: "official_blog",
    baseUrl: "https://deepmind.google/discover/blog/",
    enabled: true,
    priority: 89,
  },
  {
    id: "source-meta-ai",
    name: "Meta AI",
    type: "official_blog",
    baseUrl: "https://ai.meta.com/blog/",
    enabled: true,
    priority: 87,
  },
  {
    id: "source-huggingface",
    name: "Hugging Face",
    type: "official_blog",
    baseUrl: "https://huggingface.co/blog",
    enabled: true,
    priority: 86,
  },
  {
    id: "source-arxiv",
    name: "arXiv AI Research",
    type: "release_feed",
    baseUrl:
      "https://export.arxiv.org/api/query?search_query=%28cat%3Acs.AI+OR+cat%3Acs.LG+OR+cat%3Acs.CL%29&sortBy=submittedDate&sortOrder=descending&max_results=8",
    enabled: true,
    priority: 91,
  },
  {
    id: "source-github-releases",
    name: "GitHub Releases",
    type: "release_feed",
    baseUrl: "https://github.com/releases",
    enabled: true,
    priority: 92,
  },
  {
    id: "source-vscode",
    name: "VS Code",
    type: "tooling",
    baseUrl: "https://code.visualstudio.com/updates",
    enabled: true,
    priority: 88,
  },
  {
    id: "source-hackernews",
    name: "Hacker News",
    type: "community",
    baseUrl: "https://news.ycombinator.com",
    enabled: true,
    priority: 72,
  },
  {
    id: "source-reddit",
    name: "Reddit",
    type: "community",
    baseUrl: "https://www.reddit.com",
    enabled: true,
    priority: 65,
  },
  {
    id: "source-video",
    name: "YouTube/Bilibili",
    type: "video",
    baseUrl: "https://www.youtube.com",
    enabled: true,
    priority: 60,
  },
];

type SignalSeed = Omit<NormalizedSignal, "rawIngestionId"> & {
  rawSourceId: string;
};

const signalSeeds: SignalSeed[] = [
  {
    id: "signal-001",
    rawSourceId: "source-anthropic",
    signalType: "release",
    title: "Anthropic expands long-context coding controls in Claude Code",
    summary:
      "Anthropic added finer effort controls and improved long-session handling for Claude Code, giving teams a more reliable way to balance speed and reasoning depth during complex engineering work.",
    sourceName: "Anthropic",
    url: "https://www.anthropic.com/news/claude-code-effort-controls",
    publishedAt: "2026-04-21T08:30:00.000Z",
    vendors: ["Anthropic"],
    technologies: ["Claude Code", "Claude Opus", "agentic coding"],
    industries: ["Software", "Technology"],
    functions: ["engineering", "operations"],
    impactScore: 93,
    noveltyScore: 86,
    confidenceScore: 88,
    businessImpact:
      "Engineering teams can move more code review and refactor work into AI-assisted workflows without losing control over cost and latency.",
    implementationHint:
      "Use higher-effort modes for architecture and refactor requests, while keeping standard effort for everyday task execution.",
    status: "approved",
  },
  {
    id: "signal-002",
    rawSourceId: "source-openai",
    signalType: "tool_update",
    title: "OpenAI sharpens eval tooling for production agents",
    summary:
      "OpenAI published updated evaluation guidance for production agents, focusing on tool reliability, handoff quality, and failure tracing for enterprise workflows.",
    sourceName: "OpenAI",
    url: "https://openai.com/news/production-agent-evals",
    publishedAt: "2026-04-20T10:00:00.000Z",
    vendors: ["OpenAI"],
    technologies: ["Agents", "Evals", "Observability"],
    industries: ["Software", "Financial Services", "Support"],
    functions: ["engineering", "risk", "operations"],
    impactScore: 90,
    noveltyScore: 81,
    confidenceScore: 85,
    businessImpact:
      "The bottleneck for agent adoption is shifting from model quality to evaluation and controls, which raises the importance of governance tooling.",
    implementationHint:
      "Add eval checkpoints before and after tool calls so teams can diagnose agent failure modes before production rollout.",
    status: "approved",
  },
  {
    id: "signal-003",
    rawSourceId: "source-google",
    signalType: "news",
    title: "Google highlights Gemini workflows for enterprise knowledge assistants",
    summary:
      "Google showcased Gemini-based assistants that connect internal documents, workflow tools, and knowledge graphs to reduce search time inside large organizations.",
    sourceName: "Google AI",
    url: "https://blog.google/technology/ai/gemini-enterprise-knowledge-workflows",
    publishedAt: "2026-04-19T13:15:00.000Z",
    vendors: ["Google"],
    technologies: ["Gemini", "knowledge assistants", "workspace automation"],
    industries: ["Enterprise", "Consulting", "Operations"],
    functions: ["operations", "customer_experience", "strategy"],
    impactScore: 84,
    noveltyScore: 73,
    confidenceScore: 79,
    businessImpact:
      "Knowledge retrieval is becoming a default productivity layer, especially in teams that need rapid synthesis across documents and communication tools.",
    implementationHint:
      "Pilot internal knowledge assistants in high-document teams first, then expand into cross-functional research workflows.",
    status: "approved",
  },
  {
    id: "signal-004",
    rawSourceId: "source-github-releases",
    signalType: "tool_update",
    title: "GitHub Copilot adds stronger workflow memory in VS Code",
    summary:
      "GitHub shipped improvements to task continuity and context carryover in VS Code, making Copilot better at following a multi-step developer workflow instead of isolated prompts.",
    sourceName: "GitHub Releases",
    url: "https://github.com/github/copilot/releases/tag/workflow-memory",
    publishedAt: "2026-04-18T09:10:00.000Z",
    vendors: ["GitHub", "Microsoft"],
    technologies: ["GitHub Copilot", "VS Code", "workflow memory"],
    industries: ["Software"],
    functions: ["engineering"],
    impactScore: 87,
    noveltyScore: 76,
    confidenceScore: 82,
    businessImpact:
      "Competition is moving toward workflow continuity, which matters more for developer adoption than one-shot code generation quality.",
    implementationHint:
      "Compare AI coding tools on how well they preserve task intent across edits, reviews, test runs, and follow-up fixes.",
    status: "approved",
  },
  {
    id: "signal-005",
    rawSourceId: "source-vscode",
    signalType: "tool_update",
    title: "VS Code leans further into multi-agent developer workflows",
    summary:
      "The latest VS Code updates place more emphasis on agent orchestration, task delegation, and model-aware workflows directly inside the editor.",
    sourceName: "VS Code",
    url: "https://code.visualstudio.com/updates/agent-workflows",
    publishedAt: "2026-04-17T11:20:00.000Z",
    vendors: ["Microsoft"],
    technologies: ["VS Code", "agents", "developer workflow"],
    industries: ["Software"],
    functions: ["engineering", "operations"],
    impactScore: 88,
    noveltyScore: 78,
    confidenceScore: 83,
    businessImpact:
      "The code editor is becoming the operating system for AI-assisted execution, which raises the value of tooling ecosystems around it.",
    implementationHint:
      "Track whether your engineering workflow is converging around one editor-native agent layer or several disconnected tools.",
    status: "approved",
  },
  {
    id: "signal-006",
    rawSourceId: "source-hackernews",
    signalType: "market_signal",
    title: "HN discussion shifts from model benchmarks to production reliability",
    summary:
      "A high-signal Hacker News thread shows practitioners caring less about leaderboard differences and more about deployment reliability, tool correctness, and operational safety.",
    sourceName: "Hacker News",
    url: "https://news.ycombinator.com/item?id=436001",
    publishedAt: "2026-04-16T15:00:00.000Z",
    vendors: ["OpenAI", "Anthropic", "Google"],
    technologies: ["agents", "evals", "tool use"],
    industries: ["Software", "Enterprise"],
    functions: ["risk", "engineering", "strategy"],
    impactScore: 80,
    noveltyScore: 68,
    confidenceScore: 77,
    businessImpact:
      "Enterprise buyers are rewarding systems that reduce workflow risk rather than merely posting stronger model demos.",
    implementationHint:
      "When prioritizing pilot tools, include reliability and rollback design in the selection criteria from day one.",
    status: "approved",
  },
  {
    id: "signal-007",
    rawSourceId: "source-reddit",
    signalType: "use_case_signal",
    title: "Operations teams share AI-assisted reporting workflows on Reddit",
    summary:
      "Operations practitioners described using AI to combine meeting notes, dashboard snapshots, and change logs into concise weekly decision reports.",
    sourceName: "Reddit",
    url: "https://www.reddit.com/r/artificial/comments/ops-report-workflows",
    publishedAt: "2026-04-15T08:00:00.000Z",
    vendors: ["Anthropic", "OpenAI"],
    technologies: ["report generation", "workflow automation", "summarization"],
    industries: ["Operations", "SaaS", "Professional Services"],
    functions: ["operations", "strategy"],
    impactScore: 78,
    noveltyScore: 70,
    confidenceScore: 74,
    businessImpact:
      "The value of AI for operations is strongest when it compresses scattered inputs into faster management reporting.",
    implementationHint:
      "Start with recurring reporting processes where the input sources are stable and the output format is already known.",
    status: "approved",
  },
  {
    id: "signal-008",
    rawSourceId: "source-video",
    signalType: "use_case_signal",
    title: "Video walkthrough shows AI triaging sales calls into CRM actions",
    summary:
      "A practical demo showed an AI workflow that turns call transcripts into CRM notes, risk flags, and suggested follow-up actions for account teams.",
    sourceName: "YouTube/Bilibili",
    url: "https://www.youtube.com/watch?v=crm-ai-triage-demo",
    publishedAt: "2026-04-14T14:30:00.000Z",
    vendors: ["OpenAI", "HubSpot"],
    technologies: ["speech-to-text", "CRM automation", "workflow orchestration"],
    industries: ["Sales", "SaaS"],
    functions: ["customer_experience", "operations"],
    impactScore: 82,
    noveltyScore: 72,
    confidenceScore: 75,
    businessImpact:
      "Revenue teams can use AI to reduce manual CRM hygiene work and make follow-up quality more consistent.",
    implementationHint:
      "Treat CRM automation as a high-leverage workflow if your main problem is inconsistent note capture after calls.",
    status: "approved",
  },
  {
    id: "signal-009",
    rawSourceId: "source-openai",
    signalType: "release",
    title: "OpenAI introduces safer tool permissions for enterprise agents",
    summary:
      "OpenAI added more granular permission controls for enterprise agents, helping teams separate read-only, assisted, and auto-execute actions.",
    sourceName: "OpenAI",
    url: "https://openai.com/news/enterprise-tool-permissions",
    publishedAt: "2026-04-13T12:40:00.000Z",
    vendors: ["OpenAI"],
    technologies: ["agents", "permissions", "governance"],
    industries: ["Enterprise", "Financial Services", "Healthcare"],
    functions: ["risk", "engineering", "operations"],
    impactScore: 89,
    noveltyScore: 80,
    confidenceScore: 87,
    businessImpact:
      "Permissioning is becoming a core buying criterion for enterprise AI agents, especially where execution risk is high.",
    implementationHint:
      "Design action tiers early so teams know which workflows can be automated and which require a human checkpoint.",
    status: "approved",
  },
  {
    id: "signal-010",
    rawSourceId: "source-google",
    signalType: "use_case_signal",
    title: "Gemini case study shows contract review acceleration for legal ops",
    summary:
      "Google highlighted a legal operations workflow where Gemini pre-tags clauses, summarizes deviations, and drafts risk notes before human review.",
    sourceName: "Google AI",
    url: "https://blog.google/technology/ai/legal-ops-contract-review",
    publishedAt: "2026-04-12T09:25:00.000Z",
    vendors: ["Google"],
    technologies: ["Gemini", "document analysis", "legal workflow"],
    industries: ["Legal", "Enterprise"],
    functions: ["risk", "operations"],
    impactScore: 85,
    noveltyScore: 75,
    confidenceScore: 80,
    businessImpact:
      "Structured document-heavy functions remain one of the clearest AI value pools because the review workflow is repetitive and measurable.",
    implementationHint:
      "Use a clause taxonomy and review thresholds so legal teams can validate outputs without re-reading every page from scratch.",
    status: "approved",
  },
  {
    id: "signal-011",
    rawSourceId: "source-github-releases",
    signalType: "release",
    title: "GitHub expands repository-aware coding agents",
    summary:
      "GitHub broadened repository-aware agent features, helping teams maintain task context across issues, pull requests, and workspace state.",
    sourceName: "GitHub Releases",
    url: "https://github.com/releases/repository-aware-agents",
    publishedAt: "2026-04-11T16:10:00.000Z",
    vendors: ["GitHub", "Microsoft"],
    technologies: ["agents", "code context", "pull requests"],
    industries: ["Software"],
    functions: ["engineering"],
    impactScore: 86,
    noveltyScore: 74,
    confidenceScore: 81,
    businessImpact:
      "Repository awareness lowers friction for engineering adoption because context handoff becomes less manual and less error-prone.",
    implementationHint:
      "Measure how well tools preserve issue intent across PR creation, review requests, and change iteration.",
    status: "approved",
  },
  {
    id: "signal-012",
    rawSourceId: "source-vscode",
    signalType: "market_signal",
    title: "Developer tooling ecosystem converges on model-agnostic copilots",
    summary:
      "VS Code ecosystem discussions show rising demand for model-agnostic copilots that let teams switch providers without rebuilding workflows.",
    sourceName: "VS Code",
    url: "https://code.visualstudio.com/blog/model-agnostic-copilots",
    publishedAt: "2026-04-10T17:45:00.000Z",
    vendors: ["Microsoft", "Anthropic", "OpenAI", "Google"],
    technologies: ["VS Code", "model routing", "copilots"],
    industries: ["Software"],
    functions: ["engineering", "strategy"],
    impactScore: 79,
    noveltyScore: 67,
    confidenceScore: 78,
    businessImpact:
      "Vendor flexibility is turning into a strategic requirement, especially for teams balancing cost, latency, and compliance.",
    implementationHint:
      "Abstract prompt workflows from one specific model provider whenever you can, especially in shared team tooling.",
    status: "approved",
  },
  {
    id: "signal-013",
    rawSourceId: "source-anthropic",
    signalType: "use_case_signal",
    title: "Anthropic shares internal pattern for analyst research memos",
    summary:
      "Anthropic described a memo-building workflow where AI composes first-pass research syntheses from links, notes, and prior hypotheses.",
    sourceName: "Anthropic",
    url: "https://www.anthropic.com/news/research-memo-workflows",
    publishedAt: "2026-04-09T11:55:00.000Z",
    vendors: ["Anthropic"],
    technologies: ["research synthesis", "Claude", "memo drafting"],
    industries: ["Consulting", "Research", "Strategy"],
    functions: ["strategy", "operations"],
    impactScore: 83,
    noveltyScore: 74,
    confidenceScore: 84,
    businessImpact:
      "Analyst work is increasingly shifting toward synthesis supervision rather than first-draft production.",
    implementationHint:
      "Use AI for first-pass memo structure, then validate claims, metrics, and recommendation logic before publishing.",
    status: "approved",
  },
  {
    id: "signal-014",
    rawSourceId: "source-openai",
    signalType: "news",
    title: "OpenAI pushes structured outputs deeper into enterprise workflows",
    summary:
      "OpenAI emphasized structured outputs for operational systems, showing how reliable schemas make AI more usable in downstream automation and analytics.",
    sourceName: "OpenAI",
    url: "https://openai.com/news/structured-outputs-enterprise",
    publishedAt: "2026-04-08T08:45:00.000Z",
    vendors: ["OpenAI"],
    technologies: ["structured outputs", "JSON schema", "automation"],
    industries: ["Enterprise", "Operations"],
    functions: ["operations", "engineering"],
    impactScore: 88,
    noveltyScore: 79,
    confidenceScore: 86,
    businessImpact:
      "Reliable structured outputs reduce one of the biggest blockers to integrating AI into operational systems and dashboards.",
    implementationHint:
      "Use schema validation at every handoff so LLM outputs are safe to reuse in automation pipelines.",
    status: "approved",
  },
  {
    id: "signal-015",
    rawSourceId: "source-google",
    signalType: "market_signal",
    title: "Google frames multimodal AI as an operations layer, not just a feature",
    summary:
      "Google’s messaging increasingly positions multimodal AI as an orchestration layer for enterprise workflows rather than a standalone model capability.",
    sourceName: "Google AI",
    url: "https://blog.google/technology/ai/multimodal-ops-layer",
    publishedAt: "2026-04-07T10:20:00.000Z",
    vendors: ["Google"],
    technologies: ["Gemini", "multimodal workflows", "orchestration"],
    industries: ["Enterprise", "Retail", "Support"],
    functions: ["operations", "customer_experience", "strategy"],
    impactScore: 81,
    noveltyScore: 71,
    confidenceScore: 78,
    businessImpact:
      "Value is moving from single-model capability demos to workflow orchestration across channels and formats.",
    implementationHint:
      "Look for workflows where text, image, and voice currently require multiple handoffs between teams or systems.",
    status: "approved",
  },
  {
    id: "signal-016",
    rawSourceId: "source-hackernews",
    signalType: "market_signal",
    title: "HN operators compare agent guardrails across vendors",
    summary:
      "An active practitioner discussion compared policy layers, observability hooks, and escalation controls across agent frameworks and providers.",
    sourceName: "Hacker News",
    url: "https://news.ycombinator.com/item?id=435998",
    publishedAt: "2026-04-06T18:10:00.000Z",
    vendors: ["Anthropic", "OpenAI", "Microsoft"],
    technologies: ["guardrails", "agent frameworks", "observability"],
    industries: ["Software", "Financial Services"],
    functions: ["risk", "engineering", "operations"],
    impactScore: 82,
    noveltyScore: 66,
    confidenceScore: 79,
    businessImpact:
      "The tool stack around agents is becoming as strategically important as the foundation model itself.",
    implementationHint:
      "Track what guardrails are native versus what needs to be built in your own orchestration layer.",
    status: "approved",
  },
  {
    id: "signal-017",
    rawSourceId: "source-reddit",
    signalType: "use_case_signal",
    title: "Finance teams share month-end close automation patterns",
    summary:
      "Finance operators discussed AI-assisted close workflows that compile explanations, outlier checks, and management notes before review meetings.",
    sourceName: "Reddit",
    url: "https://www.reddit.com/r/financeops/comments/ai-close-patterns",
    publishedAt: "2026-04-05T07:50:00.000Z",
    vendors: ["OpenAI", "Anthropic"],
    technologies: ["financial reporting", "variance summaries", "workflow automation"],
    industries: ["Financial Services", "SaaS"],
    functions: ["operations", "risk"],
    impactScore: 84,
    noveltyScore: 72,
    confidenceScore: 77,
    businessImpact:
      "AI can reduce reporting friction in finance, but trust depends on consistent exception handling and audit visibility.",
    implementationHint:
      "Use AI to draft variance explanations and issue lists, then keep approval and sign-off workflows human-owned.",
    status: "approved",
  },
  {
    id: "signal-018",
    rawSourceId: "source-video",
    signalType: "use_case_signal",
    title: "Field ops team demonstrates AI-generated service visit summaries",
    summary:
      "A practical field service demo showed AI turning technician notes and photos into standardized visit summaries for managers and customers.",
    sourceName: "YouTube/Bilibili",
    url: "https://www.bilibili.com/video/BV-field-service-ai-summary",
    publishedAt: "2026-04-04T12:15:00.000Z",
    vendors: ["Google", "OpenAI"],
    technologies: ["vision models", "field service", "workflow summaries"],
    industries: ["Field Service", "Manufacturing"],
    functions: ["operations", "customer_experience"],
    impactScore: 77,
    noveltyScore: 69,
    confidenceScore: 73,
    businessImpact:
      "Service workflows benefit when AI standardizes documentation that is otherwise inconsistent and difficult to analyze later.",
    implementationHint:
      "Pair photo analysis with a fixed output schema so summaries are reusable in CRM or ticketing systems.",
    status: "approved",
  },
  {
    id: "signal-019",
    rawSourceId: "source-github-releases",
    signalType: "tool_update",
    title: "MCP ecosystem adds more internal-tool connectivity patterns",
    summary:
      "Release activity around MCP-compatible tooling points to a growing ecosystem for connecting internal data, scripts, and services into AI workflows.",
    sourceName: "GitHub Releases",
    url: "https://github.com/releases/mcp-connectivity-patterns",
    publishedAt: "2026-04-03T10:00:00.000Z",
    vendors: ["Anthropic", "Open Source"],
    technologies: ["MCP", "tool integration", "internal systems"],
    industries: ["Software", "Enterprise"],
    functions: ["engineering", "operations"],
    impactScore: 86,
    noveltyScore: 81,
    confidenceScore: 84,
    businessImpact:
      "Internal tool connectivity is one of the fastest paths from generic AI to workflow-specific value.",
    implementationHint:
      "Map repetitive internal tasks that already have APIs or scripts, then expose them to an agent layer incrementally.",
    status: "approved",
  },
  {
    id: "signal-020",
    rawSourceId: "source-vscode",
    signalType: "news",
    title: "VS Code highlights review flows for AI-generated changes",
    summary:
      "VS Code documentation now puts more emphasis on review, diff inspection, and human approval patterns for AI-generated edits.",
    sourceName: "VS Code",
    url: "https://code.visualstudio.com/blog/ai-review-workflows",
    publishedAt: "2026-04-02T16:30:00.000Z",
    vendors: ["Microsoft"],
    technologies: ["VS Code", "AI review", "diff workflows"],
    industries: ["Software"],
    functions: ["engineering", "risk"],
    impactScore: 76,
    noveltyScore: 65,
    confidenceScore: 78,
    businessImpact:
      "The strongest AI coding workflows are increasingly review-centric rather than generation-centric.",
    implementationHint:
      "Measure adoption not just by code produced, but by how quickly safe changes move through review.",
    status: "approved",
  },
  {
    id: "signal-021",
    rawSourceId: "source-anthropic",
    signalType: "market_signal",
    title: "Anthropic positions reliability as a differentiator for enterprise agents",
    summary:
      "Anthropic’s messaging increasingly focuses on controllability, long-context consistency, and tool reliability as enterprise adoption drivers.",
    sourceName: "Anthropic",
    url: "https://www.anthropic.com/news/enterprise-agent-reliability",
    publishedAt: "2026-04-01T09:10:00.000Z",
    vendors: ["Anthropic"],
    technologies: ["agents", "tool reliability", "enterprise AI"],
    industries: ["Enterprise", "Software"],
    functions: ["strategy", "risk", "engineering"],
    impactScore: 89,
    noveltyScore: 77,
    confidenceScore: 86,
    businessImpact:
      "Reliability is becoming a commercial narrative, not just a technical metric, which will shape enterprise vendor selection.",
    implementationHint:
      "Include reliability evidence and failure analysis in any internal business case for AI platform adoption.",
    status: "approved",
  },
  {
    id: "signal-022",
    rawSourceId: "source-openai",
    signalType: "use_case_signal",
    title: "Customer support teams move from chat summaries to action orchestration",
    summary:
      "OpenAI examples show support leaders using AI not only for ticket summaries, but also for routing, drafting replies, and handoff recommendations.",
    sourceName: "OpenAI",
    url: "https://openai.com/news/support-action-orchestration",
    publishedAt: "2026-03-31T13:05:00.000Z",
    vendors: ["OpenAI"],
    technologies: ["support agents", "workflow routing", "ticket summarization"],
    industries: ["Support", "SaaS", "E-commerce"],
    functions: ["customer_experience", "operations"],
    impactScore: 85,
    noveltyScore: 73,
    confidenceScore: 82,
    businessImpact:
      "Support AI is moving toward orchestration, which changes the ROI story from efficiency alone to service consistency and escalation quality.",
    implementationHint:
      "Prioritize workflows where the support team already uses standard playbooks, because those rules transfer well into AI-assisted routing.",
    status: "approved",
  },
  {
    id: "signal-023",
    rawSourceId: "source-google",
    signalType: "use_case_signal",
    title: "Retail case shows AI demand forecasting tied to campaign planning",
    summary:
      "Google presented a retail example where AI planning connected promotional calendars, demand shifts, and inventory commentary into one decision loop.",
    sourceName: "Google AI",
    url: "https://blog.google/technology/ai/retail-demand-campaign-planning",
    publishedAt: "2026-03-30T11:40:00.000Z",
    vendors: ["Google"],
    technologies: ["forecasting", "retail planning", "decision support"],
    industries: ["Retail"],
    functions: ["operations", "strategy"],
    impactScore: 83,
    noveltyScore: 70,
    confidenceScore: 79,
    businessImpact:
      "Planning use cases become more valuable when AI can combine predictive signals with campaign and narrative context for decision makers.",
    implementationHint:
      "Use AI to explain forecast movement in business language, not just to produce a number.",
    status: "approved",
  },
  {
    id: "signal-024",
    rawSourceId: "source-hackernews",
    signalType: "market_signal",
    title: "Practitioners debate whether AI platforms or workflows will capture value",
    summary:
      "Operators on Hacker News debated whether moat will belong to model vendors or to teams that own workflow-specific data and orchestration logic.",
    sourceName: "Hacker News",
    url: "https://news.ycombinator.com/item?id=435990",
    publishedAt: "2026-03-29T18:45:00.000Z",
    vendors: ["OpenAI", "Anthropic", "Google", "Microsoft"],
    technologies: ["agents", "workflow automation", "enterprise platforms"],
    industries: ["Software", "Enterprise"],
    functions: ["strategy"],
    impactScore: 81,
    noveltyScore: 68,
    confidenceScore: 76,
    businessImpact:
      "This debate matters because workflow ownership may become more defensible than access to any single frontier model.",
    implementationHint:
      "Track which internal assets are unique: data, approvals, operating procedures, or human review loops.",
    status: "approved",
  },
  {
    id: "signal-025",
    rawSourceId: "source-reddit",
    signalType: "use_case_signal",
    title: "Product teams share AI-assisted PRD and backlog synthesis",
    summary:
      "Product managers described using AI to draft PRDs, reconcile stakeholder notes, and translate customer themes into backlog proposals.",
    sourceName: "Reddit",
    url: "https://www.reddit.com/r/productmanagement/comments/ai-prd-synthesis",
    publishedAt: "2026-03-28T06:50:00.000Z",
    vendors: ["Anthropic", "OpenAI", "Notion"],
    technologies: ["PRD drafting", "backlog synthesis", "research notes"],
    industries: ["Software"],
    functions: ["product", "strategy"],
    impactScore: 79,
    noveltyScore: 69,
    confidenceScore: 74,
    businessImpact:
      "AI is increasingly useful in product ops where teams need structured synthesis across customer signals, roadmap themes, and execution constraints.",
    implementationHint:
      "Use AI to generate first-draft structure, then let PMs validate prioritization logic and strategic tradeoffs.",
    status: "approved",
  },
  {
    id: "signal-026",
    rawSourceId: "source-video",
    signalType: "use_case_signal",
    title: "Video demo maps AI copilots into procurement workflows",
    summary:
      "A procurement demo showed AI summarizing vendor proposals, highlighting risk areas, and preparing negotiation notes for sourcing teams.",
    sourceName: "YouTube/Bilibili",
    url: "https://www.youtube.com/watch?v=procurement-ai-copilot",
    publishedAt: "2026-03-27T14:10:00.000Z",
    vendors: ["Anthropic", "Google"],
    technologies: ["document review", "procurement", "negotiation prep"],
    industries: ["Procurement", "Enterprise"],
    functions: ["operations", "risk"],
    impactScore: 80,
    noveltyScore: 71,
    confidenceScore: 75,
    businessImpact:
      "Back-office decision support is gaining ground because AI can compress document review time without requiring full process automation.",
    implementationHint:
      "Focus on workflows with recurring documents and standard evaluation criteria before attempting end-to-end procurement automation.",
    status: "approved",
  },
  {
    id: "signal-027",
    rawSourceId: "source-github-releases",
    signalType: "tool_update",
    title: "Open-source observability stack adds agent trace replay",
    summary:
      "A growing set of open-source observability tools now supports trace replay for multi-step agents, making debugging and review more practical for teams.",
    sourceName: "GitHub Releases",
    url: "https://github.com/releases/agent-trace-replay",
    publishedAt: "2026-03-26T15:20:00.000Z",
    vendors: ["Open Source"],
    technologies: ["observability", "trace replay", "agents"],
    industries: ["Software", "Enterprise"],
    functions: ["engineering", "risk"],
    impactScore: 82,
    noveltyScore: 78,
    confidenceScore: 81,
    businessImpact:
      "Trace replay supports auditability and faster debugging, both of which are essential for scaling agent workflows inside companies.",
    implementationHint:
      "If you are piloting agents, capture traces now even if you do not yet have perfect dashboards for them.",
    status: "approved",
  },
  {
    id: "signal-028",
    rawSourceId: "source-vscode",
    signalType: "market_signal",
    title: "VS Code plugin ecosystem widens around AI workflow specialization",
    summary:
      "The VS Code ecosystem is increasingly segmented into specialized plugins for review, debugging, context loading, and task execution around AI workflows.",
    sourceName: "VS Code",
    url: "https://code.visualstudio.com/blog/ai-plugin-specialization",
    publishedAt: "2026-03-25T17:00:00.000Z",
    vendors: ["Microsoft", "Open Source"],
    technologies: ["VS Code", "plugins", "workflow specialization"],
    industries: ["Software"],
    functions: ["engineering", "operations"],
    impactScore: 75,
    noveltyScore: 67,
    confidenceScore: 76,
    businessImpact:
      "Tool sprawl is rising, which makes workflow architecture and vendor consolidation more important for teams than ever.",
    implementationHint:
      "Standardize a small approved AI tooling stack per team to avoid fragmentation and hidden risk.",
    status: "approved",
  },
  {
    id: "signal-029",
    rawSourceId: "source-anthropic",
    signalType: "news",
    title: "Anthropic emphasizes AI systems that support analyst judgment",
    summary:
      "Anthropic’s research positioning continues to highlight AI as a collaborator for judgment-heavy work instead of a replacement for high-stakes decision makers.",
    sourceName: "Anthropic",
    url: "https://www.anthropic.com/news/analyst-judgment-systems",
    publishedAt: "2026-03-24T09:35:00.000Z",
    vendors: ["Anthropic"],
    technologies: ["analyst workflows", "human in the loop", "decision support"],
    industries: ["Consulting", "Financial Services", "Strategy"],
    functions: ["strategy", "risk", "operations"],
    impactScore: 84,
    noveltyScore: 74,
    confidenceScore: 85,
    businessImpact:
      "Judgment-heavy roles will likely adopt AI fastest when the workflow clearly preserves review authority and reasoning visibility.",
    implementationHint:
      "Frame AI adoption around decision support and synthesis first, not full autonomy, for analyst-centered teams.",
    status: "approved",
  },
  {
    id: "signal-030",
    rawSourceId: "source-openai",
    signalType: "market_signal",
    title: "OpenAI messaging suggests business value is becoming workflow-native",
    summary:
      "Recent OpenAI positioning suggests the real adoption story is no longer model access alone, but how AI gets embedded inside recurring business workflows.",
    sourceName: "OpenAI",
    url: "https://openai.com/news/workflow-native-ai-value",
    publishedAt: "2026-03-23T12:00:00.000Z",
    vendors: ["OpenAI"],
    technologies: ["workflow automation", "agents", "enterprise AI"],
    industries: ["Enterprise", "Software", "Operations"],
    functions: ["strategy", "operations", "product"],
    impactScore: 91,
    noveltyScore: 80,
    confidenceScore: 87,
    businessImpact:
      "Long-term value will be captured by teams that own workflow integration, review systems, and domain context rather than only prompt access.",
    implementationHint:
      "Audit which recurring workflows already have enough structure, data, and accountability to support AI deployment now.",
    status: "approved",
  },
];

const useCaseSeeds: UseCaseRecord[] = [
  {
    id: "usecase-001",
    title: "AI daily executive brief for strategy teams",
    industry: "Consulting",
    businessFunction: "strategy",
    problem: "Leaders struggle to scan scattered AI updates and convert them into decision-ready insight each morning.",
    solutionPattern:
      "Aggregate multi-source signals, generate a concise brief, and attach business impact notes plus prediction updates.",
    tools: ["Claude", "OpenAI", "Notion", "Supabase"],
    implementationLevel: "production",
    expectedValue: "Reduces analysis prep time and increases visibility into fast-moving AI shifts.",
    risks: "Narrative drift, stale sources, and overconfidence in generated summaries.",
    businessImpact:
      "Turns fragmented AI monitoring into a repeatable intelligence product that supports executive decision velocity.",
    maturity: "validated",
    sourceSignalIds: ["signal-013", "signal-029", "signal-030"],
    status: "approved",
  },
  {
    id: "usecase-002",
    title: "Code review copilot with repository-aware context",
    industry: "Software",
    businessFunction: "engineering",
    problem: "Developers lose time context-switching across issue context, diffs, and test failures.",
    solutionPattern:
      "Use a repository-aware coding agent to summarize context, propose edits, and support human review before merge.",
    tools: ["Claude Code", "GitHub", "VS Code"],
    implementationLevel: "team_ready",
    expectedValue: "Accelerates refactors and lowers friction in multi-step code workflows.",
    risks: "Incorrect edits, poor context handling, and weak review discipline.",
    businessImpact:
      "Increases engineering throughput when paired with strong review and test workflows rather than blind auto-merge.",
    maturity: "scaling",
    sourceSignalIds: ["signal-001", "signal-011", "signal-020"],
    status: "approved",
  },
  {
    id: "usecase-003",
    title: "Support ticket triage and routing assistant",
    industry: "SaaS",
    businessFunction: "customer_experience",
    problem: "Support teams spend too much time classifying tickets and preparing first responses.",
    solutionPattern:
      "Summarize tickets, classify urgency, draft response options, and recommend routing to the right queue.",
    tools: ["OpenAI", "Zendesk", "Supabase"],
    implementationLevel: "production",
    expectedValue: "Improves response consistency and lowers triage time for frontline teams.",
    risks: "Misclassification, tone mismatch, and automation without escalation controls.",
    businessImpact:
      "Shifts support AI from single-task summarization into higher-value orchestration and service consistency.",
    maturity: "mainstream",
    sourceSignalIds: ["signal-022"],
    status: "approved",
  },
  {
    id: "usecase-004",
    title: "Sales call-to-CRM intelligence workflow",
    industry: "SaaS",
    businessFunction: "operations",
    problem: "Account teams often fail to update CRM systems consistently after calls.",
    solutionPattern:
      "Turn call transcripts into CRM notes, next steps, risk flags, and deal-stage suggestions.",
    tools: ["OpenAI", "HubSpot", "speech-to-text"],
    implementationLevel: "team_ready",
    expectedValue: "Reduces admin time and improves forecast quality through cleaner CRM data.",
    risks: "Over-automation, weak human QA, and bad downstream CRM updates.",
    businessImpact:
      "Improves revenue operations by standardizing post-call capture and recommended follow-up actions.",
    maturity: "validated",
    sourceSignalIds: ["signal-008"],
    status: "approved",
  },
  {
    id: "usecase-005",
    title: "Legal ops contract deviation review",
    industry: "Legal",
    businessFunction: "risk",
    problem: "Teams manually compare contract language and summarize risk deviations.",
    solutionPattern:
      "Pre-tag clauses, summarize deviations, and draft review notes before legal approval.",
    tools: ["Gemini", "document analysis", "workflow rules"],
    implementationLevel: "team_ready",
    expectedValue: "Shortens first-pass review time for repetitive legal documents.",
    risks: "False confidence on clause interpretation and incomplete exception capture.",
    businessImpact:
      "Increases document review leverage while preserving legal sign-off as the decision gate.",
    maturity: "validated",
    sourceSignalIds: ["signal-010"],
    status: "approved",
  },
  {
    id: "usecase-006",
    title: "Month-end finance commentary generator",
    industry: "Financial Services",
    businessFunction: "operations",
    problem: "Finance teams spend too much time writing recurring variance commentary and management notes.",
    solutionPattern:
      "Draft variance explanations, highlight unusual movements, and assemble a review-ready summary packet.",
    tools: ["Claude", "Excel exports", "BI dashboards"],
    implementationLevel: "pilot",
    expectedValue: "Cuts repetitive reporting work and increases visibility into anomalies.",
    risks: "Narrative inaccuracies and hidden dependency on low-quality source data.",
    businessImpact:
      "Improves close-cycle speed while keeping critical sign-off and audit review in human hands.",
    maturity: "emerging",
    sourceSignalIds: ["signal-017"],
    status: "approved",
  },
  {
    id: "usecase-007",
    title: "Internal knowledge assistant for operations teams",
    industry: "Enterprise",
    businessFunction: "operations",
    problem: "Teams lose time searching internal docs, playbooks, and policy notes across disconnected systems.",
    solutionPattern:
      "Connect documents and workflow tools into a retrieval-first assistant with structured answers and linked citations.",
    tools: ["Gemini", "Supabase", "workspace connectors"],
    implementationLevel: "production",
    expectedValue: "Reduces search time and improves consistency in answering internal process questions.",
    risks: "Stale content, access control gaps, and overbroad retrieval.",
    businessImpact:
      "Creates a reusable knowledge layer that compounds value across large organizations.",
    maturity: "scaling",
    sourceSignalIds: ["signal-003"],
    status: "approved",
  },
  {
    id: "usecase-008",
    title: "Procurement proposal comparison assistant",
    industry: "Enterprise",
    businessFunction: "operations",
    problem: "Sourcing teams spend too much time comparing large vendor responses across fixed criteria.",
    solutionPattern:
      "Summarize proposals, flag gaps, and draft negotiation notes for sourcing managers.",
    tools: ["Claude", "Google AI", "document parsers"],
    implementationLevel: "pilot",
    expectedValue: "Speeds up evaluation cycles while preserving human negotiation control.",
    risks: "Missed nuance in vendor commitments and inconsistent scoring logic.",
    businessImpact:
      "Improves procurement throughput and enables more standardized vendor review.",
    maturity: "emerging",
    sourceSignalIds: ["signal-026"],
    status: "approved",
  },
  {
    id: "usecase-009",
    title: "Product PRD and research synthesis assistant",
    industry: "Software",
    businessFunction: "product",
    problem: "Product managers need to combine research notes, customer feedback, and roadmap context under time pressure.",
    solutionPattern:
      "Generate draft PRDs, summarize customer themes, and organize backlog proposals for PM review.",
    tools: ["Claude", "OpenAI", "Notion"],
    implementationLevel: "team_ready",
    expectedValue: "Reduces PM synthesis overhead and makes discovery artifacts more consistent.",
    risks: "Weak prioritization logic and overconfident recommendations.",
    businessImpact:
      "Moves PM AI adoption toward structured synthesis rather than isolated note summarization.",
    maturity: "validated",
    sourceSignalIds: ["signal-025"],
    status: "approved",
  },
  {
    id: "usecase-010",
    title: "Retail campaign and demand planning explainer",
    industry: "Retail",
    businessFunction: "strategy",
    problem: "Planning teams receive forecasts without clear narrative links to campaigns and inventory assumptions.",
    solutionPattern:
      "Use AI to connect demand shifts, promo calendars, and inventory commentary into planning briefs.",
    tools: ["Gemini", "forecasting models", "BI exports"],
    implementationLevel: "pilot",
    expectedValue: "Improves decision quality by adding interpretable business context to forecasts.",
    risks: "Weak causal reasoning and poor source reconciliation.",
    businessImpact:
      "Makes AI forecasting more actionable for business users by improving explainability instead of just prediction output.",
    maturity: "emerging",
    sourceSignalIds: ["signal-023"],
    status: "approved",
  },
  {
    id: "usecase-011",
    title: "Service visit summary standardization",
    industry: "Field Service",
    businessFunction: "customer_experience",
    problem: "Technician notes vary in quality, making post-visit reporting inconsistent.",
    solutionPattern:
      "Turn photos and notes into standardized visit summaries with customer-facing and manager-facing versions.",
    tools: ["vision models", "OpenAI", "Google AI"],
    implementationLevel: "pilot",
    expectedValue: "Improves documentation quality and makes field data more reusable.",
    risks: "Bad image context, summary hallucination, and low trust from technicians.",
    businessImpact:
      "Creates cleaner downstream data for service quality monitoring and follow-up actions.",
    maturity: "emerging",
    sourceSignalIds: ["signal-018"],
    status: "approved",
  },
  {
    id: "usecase-012",
    title: "Analyst research memo first-draft workflow",
    industry: "Research",
    businessFunction: "strategy",
    problem: "Analysts lose time building first-pass memo structure from scattered notes and links.",
    solutionPattern:
      "Create an AI draft memo with sourced claims, then let the analyst review structure, evidence, and recommendations.",
    tools: ["Claude", "research links", "Supabase"],
    implementationLevel: "production",
    expectedValue: "Shortens the path from raw research to stakeholder-ready narrative.",
    risks: "Weak citation control and over-reliance on model-written framing.",
    businessImpact:
      "Keeps human judgment at the center while making synthesis work much faster.",
    maturity: "validated",
    sourceSignalIds: ["signal-013", "signal-029"],
    status: "approved",
  },
  {
    id: "usecase-013",
    title: "AI-powered incident review and postmortem drafting",
    industry: "Software",
    businessFunction: "engineering",
    problem: "Engineering managers spend too much time converting logs and chat threads into incident narratives.",
    solutionPattern:
      "Summarize timelines, extract root-cause candidates, and generate draft postmortems for review.",
    tools: ["OpenAI", "observability traces", "incident tooling"],
    implementationLevel: "team_ready",
    expectedValue: "Accelerates postmortem creation and improves clarity in incident retrospectives.",
    risks: "Timeline errors and premature causal conclusions.",
    businessImpact:
      "Improves learning loops when AI is used to compress operational complexity into reviewable narrative form.",
    maturity: "validated",
    sourceSignalIds: ["signal-027"],
    status: "approved",
  },
  {
    id: "usecase-014",
    title: "Marketing campaign performance recap assistant",
    industry: "Marketing",
    businessFunction: "operations",
    problem: "Teams manually assemble multi-channel campaign recaps from dashboards and meeting notes.",
    solutionPattern:
      "Combine metric snapshots, experiment notes, and stakeholder updates into a campaign review memo.",
    tools: ["Claude", "BI dashboards", "Notion"],
    implementationLevel: "team_ready",
    expectedValue: "Reduces recap prep time and improves cross-functional reporting quality.",
    risks: "Selective interpretation of metrics and weak attribution reasoning.",
    businessImpact:
      "Creates a scalable reporting layer for marketing operations teams with recurring briefing needs.",
    maturity: "validated",
    sourceSignalIds: ["signal-007"],
    status: "approved",
  },
  {
    id: "usecase-015",
    title: "Enterprise AI permissioning for workflow execution",
    industry: "Enterprise",
    businessFunction: "risk",
    problem: "Teams need AI to act in systems without giving every workflow full write access.",
    solutionPattern:
      "Define read-only, assisted, and auto-execute action tiers with approval gates by workflow type.",
    tools: ["OpenAI", "workflow orchestration", "governance rules"],
    implementationLevel: "production",
    expectedValue: "Unlocks more automation while controlling execution risk.",
    risks: "Poorly designed permission boundaries and approval fatigue.",
    businessImpact:
      "Makes enterprise agent deployment much more realistic by separating insight generation from action authority.",
    maturity: "scaling",
    sourceSignalIds: ["signal-009"],
    status: "approved",
  },
  {
    id: "usecase-016",
    title: "AI governance dashboard for model and workflow selection",
    industry: "Enterprise",
    businessFunction: "strategy",
    problem: "Teams cannot easily compare AI workflows across cost, reliability, and business value dimensions.",
    solutionPattern:
      "Maintain a dashboard of signals, evaluations, vendor tradeoffs, and adoption notes across active AI workflows.",
    tools: ["Supabase", "Drizzle", "Claude", "OpenAI"],
    implementationLevel: "production",
    expectedValue: "Improves prioritization and vendor governance for AI investments.",
    risks: "Stale data, unclear metrics, and subjective scoring without review.",
    businessImpact:
      "Turns AI tooling decisions into a strategic operating system rather than a scattered experimentation stream.",
    maturity: "validated",
    sourceSignalIds: ["signal-002", "signal-016", "signal-024"],
    status: "approved",
  },
  {
    id: "usecase-017",
    title: "AI-enhanced backlog cleanup for engineering operations",
    industry: "Software",
    businessFunction: "operations",
    problem: "Engineering backlogs accumulate duplicate, stale, or unclear tickets that slow planning.",
    solutionPattern:
      "Use AI to cluster duplicates, rewrite titles, draft acceptance criteria, and propose closure candidates.",
    tools: ["GitHub Copilot", "VS Code", "issue data"],
    implementationLevel: "team_ready",
    expectedValue: "Improves backlog quality and reduces planning overhead.",
    risks: "Accidental closure of valuable tickets and poor clustering logic.",
    businessImpact:
      "Creates a high-leverage operational use case because the workflow is repetitive, visible, and measurable.",
    maturity: "validated",
    sourceSignalIds: ["signal-004", "signal-005"],
    status: "approved",
  },
  {
    id: "usecase-018",
    title: "Board and investor update drafting assistant",
    industry: "SaaS",
    businessFunction: "strategy",
    problem: "Leadership teams manually pull updates from metrics, roadmap changes, and team notes each month.",
    solutionPattern:
      "Generate a first draft of executive updates and board narratives from structured KPI and project inputs.",
    tools: ["Claude", "BI dashboards", "roadmap exports"],
    implementationLevel: "pilot",
    expectedValue: "Reduces the time needed to assemble consistent leadership communication.",
    risks: "Narrative overreach and inaccurate strategic framing.",
    businessImpact:
      "Supports faster executive communication by treating internal reporting as a synthesis workflow.",
    maturity: "emerging",
    sourceSignalIds: ["signal-007", "signal-013"],
    status: "approved",
  },
  {
    id: "usecase-019",
    title: "Compliance note extraction for internal policy reviews",
    industry: "Financial Services",
    businessFunction: "risk",
    problem: "Compliance teams need to extract key obligations and policy changes from long documents and vendor updates.",
    solutionPattern:
      "Use AI to tag obligations, summarize differences, and surface items needing legal or risk review.",
    tools: ["Gemini", "document parsers", "Supabase"],
    implementationLevel: "pilot",
    expectedValue: "Reduces review effort in document-heavy compliance workflows.",
    risks: "Missed obligations and weak traceability back to source text.",
    businessImpact:
      "Improves scale in policy review processes while keeping final accountability with compliance owners.",
    maturity: "emerging",
    sourceSignalIds: ["signal-010", "signal-021"],
    status: "approved",
  },
  {
    id: "usecase-020",
    title: "AI news, use case, and prediction intelligence hub",
    industry: "Media",
    businessFunction: "strategy",
    problem: "AI practitioners need one place to track signals, implementation patterns, and commercial meaning every day.",
    solutionPattern:
      "Create a daily-updated platform that stores signals, use cases, reports, and analyst-reviewed predictions in one structured system.",
    tools: ["Next.js", "Supabase", "Drizzle", "Claude", "OpenAI"],
    implementationLevel: "production",
    expectedValue: "Builds a reusable intelligence asset for decision making, storytelling, and market monitoring.",
    risks: "Source quality drift, schema drift, and weak review discipline.",
    businessImpact:
      "Turns AI trend monitoring into a differentiated intelligence product rather than a stream of disconnected updates.",
    maturity: "validated",
    sourceSignalIds: ["signal-001", "signal-002", "signal-030"],
    status: "approved",
  },
];

const predictionSeeds: PredictionRecord[] = [
  {
    id: "prediction-001",
    title: "Coding copilots will compete on workflow continuity, not raw generation alone",
    statement:
      "Within 90 days, public product updates from leading coding copilots will emphasize continuity across tasks, reviews, and execution more than one-shot code generation speed.",
    timeframe: "90d",
    confidence: 82,
    rationale:
      "Signals across Anthropic, GitHub, and VS Code all point toward persistent context and multi-step execution as the next real adoption battleground.",
    impactArea: "engineering",
    supportingSignalIds: ["signal-001", "signal-004", "signal-005", "signal-011"],
    aiDraft:
      "The market is moving from model quality competition to workflow continuity competition in coding environments.",
    analystRevision:
      "Expect the strongest product messaging to cluster around review loops, repo awareness, and task memory rather than only benchmark wins.",
    status: "approved",
    createdAt: "2026-04-21T18:10:00.000Z",
  },
  {
    id: "prediction-002",
    title: "Business value will be captured by workflow owners rather than model owners alone",
    statement:
      "Within 180 days, the most durable enterprise AI advantage will come from owning workflow integration, approvals, and proprietary operational context instead of relying on access to one model provider.",
    timeframe: "180d",
    confidence: 80,
    rationale:
      "Multiple signals indicate that integration, governance, and review systems are becoming more important than benchmark differentials.",
    impactArea: "strategy",
    supportingSignalIds: ["signal-024", "signal-027", "signal-030"],
    aiDraft:
      "Workflow ownership may become more valuable than model ownership in enterprise AI adoption.",
    analystRevision:
      "The strategic moat is shifting toward operational embedding: who controls context, review loops, and execution architecture.",
    status: "approved",
    createdAt: "2026-04-21T18:11:00.000Z",
  },
  {
    id: "prediction-003",
    title: "Support AI will evolve from summarization to action orchestration",
    statement:
      "Within 30 days, support-focused AI announcements will increasingly bundle summarization with routing, policy checks, and escalation recommendations.",
    timeframe: "30d",
    confidence: 78,
    rationale:
      "Support use cases are already shifting toward workflow action layers instead of isolated content generation.",
    impactArea: "customer_experience",
    supportingSignalIds: ["signal-022", "signal-008"],
    aiDraft:
      "Support copilots are likely to move from note-taking into full queue and escalation orchestration.",
    analystRevision:
      "Watch for support products that attach policy routing and recommended actions to conversation summaries.",
    status: "approved",
    createdAt: "2026-04-21T18:12:00.000Z",
  },
  {
    id: "prediction-004",
    title: "Analyst workflows will adopt AI fastest where final judgment remains visible",
    statement:
      "Over the next 90 days, analyst and strategy teams will adopt AI more aggressively in memo drafting and synthesis than in fully autonomous recommendation systems.",
    timeframe: "90d",
    confidence: 84,
    rationale:
      "Signals emphasize human-in-the-loop synthesis and judgment support rather than decision replacement.",
    impactArea: "strategy",
    supportingSignalIds: ["signal-013", "signal-029"],
    aiDraft:
      "Analyst-centered workflows favor decision support over autonomous recommendation generation.",
    analystRevision:
      "The strongest adoption pattern will be 'AI drafts, humans decide' in research, strategy, and business analysis environments.",
    status: "approved",
    createdAt: "2026-04-21T18:13:00.000Z",
  },
  {
    id: "prediction-005",
    title: "Structured outputs will become a default requirement for operational AI",
    statement:
      "Within 180 days, structured output support and schema validation will be treated as baseline requirements for operational AI deployments.",
    timeframe: "180d",
    confidence: 86,
    rationale:
      "Structured outputs are increasingly central to integrating AI into automation, analytics, and reporting systems safely.",
    impactArea: "operations",
    supportingSignalIds: ["signal-014", "signal-002"],
    aiDraft:
      "Schema-safe outputs are likely to move from nice-to-have to baseline requirement in enterprise AI workflows.",
    analystRevision:
      "Organizations that treat LLM output as system input will force structured output reliability into the default feature set for vendor selection.",
    status: "approved",
    createdAt: "2026-04-21T18:14:00.000Z",
  },
  {
    id: "prediction-006",
    title: "Permissioning and action tiers will define enterprise agent rollout speed",
    statement:
      "Within 90 days, enterprises evaluating agents will prioritize action-tier controls and approval design as much as they prioritize model accuracy.",
    timeframe: "90d",
    confidence: 81,
    rationale:
      "Execution risk is the central blocker to agent adoption, and permissioning frameworks directly address it.",
    impactArea: "risk",
    supportingSignalIds: ["signal-009", "signal-016", "signal-021"],
    aiDraft:
      "Permissioning will become a central enterprise buying criterion for agent platforms.",
    analystRevision:
      "The enterprise rollout question is increasingly not 'can the model do it?' but 'what is it allowed to do without review?'",
    status: "approved",
    createdAt: "2026-04-21T18:15:00.000Z",
  },
  {
    id: "prediction-007",
    title: "Back-office document workflows will outpace flashy consumer AI use cases",
    statement:
      "Within 180 days, document-heavy back-office functions such as legal ops, procurement, and compliance will show more stable AI ROI than broad consumer-facing novelty use cases.",
    timeframe: "180d",
    confidence: 79,
    rationale:
      "These workflows already have repetitive structure, clear documents, and measurable review bottlenecks.",
    impactArea: "operations",
    supportingSignalIds: ["signal-010", "signal-026"],
    aiDraft:
      "Structured back-office workflows are likely to outperform novelty use cases on near-term enterprise ROI.",
    analystRevision:
      "Expect document review and policy-heavy workflows to remain among the best short-term AI deployment candidates.",
    status: "approved",
    createdAt: "2026-04-21T18:16:00.000Z",
  },
  {
    id: "prediction-008",
    title: "AI tooling stacks will fragment before they consolidate",
    statement:
      "Over the next 30 days, more teams will add specialized AI plugins and point tools before later consolidating around a smaller approved workflow stack.",
    timeframe: "30d",
    confidence: 74,
    rationale:
      "Signals show rapid plugin specialization in VS Code and broader pressure to standardize later for risk and workflow clarity.",
    impactArea: "engineering",
    supportingSignalIds: ["signal-012", "signal-028"],
    aiDraft:
      "The next stage of adoption is likely to be short-term tool sprawl followed by stack consolidation.",
    analystRevision:
      "This looks like a temporary fragmentation phase: experimentation first, workflow governance second.",
    status: "approved",
    createdAt: "2026-04-21T18:17:00.000Z",
  },
  {
    id: "prediction-009",
    title: "Knowledge assistants will become default internal productivity infrastructure",
    statement:
      "Within 180 days, more enterprise teams will treat knowledge assistants as shared productivity infrastructure rather than isolated innovation projects.",
    timeframe: "180d",
    confidence: 77,
    rationale:
      "Knowledge retrieval has broad applicability and relatively clear value once access controls and content freshness are managed well.",
    impactArea: "operations",
    supportingSignalIds: ["signal-003"],
    aiDraft:
      "Knowledge assistants are on track to become a default internal workflow layer in enterprise environments.",
    analystRevision:
      "The strongest version of this trend is not chatbot novelty, but retrieval becoming part of how teams operate every day.",
    status: "approved",
    createdAt: "2026-04-21T18:18:00.000Z",
  },
  {
    id: "prediction-010",
    title: "AI intelligence products will differentiate through analyst framing",
    statement:
      "Within 90 days, AI monitoring products that add clear business interpretation and analyst framing will stand out more than products that only aggregate links.",
    timeframe: "90d",
    confidence: 83,
    rationale:
      "Information abundance is no longer the constraint; meaning, relevance, and business interpretation are the scarce layer.",
    impactArea: "strategy",
    supportingSignalIds: ["signal-007", "signal-013", "signal-030"],
    aiDraft:
      "The most valuable AI news products will likely combine aggregation with business interpretation.",
    analystRevision:
      "Aggregation is table stakes; judgment, prioritization, and business framing are the durable differentiators.",
    status: "approved",
    createdAt: "2026-04-21T18:19:00.000Z",
  },
];

const reportSeeds: ReportRecord[] = [
  {
    id: "report-2026-04-21",
    reportDate: "2026-04-21",
    executiveSummary:
      "Today's AI market signal is broader than any single vendor or coding tool. Research progress, platform controls, open-source infrastructure, and workflow-specific applications are converging into a new execution layer for business and product teams.",
    topSignalIds: ["signal-001", "signal-002", "signal-019", "signal-030"],
    topUseCaseIds: ["usecase-002", "usecase-012", "usecase-020"],
    strategicTakeaways: [
      "Research and platform releases increasingly matter when they change deployment economics, evaluation standards, or workflow reliability.",
      "Structured outputs and action permissioning are becoming non-negotiable for enterprise AI operations.",
      "The biggest moat may belong to teams that own workflow integration, analyst framing, and operational context, not model access alone.",
    ],
    businessImpactSummary:
      "Business teams should treat AI less like a feature race and more like a workflow design decision. The winners will be organizations that combine model capability with governance, review systems, and domain-specific execution patterns.",
    predictionUpdates: [
      "Workflow continuity remains a strong differentiator, but it now sits alongside governance, retrieval quality, and open-stack flexibility.",
      "Permission design is emerging as a practical gate for enterprise agent deployment.",
      "Analyst-reviewed intelligence products may become more valuable than pure AI news aggregation.",
    ],
    publishedAt: "2026-04-21T19:00:00.000Z",
  },
  {
    id: "report-2026-04-20",
    reportDate: "2026-04-20",
    executiveSummary:
      "The AI product layer continues to move closer to execution. Today's strongest signals center on production evals, governance, knowledge systems, and workflow categories where AI can take on repeatable synthesis or coordination tasks.",
    topSignalIds: ["signal-002", "signal-009", "signal-022"],
    topUseCaseIds: ["usecase-003", "usecase-015", "usecase-016"],
    strategicTakeaways: [
      "Production evals are moving into the foreground for enterprise agent design.",
      "Permissioned action tiers offer a clearer path to trusted automation.",
      "Support and operations are becoming orchestration-heavy AI categories.",
    ],
    businessImpactSummary:
      "Operators should expect workflow governance and measurable control layers to become buying criteria for enterprise AI stacks.",
    predictionUpdates: [
      "Support AI is likely to move beyond summarization into routing and action orchestration.",
      "Structured outputs and evals are becoming operational infrastructure.",
    ],
    publishedAt: "2026-04-20T18:30:00.000Z",
  },
  {
    id: "report-2026-04-18",
    reportDate: "2026-04-18",
    executiveSummary:
      "AI productivity platforms are competing less on novelty and more on how smoothly they fit into existing developer, analyst, and operational workflows.",
    topSignalIds: ["signal-004", "signal-005", "signal-011"],
    topUseCaseIds: ["usecase-002", "usecase-017"],
    strategicTakeaways: [
      "Editor-native workflows matter more than standalone copilots.",
      "Review and context continuity are key adoption drivers.",
      "Engineering teams need stack clarity before tool sprawl gets expensive.",
    ],
    businessImpactSummary:
      "Developer platform decisions increasingly look like workflow architecture decisions, not one-off tool purchases.",
    predictionUpdates: [
      "Tool fragmentation will likely precede a consolidation phase.",
    ],
    publishedAt: "2026-04-18T18:00:00.000Z",
  },
];

function buildRawSignal(signal: SignalSeed): RawSignal {
  return {
    id: `raw-${signal.id}`,
    sourceId: signal.rawSourceId,
    externalId: signal.id,
    url: signal.url,
    titleRaw: signal.title,
    contentRaw: `${signal.summary}\n\n${signal.businessImpact}`,
    payloadJson: {
      vendors: signal.vendors,
      technologies: signal.technologies,
      industries: signal.industries,
      functions: signal.functions,
    },
    publishedAt: signal.publishedAt,
    fetchedAt: signal.publishedAt,
    hash: `${signal.id}-hash`,
  };
}

export const seedData = {
  sources: sourceSeeds,
  rawIngestions: signalSeeds.map(buildRawSignal),
  signals: signalSeeds.map((signal) => ({
    ...signal,
    rawIngestionId: `raw-${signal.id}`,
  })) satisfies NormalizedSignal[],
  useCases: useCaseSeeds,
  predictions: predictionSeeds,
  reports: reportSeeds,
};

export const seedDashboardData: DashboardData = {
  dailyBrief: seedData.reports[0],
  topSignals: seedData.signals.slice(0, 6),
  useCases: seedData.useCases.slice(0, 6),
  businessSignals: seedData.signals
    .filter((signal) => signal.impactScore >= 85)
    .slice(0, 5),
  tools: buildToolTrackingEntries(seedData.signals, seedData.useCases).slice(0, 6),
  predictions: seedData.predictions.slice(0, 6),
};
