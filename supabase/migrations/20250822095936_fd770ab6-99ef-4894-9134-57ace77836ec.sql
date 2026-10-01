-- CRITICAL SECURITY FIXES - Phase 1: Database Function Security
-- Update all database functions to include proper search_path for security

-- Fix get_all_company_values_with_translation function
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

-- Fix get_all_clients_with_translation function
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

-- Fix get_all_metrics_with_translation function
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

-- Fix get_all_team_members_with_translation function
CREATE OR REPLACE FUNCTION public.get_all_team_members_with_translation(p_language_code character varying)
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
    tm.id,
    COALESCE(
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.name
    ) AS name,
    COALESCE(
      (SELECT tmt.job_title FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.position
    ) AS job_position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.bio
    ) AS bio,
    COALESCE(
      (SELECT tmt.role_description FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      tm.role_description
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
  ORDER BY tm.display_order, tm.name;
END;
$function$;

-- Create secure admin setup function with proper validation
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

-- Add security monitoring trigger for sensitive table access
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

-- Apply security monitoring to sensitive tables
DROP TRIGGER IF EXISTS security_monitor_user_roles ON public.user_roles;
CREATE TRIGGER security_monitor_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.security_monitor_trigger();

-- Add password strength validation function
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