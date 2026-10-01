-- Phase 2: Authentication and Database Security Hardening (Fixed)

-- Fix search_path settings on all database functions for security
-- This prevents potential privilege escalation via search_path manipulation

-- Function 1: get_current_user_role (already has correct search_path)
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

-- Function 2: has_role (already has correct search_path)
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

-- Function 3: is_admin_user (already has correct search_path)
CREATE OR REPLACE FUNCTION public.is_admin_user()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
$function$;

-- Function 4: check_auth_rate_limit (add missing search_path)
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(user_ip inet)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
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

-- Add content validation function for CMS inputs to prevent XSS at database level
CREATE OR REPLACE FUNCTION public.validate_html_content(content_html text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check for suspicious script tags and javascript protocols (simplified patterns)
  IF content_html ILIKE '%<script%' 
     OR content_html ILIKE '%javascript:%' 
     OR content_html ILIKE '%vbscript:%' 
     OR content_html ILIKE '%onclick=%'
     OR content_html ILIKE '%onload=%' 
     OR content_html ILIKE '%onerror=%'
     OR content_html ILIKE '%onmouseover=%' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

-- Add security validation triggers for content tables
CREATE OR REPLACE FUNCTION public.validate_content_security()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate HTML content in insights
  IF TG_TABLE_NAME = 'insights_translations' AND NEW.content IS NOT NULL THEN
    IF NOT public.validate_html_content(NEW.content) THEN
      RAISE EXCEPTION 'Content contains potentially unsafe HTML elements';
    END IF;
  END IF;
  
  -- Validate HTML content in news
  IF TG_TABLE_NAME = 'news_translations' AND NEW.content IS NOT NULL THEN
    IF NOT public.validate_html_content(NEW.content) THEN
      RAISE EXCEPTION 'Content contains potentially unsafe HTML elements';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Apply content security triggers
DROP TRIGGER IF EXISTS validate_insights_content ON public.insights_translations;
CREATE TRIGGER validate_insights_content
  BEFORE INSERT OR UPDATE ON public.insights_translations
  FOR EACH ROW EXECUTE FUNCTION public.validate_content_security();

DROP TRIGGER IF EXISTS validate_news_content ON public.news_translations;  
CREATE TRIGGER validate_news_content
  BEFORE INSERT OR UPDATE ON public.news_translations
  FOR EACH ROW EXECUTE FUNCTION public.validate_content_security();

-- Add security documentation
COMMENT ON FUNCTION public.validate_html_content(text) IS 'Validates HTML content to prevent XSS attacks by detecting suspicious patterns including script tags, event handlers, and javascript protocols.';
COMMENT ON FUNCTION public.validate_content_security() IS 'Trigger function that validates content security for CMS inputs across content tables.';
COMMENT ON FUNCTION public.check_auth_rate_limit(inet) IS 'Rate limiting function for authentication attempts with secure search_path.';