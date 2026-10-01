-- Add SEO fields to service_translations table
ALTER TABLE public.service_translations 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Update the RPC function to include SEO fields
DROP FUNCTION IF EXISTS public.get_service_by_slug_simple(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.get_service_by_slug_simple(
  p_slug TEXT,
  p_language_code TEXT DEFAULT 'en'
)
RETURNS TABLE(
  id UUID,
  category_id UUID,
  title TEXT,
  slug TEXT,
  icon_name TEXT,
  short_description TEXT,
  long_description TEXT,
  seo_title TEXT,
  meta_description TEXT,
  display_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_language_id INTEGER;
  v_english_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id FROM public.languages l WHERE l.code = p_language_code;
  SELECT l.id INTO v_english_id FROM public.languages l WHERE l.code = 'en';

  IF v_language_id IS NULL THEN
    v_language_id := v_english_id;
  END IF;

  RETURN QUERY
  SELECT
    s.id,
    s.category_id,
    COALESCE(st.title, st_en.title) as title,
    s.slug,
    s.icon_name::text as icon_name,
    COALESCE(st.short_description, st_en.short_description) as short_description,
    COALESCE(st.long_description, st_en.long_description) as long_description,
    COALESCE(st.seo_title, st_en.seo_title, st.title, st_en.title) as seo_title,
    COALESCE(st.meta_description, st_en.meta_description, st.short_description, st_en.short_description) as meta_description,
    s.display_order
  FROM public.services s
  LEFT JOIN public.service_translations st
    ON st.service_id = s.id AND st.language_id = v_language_id
  LEFT JOIN public.service_translations st_en
    ON st_en.service_id = s.id AND st_en.language_id = v_english_id
  WHERE s.slug = p_slug;
END;
$$;