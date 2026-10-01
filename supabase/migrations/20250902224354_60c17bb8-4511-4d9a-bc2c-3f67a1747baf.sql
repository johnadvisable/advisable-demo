-- Check and fix function overloading issue for get_services_by_category_slug
-- Drop the conflicting function with character varying parameter
DROP FUNCTION IF EXISTS public.get_services_by_category_slug(text, character varying);

-- Create a single, consistent function with text parameters
CREATE OR REPLACE FUNCTION public.get_services_by_category_slug(p_category_slug text, p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid, 
  category_id uuid, 
  slug text, 
  emoji text, 
  display_order integer, 
  title text, 
  short_description text, 
  long_description text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
  v_category_id uuid;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  -- Get category ID from slug
  SELECT sc.id INTO v_category_id
  FROM public.service_categories sc
  WHERE sc.slug = p_category_slug
  LIMIT 1;
  
  -- Return services for the category
  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    COALESCE(
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.title FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.short_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS short_description,
    COALESCE(
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_language_id),
      (SELECT st.long_description FROM public.service_translations st 
       WHERE st.service_id = s.id AND st.language_id = v_default_language_id),
      ''
    ) AS long_description
  FROM public.services s
  WHERE s.category_id = v_category_id
  ORDER BY s.display_order;
END;
$function$;