import type { NormalizedSignal } from "@/lib/intelligence/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

type Props = {
  signal: NormalizedSignal;
};

export default function SignalCard({ signal }: Props) {
  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
        <span className="rounded-full bg-stone-950 px-3 py-1 text-stone-50">
          {signal.sourceName}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
          {titleCase(signal.signalType)}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">
          Impact {signal.impactScore}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-stone-950">
        {signal.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-stone-700">{signal.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-500">
        {signal.vendors.map((vendor) => (
          <span key={vendor} className="rounded-full bg-stone-100 px-2.5 py-1">
            {vendor}
          </span>
        ))}
        {signal.technologies.slice(0, 3).map((technology) => (
          <span key={technology} className="rounded-full bg-stone-100 px-2.5 py-1">
            {technology}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Business impact
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">{signal.businessImpact}</p>
      </div>

      <div className="mt-4 rounded-[1.25rem] border border-dashed border-stone-300 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Implementation hint
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">
          {signal.implementationHint}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-stone-500">
        <span>{formatDate(signal.publishedAt)}</span>
        <a
          href={signal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-amber-800 transition hover:text-stone-950"
        >
          Open source
        </a>
      </div>
    </article>
  );
}
