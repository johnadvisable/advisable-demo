-- Fix the remaining get_all_service_categories_joined function conflict

-- Drop all conflicting function overloads
DROP FUNCTION IF EXISTS public.get_all_service_categories_joined(character varying);
DROP FUNCTION IF EXISTS public.get_all_service_categories_joined(text);

-- Create single, consistent function for getting all service categories
CREATE OR REPLACE FUNCTION public.get_all_service_categories_joined(p_language_code text DEFAULT 'en')
RETURNS TABLE(
  id uuid, 
  slug text, 
  name text, 
  description text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
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
  
  RETURN QUERY
  SELECT 
    sc.id,
    sc.slug,
    COALESCE(
      (SELECT sct.name FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
      (SELECT sct.name FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
      'Unnamed Category'
    ) AS name,
    COALESCE(
      (SELECT sct.description FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_language_id),
      (SELECT sct.description FROM public.service_category_translations sct 
       WHERE sct.category_id = sc.id AND sct.language_id = v_default_language_id),
      ''
    ) AS description
  FROM public.service_categories sc
  ORDER BY sc.name;
END;
$function$;