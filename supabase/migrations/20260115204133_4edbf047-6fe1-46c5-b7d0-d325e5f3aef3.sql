-- Fix the RPC function to cast icon_name properly
CREATE OR REPLACE FUNCTION get_services_hierarchical(
  p_category_slug TEXT,
  p_language TEXT DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  short_description TEXT,
  icon_name TEXT,
  is_parent BOOLEAN,
  parent_service_id UUID,
  parent_slug TEXT,
  display_order INT,
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
  ORDER BY 
    CASE WHEN s.is_parent = true THEN 0 ELSE 1 END,
    COALESCE(ps.display_order, s.display_order),
    s.display_order;
END;
$$;