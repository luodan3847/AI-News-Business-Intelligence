import SectionTitle from "../components/SectionTitle";
import UseCaseExplorer from "../components/UseCaseExplorer";
import { listUseCases } from "@/lib/intelligence/repository";

export const metadata = {
  title: "Use Cases",
  description:
    "Structured AI use cases with business function, industry, implementation level, and maturity.",
};

export default async function UseCasesPage() {
  const useCases = await listUseCases({});

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <SectionTitle
        eyebrow="Use case database"
        title="Structured implementation patterns, not isolated examples"
        description="Each entry is stored as a business workflow with a problem, solution pattern, expected value, risks, and maturity."
      />
      <div className="mt-8">
        <UseCaseExplorer useCases={useCases} />
      </div>
    </div>
  );
}
