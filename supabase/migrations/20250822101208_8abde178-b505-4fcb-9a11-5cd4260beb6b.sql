-- Security Fix 1: Update all database functions to include proper search_path
-- This prevents SQL injection attacks through search_path manipulation

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

-- Fix setup_initial_admin function
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

-- Fix create_initial_admin_role function
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

-- Fix validate_password_strength function
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

-- Fix check_auth_rate_limit function
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

-- Security Fix 2: Create enhanced password validation trigger
CREATE OR REPLACE FUNCTION public.validate_user_password()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- This would be triggered on auth.users but we can't modify auth schema
  -- Instead, we'll validate in the application layer
  RETURN NEW;
END;
$function$;

-- Security Fix 3: Enhanced audit logging for admin actions
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

-- Security Fix 4: Create secure admin validation function
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

-- Security Fix 5: Create function to securely check user permissions
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