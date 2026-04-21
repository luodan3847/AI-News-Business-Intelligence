import type { UseCaseRecord } from "@/lib/intelligence/types";

type Props = {
  useCase: UseCaseRecord;
};

export default function UseCaseCard({ useCase }: Props) {
  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-stone-300/70 bg-[#fffdf8] p-6 shadow-[0_16px_40px_rgba(68,54,39,0.06)]">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
        <span className="rounded-full bg-stone-950 px-3 py-1 text-stone-50">
          {useCase.industry}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
          {useCase.businessFunction}
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">
          {useCase.implementationLevel.replace(/_/g, " ")}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-stone-950">
        {useCase.title}
      </h3>

      <div className="mt-4 space-y-4 text-sm leading-7 text-stone-700">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Problem
          </p>
          <p className="mt-1">{useCase.problem}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Solution pattern
          </p>
          <p className="mt-1">{useCase.solutionPattern}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Business impact
          </p>
          <p className="mt-1">{useCase.businessImpact}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-stone-500">
        {useCase.tools.map((tool) => (
          <span key={tool} className="rounded-full bg-stone-100 px-2.5 py-1">
            {tool}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.25rem] border border-stone-200 bg-white p-4 text-sm leading-7 text-stone-700 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Expected value
          </p>
          <p className="mt-1">{useCase.expectedValue}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Risks
          </p>
          <p className="mt-1">{useCase.risks}</p>
        </div>
      </div>
    </article>
  );
}
