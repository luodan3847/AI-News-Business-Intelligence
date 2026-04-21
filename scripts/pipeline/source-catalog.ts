import axios from "axios";
import * as cheerio from "cheerio";
import { seedData } from "../../lib/intelligence/seed-data";
import type { RawSignal, SourceRecord } from "../../lib/intelligence/types";
import { toRawSignal } from "./shared";

const USER_AGENT = "AI-News-Business-Intelligence/1.0";
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};
const officialFeedUrls: Partial<Record<SourceRecord["id"], string>> = {
  "source-anthropic": "https://www.anthropic.com/news/rss.xml",
  "source-openai": "https://openai.com/news/rss.xml",
  "source-google": "https://blog.google/technology/ai/rss/",
  "source-huggingface": "https://huggingface.co/blog/feed.xml",
  "source-arxiv":
    "https://export.arxiv.org/api/query?search_query=%28cat%3Acs.AI+OR+cat%3Acs.LG+OR+cat%3Acs.CL%29&sortBy=submittedDate&sortOrder=descending&max_results=8",
  "source-vscode": "https://code.visualstudio.com/feed.xml",
};

type YouTubeSearchModule = {
  GetListByKeyword: (
    keyword: string,
    withPlaylist: boolean,
    limit: number
  ) => Promise<{ items?: Array<Record<string, unknown>> }>;
};

function describeError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status ? `${error.message} (status ${status})` : error.message;
  }

  return error instanceof Error ? error.message : String(error);
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function getVideoId(item: Record<string, unknown>) {
  if (typeof item.id === "string") {
    return item.id;
  }

  if (item.id && typeof item.id === "object") {
    const nestedId = (item.id as Record<string, unknown>).videoId;
    if (typeof nestedId === "string") {
      return nestedId;
    }
  }

  if (typeof item.videoId === "string") {
    return item.videoId;
  }

  return "";
}

function getVideoSnippet(item: Record<string, unknown>) {
  if (typeof item.snippet === "string") {
    return item.snippet;
  }

  if (item.snippet && typeof item.snippet === "object") {
    const description = (item.snippet as Record<string, unknown>).description;
    if (typeof description === "string") {
      return description;
    }
  }

  return typeof item.description === "string" ? item.description : "";
}

async function fetchGitHubReleaseSignals(source: SourceRecord) {
  const repos = [
    "anthropics/claude-code",
    "openai/openai-python",
    "huggingface/transformers",
    "langchain-ai/langchain",
    "microsoft/autogen",
    "ollama/ollama",
    "github/copilot.vim",
    "microsoft/vscode",
  ];

  const results: RawSignal[] = [];

  for (const repo of repos) {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repo}/releases?per_page=4`,
        {
          headers: {
            "User-Agent": USER_AGENT,
            ...(process.env.GITHUB_TOKEN
              ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
              : {}),
          },
        }
      );

      for (const release of response.data ?? []) {
        results.push(
          toRawSignal(source.id, {
            externalId: `${repo}:${release.tag_name}`,
            url: release.html_url,
            titleRaw: `${repo} ${release.tag_name} released`,
            contentRaw: release.body ?? release.name ?? "",
            payloadJson: { repo, release },
            publishedAt: release.published_at,
          })
        );
      }
    } catch (error) {
      console.warn(
        `[ingest] GitHub release fetch failed for ${repo}: ${describeError(error)}`
      );
    }
  }

  return results;
}

async function fetchHackerNewsSignals(source: SourceRecord) {
  const queries = [
    "AI agent workflow",
    "reasoning model",
    "multimodal AI",
    "enterprise AI strategy",
  ];
  const results: RawSignal[] = [];

  for (const query of queries) {
    try {
      const response = await axios.get("https://hn.algolia.com/api/v1/search", {
        params: { query, hitsPerPage: 4, tags: "story" },
        headers: { "User-Agent": USER_AGENT },
      });

      for (const hit of response.data?.hits ?? []) {
        results.push(
          toRawSignal(source.id, {
            externalId: `hn:${hit.objectID}`,
            url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            titleRaw: hit.title ?? "HN discussion",
            contentRaw: hit.story_text ?? hit.comment_text ?? "",
            payloadJson: hit,
            publishedAt: hit.created_at,
          })
        );
      }
    } catch (error) {
      console.warn(`[ingest] HN query failed for ${query}: ${describeError(error)}`);
    }
  }

  return results;
}

async function fetchRedditSignals(source: SourceRecord) {
  const subreddits = ["singularity", "artificial", "MachineLearning", "LocalLLaMA"];
  const results: RawSignal[] = [];

  for (const subreddit of subreddits) {
    try {
      const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json`, {
        params: { limit: 6 },
        headers: BROWSER_HEADERS,
      });

      for (const child of response.data?.data?.children ?? []) {
        const post = child.data;
        results.push(
          toRawSignal(source.id, {
            externalId: `reddit:${post.id}`,
            url: `https://reddit.com${post.permalink}`,
            titleRaw: post.title,
            contentRaw: post.selftext ?? "",
            payloadJson: post,
            publishedAt: new Date(post.created_utc * 1000).toISOString(),
          })
        );
      }
    } catch (error) {
      console.warn(
        `[ingest] Reddit fetch failed for r/${subreddit}: ${describeError(error)}`
      );
    }
  }

  return results;
}

