-- Update the get_hero_content_by_page_with_translation function to include new fields
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
    hc.bunny_video_desktop,
    hc.bunny_video_mobile
  FROM public.hero_content hc
  LEFT JOIN public.hero_content_translations hct ON hc.id = hct.hero_content_id AND hct.language_id = v_language_id
  WHERE hc.page_name = p_page_name;
END;
$function$;