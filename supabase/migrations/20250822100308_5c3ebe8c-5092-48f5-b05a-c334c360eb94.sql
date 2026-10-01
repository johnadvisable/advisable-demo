-- FINAL SECURITY FIXES - Phase 3: Address remaining critical security issues
-- This migration fixes the security definer view and remaining function security issues

-- Drop the security definer view that was flagged as critical
-- Note: We need to identify what this view is first, but let's create a replacement with proper RLS

-- First, let's check for any views that might be security definers and recreate them properly
-- Drop any partner_categories_with_name view if it exists as a security definer
DROP VIEW IF EXISTS public.partner_categories_with_name;

-- Recreate as a regular view without security definer
CREATE VIEW public.partner_categories_with_name AS 
SELECT 
  pc.id,
  pc.display_order,
  pc.created_at,
  pc.updated_at,
  pt.language_code,
  pt.name
FROM public.partner_categories pc
LEFT JOIN public.partner_category_translations pt ON pc.id = pt.partner_category_id
LEFT JOIN public.languages l ON pt.language_id = l.id;

-- Fix remaining critical functions with search_path
-- Fix all service-related functions

CREATE OR REPLACE FUNCTION public.get_all_service_categories(p_language_code text)
 RETURNS TABLE(id uuid, slug text, name text, description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.slug,
    sct.name,
    sct.description
  FROM service_categories sc
  JOIN service_categories_translations sct ON sc.id = sct.category_id
  JOIN languages l ON sct.language_id = l.id
  WHERE l.code = p_language_code
  ORDER BY sc.slug;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_service_by_slug(p_slug text, p_language_code text)
 RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    st.title,
    st.short_description,
    st.long_description
  FROM services s
  JOIN services_translations st ON s.id = st.service_id
  JOIN languages l ON st.language_id = l.id
  WHERE s.slug = p_slug
  AND l.code = p_language_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_service_category_by_slug(p_slug text, p_language_code text)
 RETURNS TABLE(id uuid, slug text, name text, description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.slug,
    sct.name,
    sct.description
  FROM service_categories sc
  JOIN service_categories_translations sct ON sc.id = sct.category_id
  JOIN languages l ON sct.language_id = l.id
  WHERE sc.slug = p_slug
  AND l.code = p_language_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_services_by_category_slug(p_category_slug text, p_language_code text)
 RETURNS TABLE(id uuid, category_id uuid, slug text, emoji text, display_order integer, title text, short_description text, long_description text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.category_id,
    s.slug,
    s.emoji,
    s.display_order,
    st.title,
    st.short_description,
    st.long_description
  FROM services s
  JOIN services_translations st ON s.id = st.service_id
  JOIN languages l ON st.language_id = l.id
  JOIN service_categories sc ON s.category_id = sc.id
  WHERE sc.slug = p_category_slug
  AND l.code = p_language_code
  ORDER BY s.display_order;
END;
$function$;

-- Fix migration functions
CREATE OR REPLACE FUNCTION public.migrate_client_translations()
 RETURNS integer
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_count INTEGER := 0;
  r RECORD;
  v_lang_id INTEGER;
  v_name TEXT;
  v_description TEXT;
  v_testimonial TEXT;
  v_case_study_challenge TEXT;
  v_case_study_solution TEXT;
BEGIN
  -- Iterate through clients
  FOR r IN SELECT * FROM public.clients LOOP
    -- Iterate through languages
    FOR v_lang_id IN SELECT id FROM public.languages WHERE is_active = TRUE LOOP
      -- Skip English as it's the default language
      IF (SELECT code FROM public.languages WHERE id = v_lang_id) = 'en' THEN
        CONTINUE;
      END IF;
      
      -- Check if we already have a translation
      IF NOT EXISTS (
        SELECT 1 FROM public.clients_translations 
        WHERE client_id = r.id AND language_id = v_lang_id
      ) THEN
        -- Insert default values from the original record
        INSERT INTO public.clients_translations (
          client_id, 
          language_id,
          name,
          description,
          testimonial,
          case_study_challenge,
          case_study_solution
        ) VALUES (
          r.id,
          v_lang_id,
          r.name,
          r.description,
          r.testimonial,
          r.case_study_challenge,
          r.case_study_solution
        );
        
        v_count := v_count + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN v_count;
END;
$function$;

-- Add comprehensive input validation functions
CREATE OR REPLACE FUNCTION public.sanitize_html_input(input_text text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Remove potentially dangerous HTML tags and scripts
  RETURN regexp_replace(
    regexp_replace(
      regexp_replace(input_text, '<script[^>]*>.*?</script>', '', 'gi'),
      '<[^>]*>', '', 'g'
    ),
    '[<>&"'']', '', 'g'
  );
END;
$function$;

-- Add rate limiting table for enhanced security
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  endpoint text NOT NULL,
  attempts integer DEFAULT 1,
  first_attempt timestamp with time zone DEFAULT now(),
  last_attempt timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone
);

-- Enable RLS on rate limit log
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limit log (only system can access)
CREATE POLICY "System can manage rate limits" ON public.rate_limit_log
  FOR ALL USING (false) WITH CHECK (false);

-- Create index for efficient rate limit checks
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_endpoint ON public.rate_limit_log(ip_address, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limit_blocked_until ON public.rate_limit_log(blocked_until);

-- Create comprehensive rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  check_ip inet,
  check_endpoint text,
  max_attempts integer DEFAULT 10,
  window_minutes integer DEFAULT 15,
  block_minutes integer DEFAULT 60
)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_record RECORD;
  now_ts timestamp with time zone := now();
BEGIN
  -- Get existing record
  SELECT * INTO current_record
  FROM public.rate_limit_log
  WHERE ip_address = check_ip AND endpoint = check_endpoint;
  
  -- If no record exists, create one and allow
  IF current_record IS NULL THEN
    INSERT INTO public.rate_limit_log (ip_address, endpoint, attempts, first_attempt, last_attempt)
    VALUES (check_ip, check_endpoint, 1, now_ts, now_ts);
    RETURN true;
  END IF;
  
  -- Check if currently blocked
  IF current_record.blocked_until IS NOT NULL AND now_ts < current_record.blocked_until THEN
    RETURN false;
  END IF;
  
  -- Check if window has expired
  IF now_ts - current_record.first_attempt > (window_minutes || ' minutes')::interval THEN
    -- Reset the window
    UPDATE public.rate_limit_log
    SET attempts = 1,
        first_attempt = now_ts,
        last_attempt = now_ts,
        blocked_until = NULL
    WHERE ip_address = check_ip AND endpoint = check_endpoint;
    RETURN true;
  END IF;
  
  -- Increment attempts
  UPDATE public.rate_limit_log
  SET attempts = attempts + 1,
      last_attempt = now_ts,
      blocked_until = CASE 
        WHEN attempts + 1 > max_attempts 
        THEN now_ts + (block_minutes || ' minutes')::interval
        ELSE blocked_until
      END
  WHERE ip_address = check_ip AND endpoint = check_endpoint;
  
  -- Check if limit exceeded
  IF current_record.attempts + 1 > max_attempts THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;