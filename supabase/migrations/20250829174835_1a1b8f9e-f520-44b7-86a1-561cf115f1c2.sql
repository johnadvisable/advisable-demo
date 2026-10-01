-- Drop the conflicting function and recreate it with correct signature
DROP FUNCTION IF EXISTS public.get_hero_content_by_page_with_translation(text, character varying);
DROP FUNCTION IF EXISTS public.get_hero_content_by_page_with_translation(text, text);

-- Create the function with consistent parameter types
CREATE OR REPLACE FUNCTION public.get_hero_content_by_page_with_translation(p_page_name text, p_language_code text)
RETURNS TABLE(
  id uuid,
  page_name text,
  heading text,
  subheading text,
  cta_text text,
  cta_link text,
  background_type text,
  background_image text,
  background_video text,
  desktop_video_id text,
  mobile_video_id text
)
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
    hc.mobile_video_id
  FROM public.hero_content hc
  LEFT JOIN public.hero_content_translations hct ON hc.id = hct.hero_content_id AND hct.language_id = v_language_id
  WHERE hc.page_name = p_page_name;
END;
$function$;

-- Add unique constraint on page_name if it doesn't exist
ALTER TABLE public.hero_content ADD CONSTRAINT hero_content_page_name_unique UNIQUE (page_name);

-- Update existing index page record or insert new one
UPDATE public.hero_content 
SET 
  background_type = 'bunny_video',
  desktop_video_id = 'ec6f582f-3525-41a0-b0db-73353848636b',
  mobile_video_id = '02b3761e-6727-4070-8190-396127ed8b0d',
  cta_link = '#contact'
WHERE page_name = 'index';

-- If no record was updated, insert a new one
INSERT INTO public.hero_content (page_name, background_type, desktop_video_id, mobile_video_id, cta_link)
SELECT 'index', 'bunny_video', 'ec6f582f-3525-41a0-b0db-73353848636b', '02b3761e-6727-4070-8190-396127ed8b0d', '#contact'
WHERE NOT EXISTS (SELECT 1 FROM public.hero_content WHERE page_name = 'index');