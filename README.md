# AI News & Business Intelligence

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3fcf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1f6f43.svg)](LICENSE)

An all-in-one AI intelligence platform for daily news, implementation use cases, business impact signals, and analyst-reviewed predictions.

[Architecture](docs/architecture.md) | [Product Thinking](docs/product-thinking.md) | [Roadmap](docs/roadmap.md) | [Methodology Route](app/methodology/page.tsx)

![AI News & Business Intelligence preview](public/readme-preview.svg)

## What this project is

This project is not a generic AI news feed and not a single-tool guide.

It is designed as a daily intelligence product that:

- tracks AI signals across frontier research, official launches, open-source ecosystems, community discussion, and high-signal demos
- translates those signals into structured implementation use cases
- explains the business impact behind the headlines
- publishes analyst-reviewed predictions instead of link-only aggregation

The product lens is intentionally ecosystem-first and workflow-aware. The goal is to answer:

- What happened?
- Why does it matter?
- How could it be implemented?
- What business impact might it create?
- What should we expect next?

Recommended repository slug: `ai-news-business-intelligence`

## Product modules

- `Daily Brief`: executive summary and top signals for the current day
- `News`: tracked AI research, releases, tooling updates, and market signals
- `Use Case Database`: structured implementation patterns with business context
- `Tools`: platform-level tracking across model vendors, open-source ecosystems, and developer workflows
- `Predictions`: hybrid AI-draft plus analyst-review forward views
- `Reports`: date-specific intelligence reports
- `Methodology`: how the pipeline ingests, scores, proposes, and publishes

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Postgres
- Drizzle ORM
- Anthropic SDK
- Axios
- Cheerio

## Data model

The platform is DB-first and centers on six core tables:

- `sources`
- `raw_ingestions`
- `signals`
- `use_cases`
- `predictions`
- `reports`

Local JSON exports in `data/published/` act as a public fallback layer when a database connection is unavailable.

Legacy one-off raw snapshots from the earlier repo shape are intentionally no longer part of the active product structure.

## Repository structure

```text
app/                  Public routes and intelligence dashboard UI
lib/db/               Drizzle schema and database client
lib/intelligence/     Typed data model, seed dataset, repository layer
scripts/pipeline/     Ingest -> normalize -> analyze -> propose -> publish pipeline
supabase/migrations/  SQL migration files for the initial schema
data/                 Pipeline artifacts and published JSON fallback
.github/workflows/    Scheduled daily automation
docs/                 Product framing and architecture notes
```

## Local development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Run checks:

```bash
npm run check
```

Export the published fallback dataset and seed the database when a connection is available:

```bash
npm run seed:db
```

Run the full pipeline manually:

```bash
npm run pipeline:daily
```

## Standalone deployment

Recommended release path:

1. create a new GitHub repository named `ai-news-business-intelligence`
2. import that repository into Vercel as a separate standalone project
3. set `NEXT_PUBLIC_SITE_URL` to the Vercel production URL or your custom domain
4. set `NEXT_PUBLIC_REPOSITORY_URL` to the new GitHub repository URL
5. add `DATABASE_URL` or `SUPABASE_DB_URL` when you are ready to switch from JSON fallback to live Postgres hydration

The current automation model keeps daily ingestion in GitHub Actions and uses Vercel as the public application host.

Minimal database bootstrap:

```bash
npm run db:push
npm run seed:db
```

## Environment variables

Create an `.env.local` file from `.env.example` and set the values you need:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_REPOSITORY_URL`
- `DATABASE_URL`
- `SUPABASE_DB_URL`
- `ANTHROPIC_API_KEY`
- `GITHUB_TOKEN`

`NEXT_PUBLIC_SITE_URL` should point to the deployed site when you publish the product.

`NEXT_PUBLIC_REPOSITORY_URL` is optional and is only used when you want to surface the repository link in the public UI.

`DATABASE_URL` or `SUPABASE_DB_URL` enables live database hydration. Without a DB connection, the app falls back to the published JSON exports and built-in seed data.

## Current status

The current version includes:

- a full intelligence dashboard information architecture
- Drizzle schema and Supabase migration
- a six-step pipeline with post-publish coverage audit
- seed data for signals, use cases, predictions, and reports
- JSON fallback publishing
- Vercel-ready project configuration for standalone deployment

The next major improvement is moving from static seed-first content to fully live database-backed source ingestion and analyst review operations.

## Contributing

This project is currently maintained as a focused product build. Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance.

## License

This project is licensed under the [MIT License](LICENSE).
