# Changelog

All notable public-facing updates to this project should be recorded here.

## [1.2.0] - 2026-04-21

### Added

- post-publish coverage audit artifact and public coverage snapshot panels
- curated tool and ecosystem tracking layer instead of raw technology tag aggregation
- shared site metadata config and a minimal `vercel.json` for standalone deployment setup

### Changed

- rebalanced signal classification so community and video sources map more cleanly into market and implementation signal types
- tightened theme detection to better reflect research, platform, open-source, customer, and governance coverage
- cleaned environment setup guidance around the recommended standalone repo slug and deployment flow

## [1.1.0] - 2026-04-21

### Added

- broader source coverage across research feeds, frontier labs, open-source ecosystems, and business intelligence signals
- environment-driven public metadata for site and repository URLs
- final repository audit cleanup around docs, data structure, and public framing

### Changed

- removed remaining repo-facing references that framed the project as a derivative of an earlier guide
- tightened the documentation around the current DB-first intelligence architecture
- aligned the public copy with the broader AI ecosystem, not one vendor or one coding tool
- narrowed active filesystem artifacts to `data/pipeline/` and `data/published/`

## [1.0.0] - 2026-04-21

### Added

- intelligence dashboard routes for news, use cases, tools, predictions, reports, and methodology
- Supabase and Drizzle schema for sources, raw ingestions, signals, use cases, predictions, and reports
- five-step pipeline under `scripts/pipeline/`
- JSON publication fallback in `data/published/`
- seed data for AI signals, use cases, predictions, and daily reports
- architecture, product thinking, roadmap, and contribution documentation

### Changed

- established the product as AI News & Business Intelligence
- redesigned the public experience around dashboard-first intelligence views
- added combined `npm run check` verification for type and build validation

### Verified

- `npm run typecheck`
- `npm run build`
