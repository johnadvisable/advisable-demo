-- Final security fix batch - Add SET search_path to remaining functions

CREATE OR REPLACE FUNCTION public.get_service_with_translation(p_service_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
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

CREATE OR REPLACE FUNCTION public.get_credential_with_translation(p_credential_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, title text, description text, icon_name text, image_url text, display_order integer)
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
    c.id,
    COALESCE(
      (SELECT ct.title FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_language_id),
      c.title
    ) AS title,
    COALESCE(
      (SELECT ct.description FROM public.credential_translations ct 
       WHERE ct.credential_id = c.id AND ct.language_id = v_language_id),
      c.description
    ) AS description,
    c.icon_name,
    c.image_url,
    c.display_order
  FROM public.credentials c
  WHERE c.id = p_credential_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_metric_with_translation(p_metric_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, key text, label text, value integer, description text)
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
    m.id,
    m.key,
    COALESCE(
      (SELECT mt.label FROM public.metric_translations mt 
       WHERE mt.metric_id = m.id AND mt.language_id = v_language_id),
      m.label
    ) AS label,
    m.value,
    COALESCE(
      (SELECT mt.description FROM public.metric_translations mt 
       WHERE mt.metric_id = m.id AND mt.language_id = v_language_id),
      m.description
    ) AS description
  FROM public.metrics m
  WHERE m.id = p_metric_id;
END;
$function$;