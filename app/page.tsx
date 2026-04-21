import Link from "next/link";
import CoverageSnapshot from "./components/CoverageSnapshot";
import PredictionCard from "./components/PredictionCard";
import SectionTitle from "./components/SectionTitle";
import SignalCard from "./components/SignalCard";
import ToolCard from "./components/ToolCard";
import UseCaseCard from "./components/UseCaseCard";
import {
  getCoverageAudit,
  getDashboardData,
  getRawIngestionCount,
} from "@/lib/intelligence/repository";

export default async function Home() {
  const [dashboard, rawIngestionCount, audit] = await Promise.all([
    getDashboardData(),
    getRawIngestionCount(),
    getCoverageAudit(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <section className="grid gap-8 rounded-[2rem] border border-stone-300/70 bg-white/82 p-8 shadow-[0_30px_80px_rgba(68,54,39,0.12)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            Daily AI intelligence dashboard
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-stone-950 md:text-6xl">
            One place for AI research, product signals, use cases, and business impact.
          </h1>
          <p className="mt-6 text-lg leading-8 text-stone-700">
            This product tracks frontier research, model and platform releases,
            open-source ecosystem movement, implementation patterns, and the
            business meaning behind the noise. It is built for operators,
            analysts, strategists, and teams that need more than a link feed.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-stone-600">
            {[
              "Research papers",
              "Model platforms",
              "Open-source ecosystems",
              "Product launches",
              "Use cases",
              "Business signals",
            ].map((label) => (
              <span
                key={label}
                className="rounded-full border border-stone-300 bg-white/70 px-3 py-1.5"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/reports/${dashboard.dailyBrief.reportDate}`}
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
            >
              Read today&apos;s report
            </Link>
            <Link
              href="/news"
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-800 transition hover:border-stone-950 hover:text-stone-950"
            >
              Explore all signals
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-stone-200 bg-stone-950 p-6 text-stone-50 shadow-[0_18px_50px_rgba(28,25,23,0.25)]">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-300">
            Today&apos;s brief
          </p>
          <p className="mt-4 text-2xl font-semibold tracking-tight">
            {dashboard.dailyBrief.reportDate}
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            {dashboard.dailyBrief.executiveSummary}
          </p>
          <div className="mt-6 grid gap-3 text-sm text-stone-300 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold text-stone-50">
                {dashboard.topSignals.length}
              </p>
              <p className="mt-2">Top signals</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold text-stone-50">
                {dashboard.useCases.length}
              </p>
              <p className="mt-2">Featured use cases</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold text-stone-50">
                {rawIngestionCount}
              </p>
              <p className="mt-2">Tracked raw ingestions</p>
            </div>
          </div>
        </div>
      </section>

      {audit ? (
        <section className="mt-18">
          <SectionTitle
            eyebrow="Coverage pulse"
            title="A visible read on breadth, concentration, and signal balance"
            description="The platform now runs a post-publish audit so we can see whether the intelligence layer is broad enough across sources, themes, industries, and business functions."
          />
          <div className="mt-8">
            <CoverageSnapshot audit={audit} />
          </div>
        </section>
      ) : null}

      <section className="mt-18">
        <SectionTitle
          eyebrow="Top signals"
          title="High-impact developments worth paying attention to now"
          description="These are the signals with the clearest strategic or operational consequences in the current cycle."
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-3">
          {dashboard.topSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </section>

      <section className="mt-18">
        <SectionTitle
          eyebrow="Use case database"
          title="Implementation patterns that matter beyond the headline"
          description="Each use case translates a market signal into an operational pattern, expected value, and risk profile."
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {dashboard.useCases.map((useCase) => (
            <UseCaseCard key={useCase.id} useCase={useCase} />
          ))}
        </div>
      </section>

      <section className="mt-18 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionTitle
            eyebrow="Business impact"
            title="Where the strongest business implications are showing up"
            description="This view isolates the signals with the highest near-term implications for strategy, operations, product, and risk."
          />
          <div className="mt-8 space-y-5">
            {dashboard.businessSignals.map((signal) => (
              <div
                key={signal.id}
                className="rounded-[1.5rem] border border-stone-300/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-stone-900">{signal.title}</p>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                    Impact {signal.impactScore}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-stone-700">
                  {signal.businessImpact}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle
            eyebrow="Platform tracking"
            title="A tighter view of the platforms and tools shaping the AI stack"
            description="Coverage spans model vendors, open-source ecosystems, developer tooling, and the platforms changing how teams execute AI work."
          />
          <div className="mt-8 space-y-5">
            {dashboard.tools.map((tool) => (
              <ToolCard key={tool.name} entry={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-18">
        <SectionTitle
          eyebrow="Predictions"
          title="Analyst-reviewed forward views"
          description="Predictions begin as AI drafts, then move through analyst review before they are published."
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {dashboard.predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      </section>
    </div>
  );
}
