CREATE TYPE source_type AS ENUM (
  'official_blog',
  'release_feed',
  'community',
  'video',
  'tooling'
);

CREATE TYPE signal_type AS ENUM (
  'news',
  'release',
  'tool_update',
  'use_case_signal',
  'market_signal'
);

CREATE TYPE record_status AS ENUM ('draft', 'approved', 'archived');

CREATE TYPE prediction_status AS ENUM (
  'draft_ai',
  'under_review',
  'approved',
  'rejected'
);

CREATE TYPE impact_area AS ENUM (
  'strategy',
  'product',
  'operations',
  'engineering',
  'customer_experience',
  'risk'
);

CREATE TYPE implementation_level AS ENUM (
  'pilot',
  'team_ready',
  'production',
  'enterprise_scale'
);

CREATE TYPE maturity_level AS ENUM (
  'emerging',
  'validated',
  'scaling',
  'mainstream'
);

CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  type source_type NOT NULL,
  base_url text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS raw_ingestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  external_id varchar(255) NOT NULL,
  url text NOT NULL,
  title_raw text NOT NULL,
  content_raw text NOT NULL,
  payload_json jsonb NOT NULL,
  published_at timestamptz NOT NULL,
  fetched_at timestamptz NOT NULL,
  hash varchar(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_ingestion_id uuid NOT NULL REFERENCES raw_ingestions(id) ON DELETE CASCADE,
  signal_type signal_type NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  source_name varchar(120) NOT NULL,
  url text NOT NULL,
  published_at timestamptz NOT NULL,
  vendors text[] NOT NULL DEFAULT '{}'::text[],
  technologies text[] NOT NULL DEFAULT '{}'::text[],
  industries text[] NOT NULL DEFAULT '{}'::text[],
  functions text[] NOT NULL DEFAULT '{}'::text[],
  impact_score integer NOT NULL DEFAULT 50,
  novelty_score integer NOT NULL DEFAULT 50,
  confidence_score integer NOT NULL DEFAULT 50,
  business_impact text NOT NULL,
  implementation_hint text NOT NULL,
  status record_status NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  industry varchar(120) NOT NULL,
  business_function varchar(120) NOT NULL,
  problem text NOT NULL,
  solution_pattern text NOT NULL,
  tools text[] NOT NULL DEFAULT '{}'::text[],
  implementation_level implementation_level NOT NULL,
  expected_value text NOT NULL,
  risks text NOT NULL,
  business_impact text NOT NULL,
  maturity maturity_level NOT NULL,
  source_signal_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  status record_status NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  statement text NOT NULL,
  timeframe varchar(8) NOT NULL,
  confidence integer NOT NULL DEFAULT 60,
  rationale text NOT NULL,
  impact_area impact_area NOT NULL,
  supporting_signal_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  ai_draft text NOT NULL,
  analyst_revision text NOT NULL,
  status prediction_status NOT NULL DEFAULT 'draft_ai',
  created_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date varchar(10) NOT NULL,
  executive_summary text NOT NULL,
  top_signal_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  top_use_case_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  strategic_takeaways text[] NOT NULL DEFAULT '{}'::text[],
  business_impact_summary text NOT NULL,
  prediction_updates text[] NOT NULL DEFAULT '{}'::text[],
  published_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS raw_ingestions_source_id_idx ON raw_ingestions(source_id);
CREATE INDEX IF NOT EXISTS raw_ingestions_external_id_idx ON raw_ingestions(external_id);
CREATE INDEX IF NOT EXISTS signals_status_idx ON signals(status);
CREATE INDEX IF NOT EXISTS signals_published_at_idx ON signals(published_at DESC);
CREATE INDEX IF NOT EXISTS use_cases_status_idx ON use_cases(status);
CREATE INDEX IF NOT EXISTS predictions_status_idx ON predictions(status);
CREATE INDEX IF NOT EXISTS reports_report_date_idx ON reports(report_date DESC);
