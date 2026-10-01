-- Drop and recreate the RPC function with featured_image
DROP FUNCTION IF EXISTS public.get_service_by_slug_simple(text, text);

CREATE FUNCTION public.get_service_by_slug_simple(p_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid,
  category_id uuid,
  title text,
  slug text,
  icon_name text,
  short_description text,
  long_description text,
  seo_title text,
  meta_description text,
  display_order integer,
  featured_image text
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
    s.display_order,
    s.featured_image
  FROM public.services s
  LEFT JOIN public.service_translations st
    ON st.service_id = s.id AND st.language_id = v_language_id
  LEFT JOIN public.service_translations st_en
    ON st_en.service_id = s.id AND st_en.language_id = v_english_id
  WHERE s.slug = p_slug;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_service_by_slug_simple(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_service_by_slug_simple(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_service_by_slug_simple(text, text) TO service_role;