async function fetchVideoSignals(source: SourceRecord) {
  const YouTubeSearchApi =
    (await import("youtube-search-api")) as unknown as YouTubeSearchModule;
  const queries = [
    "AI workflow automation",
    "AI research paper explained",
    "reasoning model architecture",
    "enterprise AI strategy",
  ];
  const results: RawSignal[] = [];

  for (const query of queries) {
    try {
      const response = await YouTubeSearchApi.GetListByKeyword(query, false, 4);
      for (const item of response?.items ?? []) {
        const videoId = getVideoId(item);
        if (!videoId) {
          continue;
        }

        results.push(
          toRawSignal(source.id, {
            externalId: `youtube:${videoId}`,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            titleRaw: String(item.title ?? query),
            contentRaw: getVideoSnippet(item),
            payloadJson: item,
            publishedAt: normalizeDate(item.publishedAt),
          })
        );
      }
    } catch (error) {
      console.warn(`[ingest] YouTube search failed for ${query}: ${describeError(error)}`);
    }
  }

  try {
    const response = await axios.get(
      "https://api.bilibili.com/x/web-interface/search/type",
      {
        params: {
          search_type: "video",
          keyword: "AI business use case large model workflow",
          page: 1,
          page_size: 4,
        },
        headers: {
          ...BROWSER_HEADERS,
          Referer: "https://www.bilibili.com",
        },
      }
    );

    for (const item of response.data?.data?.result ?? []) {
      results.push(
        toRawSignal(source.id, {
          externalId: `bilibili:${item.bvid}`,
          url: `https://www.bilibili.com/video/${item.bvid}`,
          titleRaw: String(item.title ?? "").replace(/<[^>]+>/g, ""),
          contentRaw: item.description ?? "",
          payloadJson: item,
          publishedAt: item.pubdate
            ? new Date(item.pubdate * 1000).toISOString()
            : new Date().toISOString(),
        })
      );
    }
  } catch (error) {
    const message = `[ingest] Bilibili search failed: ${describeError(error)}`;
    if (results.length > 0) {
      console.log(`${message} (continuing with YouTube coverage)`);
    } else {
      console.warn(message);
    }
  }

  return results;
}

