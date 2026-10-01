-- Phase 2: Authentication and Database Security Hardening

-- Fix search_path settings on all database functions for security
-- This prevents potential privilege escalation via search_path manipulation

-- Function 1: get_current_user_role
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

-- Function 2: has_role
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

-- Function 3: is_admin_user
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

-- Function 4: user_has_permission
CREATE OR REPLACE FUNCTION public.user_has_permission(permission_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_role_val app_role;
BEGIN
  -- Get user role
  SELECT role INTO user_role_val
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Admin has all permissions
  IF user_role_val = 'admin' THEN
    RETURN true;
  END IF;
  
  -- Add more granular permissions as needed
  -- For now, only admin has permissions
  RETURN false;
END;
$function$;

-- Function 5: check_auth_rate_limit
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

-- Function 6: Enhanced audit trigger
CREATE OR REPLACE FUNCTION public.enhanced_audit_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_role app_role;
BEGIN
  -- Get current user role
  SELECT role INTO current_user_role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Log all operations on sensitive tables
  IF TG_TABLE_NAME IN ('user_roles', 'security_audit_log', 'clients', 'products', 'services') THEN
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
      TG_OP || '_' || TG_TABLE_NAME,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
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
  -- Check for suspicious script tags, event handlers, and javascript protocols
  IF content_html ~* '<script[^>]*>' 
     OR content_html ~* 'javascript:' 
     OR content_html ~* 'vbscript:' 
     OR content_html ~* 'on\w+\s*=' 
     OR content_html ~* 'expression\s*\(' 
     OR content_html ~* '<iframe[^>]*src\s*=\s*["\']?(?!https?://)[^"\']*["\']?' THEN
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

-- Add comment for security documentation
COMMENT ON FUNCTION public.validate_html_content(text) IS 'Validates HTML content to prevent XSS attacks by detecting suspicious patterns including script tags, event handlers, and javascript protocols.';
COMMENT ON FUNCTION public.validate_content_security() IS 'Trigger function that validates content security for CMS inputs across content tables.';
COMMENT ON FUNCTION public.enhanced_audit_trigger() IS 'Enhanced audit logging with proper search_path security settings.';
COMMENT ON FUNCTION public.check_auth_rate_limit(inet) IS 'Rate limiting function for authentication attempts with secure search_path.';