# Architecture Overview

## Objective

AI News & Business Intelligence is built as a daily intelligence system, not a static content site.

The architecture is designed to move from raw AI information to structured, publishable insight through a repeatable pipeline:

- ingest raw signals
- normalize and classify them
- analyze business impact
- propose use cases and predictions
- publish approved outputs

## Main layers

### 1. Public application layer

The `app/` directory is the public experience. It exposes the dashboard, signal explorer, use case database, tool tracking, prediction views, and daily reports.

This layer should present intelligence clearly, not merely list content.

### 2. Data model layer

The `lib/db/` and `lib/intelligence/` directories define the product schema and typed interfaces.

Core records:

- `sources`
- `raw_ingestions`
- `signals`
- `use_cases`
- `predictions`
- `reports`

Supabase Postgres is the primary store. JSON exports in `data/published/` are the fallback publication layer.

### 3. Pipeline layer

The `scripts/pipeline/` directory handles the operational workflow:

1. `ingest`
2. `normalize`
3. `analyze`
4. `propose`
5. `publish`

The pipeline writes intermediate artifacts to `data/pipeline/` and public fallback artifacts to `data/published/`.

Legacy `data/latest.json`, `data/raw-*`, and `data/archive/*` snapshots are not part of the active architecture anymore. The current product treats `data/pipeline/` and `data/published/` as the canonical filesystem layers.

### 4. Automation layer

GitHub Actions runs the daily pipeline on a schedule and supports manual triggering. This keeps the product aligned with the idea of recurring intelligence, not one-time curation.

## Design principles

- Prefer structured intelligence over content sprawl
- Keep the data model reusable across routes and scripts
- Separate raw signals from published insight
- Preserve analyst review as a distinct step for predictions
- Build for dashboard clarity, not tutorial storytelling
