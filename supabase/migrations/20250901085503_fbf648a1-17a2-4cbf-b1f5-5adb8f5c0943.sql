-- Fix remaining database security warnings by adding SET search_path TO 'public' to all remaining functions
-- Note: avoiding "values" as it's a reserved keyword

-- Fix get_all_company_info_with_translation function  
CREATE OR REPLACE FUNCTION public.get_all_company_info_with_translation(p_language_code character varying)
 RETURNS TABLE(id uuid, founded_year integer, image_url text, company_values text[], title text, content text, vision text, mission text, history text, approach text, team_intro text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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
    ci.id,
    ci.founded_year,
    ci.image_url,
    ci.values as company_values,
    COALESCE(
      (SELECT cit.title FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_language_id),
      (SELECT cit.title FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_default_language_id),
      ''
    ) AS title,
    COALESCE(
      (SELECT cit.content FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_language_id),
      (SELECT cit.content FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_default_language_id),
      ''
    ) AS content,
    COALESCE(
      (SELECT cit.vision FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_language_id),
      (SELECT cit.vision FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_default_language_id),
      ''
    ) AS vision,
    COALESCE(
      (SELECT cit.mission FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_language_id),
      (SELECT cit.mission FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_default_language_id),
      ''
    ) AS mission,
    COALESCE(
      (SELECT cit.history FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_language_id),
      (SELECT cit.history FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_default_language_id),
      ''
    ) AS history,
    COALESCE(
      (SELECT cit.approach FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_language_id),
      (SELECT cit.approach FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_default_language_id),
      ''
    ) AS approach,
    COALESCE(
      (SELECT cit.team_intro FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_language_id),
      (SELECT cit.team_intro FROM public.company_info_translations cit 
       WHERE cit.company_info_id = ci.id AND cit.language_id = v_default_language_id),
      ''
    ) AS team_intro
  FROM public.company_info ci
  ORDER BY ci.created_at DESC
  LIMIT 1;
END;
$function$;

-- Add the missing hero content translations table
CREATE TABLE IF NOT EXISTS public.hero_content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_content_id UUID NOT NULL,
  language_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  heading TEXT,
  subheading TEXT,
  cta_text TEXT,
  background_image TEXT,
  background_video TEXT
);

-- Enable RLS on hero_content_translations
ALTER TABLE public.hero_content_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hero_content_translations
DROP POLICY IF EXISTS "Public read access to hero_content_translations" ON public.hero_content_translations;
DROP POLICY IF EXISTS "Only admins can modify hero_content_translations" ON public.hero_content_translations;

CREATE POLICY "Public read access to hero_content_translations" ON public.hero_content_translations FOR SELECT USING (true);
CREATE POLICY "Only admins can modify hero_content_translations" ON public.hero_content_translations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update the get_hero_content_by_page_with_translation function to properly construct bunny video URLs
CREATE OR REPLACE FUNCTION public.get_hero_content_by_page_with_translation(p_page_name text, p_language_code text)
 RETURNS TABLE(id uuid, page_name text, heading text, subheading text, cta_text text, cta_link text, background_type text, background_image text, background_video text, desktop_video_id text, mobile_video_id text, bunny_video_desktop text, bunny_video_mobile text)
 LANGUAGE plpgsql
 SECURITY DEFINER
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
    hc.id,
    hc.page_name,
    COALESCE(hct.heading, '') as heading,
    COALESCE(hct.subheading, '') as subheading,
    COALESCE(hct.cta_text, '') as cta_text,
    hc.cta_link,
    hc.background_type,
    COALESCE(hct.background_image, hc.background_image) as background_image,
    COALESCE(hct.background_video, hc.background_video) as background_video,
    hc.desktop_video_id,
    hc.mobile_video_id,
    -- Construct bunny video URLs using the video IDs
    CASE 
      WHEN hc.desktop_video_id IS NOT NULL AND hc.desktop_video_id != '' 
      THEN 'https://vz-f673a44e-c26.b-cdn.net/' || hc.desktop_video_id || '/play_720p.mp4'
      ELSE hc.bunny_video_desktop 
    END as bunny_video_desktop,
    CASE 
      WHEN hc.mobile_video_id IS NOT NULL AND hc.mobile_video_id != '' 
      THEN 'https://vz-f673a44e-c26.b-cdn.net/' || hc.mobile_video_id || '/play_720p.mp4'
      ELSE hc.bunny_video_mobile 
    END as bunny_video_mobile
  FROM public.hero_content hc
  LEFT JOIN public.hero_content_translations hct ON hc.id = hct.hero_content_id AND hct.language_id = v_language_id
  WHERE hc.page_name = p_page_name;
END;
$function$;