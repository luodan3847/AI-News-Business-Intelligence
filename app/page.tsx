import Link from "next/link";
import DailyFeed from "./components/DailyFeed";
import LearningPath from "./components/LearningPath";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <div className="relative mb-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-12 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Updated daily at 6AM UTC · Powered by Claude API
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Learn Claude Code,<br />one day at a time.
          </h1>

          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Daily-curated releases, tutorials, tips, and community discussions —
            from GitHub, Hacker News, Reddit, YouTube, Bilibili & Anthropic.
            Filtered by skill level. Always relevant.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/guide"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Start Setup Guide →
            </Link>
            <a
              href="#daily-feed"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Today&apos;s Feed
            </a>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { value: "6", label: "Sources tracked daily" },
          { value: "5", label: "Categories" },
          { value: "AI", label: "Summarized by Claude" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Learning Path */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Learning Path</h2>
        <LearningPath />
      </div>

      {/* Daily Feed */}
      <div id="daily-feed">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Today&apos;s Feed</h2>
          <span className="text-sm text-gray-400">GitHub · HN · Reddit · YouTube · Bilibili · Anthropic</span>
        </div>
        <DailyFeed />
      </div>
    </div>
  );
}