async function fetchOfficialFeedSignals(
  source: SourceRecord,
  options: { quiet?: boolean } = {}
) {
  const feedUrl = officialFeedUrls[source.id];
  if (!feedUrl) {
    return [];
  }

  try {
    const response = await axios.get(feedUrl, {
      headers: BROWSER_HEADERS,
    });
    const $ = cheerio.load(response.data, { xmlMode: true });
    const results: RawSignal[] = [];
    const seen = new Set<string>();

    $("item, entry").each((index, element) => {
      if (index >= 6) {
        return;
      }

      const title = $(element).find("title").first().text().trim().replace(/\s+/g, " ");
      const linkNode = $(element).find("link").first();
      const href =
        linkNode.attr("href") ||
        linkNode.text().trim() ||
        $(element).find("id, guid").first().text().trim();
      const summary =
        $(element).find("description, summary, content").first().text().trim() || title;
      const publishedAt =
        $(element).find("pubDate, updated, published").first().text().trim() || undefined;

      if (!title || !href || seen.has(href)) {
        return;
      }

      seen.add(href);
      results.push(
        toRawSignal(source.id, {
          externalId: href,
          url: href,
          titleRaw: title,
          contentRaw: summary,
          payloadJson: { feedUrl, href, title },
          publishedAt: publishedAt ? normalizeDate(publishedAt) : undefined,
        })
      );
    });

    return results;
  } catch (error) {
    if (!options.quiet) {
      console.warn(`[ingest] Feed fetch failed for ${source.name}: ${describeError(error)}`);
    }
    return [];
  }
}

async function fetchOfficialBlogSignals(source: SourceRecord, selectors: string[]) {
  const feedResults = await fetchOfficialFeedSignals(source, { quiet: true });
  if (feedResults.length > 0) {
    return feedResults;
  }

  try {
    const response = await axios.get(source.baseUrl, {
      headers: BROWSER_HEADERS,
    });
    const $ = cheerio.load(response.data);
    const results: RawSignal[] = [];
    const seen = new Set<string>();

    for (const selector of selectors) {
      $(selector).each((index, element) => {
        if (index > 5) {
          return;
        }

        const title = $(element).text().trim().replace(/\s+/g, " ");
        const href = $(element).attr("href");
        if (!title || !href) {
          return;
        }

        const url = href.startsWith("http")
          ? href
          : new URL(href, source.baseUrl).toString();

        if (seen.has(url)) {
          return;
        }
        seen.add(url);

        results.push(
          toRawSignal(source.id, {
            externalId: url,
            url,
            titleRaw: title,
            contentRaw: `${title} from ${source.name}`,
            payloadJson: { selector, url, title },
          })
        );
      });

      if (results.length > 0) {
        break;
      }
    }

    return results;
  } catch (error) {
    console.warn(`[ingest] Blog scrape failed for ${source.name}: ${describeError(error)}`);
    return [];
  }
}

export async function ingestAllSources() {
  const byId = new Map(seedData.sources.map((source) => [source.id, source]));
  const results = await Promise.all([
    fetchOfficialBlogSignals(byId.get("source-anthropic")!, ['a[href*="/news/"]']),
    fetchOfficialBlogSignals(byId.get("source-openai")!, ['a[href*="/news/"]', 'a[href*="/index/"]']),
    fetchOfficialBlogSignals(byId.get("source-google")!, ['a[href*="/technology/ai/"]']),
    fetchOfficialBlogSignals(byId.get("source-deepmind")!, ['a[href*="/discover/blog/"]', 'a[href*="/blog/"]']),
    fetchOfficialBlogSignals(byId.get("source-meta-ai")!, ['a[href*="/blog/"]']),
    fetchOfficialBlogSignals(byId.get("source-huggingface")!, ['a[href*="/blog/"]']),
    fetchOfficialBlogSignals(byId.get("source-arxiv")!, []),
    fetchGitHubReleaseSignals(byId.get("source-github-releases")!),
    fetchOfficialBlogSignals(byId.get("source-vscode")!, ['a[href*="/updates/"]']),
    fetchHackerNewsSignals(byId.get("source-hackernews")!),
    fetchRedditSignals(byId.get("source-reddit")!),
    fetchVideoSignals(byId.get("source-video")!),
  ]);

  const merged = results.flat();
  const deduped = new Map<string, RawSignal>();

  for (const item of merged) {
    const key = `${item.sourceId}:${item.externalId}:${item.url}`;
    if (!deduped.has(key)) {
      deduped.set(key, item);
    }
  }

  return Array.from(deduped.values());
}
