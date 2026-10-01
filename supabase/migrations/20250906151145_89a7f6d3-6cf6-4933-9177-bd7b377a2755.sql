-- Fix database functions to remove testimonial references

-- Drop and recreate get_all_clients_with_translation function without testimonial
DROP FUNCTION IF EXISTS public.get_all_clients_with_translation(character varying);

CREATE OR REPLACE FUNCTION public.get_all_clients_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, slug text, name text, logo text, description text, background_image text, website text, featured boolean, product_category text, product_categories text[], case_study_challenge text, case_study_solution text, case_study_team_size text, case_study_timeline text, case_study_images jsonb, case_study_videos jsonb, case_study_results jsonb, industry text, country text, display_order integer, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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

-- Create get_client_with_translation function if it doesn't exist (without testimonial)
DROP FUNCTION IF EXISTS public.get_client_with_translation(uuid, character varying);

CREATE OR REPLACE FUNCTION public.get_client_with_translation(p_client_id uuid, p_language_code character varying)
 RETURNS TABLE(id uuid, slug text, name text, logo text, description text, background_image text, website text, featured boolean, product_category text, product_categories text[], case_study_challenge text, case_study_solution text, case_study_team_size text, case_study_timeline text, case_study_images jsonb, case_study_videos jsonb, case_study_results jsonb, industry text, country text, display_order integer, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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
  WHERE c.id = p_client_id;
END;
$function$;

-- Create get_client_by_slug_with_translation function if it doesn't exist (without testimonial)
DROP FUNCTION IF EXISTS public.get_client_by_slug_with_translation(text, character varying);

CREATE OR REPLACE FUNCTION public.get_client_by_slug_with_translation(p_slug text, p_language_code character varying)
 RETURNS TABLE(id uuid, slug text, name text, logo text, description text, background_image text, website text, featured boolean, product_category text, product_categories text[], case_study_challenge text, case_study_solution text, case_study_team_size text, case_study_timeline text, case_study_images jsonb, case_study_videos jsonb, case_study_results jsonb, industry text, country text, display_order integer, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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
  WHERE c.slug = p_slug;
END;
$function$;