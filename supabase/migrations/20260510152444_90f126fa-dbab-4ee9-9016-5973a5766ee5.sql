ALTER TABLE public.startup_applications
  ADD COLUMN IF NOT EXISTS is_live text,
  ADD COLUMN IF NOT EXISTS live_product_url text,
  ADD COLUMN IF NOT EXISTS live_product_credentials text;