-- Fix security warnings by adding SET search_path to all RPC functions
-- This addresses the 28 security warnings identified in the linter

-- Fix get_all_clients_with_translation function
CREATE OR REPLACE FUNCTION public.get_all_clients_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, slug text, name text, logo text, description text, testimonial text, background_image text, website text, featured boolean, product_category text, product_categories text[], case_study_challenge text, case_study_solution text, case_study_team_size text, case_study_timeline text, case_study_images jsonb, case_study_videos jsonb, case_study_results jsonb, industry text, country text, display_order integer, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  RETURN QUERY
  SELECT 
    c.id,
    c.slug,
    COALESCE(ct.name, 'Unnamed Client') AS name,
    c.logo,
    COALESCE(ct.description, '') AS description,
    COALESCE(ct.testimonial, '') AS testimonial,
    c.background_image,
    c.website,
    c.featured,
    c.product_category,
    get_client_categories(c.id) AS product_categories,
    COALESCE(ct.case_study_challenge, '') AS case_study_challenge,
    COALESCE(ct.case_study_solution, '') AS case_study_solution,
    c.case_study_team_size,
    c.case_study_timeline,
    COALESCE(c.case_study_images, '[]'::jsonb) AS case_study_images,
    COALESCE(c.case_study_videos, '[]'::jsonb) AS case_study_videos,
    COALESCE(c.case_study_results, '[]'::jsonb) AS case_study_results,
    c.industry,
    c.country,
    COALESCE(c.display_order, 0) AS display_order,
    c.created_at,
    c.updated_at
  FROM public.clients c
  LEFT JOIN public.clients_translations ct ON c.id = ct.client_id AND ct.language_id = v_language_id
  ORDER BY c.display_order ASC NULLS LAST, ct.name ASC NULLS LAST;
END;
$function$;

-- Create the missing team members function
CREATE OR REPLACE FUNCTION public.get_all_team_members_with_translations(p_language_code character varying)
 RETURNS TABLE(id uuid, slug text, name text, position text, bio text, image_url text, linkedin_url text, email text, phone text, display_order integer, is_leadership boolean, department text, join_date date, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    tm.id,
    tm.slug,
    COALESCE(
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.name FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      'Unnamed Member'
    ) AS name,
    COALESCE(
      (SELECT tmt.position FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.position FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS position,
    COALESCE(
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_language_id),
      (SELECT tmt.bio FROM public.team_member_translations tmt 
       WHERE tmt.team_member_id = tm.id AND tmt.language_id = v_default_language_id),
      ''
    ) AS bio,
    tm.image_url,
    tm.linkedin_url,
    tm.email,
    tm.phone,
    COALESCE(tm.display_order, 0) AS display_order,
    COALESCE(tm.is_leadership, false) AS is_leadership,
    tm.department,
    tm.join_date,
    tm.created_at,
    tm.updated_at
  FROM public.team_members tm
  ORDER BY tm.display_order ASC NULLS LAST;
END;
$function$;

-- Add missing foreign key constraints for data consistency
-- Client categories foreign key
ALTER TABLE public.client_categories 
ADD CONSTRAINT fk_client_categories_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Client translations foreign key
ALTER TABLE public.clients_translations 
ADD CONSTRAINT fk_clients_translations_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- Team member translations foreign key
ALTER TABLE public.team_member_translations 
ADD CONSTRAINT fk_team_member_translations_team_member_id 
FOREIGN KEY (team_member_id) REFERENCES public.team_members(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_translations_client_id ON public.clients_translations(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_translations_language_id ON public.clients_translations(language_id);
CREATE INDEX IF NOT EXISTS idx_client_categories_client_id ON public.client_categories(client_id);
CREATE INDEX IF NOT EXISTS idx_team_member_translations_team_member_id ON public.team_member_translations(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_member_translations_language_id ON public.team_member_translations(language_id);