import Link from "next/link";
import { connection } from "next/server";
import SectionTitle from "../components/SectionTitle";
import { listReports } from "@/lib/intelligence/repository";

export const metadata = {
  title: "Reports",
  description: "Daily AI intelligence reports with executive summary, signals, use cases, and prediction updates.",
};

export default async function ReportsIndexPage() {
  await connection();

  const reports = await listReports();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <SectionTitle
        eyebrow="Reports"
        title="Daily AI intelligence reports"
        description="Each report packages executive summary, top signals, use cases, and prediction updates into one date-specific briefing."
      />

      <div className="mt-8 space-y-5">
        {reports.map((report) => (
          <article
            key={report.id}
            className="rounded-[1.75rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Report date
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  {report.reportDate}
                </h2>
              </div>
              <Link
                href={`/reports/${report.reportDate}`}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                Open report
              </Link>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-stone-700">
              {report.executiveSummary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
