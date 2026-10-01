-- ==============================================================================
-- Phase 1: Database Structure Canonicalization & RLS Policy Cleanup
-- ==============================================================================

-- Fix ambiguous column reference in company facts function
DROP FUNCTION IF EXISTS public.get_all_company_facts_with_translation(character varying);
CREATE OR REPLACE FUNCTION public.get_all_company_facts_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  key text, 
  value text, 
  icon_name text, 
  display_order integer, 
  label text, 
  description text
)
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
    cf.id,
    cf.key,
    cf.value,
    cf.icon_name,
    cf.display_order,
    COALESCE(cft.label, cf.key) as label,
    COALESCE(cft.description, '') as description
  FROM public.company_facts cf
  LEFT JOIN public.company_fact_translations cft ON cf.id = cft.company_fact_id AND cft.language_id = v_language_id
  ORDER BY cf.display_order;
END;
$function$;

-- ==============================================================================
-- Complete clients table translation migration
-- ==============================================================================

-- First, migrate existing data to translations table for all languages
DO $$
DECLARE
  client_rec RECORD;
  lang_rec RECORD;
BEGIN
  -- For each client
  FOR client_rec IN SELECT id, name, description, testimonial, case_study_challenge, case_study_solution FROM public.clients LOOP
    -- For each active language
    FOR lang_rec IN SELECT id, code FROM public.languages WHERE is_active = TRUE LOOP
      -- Insert translation if it doesn't exist
      INSERT INTO public.clients_translations (
        client_id, 
        language_id, 
        name, 
        description, 
        testimonial, 
        case_study_challenge, 
        case_study_solution
      ) VALUES (
        client_rec.id,
        lang_rec.id,
        client_rec.name,
        client_rec.description,
        client_rec.testimonial,
        client_rec.case_study_challenge,
        client_rec.case_study_solution
      )
      ON CONFLICT (client_id, language_id) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Remove translatable columns from clients table
ALTER TABLE public.clients DROP COLUMN IF EXISTS name;
ALTER TABLE public.clients DROP COLUMN IF EXISTS description;
ALTER TABLE public.clients DROP COLUMN IF EXISTS testimonial;
ALTER TABLE public.clients DROP COLUMN IF EXISTS case_study_challenge;
ALTER TABLE public.clients DROP COLUMN IF EXISTS case_study_solution;

-- ==============================================================================
-- Complete partners table translation migration  
-- ==============================================================================

-- Migrate existing data to translations table for all languages
DO $$
DECLARE
  partner_rec RECORD;
  lang_rec RECORD;
BEGIN
  -- For each partner
  FOR partner_rec IN SELECT id, name FROM public.partners WHERE name IS NOT NULL LOOP
    -- For each active language
    FOR lang_rec IN SELECT id, code FROM public.languages WHERE is_active = TRUE LOOP
      -- Insert translation if it doesn't exist
      INSERT INTO public.partner_translations (
        partner_id, 
        language_id, 
        name
      ) VALUES (
        partner_rec.id,
        lang_rec.id,
        partner_rec.name
      )
      ON CONFLICT (partner_id, language_id) DO UPDATE SET name = EXCLUDED.name;
    END LOOP;
  END LOOP;
END $$;

-- Remove translatable columns from partners table
ALTER TABLE public.partners DROP COLUMN IF EXISTS name;

-- ==============================================================================
-- Update all database functions to include proper search_path
-- ==============================================================================

-- Update get_client_with_translation function
DROP FUNCTION IF EXISTS public.get_client_with_translation(uuid, character varying);
CREATE OR REPLACE FUNCTION public.get_client_with_translation(p_client_id uuid, p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  name text, 
  logo text, 
  description text, 
  testimonial text, 
  background_image text, 
  website text, 
  featured boolean, 
  product_category text, 
  product_categories text[], 
  case_study_challenge text, 
  case_study_solution text, 
  case_study_team_size text, 
  case_study_timeline text, 
  case_study_images jsonb, 
  case_study_videos jsonb, 
  case_study_results jsonb, 
  industry text, 
  country text, 
  display_order integer
)
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
    c.case_study_images,
    c.case_study_videos,
    c.case_study_results,
    c.industry,
    c.country,
    c.display_order
  FROM public.clients c
  LEFT JOIN public.clients_translations ct ON c.id = ct.client_id AND ct.language_id = v_language_id
  WHERE c.id = p_client_id;
END;
$function$;

