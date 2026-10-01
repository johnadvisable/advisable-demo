-- Phase 2: Fix remaining security issues by adding SET search_path TO 'public' to all functions

-- Update all functions that don't have SET search_path specified
CREATE OR REPLACE FUNCTION public.get_partner_categories(p_partner_id text)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN ARRAY(
    SELECT category 
    FROM public.partner_partner_categories 
    WHERE partner_id = p_partner_id
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_client_categories(p_client_id uuid)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN ARRAY(
    SELECT category 
    FROM public.client_categories 
    WHERE client_id = p_client_id
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.setup_initial_admin(admin_email text, admin_password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    admin_user_id uuid;
    existing_admins int;
BEGIN
    -- Check if any admins already exist
    SELECT COUNT(*) INTO existing_admins
    FROM public.user_roles
    WHERE role = 'admin'::app_role;
    
    -- Only allow if no admins exist
    IF existing_admins > 0 THEN
        RAISE EXCEPTION 'Admin users already exist. Cannot create initial admin.';
    END IF;
    
    -- This would need to be called during initial setup
    -- The actual user creation should be done through Supabase Auth
    RAISE NOTICE 'Use Supabase Auth to create admin user with email: %', admin_email;
    
    RETURN true;
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
      COALESCE(
        (current_setting('request.headers', true)::json->>'user-agent'),
        'Unknown'
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

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

-- Continue updating remaining functions with SET search_path
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