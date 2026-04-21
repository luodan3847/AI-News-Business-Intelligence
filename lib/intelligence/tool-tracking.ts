import { normalizeContent } from "./rebalance";
import type {
  NormalizedSignal,
  ToolTrackingEntry,
  UseCaseRecord,
} from "./types";

type TrackedEntityDefinition = {
  name: string;
  vendor: string;
  category: string;
  overview: string;
  keywords: string[];
  vendorMatches?: string[];
  sourceMatches?: string[];
};

const trackedEntityCatalog: TrackedEntityDefinition[] = [
  {
    name: "Frontier Research",
    vendor: "Research",
    category: "Research",
    overview:
      "Tracks papers, benchmarks, reasoning advances, and multimodal work that can shift the practical AI baseline.",
    keywords: [
      "research",
      "paper",
      "benchmark",
      "arxiv",
      "preprint",
      "reasoning",
      "multimodal",
      "frontier model",
    ],
    sourceMatches: ["arXiv AI Research"],
  },
  {
    name: "OpenAI Platform",
    vendor: "OpenAI",
    category: "Model platform",
    overview:
      "Foundation model and agent platform centered on structured outputs, evals, and workflow-ready enterprise APIs.",
    keywords: ["openai", "gpt", "structured outputs", "evals", "responses api"],
    vendorMatches: ["OpenAI"],
    sourceMatches: ["OpenAI"],
  },
  {
    name: "Anthropic & Claude",
    vendor: "Anthropic",
    category: "Model platform",
    overview:
      "Anthropic's execution layer across Claude, Claude Code, long-context reasoning, and enterprise-grade controls.",
    keywords: [
      "anthropic",
      "claude",
      "claude code",
      "long-context",
      "computer use",
      "agentic coding",
      "constitutional ai",
    ],
    vendorMatches: ["Anthropic"],
    sourceMatches: ["Anthropic"],
  },
  {
    name: "Gemini & Google AI",
    vendor: "Google",
    category: "Model platform",
    overview:
      "Google's multimodal AI stack across Gemini, DeepMind research, workspace intelligence, and enterprise retrieval.",
    keywords: [
      "gemini",
      "google ai",
      "google deepmind",
      "deepmind",
      "workspace automation",
      "google workspace",
    ],
    vendorMatches: ["Google", "Google DeepMind"],
    sourceMatches: ["Google AI", "Google DeepMind"],
  },
  {
    name: "Hugging Face & Open Models",
    vendor: "Hugging Face",
    category: "Open-source ecosystem",
    overview:
      "Open-source model distribution, serving infrastructure, and reusable components that accelerate experimentation and deployment.",
    keywords: [
      "hugging face",
      "transformers",
      "open source",
      "open weights",
      "model serving",
      "inference",
      "ollama",
      "serving stack",
    ],
    vendorMatches: ["Hugging Face", "Open Source"],
    sourceMatches: ["Hugging Face", "GitHub Releases"],
  },
  {
    name: "MCP & Agent Infrastructure",
    vendor: "Open ecosystem",
    category: "Agent infrastructure",
    overview:
      "Protocol and orchestration layer for connecting models to tools, internal systems, and multi-step execution workflows.",
    keywords: [
      "mcp",
      "tool integration",
      "workflow orchestration",
      "agent framework",
      "tool use",
      "model routing",
      "internal systems",
      "connectors",
      "langchain",
      "autogen",
    ],
    vendorMatches: ["Anthropic", "Open Source"],
    sourceMatches: ["GitHub Releases"],
  },
  {
    name: "Knowledge Systems & Retrieval",
    vendor: "Mixed",
    category: "Workflow stack",
    overview:
      "Knowledge assistants, retrieval layers, and document intelligence systems that turn internal context into usable operational memory.",
    keywords: [
      "knowledge assistant",
      "knowledge systems",
      "retrieval",
      "workspace connectors",
      "document parsers",
      "document intelligence",
      "search time",
      "linked citations",
    ],
  },
  {
    name: "GitHub Copilot",
    vendor: "GitHub",
    category: "Developer tooling",
    overview:
      "Repository-aware coding assistant focused on continuity across diffs, reviews, and execution loops.",
    keywords: [
      "github copilot",
      "copilot",
      "pull request review",
      "repo awareness",
      "issue data",
      "workflow memory",
    ],
    vendorMatches: ["GitHub"],
    sourceMatches: ["GitHub Releases"],
  },
  {
    name: "VS Code AI",
    vendor: "Microsoft",
    category: "Developer tooling",
    overview:
      "Editor-native AI coordination layer where coding agents, review flows, and specialized plugins increasingly converge.",
    keywords: [
      "vs code",
      "vscode",
      "editor-native",
      "agent workflows",
      "ai review",
      "plugin specialization",
      "developer workflow",
    ],
    vendorMatches: ["Microsoft"],
    sourceMatches: ["VS Code"],
  },
];

function textIncludesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function buildSignalCorpus(signal: NormalizedSignal) {
  return normalizeContent(
    [
      signal.title,
      signal.summary,
      signal.businessImpact,
      signal.implementationHint,
      signal.sourceName,
      ...signal.vendors,
      ...signal.technologies,
      ...signal.industries,
      ...signal.functions,
    ].join(" ")
  );
}

function buildUseCaseCorpus(useCase: UseCaseRecord) {
  return normalizeContent(
    [
      useCase.title,
      useCase.problem,
      useCase.solutionPattern,
      useCase.expectedValue,
      useCase.businessImpact,
      useCase.industry,
      useCase.businessFunction,
      ...useCase.tools,
    ].join(" ")
  );
}

function matchesSignal(signal: NormalizedSignal, entity: TrackedEntityDefinition) {
  const text = buildSignalCorpus(signal);

  if (textIncludesAny(text, entity.keywords)) {
    return true;
  }

  if (entity.vendorMatches?.some((vendor) => signal.vendors.includes(vendor))) {
    return true;
  }

  if (entity.sourceMatches?.includes(signal.sourceName)) {
    return true;
  }

  return false;
}

function matchesUseCase(useCase: UseCaseRecord, entity: TrackedEntityDefinition) {
  const text = buildUseCaseCorpus(useCase);

  if (textIncludesAny(text, entity.keywords)) {
    return true;
  }

  return entity.vendorMatches?.some((vendor) =>
    useCase.tools.some((tool) => tool.toLowerCase().includes(vendor.toLowerCase()))
  );
}

export function buildToolTrackingEntries(
  signalItems: NormalizedSignal[],
  useCaseItems: UseCaseRecord[]
): ToolTrackingEntry[] {
  return trackedEntityCatalog
    .map((entity, index) => {
      const latestSignals = signalItems
        .filter((signal) => matchesSignal(signal, entity))
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, 3);

      const relatedUseCases = useCaseItems
        .filter((useCase) => matchesUseCase(useCase, entity))
        .slice(0, 3);

      return {
        name: entity.name,
        vendor: entity.vendor,
        category: entity.category,
        overview: entity.overview,
        latestSignals,
        relatedUseCases,
        adoptionSignal:
          latestSignals[0]?.businessImpact ??
          `${entity.name} matters when teams turn it into a repeatable operating layer instead of treating it as isolated experimentation.`,
        impactSummary:
          relatedUseCases[0]?.businessImpact ??
          `The clearest impact from ${entity.name} appears when it supports measurable workflow execution and analyst-visible review loops.`,
        activityScore: latestSignals.length * 2 + relatedUseCases.length,
        catalogIndex: index,
      };
    })
    .filter((entry) => entry.activityScore > 0)
    .sort((left, right) => {
      if (right.activityScore !== left.activityScore) {
        return right.activityScore - left.activityScore;
      }

      return left.catalogIndex - right.catalogIndex;
    })
    .map(({ activityScore: _activityScore, catalogIndex: _catalogIndex, ...entry }) => entry);
}