-- Update get_all_clients_with_translation function
DROP FUNCTION IF EXISTS public.get_all_clients_with_translation(character varying);
CREATE OR REPLACE FUNCTION public.get_all_clients_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid, 
  name text, 
  logo text, 
  description text, 
  testimonial text, 
  background_image text, 
  website text, 
  featured boolean, 
  product_category text, 
  product_categories text[], 
  case_study_challenge text, 
  case_study_solution text, 
  case_study_team_size text, 
  case_study_timeline text, 
  case_study_images jsonb, 
  case_study_videos jsonb, 
  case_study_results jsonb, 
  industry text, 
  country text, 
  display_order integer
)
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
    c.case_study_images,
    c.case_study_videos,
    c.case_study_results,
    c.industry,
    c.country,
    c.display_order
  FROM public.clients c
  LEFT JOIN public.clients_translations ct ON c.id = ct.client_id AND ct.language_id = v_language_id
  ORDER BY c.display_order, ct.name;
END;
$function$;

-- Create partner translation functions
DROP FUNCTION IF EXISTS public.get_partner_with_translation(uuid, character varying);
CREATE OR REPLACE FUNCTION public.get_partner_with_translation(p_partner_id uuid, p_language_code character varying)
RETURNS TABLE(
  id uuid,
  name text,
  description text,
  long_description text,
  use_case text,
  logo text,
  category text,
  has_detail_page boolean,
  featured boolean,
  benefits text[],
  integration_steps text[],
  contact_person text,
  partnership_type text,
  display_order integer
)
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
    p.id,
    COALESCE(pt.name, 'Unnamed Partner') AS name,
    COALESCE(pt.description, '') AS description,
    COALESCE(pt.long_description, '') AS long_description,
    COALESCE(pt.use_case, '') AS use_case,
    p.logo,
    p.category,
    p.has_detail_page,
    p.featured,
    p.benefits,
    p.integration_steps,
    p.contact_person,
    p.partnership_type,
    p.display_order
  FROM public.partners p
  LEFT JOIN public.partner_translations pt ON p.id = pt.partner_id AND pt.language_id = v_language_id
  WHERE p.id = p_partner_id;
END;
$function$;

DROP FUNCTION IF EXISTS public.get_all_partners_with_translation(character varying);
CREATE OR REPLACE FUNCTION public.get_all_partners_with_translation(p_language_code character varying)
RETURNS TABLE(
  id uuid,
  name text,
  description text,
  long_description text,
  use_case text,
  logo text,
  category text,
  has_detail_page boolean,
  featured boolean,
  benefits text[],
  integration_steps text[],
  contact_person text,
  partnership_type text,
  display_order integer
)
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
    p.id,
    COALESCE(pt.name, 'Unnamed Partner') AS name,
    COALESCE(pt.description, '') AS description,
    COALESCE(pt.long_description, '') AS long_description,
    COALESCE(pt.use_case, '') AS use_case,
    p.logo,
    p.category,
    p.has_detail_page,
    p.featured,
    p.benefits,
    p.integration_steps,
    p.contact_person,
    p.partnership_type,
    p.display_order
  FROM public.partners p
  LEFT JOIN public.partner_translations pt ON p.id = pt.partner_id AND pt.language_id = v_language_id
  ORDER BY p.display_order, pt.name;
END;
$function$;

-- ==============================================================================
-- Clean up RLS policies - Remove duplicates and conflicts
-- ==============================================================================

-- Clean up clients table policies
DROP POLICY IF EXISTS "Authenticated users can select clients" ON public.clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.metrics;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.metrics;
DROP POLICY IF EXISTS "Authenticated users can select news_items" ON public.news_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.news_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.news_items;
DROP POLICY IF EXISTS "Authenticated users can select hero_content" ON public.hero_content;
DROP POLICY IF EXISTS "Authenticated users can select credentials" ON public.credentials;
DROP POLICY IF EXISTS "Authenticated users can select partners" ON public.partners;
DROP POLICY IF EXISTS "Authenticated users can select company_info" ON public.company_info;
DROP POLICY IF EXISTS "Allow public read access to blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can select blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can select blog_posts" ON public.blog_posts;

-- Standardize admin policies
CREATE POLICY "Admin full access to clients" ON public.clients
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin full access to partners" ON public.partners  
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ==============================================================================
-- Add search_path to remaining functions
-- ==============================================================================

-- Update get_client_categories function
DROP FUNCTION IF EXISTS public.get_client_categories(uuid);
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

-- Update get_partner_categories function  
DROP FUNCTION IF EXISTS public.get_partner_categories(text);
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
    WHERE partner_id = p_partner_id::uuid
  );
END;
$function$;