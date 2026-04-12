export type NewsSource =
  | "github"
  | "hackernews"
  | "reddit"
  | "anthropic"
  | "bilibili"
  | "youtube";

export type RelevanceLevel = "beginner" | "intermediate" | "advanced";

export type NewsCategory =
  | "Release"
  | "Tutorial"
  | "Discussion"
  | "Tips"
  | "Community";

export type NewsItem = {
  title: string;
  summary: string;
  source: NewsSource;
  url: string;
  relevance: RelevanceLevel;
  category: NewsCategory;
  tags: string[];
  thumbnail_url: string | null;
  video_id: string | null;
};

export type DailyData = {
  date: string;
  highlights: NewsItem[];
  tips_of_the_day: string[];
};
