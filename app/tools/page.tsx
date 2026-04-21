import SectionTitle from "../components/SectionTitle";
import ToolCard from "../components/ToolCard";
import { getToolTrackingEntries } from "@/lib/intelligence/repository";

export const metadata = {
  title: "Tools",
  description:
    "Platform and tool tracking for model vendors, open-source ecosystems, coding agents, and implementation signals.",
};

export default async function ToolsPage() {
  const tools = await getToolTrackingEntries();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <SectionTitle
        eyebrow="Platform tracking"
        title="Track the platforms, tools, and ecosystems shaping AI execution"
        description="This view groups model platforms, open-source infrastructure, coding agents, and related use cases into one operational layer."
      />
      <div className="mt-8 space-y-5">
        {tools.map((tool) => (
          <ToolCard key={tool.name} entry={tool} />
        ))}
      </div>
    </div>
  );
}
