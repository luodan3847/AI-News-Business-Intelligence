import type { ToolTrackingEntry } from "@/lib/intelligence/types";

type Props = {
  entry: ToolTrackingEntry;
};

export default function ToolCard({ entry }: Props) {
  return (
    <article className="rounded-[1.5rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
        <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
          {entry.category}
        </span>
        <span className="rounded-full bg-stone-950 px-3 py-1 text-stone-50">
          {entry.vendor}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
          {entry.latestSignals.length} tracked signals
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-stone-950">
        {entry.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-stone-700">{entry.overview}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4 text-sm leading-7 text-stone-700">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Adoption signal
          </p>
          <p className="mt-2">{entry.adoptionSignal}</p>
        </div>
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50/80 p-4 text-sm leading-7 text-stone-700">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
            Business impact
          </p>
          <p className="mt-2">{entry.impactSummary}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.25rem] border border-stone-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Latest updates
          </p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
            {entry.latestSignals.slice(0, 3).map((signal) => (
              <li key={signal.id}>{signal.title}</li>
            ))}
            {entry.latestSignals.length === 0 ? (
              <li>No current signals are mapped to this tracker yet.</li>
            ) : null}
          </ul>
        </div>
        <div className="rounded-[1.25rem] border border-stone-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Related use cases
          </p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
            {entry.relatedUseCases.slice(0, 3).map((useCase) => (
              <li key={useCase.id}>{useCase.title}</li>
            ))}
            {entry.relatedUseCases.length === 0 ? (
              <li>No approved use cases are linked to this tracker yet.</li>
            ) : null}
          </ul>
        </div>
      </div>
    </article>
  );
}
