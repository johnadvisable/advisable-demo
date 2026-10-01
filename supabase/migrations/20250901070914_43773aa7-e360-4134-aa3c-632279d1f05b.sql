-- Phase 1: Database Functions Optimization
-- Fix search_path security warnings and create optimized RPC functions

-- Update existing functions with proper security
CREATE OR REPLACE FUNCTION public.get_all_services_with_translation_enhanced(p_language_code character varying)
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
  ORDER BY s.display_order;
END;
$function$;

-- Enhanced partner RPC function
CREATE OR REPLACE FUNCTION public.get_all_partners_with_translation_enhanced(p_language_code character varying)
 RETURNS TABLE(id uuid, name text, description text, long_description text, use_case text, logo text, category text, has_detail_page boolean, featured boolean, benefits text[], integration_steps text[], contact_person text, partnership_type text, display_order integer)
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
      (SELECT pt.name FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.name FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_default_language_id),
      'Unnamed Partner'
    ) AS name,
    COALESCE(
      (SELECT pt.description FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.description FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_default_language_id),
      ''
    ) AS description,
    COALESCE(
      (SELECT pt.long_description FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.long_description FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_default_language_id),
      ''
    ) AS long_description,
    COALESCE(
      (SELECT pt.use_case FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.use_case FROM public.partner_translations pt 
       WHERE pt.partner_id = p.id AND pt.language_id = v_default_language_id),
      ''
    ) AS use_case,
    p.logo,
    p.category,
    p.has_detail_page,
    p.featured,
    p.benefits,
    p.integration_steps,
    p.contact_person,
    p.partnership_type,
    p.display_order
  FROM public.partners p
  ORDER BY p.display_order, (
    SELECT pt.name FROM public.partner_translations pt 
    WHERE pt.partner_id = p.id AND pt.language_id = v_language_id
    LIMIT 1
  );
END;
$function$;

-- Enhanced service by slug function with proper error handling
CREATE OR REPLACE FUNCTION public.get_service_by_slug_safe(p_slug text, p_language_code text)
 RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
  v_service_exists BOOLEAN;
BEGIN
  -- Check if service exists
  SELECT EXISTS(SELECT 1 FROM public.services WHERE services.slug = p_slug) INTO v_service_exists;
  
  IF NOT v_service_exists THEN
    RETURN;
  END IF;
  
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
  WHERE s.slug = p_slug;
END;
$function$;

-- Create unified admin functions for all entities
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
 RETURNS TABLE(
   total_clients bigint,
   total_services bigint, 
   total_products bigint,
   total_partners bigint,
   total_blog_posts bigint,
   total_news_items bigint,
   total_team_members bigint,
   total_credentials bigint
 )
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admins to access this function
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.clients) as total_clients,
    (SELECT COUNT(*) FROM public.services) as total_services,
    (SELECT COUNT(*) FROM public.products) as total_products,
    (SELECT COUNT(*) FROM public.partners) as total_partners,
    (SELECT COUNT(*) FROM public.blog_posts) as total_blog_posts,
    (SELECT COUNT(*) FROM public.news_items) as total_news_items,
    (SELECT COUNT(*) FROM public.team_members) as total_team_members,
    (SELECT COUNT(*) FROM public.credentials) as total_credentials;
END;
$function$;