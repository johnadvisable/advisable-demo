
-- Update get_services_hierarchical to filter out SEO-only services
CREATE OR REPLACE FUNCTION public.get_services_hierarchical(p_category_slug TEXT, p_language TEXT DEFAULT 'en')
RETURNS TABLE(
  id UUID,
  slug TEXT,
  title TEXT,
  short_description TEXT,
  icon_name TEXT,
  is_parent BOOLEAN,
  parent_service_id UUID,
  parent_slug TEXT,
  display_order INTEGER,
  featured_image TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.slug,
    COALESCE(st.title, st_en.title, s.slug) as title,
    COALESCE(st.short_description, st_en.short_description, '') as short_description,
    s.icon_name::TEXT as icon_name,
    COALESCE(s.is_parent, false) as is_parent,
    s.parent_service_id,
    ps.slug as parent_slug,
    s.display_order,
    s.featured_image
  FROM services s
  JOIN service_categories sc ON s.category_id = sc.id
  LEFT JOIN languages l ON l.code = p_language
  LEFT JOIN service_translations st ON st.service_id = s.id AND st.language_id = l.id
  LEFT JOIN languages l_en ON l_en.code = 'en'
  LEFT JOIN service_translations st_en ON st_en.service_id = s.id AND st_en.language_id = l_en.id
  LEFT JOIN services ps ON s.parent_service_id = ps.id
  WHERE sc.slug = p_category_slug
    AND COALESCE(s.is_seo_only, false) = false
  ORDER BY 
    CASE WHEN s.is_parent = true THEN 0 ELSE 1 END,
    COALESCE(ps.display_order, s.display_order),
    s.display_order;
END;
$$;

-- Update get_services_by_category_simple to filter out SEO-only services
CREATE OR REPLACE FUNCTION public.get_services_by_category_simple(p_category_slug TEXT, p_language TEXT DEFAULT 'en')
RETURNS TABLE(
  id UUID,
  category_id UUID,
  title TEXT,
  slug TEXT,
  icon_name TEXT,
  short_description TEXT,
  description TEXT,
  display_order INTEGER,
  featured_image TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_language_id INTEGER;
  v_english_id INTEGER;
  v_category_id UUID;
BEGIN
  SELECT l.id INTO v_language_id FROM public.languages l WHERE l.code = p_language;
  SELECT l.id INTO v_english_id FROM public.languages l WHERE l.code = 'en';

  SELECT sc.id INTO v_category_id FROM public.service_categories sc WHERE sc.slug = p_category_slug;
  IF v_category_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    COALESCE(st.title, st_en.title) as title,
    s.slug,
    s.icon_name::text as icon_name,
    COALESCE(st.short_description, st_en.short_description) as short_description,
    COALESCE(st.long_description, st_en.long_description) as description,
    s.display_order,
    s.featured_image
  FROM public.services s
  LEFT JOIN public.service_translations st ON st.service_id = s.id AND st.language_id = v_language_id
  LEFT JOIN public.service_translations st_en ON st_en.service_id = s.id AND st_en.language_id = v_english_id
  WHERE s.category_id = v_category_id
    AND COALESCE(s.is_seo_only, false) = false
  ORDER BY s.display_order;
END;
$$;
