import PredictionCard from "../components/PredictionCard";
import SectionTitle from "../components/SectionTitle";
import { listPredictions, listSignals } from "@/lib/intelligence/repository";

export const metadata = {
  title: "Predictions",
  description:
    "AI-generated drafts reviewed through an analyst lens to produce higher-conviction business and workflow predictions.",
};

export default async function PredictionsPage() {
  const [predictions, signals] = await Promise.all([listPredictions(), listSignals({})]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <SectionTitle
        eyebrow="Predictions"
        title="Hybrid predictions with analyst-reviewed final output"
        description="Predictions begin as AI-generated drafts and are only published after analyst review. This keeps speed and synthesis without losing judgment."
      />
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            relatedSignals={signals.filter((signal) =>
              prediction.supportingSignalIds.includes(signal.id)
            )}
          />
        ))}
      </div>
    </div>
  );
}
