import type { AuditDistributionItem, AuditRecord } from "@/lib/intelligence/types";

type Props = {
  audit: AuditRecord;
};

function shareLabel(count: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((count / total) * 100)}%`;
}

function DistributionBars({
  items,
  total,
  tone,
  title,
}: {
  items: AuditDistributionItem[];
  total: number;
  tone: string;
  title: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
        {title}
      </p>
      <div className="mt-4 space-y-3">
        {items.slice(0, 5).map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="font-medium text-stone-800">{item.name}</p>
              <p className="text-stone-500">
                {item.count} · {shareLabel(item.count, total)}
              </p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-stone-100">
              <div
                className={`h-2 rounded-full ${tone}`}
                style={{ width: `${Math.max((item.count / Math.max(total, 1)) * 100, 8)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoverageSnapshot({ audit }: Props) {
  const summaryCards = [
    {
      label: "Tracked signals",
      value: audit.summary.signalCount,
      note: `${audit.summary.distinctSources} distinct sources`,
    },
    {
      label: "Coverage themes",
      value: audit.summary.distinctThemes,
      note: `${audit.summary.distinctFunctions} primary business functions`,
    },
    {
      label: "Industry spread",
      value: audit.summary.distinctIndustries,
      note: `${audit.summary.useCaseCount} approved use cases`,
    },
    {
      label: "Prediction surface",
      value: audit.summary.predictionCount,
      note: `${audit.distributions.predictionImpactAreas.length} impact areas`,
    },
  ];

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-[1.5rem] border border-stone-300/70 bg-white/88 p-5 shadow-[0_16px_36px_rgba(68,54,39,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              {card.label}
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-stone-600">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr_1fr]">
        <DistributionBars
          items={audit.distributions.signalThemes}
          total={audit.summary.signalCount}
          tone="bg-stone-900"
          title="Signal theme mix"
        />
        <DistributionBars
          items={audit.distributions.signalSources}
          total={audit.summary.signalCount}
          tone="bg-amber-600"
          title="Source concentration"
        />
        <DistributionBars
          items={audit.distributions.predictionImpactAreas}
          total={audit.summary.predictionCount}
          tone="bg-emerald-600"
          title="Prediction impact areas"
        />
      </div>

      <div
        className={`rounded-[1.5rem] border p-5 ${
          audit.passed
            ? "border-emerald-200 bg-emerald-50/80"
            : "border-amber-200 bg-amber-50/80"
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
              audit.passed
                ? "bg-emerald-600 text-white"
                : "bg-amber-600 text-white"
            }`}
          >
            {audit.passed ? "Audit passed" : `${audit.warnings.length} audit warning${audit.warnings.length === 1 ? "" : "s"}`}
          </span>
          <p className="text-sm text-stone-700">
            Generated {new Date(audit.generatedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(audit.warnings.length > 0
            ? audit.warnings
            : [
                "Coverage is balanced enough to support a broad market view across sources, themes, and business functions.",
                "The current published layer is suitable for public dashboarding and analyst review.",
              ]
          ).map((warning) => (
            <div
              key={warning}
              className="rounded-[1.1rem] border border-white/70 bg-white/70 p-4 text-sm leading-7 text-stone-700"
            >
              {warning}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
