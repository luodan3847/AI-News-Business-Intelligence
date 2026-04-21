ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_ingestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_enabled_sources"
ON public.sources
FOR SELECT
TO anon, authenticated
USING (enabled = true);

CREATE POLICY "public_read_approved_signals"
ON public.signals
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "public_read_approved_use_cases"
ON public.use_cases
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "public_read_approved_predictions"
ON public.predictions
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "public_read_reports"
ON public.reports
FOR SELECT
TO anon, authenticated
USING (true);
