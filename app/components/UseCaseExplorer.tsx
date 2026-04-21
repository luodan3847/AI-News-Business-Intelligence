"use client";

import { useMemo, useState } from "react";
import type {
  ImplementationLevel,
  MaturityLevel,
  UseCaseRecord,
} from "@/lib/intelligence/types";
import UseCaseCard from "./UseCaseCard";

type Props = {
  useCases: UseCaseRecord[];
};

const implementationLevels: Array<ImplementationLevel | "all"> = [
  "all",
  "pilot",
  "team_ready",
  "production",
  "enterprise_scale",
];

const maturities: Array<MaturityLevel | "all"> = [
  "all",
  "emerging",
  "validated",
  "scaling",
  "mainstream",
];

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function UseCaseExplorer({ useCases }: Props) {
  const [industry, setIndustry] = useState("all");
  const [businessFunction, setBusinessFunction] = useState("all");
  const [tool, setTool] = useState("all");
  const [implementationLevel, setImplementationLevel] =
    useState<ImplementationLevel | "all">("all");
  const [maturity, setMaturity] = useState<MaturityLevel | "all">("all");

  const industries = useMemo(
    () => Array.from(new Set(useCases.map((useCase) => useCase.industry))).sort(),
    [useCases]
  );
  const businessFunctions = useMemo(
    () =>
      Array.from(new Set(useCases.map((useCase) => useCase.businessFunction))).sort(),
    [useCases]
  );
  const tools = useMemo(
    () => Array.from(new Set(useCases.flatMap((useCase) => useCase.tools))).sort(),
    [useCases]
  );

  const filtered = useMemo(() => {
    return useCases.filter((useCase) => {
      if (industry !== "all" && useCase.industry !== industry) {
        return false;
      }
      if (businessFunction !== "all" && useCase.businessFunction !== businessFunction) {
        return false;
      }
      if (tool !== "all" && !useCase.tools.includes(tool)) {
        return false;
      }
      if (
        implementationLevel !== "all" &&
        useCase.implementationLevel !== implementationLevel
      ) {
        return false;
      }
      if (maturity !== "all" && useCase.maturity !== maturity) {
        return false;
      }
      return true;
    });
  }, [businessFunction, implementationLevel, industry, maturity, tool, useCases]);

  return (
    <div>
      <div className="grid gap-4 rounded-[1.75rem] border border-stone-300/70 bg-white/75 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)] md:grid-cols-5">
        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Industry</span>
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All industries</option>
            {industries.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Business function</span>
          <select
            value={businessFunction}
            onChange={(event) => setBusinessFunction(event.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All functions</option>
            {businessFunctions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Tool</span>
          <select
            value={tool}
            onChange={(event) => setTool(event.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All tools</option>
            {tools.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Implementation level</span>
          <select
            value={implementationLevel}
            onChange={(event) =>
              setImplementationLevel(event.target.value as ImplementationLevel | "all")
            }
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {implementationLevels.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All levels" : titleCase(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Maturity</span>
          <select
            value={maturity}
            onChange={(event) => setMaturity(event.target.value as MaturityLevel | "all")}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {maturities.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All maturity levels" : titleCase(option)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-stone-500">
        Showing {filtered.length} of {useCases.length} use cases.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {filtered.map((useCase) => (
          <UseCaseCard key={useCase.id} useCase={useCase} />
        ))}
      </div>
    </div>
  );
}
