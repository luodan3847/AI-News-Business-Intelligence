import { notFound } from "next/navigation";
import { connection } from "next/server";
import PredictionCard from "@/app/components/PredictionCard";
import SectionTitle from "@/app/components/SectionTitle";
import SignalCard from "@/app/components/SignalCard";
import UseCaseCard from "@/app/components/UseCaseCard";
import {
  getReportByDate,
  listPredictions,
  listReports,
  listSignals,
  listUseCases,
} from "@/lib/intelligence/repository";

type Props = {
  params: Promise<{ date: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { date } = await params;
  return {
    title: `Report ${date}`,
    description: `Daily AI intelligence report for ${date}.`,
  };
}

export default async function ReportDetailPage({ params }: Props) {
  await connection();

  const { date } = await params;
  const [report, signals, useCases, predictions] = await Promise.all([
    getReportByDate(date),
    listSignals({}),
    listUseCases({}),
    listPredictions(),
  ]);

  if (!report) {
    notFound();
  }

  const reportSignals = signals.filter((signal) => report.topSignalIds.includes(signal.id));
  const reportUseCases = useCases.filter((useCase) =>
    report.topUseCaseIds.includes(useCase.id)
  );
  const reportPredictions = predictions.filter((prediction) =>
    prediction.supportingSignalIds.some((signalId) => report.topSignalIds.includes(signalId))
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <SectionTitle
        eyebrow="Daily report"
        title={`AI intelligence report - ${report.reportDate}`}
        description={report.executiveSummary}
      />

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-stone-300/70 bg-white/90 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Strategic takeaways
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
            {report.strategicTakeaways.map((takeaway) => (
              <li key={takeaway}>{takeaway}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.75rem] border border-stone-300/70 bg-stone-950 p-6 text-stone-50 shadow-[0_18px_50px_rgba(28,25,23,0.25)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
            Business impact summary
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            {report.businessImpactSummary}
          </p>
          <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-300">
              Prediction updates
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-200">
              {report.predictionUpdates.map((update) => (
                <li key={update}>{update}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle
          eyebrow="Top signals"
          title="Signals driving the report"
          description="These are the core signals selected for today&apos;s report package."
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {reportSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle
          eyebrow="Top use cases"
          title="Implementation patterns linked to the signal set"
          description="Use cases are included here because they help translate signal movement into operational behavior."
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {reportUseCases.map((useCase) => (
            <UseCaseCard key={useCase.id} useCase={useCase} />
          ))}
        </div>
      </section>

      {reportPredictions.length > 0 ? (
        <section className="mt-16">
          <SectionTitle
            eyebrow="Prediction updates"
            title="Related forward views"
            description="Predictions connected to the same signal cluster are shown here when they have already passed analyst review."
          />
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {reportPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                relatedSignals={signals.filter((signal) =>
                  prediction.supportingSignalIds.includes(signal.id)
                )}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
