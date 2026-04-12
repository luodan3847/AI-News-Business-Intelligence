import type { NewsItem, NewsSource, RelevanceLevel, NewsCategory } from "../types/news";

const sourceConfig: Record<NewsSource, { label: string; color: string }> = {
  github: { label: "GitHub", color: "bg-gray-800 text-white" },
  hackernews: { label: "Hacker News", color: "bg-orange-500 text-white" },
  reddit: { label: "Reddit", color: "bg-red-500 text-white" },
  anthropic: { label: "Anthropic", color: "bg-blue-600 text-white" },
  bilibili: { label: "Bilibili", color: "bg-pink-500 text-white" },
  youtube: { label: "YouTube", color: "bg-red-600 text-white" },
};

const relevanceConfig: Record<RelevanceLevel, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-green-100 text-green-700" },
  intermediate: { label: "Intermediate", color: "bg-yellow-100 text-yellow-700" },
  advanced: { label: "Advanced", color: "bg-red-100 text-red-700" },
};

const categoryConfig: Record<NewsCategory, { color: string }> = {
  Release: { color: "bg-violet-100 text-violet-700" },
  Tutorial: { color: "bg-blue-100 text-blue-700" },
  Discussion: { color: "bg-amber-100 text-amber-700" },
  Tips: { color: "bg-teal-100 text-teal-700" },
  Community: { color: "bg-indigo-100 text-indigo-700" },
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const src = sourceConfig[item.source] ?? { label: item.source, color: "bg-gray-500 text-white" };
  const rel = relevanceConfig[item.relevance] ?? { label: item.relevance, color: "bg-gray-100 text-gray-600" };
  const cat = item.category ? categoryConfig[item.category] : null;
  const tags = item.tags ?? [];
  const thumbnail = item.thumbnail_url ?? null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group flex flex-col overflow-hidden">
      {/* Video thumbnail */}
      {thumbnail && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block w-full aspect-video bg-gray-100 flex-shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
              <span className="text-white text-sm pl-0.5">&#9654;</span>
            </div>
          </div>
        </a>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${src.color}`}>
            {src.label}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${rel.color}`}>
            {rel.label}
          </span>
          {cat && item.category && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.color}`}>
              {item.category}
            </span>
          )}
        </div>

        {/* Title */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
            {item.title}
          </h3>
        </a>

        {/* Summary */}
        <p className="text-sm text-gray-600 leading-relaxed flex-1">{item.summary}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read more */}
        <div className="mt-3 text-xs text-blue-500 font-medium group-hover:underline">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Read more →
          </a>
        </div>
      </div>
    </div>
  );
}
