-- Add seo_h2_title field to service_translations table
ALTER TABLE public.service_translations 
ADD COLUMN IF NOT EXISTS seo_h2_title TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.service_translations.seo_h2_title IS 'SEO-friendly H2 title displayed before the long description';