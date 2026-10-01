-- COMPREHENSIVE SEARCH_PATH FIX FOR ALL FUNCTIONS
-- Fix all remaining functions that don't have proper search_path settings

-- Update all the translation functions with search_path
CREATE OR REPLACE FUNCTION public.get_all_company_values_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, title text, description text, icon_name text, display_order integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.get_all_clients_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, name text, logo text, description text, testimonial text, background_image text, website text, featured boolean, product_category text, case_study_challenge text, case_study_solution text, case_study_team_size text, case_study_timeline text, case_study_images jsonb, case_study_videos jsonb, case_study_results jsonb, industry text, country text, display_order integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
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

-- Fix the update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Enable RLS on any remaining unprotected tables
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Check for tables in public schema without RLS enabled
    FOR r IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN (
            SELECT tablename 
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE c.relrowsecurity = true
            AND t.schemaname = 'public'
        )
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
        
        -- Create basic policies for each table
        EXECUTE format('
            CREATE POLICY "Public read access to %I" 
            ON public.%I 
            FOR SELECT 
            USING (true)', r.tablename, r.tablename);
            
        EXECUTE format('
            CREATE POLICY "Only admins can modify %I" 
            ON public.%I 
            FOR ALL 
            USING (has_role(auth.uid(), ''admin''::app_role))
            WITH CHECK (has_role(auth.uid(), ''admin''::app_role))', r.tablename, r.tablename);
    END LOOP;
END $$;

-- Drop any security definer views that might exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
        AND definition LIKE '%SECURITY DEFINER%'
    LOOP
        EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', r.viewname);
    END LOOP;
END $$;

-- Create a secure admin setup function
CREATE OR REPLACE FUNCTION public.setup_initial_admin(admin_email text, admin_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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