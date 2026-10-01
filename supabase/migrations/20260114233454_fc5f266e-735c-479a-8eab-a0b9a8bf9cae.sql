-- Fix the RPC function to use long_description instead of description
DROP FUNCTION IF EXISTS public.get_services_by_category_simple(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.get_services_by_category_simple(
  p_category_slug TEXT,
  p_language TEXT DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  category_id UUID,
  title TEXT,
  slug TEXT,
  icon_name TEXT,
  short_description TEXT,
  description TEXT,
  display_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_language_id INTEGER;
  v_english_id INTEGER;
  v_category_id UUID;
BEGIN
  -- Get language IDs
  SELECT l.id INTO v_language_id FROM languages l WHERE l.code = p_language;
  SELECT l.id INTO v_english_id FROM languages l WHERE l.code = 'en';
  
  -- Get category ID from slug
  SELECT sc.id INTO v_category_id FROM service_categories sc WHERE sc.slug = p_category_slug;
  
  IF v_category_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    COALESCE(st.title, st_en.title) as title,
    s.slug,
    s.icon_name,
    COALESCE(st.short_description, st_en.short_description) as short_description,
    COALESCE(st.long_description, st_en.long_description) as description,
    s.display_order
  FROM services s
  LEFT JOIN service_translations st ON st.service_id = s.id AND st.language_id = v_language_id
  LEFT JOIN service_translations st_en ON st_en.service_id = s.id AND st_en.language_id = v_english_id
  WHERE s.category_id = v_category_id
  ORDER BY s.display_order;
END;
$$;