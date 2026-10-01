-- Fix all remaining database function security issues by adding SET search_path

-- Update all functions with search_path security definer settings
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

CREATE OR REPLACE FUNCTION public.create_initial_admin_role(admin_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    existing_admins int;
BEGIN
    -- Check if any admins already exist
    SELECT COUNT(*) INTO existing_admins
    FROM public.user_roles
    WHERE role = 'admin'::app_role;
    
    -- Only allow if no admins exist and user_id is valid
    IF existing_admins > 0 THEN
        RAISE EXCEPTION 'Admin users already exist. Cannot create initial admin.';
    END IF;
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Valid user ID is required.';
    END IF;
    
    -- Create admin role for the user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Minimum 12 characters
  IF LENGTH(password) < 12 THEN
    RETURN false;
  END IF;
  
  -- Must contain lowercase
  IF password !~ '[a-z]' THEN
    RETURN false;
  END IF;
  
  -- Must contain uppercase
  IF password !~ '[A-Z]' THEN
    RETURN false;
  END IF;
  
  -- Must contain numbers
  IF password !~ '[0-9]' THEN
    RETURN false;
  END IF;
  
  -- Must contain special characters
  IF password !~ '[^a-zA-Z0-9]' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

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