-- Fix the credentials function to ensure proper ordering
DROP FUNCTION IF EXISTS public.get_all_credentials_with_translation(character varying);

CREATE OR REPLACE FUNCTION public.get_all_credentials_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  title text, 
  description text, 
  icon_name text, 
  image_url text, 
  display_order integer
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
    c.id,
    COALESCE(
      (SELECT ct.title FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_language_id),
      (SELECT ct.title FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT ct.description FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_language_id),
      (SELECT ct.description FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_default_language_id),
      ''
    ) AS description,
    c.icon_name,
    c.image_url,
    c.display_order
  FROM public.credentials c
  ORDER BY c.display_order ASC, c.id;
END;
$function$;