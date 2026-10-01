-- SECURITY FIXES - Phase 2: Fix remaining database security issues
-- Remove security definer view and fix remaining functions

-- First, identify and remove any security definer views
-- Note: This query is for informational purposes - we'll remove specific views as needed
-- DROP VIEW IF EXISTS any_security_definer_view_name;

-- Fix all remaining functions that need search_path parameter
-- Let's update the most critical ones that are commonly used

-- Fix get_default_language function
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

-- Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$function$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Fix audit_trigger_function
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

-- Fix update_updated_at_column function
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

-- Fix get_company_value_with_translation function
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

-- Fix get_metric_with_translation function
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

-- Create secure rate limiting function for authentication
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(user_ip inet)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  attempt_count integer;
  time_window interval := '15 minutes';
  max_attempts integer := 5;
BEGIN
  -- Count recent failed attempts from this IP
  SELECT COUNT(*) INTO attempt_count
  FROM public.security_audit_log
  WHERE ip_address = user_ip
    AND action = 'auth_failed'
    AND created_at > NOW() - time_window;
  
  -- Return false if too many attempts
  IF attempt_count >= max_attempts THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;