"use client";

import { useState } from "react";
import type { NewsItem, NewsCategory, RelevanceLevel } from "../types/news";
import NewsCard from "./NewsCard";

const CATEGORIES: (NewsCategory | "All")[] = [
  "All",
  "Release",
  "Tutorial",
  "Discussion",
  "Tips",
  "Community",
];

const RELEVANCE_LEVELS: (RelevanceLevel | "All")[] = [
  "All",
  "beginner",
  "intermediate",
  "advanced",
];

const RELEVANCE_LABELS: Record<RelevanceLevel | "All", string> = {
  All: "All Levels",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

type Props = {
  items: NewsItem[];
};

export default function CategoryFilter({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "All">("All");
  const [activeRelevance, setActiveRelevance] = useState<RelevanceLevel | "All">("All");

  const filtered = items.filter((item) => {
    const catMatch = activeCategory === "All" || item.category === activeCategory;
    const relMatch = activeRelevance === "All" || item.relevance === activeRelevance;
    return catMatch && relMatch;
  });

  return (
    <div>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Relevance filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {RELEVANCE_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => setActiveRelevance(level)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              activeRelevance === level
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-800"
            }`}
          >
            {RELEVANCE_LABELS[level]}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-sm text-gray-400 mb-5">
        Showing {filtered.length} of {items.length} items
      </p>

      {/* News grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((item, i) => (
            <NewsCard key={`${item.url}-${i}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No items match the selected filters.
        </div>
      )}
    </div>
  );
}
