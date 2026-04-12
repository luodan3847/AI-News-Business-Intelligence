/**
 * summarizer.js — Daily AI summarizer for ClaudeCode.guide
 *
 * Reads:  data/raw-YYYY-MM-DD.json  (written by scraper.js)
 * Calls:  Claude API to filter, translate, and summarize items
 * Writes: data/latest.json  (current day summary)
 *         data/archive/YYYY-MM-DD.json  (permanent record)
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const TODAY = new Date().toISOString().slice(0, 10);
const RAW_FILE = path.join(__dirname, "..", "data", `raw-${TODAY}.json`);
const LATEST_FILE = path.join(__dirname, "..", "data", "latest.json");
const ARCHIVE_DIR = path.join(__dirname, "..", "data", "archive");

// ─── Claude API call ─────────────────────────────────────────────────────────

function callClaudeAPI(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      reject(new Error("ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key."));
      return;
    }

    const body = JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      messages: [{ role: "user", content: prompt }],
    });

    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`Claude API error: ${parsed.error.message}`));
          } else {
            resolve(parsed.content[0].text);
          }
        } catch (e) {
          reject(new Error(`Response parse error: ${e.message}\nRaw: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── Build prompt ─────────────────────────────────────────────────────────────

function buildPrompt(rawItems) {
  const itemsText = rawItems
    .slice(0, 40) // limit to 40 items to stay within token budget
    .map((item, i) =>
      `[${i + 1}] source=${item.source} title="${item.title}" content="${(item.content || "").slice(0, 300)}" url="${item.url}" video_id="${item.video_id || ""}" thumbnail_url="${item.thumbnail_url || ""}"`
    )
    .join("\n");

  return `You are the editor of ClaudeCode.guide, a daily digest for developers learning to use Claude Code with VS Code.

Today is ${TODAY}. You have scraped the following raw items from GitHub, Hacker News, Reddit, Anthropic blog, Bilibili, and YouTube:

${itemsText}

Your task:
1. Select the 5-8 most useful and relevant items for developers using Claude Code or VS Code AI tools.
2. For each selected item, write a 2-3 sentence English summary that is clear and actionable for beginners.
3. If a Bilibili item is in Chinese, translate the title to English and summarize in English.
4. Assign a relevance level: "beginner", "intermediate", or "advanced".
5. Assign a category — choose EXACTLY ONE from: "Release", "Tutorial", "Discussion", "Tips", "Community".
   - Release: version releases, changelogs, new product announcements
   - Tutorial: how-to guides, walkthroughs, video tutorials (YouTube/Bilibili)
   - Discussion: HN/Reddit debates, opinion pieces, comparisons
   - Tips: productivity advice, workflow improvements, quick wins
   - Community: projects, tools, job posts, ecosystem news
6. Generate 3-5 short keyword tags relevant to the item (e.g. "MCP", "sub-agents", "beginner-friendly", "VS Code").
7. For YouTube and Bilibili items: copy the thumbnail_url and video_id from the raw data exactly as given. For all other sources, set both fields to null.
8. Write 3 short, actionable "tips of the day" inspired by the content (original tips, not repeating summaries).

Respond with ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "date": "${TODAY}",
  "highlights": [
    {
      "title": "...",
      "summary": "...",
      "source": "github|hackernews|reddit|anthropic|bilibili|youtube",
      "url": "...",
      "relevance": "beginner|intermediate|advanced",
      "category": "Release|Tutorial|Discussion|Tips|Community",
      "tags": ["tag1", "tag2", "tag3"],
      "thumbnail_url": "string or null",
      "video_id": "string or null"
    }
  ],
  "tips_of_the_day": ["tip1", "tip2", "tip3"]
}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== ClaudeCode.guide Summarizer — ${TODAY} ===\n`);

  // Read raw scraped data
  if (!fs.existsSync(RAW_FILE)) {
    console.error(`Raw data file not found: ${RAW_FILE}`);
    console.error("Run scraper.js first: node scripts/scraper.js");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(RAW_FILE, "utf-8"));
  const items = raw.items || [];
  console.log(`Loaded ${items.length} raw items from ${RAW_FILE}`);

  if (items.length === 0) {
    console.warn("No items to summarize. Check if scraper ran correctly.");
    process.exit(0);
  }

  // Call Claude API
  console.log("Calling Claude API to summarize...");
  const prompt = buildPrompt(items);
  const responseText = await callClaudeAPI(prompt);

  // Parse the JSON response
  let summary;
  try {
    // Claude sometimes wraps JSON in ```json blocks despite instructions — strip if needed
    const jsonText = responseText.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
    summary = JSON.parse(jsonText);
  } catch (e) {
    console.error("Failed to parse Claude response as JSON:", e.message);
    console.error("Raw response:", responseText.slice(0, 500));
    process.exit(1);
  }

  // Validate structure
  if (!summary.highlights || !Array.isArray(summary.highlights)) {
    console.error("Invalid summary structure — missing highlights array");
    process.exit(1);
  }

  console.log(`Got ${summary.highlights.length} highlights and ${summary.tips_of_the_day?.length || 0} tips`);

  // Ensure directories exist
  if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

  // Write latest.json (always overwrite)
  fs.writeFileSync(LATEST_FILE, JSON.stringify(summary, null, 2));
  console.log(`Written: ${LATEST_FILE}`);

  // Write archive copy
  const archiveFile = path.join(ARCHIVE_DIR, `${TODAY}.json`);
  fs.writeFileSync(archiveFile, JSON.stringify(summary, null, 2));
  console.log(`Archived: ${archiveFile}`);

  console.log("\nDone! The site will reflect today's updates on next build.");
}

main().catch((err) => {
  console.error("Summarizer failed:", err.message);
  process.exit(1);
});
