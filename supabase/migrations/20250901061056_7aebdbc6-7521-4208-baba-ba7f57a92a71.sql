-- Fix more security functions missing SET search_path TO 'public'

CREATE OR REPLACE FUNCTION public.get_hero_content_with_translation(p_hero_content_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, page_name text, heading text, subheading text, cta_text text, cta_link text, background_type text)
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
    h.id,
    h.page_name,
    COALESCE(
      (SELECT ht.heading FROM public.hero_content_translations ht 
       WHERE ht.hero_content_id = h.id AND ht.language_id = v_language_id),
      h.heading
    ) AS heading,
    COALESCE(
      (SELECT ht.subheading FROM public.hero_content_translations ht 
       WHERE ht.hero_content_id = h.id AND ht.language_id = v_language_id),
      h.subheading
    ) AS subheading,
    COALESCE(
      (SELECT ht.cta_text FROM public.hero_content_translations ht 
       WHERE ht.hero_content_id = h.id AND ht.language_id = v_language_id),
      h.cta_text
    ) AS cta_text,
    h.cta_link,
    h.background_type
  FROM public.hero_content h
  WHERE h.id = p_hero_content_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_service_by_slug_with_translation(p_slug character varying, p_language_code character varying)
 RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
  v_service_id UUID;
BEGIN
  -- Get service ID from slug
  SELECT id INTO v_service_id 
  FROM public.services 
  WHERE slug = p_slug;
  
  IF v_service_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT * FROM public.get_service_with_translation(v_service_id, p_language_code);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_service_category_by_slug_with_translation(p_slug text, p_language_code text)
 RETURNS TABLE(id uuid, slug text, name text, description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_language_id INTEGER;
BEGIN
    -- Get the language ID
    SELECT id INTO v_language_id 
    FROM languages 
    WHERE code = p_language_code;
    
    -- Return the category with translations
    RETURN QUERY
    SELECT 
        sc.id,
        sc.slug,
        sct.name,
        sct.description
    FROM service_categories sc
    JOIN service_category_translations sct ON sc.id = sct.category_id
    WHERE sc.slug = p_slug
    AND sct.language_id = v_language_id;
END;
$function$;