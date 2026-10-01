-- Add missing RPC function for getting service with translation
CREATE OR REPLACE FUNCTION public.get_service_with_translation(p_service_id uuid, p_language_code text)
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
  WHERE s.id = p_service_id;
END;
$function$;