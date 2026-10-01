-- Drop and recreate the RPC function with correct column references
DROP FUNCTION IF EXISTS public.get_services_by_category_simple(TEXT, TEXT);

CREATE FUNCTION public.get_services_by_category_simple(p_category_slug TEXT, p_language TEXT DEFAULT 'en')
RETURNS TABLE(
  id UUID,
  slug TEXT,
  icon_name TEXT,
  display_order INTEGER,
  category_id UUID,
  title TEXT,
  short_description TEXT,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.slug,
    s.icon_name,
    s.display_order,
    s.category_id,
    COALESCE(st.title, st_en.title) as title,
    COALESCE(st.short_description, st_en.short_description) as short_description,
    COALESCE(st.description, st_en.description) as description
  FROM services s
  JOIN service_categories sc ON s.category_id = sc.id
  LEFT JOIN languages l ON l.code = p_language
  LEFT JOIN languages l_en ON l_en.code = 'en'
  LEFT JOIN service_translations st ON st.service_id = s.id AND st.language_id = l.id
  LEFT JOIN service_translations st_en ON st_en.service_id = s.id AND st_en.language_id = l_en.id
  WHERE sc.slug = p_category_slug
  ORDER BY s.display_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;