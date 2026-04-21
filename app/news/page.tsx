import NewsExplorer from "../components/NewsExplorer";
import SectionTitle from "../components/SectionTitle";
import { listSignals } from "@/lib/intelligence/repository";

export const metadata = {
  title: "News",
  description:
    "Tracked AI signals across news, releases, tool updates, use case signals, and market signals.",
};

export default async function NewsPage() {
  const signals = await listSignals({});

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <SectionTitle
        eyebrow="Tracked signals"
        title="Explore the full AI signal layer"
        description="Use the filters to move across source, vendor, signal type, impact score, and recency."
      />
      <div className="mt-8">
        <NewsExplorer signals={signals} />
      </div>
    </div>
  );
}
