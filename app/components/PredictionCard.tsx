import type { NormalizedSignal, PredictionRecord } from "@/lib/intelligence/types";

const timeframeLabel: Record<PredictionRecord["timeframe"], string> = {
  "30d": "30 Days",
  "90d": "90 Days",
  "180d": "180 Days",
};

type Props = {
  prediction: PredictionRecord;
  relatedSignals?: NormalizedSignal[];
};

export default function PredictionCard({
  prediction,
  relatedSignals = [],
}: Props) {
  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
        <span className="rounded-full bg-stone-950 px-3 py-1 text-stone-50">
          {timeframeLabel[prediction.timeframe]}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
          {prediction.impactArea.replace(/_/g, " ")}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">
          Confidence {prediction.confidence}
        </span>
        {prediction.status === "approved" ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">
            Analyst reviewed
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-stone-950">
        {prediction.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-stone-700">{prediction.statement}</p>

      <div className="mt-5 rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Why this matters
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">{prediction.rationale}</p>
      </div>

      <div className="mt-4 rounded-[1.25rem] border border-dashed border-stone-300 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Analyst revision
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">
          {prediction.analystRevision}
        </p>
      </div>

      {relatedSignals.length > 0 ? (
        <div className="mt-4 rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Related signals
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
            {relatedSignals.slice(0, 3).map((signal) => (
              <li key={signal.id}>{signal.title}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
