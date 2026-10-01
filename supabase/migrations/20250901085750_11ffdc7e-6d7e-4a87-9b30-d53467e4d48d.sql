-- Fix the remaining database security warnings by dropping and recreating functions with correct signatures

-- Drop and recreate get_all_metrics_with_translation function with correct return type
DROP FUNCTION IF EXISTS public.get_all_metrics_with_translation(character varying);

CREATE OR REPLACE FUNCTION public.get_all_metrics_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, key text, value integer, label text, description text)
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
    m.id,
    m.key,
    m.value,
    COALESCE(
      (SELECT mt.label FROM public.metric_translations mt 
       WHERE mt.metric_id = m.id AND mt.language_id = v_language_id),
      m.key
    ) AS label,
    COALESCE(
      (SELECT mt.description FROM public.metric_translations mt 
       WHERE mt.metric_id = m.id AND mt.language_id = v_language_id),
      ''
    ) AS description
  FROM public.metrics m
  ORDER BY m.key;
END;
$function$;