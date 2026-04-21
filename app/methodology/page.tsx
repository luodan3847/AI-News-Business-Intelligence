import { connection } from "next/server";
import CoverageSnapshot from "../components/CoverageSnapshot";
import SectionTitle from "../components/SectionTitle";
import { getCoverageAudit } from "@/lib/intelligence/repository";

export const metadata = {
  title: "Methodology",
  description:
    "How the AI News & Business Intelligence pipeline ingests, analyzes, proposes, and publishes insight.",
};

const steps = [
  {
    title: "Ingest",
    text: "Pull raw signals from research feeds, official blogs, release feeds, community discussions, videos, and tooling sources into raw ingestion records.",
  },
  {
    title: "Normalize",
    text: "Deduplicate content, classify signal type, and extract vendors, technologies, industries, and business functions.",
  },
  {
    title: "Analyze",
    text: "Generate summary, business impact, and implementation hints with validation before records are promoted.",
  },
  {
    title: "Propose",
    text: "Draft use case candidates, prediction drafts, and report summaries based on approved or high-confidence signals.",
  },
  {
    title: "Publish",
    text: "Only approved records appear in the public experience. Predictions remain hidden until they move through analyst review.",
  },
];

const scoring = [
  "Impact score reflects likely near-term business consequence.",
  "Novelty score reflects how different a signal is from the current baseline of research, product, and workflow announcements.",
  "Confidence score reflects source quality, consistency across signals, and how stable the underlying claim appears to be.",
];

const sourceLayers = [
  "Frontier research and theory signals such as papers, benchmarks, reasoning work, and multimodal progress.",
  "Vendor and platform updates across OpenAI, Anthropic, Google, Meta, Hugging Face, GitHub, and related ecosystems.",
  "Open-source infrastructure and toolchain movement across model serving, agent frameworks, and developer tooling.",
  "Business implementation signals from case studies, demos, and practitioner workflows.",
];

export default async function MethodologyPage() {
  await connection();

  const audit = await getCoverageAudit();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <SectionTitle
        eyebrow="Methodology"
        title="A pipeline built for research-to-business relevance, not just aggregation"
        description="The goal is to convert raw AI information into a structure that can support monitoring, implementation thinking, and business interpretation."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Pipeline
          </p>
          <div className="mt-4 space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-900">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-700">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Source policy
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-700">
              The source layer is intentionally broader than one vendor or one coding
              tool. It covers frontier research, model and platform releases,
              open-source ecosystems, practitioner discussion, and high-signal
              business applications.
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              {sourceLayers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Scoring logic
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              {scoring.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Prediction workflow
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-700">
              Predictions are generated in hybrid mode. AI creates a first draft, but
              publication requires analyst revision and approval. This keeps speed while
              preserving viewpoint and accountability.
            </p>
          </div>
        </div>
      </div>

      {audit ? (
        <section className="mt-14">
          <SectionTitle
            eyebrow="Continuous QA"
            title="Coverage quality is checked after publish, not guessed"
            description="The pipeline writes an audit artifact that flags concentration risk, narrow industry spread, thin prediction coverage, and weak thematic diversity."
          />
          <div className="mt-8">
            <CoverageSnapshot audit={audit} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
