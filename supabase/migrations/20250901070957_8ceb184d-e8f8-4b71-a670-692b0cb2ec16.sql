-- Fix all remaining search_path security warnings
-- Phase 1B: Fix search_path for all existing functions

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

CREATE OR REPLACE FUNCTION public.get_service_category_by_slug_safe(p_slug text, p_language_code text)
 RETURNS TABLE(id uuid, slug text, name text, description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_language_id INTEGER;
    v_category_exists BOOLEAN;
BEGIN
    -- Check if category exists
    SELECT EXISTS(SELECT 1 FROM public.service_categories WHERE service_categories.slug = p_slug) INTO v_category_exists;
    
    IF NOT v_category_exists THEN
        RETURN;
    END IF;
    
    -- Get the language ID
    SELECT l.id INTO v_language_id 
    FROM public.languages l
    WHERE l.code = p_language_code;
    
    -- Return the category with translations
    RETURN QUERY
    SELECT 
        sc.id,
        sc.slug,
        COALESCE(sct.name, 'Unnamed Category') as name,
        COALESCE(sct.description, '') as description
    FROM public.service_categories sc
    LEFT JOIN public.service_category_translations sct ON sc.id = sct.category_id AND sct.language_id = v_language_id
    WHERE sc.slug = p_slug;
END;
$function$;

-- Update team member functions with search_path
CREATE OR REPLACE FUNCTION public.get_team_member_with_translation(p_team_member_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, name text, job_position text, bio text, role_description text, image_url text, linkedin_url text, twitter_url text, github_url text, instagram_url text, email text, specializations text[], achievements text[], is_leadership boolean, display_order integer)
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
  
  -- Get default language ID (English)
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    tm.id,
    COALESCE(
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      'Unnamed'
    ) AS name,
    COALESCE(
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      'Position'
    ) AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS bio,
    COALESCE(
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS role_description,
    tm.image_url,
    tm.linkedin_url,
    tm.twitter_url,
    tm.github_url,
    tm.instagram_url,
    tm.email,
    tm.specializations,
    tm.achievements,
    tm.is_leadership,
    tm.display_order
  FROM public.team_members tm
  WHERE tm.id = p_team_member_id;
END;
$function$;

-- Update get_product_with_translation
CREATE OR REPLACE FUNCTION public.get_product_with_translation(p_product_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, title text, description text, image_url text, hero_image text, website_url text, display_order integer, slug text, page_title text, page_subtitle text, page_description text, page_background_color text, highlight_color text, features jsonb, stats jsonb, testimonials jsonb, cta_section_title text, cta_section_description text, cta_button_text text)
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
    p.id,
    COALESCE(
      (SELECT pt.title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT pt.description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS description,
    p.image_url,
    p.hero_image,
    p.website_url,
    p.display_order,
    p.slug,
    COALESCE(
      (SELECT pt.page_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS page_title,
    COALESCE(
      (SELECT pt.page_subtitle FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS page_subtitle,
    COALESCE(
      (SELECT pt.page_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS page_description,
    p.page_background_color,
    p.highlight_color,
    p.features,
    p.stats,
    p.testimonials,
    COALESCE(
      (SELECT pt.cta_section_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS cta_section_title,
    COALESCE(
      (SELECT pt.cta_section_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS cta_section_description,
    COALESCE(
      (SELECT pt.cta_button_text FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      ''
    ) AS cta_button_text
  FROM public.products p
  WHERE p.id = p_product_id;
END;
$function$;