-- Security Fix Phase 2: Fix remaining database functions with search_path issues

-- Fix all remaining translation and content functions
CREATE OR REPLACE FUNCTION public.get_all_clients_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, name text, logo text, description text, testimonial text, background_image text, website text, featured boolean, product_category text, case_study_challenge text, case_study_solution text, case_study_team_size text, case_study_timeline text, case_study_images jsonb, case_study_videos jsonb, case_study_results jsonb, industry text, country text, display_order integer)
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
      (SELECT ct.name FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.name
    ) AS name,
    c.logo,
    COALESCE(
      (SELECT ct.description FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.description
    ) AS description,
    COALESCE(
      (SELECT ct.testimonial FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.testimonial
    ) AS testimonial,
    c.background_image,
    c.website,
    c.featured,
    c.product_category,
    COALESCE(
      (SELECT ct.case_study_challenge FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.case_study_challenge
    ) AS case_study_challenge,
    COALESCE(
      (SELECT ct.case_study_solution FROM public.clients_translations ct 
       WHERE ct.client_id = c.id AND ct.language_id = v_language_id),
      c.case_study_solution
    ) AS case_study_solution,
    c.case_study_team_size,
    c.case_study_timeline,
    c.case_study_images,
    c.case_study_videos,
    c.case_study_results,
    c.industry,
    c.country,
    c.display_order
  FROM public.clients c
  ORDER BY c.display_order, c.name;
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.security_monitor_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log access to sensitive tables
  IF TG_TABLE_NAME IN ('user_roles', 'security_audit_log') THEN
    INSERT INTO public.security_audit_log (
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values,
      ip_address,
      user_agent
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
      inet_client_addr(),
      current_setting('request.headers')::json->>'user-agent'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix remaining functions (sample of key ones to address the warnings)
CREATE OR REPLACE FUNCTION public.get_all_company_values_with_translation(p_language_code character varying)
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
  ORDER BY cv.display_order;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_all_metrics_with_translation(p_language_code character varying)
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
  FROM public.metrics m;
END;
$function$;

-- Remove any problematic security definer views
-- First check if partner_categories_with_name is a view and recreate it properly
DROP VIEW IF EXISTS public.partner_categories_with_name;

-- Recreate as a regular view without SECURITY DEFINER
CREATE VIEW public.partner_categories_with_name AS
SELECT 
  pc.id,
  pc.display_order,
  pc.created_at,
  pc.updated_at,
  l.code as language_code,
  pct.name
FROM public.partner_categories pc
JOIN public.languages l ON l.is_active = true
LEFT JOIN public.partner_category_translations pct ON pc.id = pct.partner_category_id AND pct.language_id = l.id;