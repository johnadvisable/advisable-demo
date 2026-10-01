-- Continue fixing remaining security functions - Company values and company info functions

CREATE OR REPLACE FUNCTION public.get_company_value_with_translation(p_value_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, title text, description text, icon_name text, display_order integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT id INTO v_language_id 
  FROM public.languages 
  WHERE code = p_language_code;
  
  -- Get default language ID
  SELECT id INTO v_default_language_id 
  FROM public.languages 
  WHERE is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    cv.id,
    COALESCE(
      (SELECT cvt.title FROM public.company_value_translations cvt 
       WHERE cvt.company_value_id = cv.id AND cvt.language_id = v_language_id),
      cv.title
    ) AS title,
    COALESCE(
      (SELECT cvt.description FROM public.company_value_translations cvt 
       WHERE cvt.company_value_id = cv.id AND cvt.language_id = v_language_id),
      cv.description
    ) AS description,
    cv.icon_name,
    cv.display_order
  FROM public.company_values cv
  WHERE cv.id = p_value_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_default_language()
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_default_language TEXT;
BEGIN
  SELECT code INTO v_default_language
  FROM public.languages
  WHERE is_default = TRUE
  LIMIT 1;
  
  RETURN COALESCE(v_default_language, 'en');
END;
$function$;

-- Drop the security definer view that's causing the ERROR
DROP VIEW IF EXISTS public.partner_categories_with_name;