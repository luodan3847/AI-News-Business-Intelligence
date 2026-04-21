"use client";

import { useMemo, useState } from "react";
import type { NewsFilters, NormalizedSignal, SignalType } from "@/lib/intelligence/types";
import SignalCard from "./SignalCard";

type Props = {
  signals: NormalizedSignal[];
};

const signalTypeOptions: Array<SignalType | "all"> = [
  "all",
  "news",
  "release",
  "tool_update",
  "use_case_signal",
  "market_signal",
];

const impactOptions = [0, 70, 80, 90];
const rangeOptions: NewsFilters["publishedRange"][] = ["all", "7d", "30d", "90d"];

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function NewsExplorer({ signals }: Props) {
  const [source, setSource] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [signalType, setSignalType] = useState<SignalType | "all">("all");
  const [minImpactScore, setMinImpactScore] = useState(0);
  const [publishedRange, setPublishedRange] = useState<NewsFilters["publishedRange"]>("all");

  const uniqueSources = useMemo(
    () => Array.from(new Set(signals.map((signal) => signal.sourceName))).sort(),
    [signals]
  );
  const uniqueVendors = useMemo(
    () => Array.from(new Set(signals.flatMap((signal) => signal.vendors))).sort(),
    [signals]
  );

  const filtered = useMemo(() => {
    const end = new Date(signals[0]?.publishedAt ?? new Date().toISOString());
    return signals.filter((signal) => {
      if (source !== "all" && signal.sourceName !== source) {
        return false;
      }
      if (vendor !== "all" && !signal.vendors.includes(vendor)) {
        return false;
      }
      if (signalType !== "all" && signal.signalType !== signalType) {
        return false;
      }
      if (signal.impactScore < minImpactScore) {
        return false;
      }
      if (publishedRange !== "all") {
        const days = publishedRange === "7d" ? 7 : publishedRange === "30d" ? 30 : 90;
        const boundary = new Date(end);
        boundary.setUTCDate(boundary.getUTCDate() - days);
        if (new Date(signal.publishedAt) < boundary) {
          return false;
        }
      }
      return true;
    });
  }, [minImpactScore, publishedRange, signalType, signals, source, vendor]);

  return (
    <div>
      <div className="grid gap-4 rounded-[1.75rem] border border-stone-300/70 bg-white/75 p-6 shadow-[0_16px_40px_rgba(68,54,39,0.08)] md:grid-cols-5">
        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Source</span>
          <select
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All sources</option>
            {uniqueSources.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Vendor</span>
          <select
            value={vendor}
            onChange={(event) => setVendor(event.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All vendors</option>
            {uniqueVendors.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Signal type</span>
          <select
            value={signalType}
            onChange={(event) => setSignalType(event.target.value as SignalType | "all")}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {signalTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All types" : titleCase(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Impact score</span>
          <select
            value={minImpactScore}
            onChange={(event) => setMinImpactScore(Number(event.target.value))}
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {impactOptions.map((option) => (
              <option key={option} value={option}>
                {option === 0 ? "All scores" : `${option}+`}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-stone-700">
          <span className="mb-2 block font-medium">Published range</span>
          <select
            value={publishedRange}
            onChange={(event) =>
              setPublishedRange(event.target.value as NewsFilters["publishedRange"])
            }
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {rangeOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All dates" : option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-stone-500">
        Showing {filtered.length} of {signals.length} tracked signals.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {filtered.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
}
