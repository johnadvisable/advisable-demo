-- Update hero_content table with specific video IDs for hero section
UPDATE public.hero_content 
SET 
  desktop_video_id = 'ec6f582f-3525-41a0-b0db-73353848636b',
  mobile_video_id = '02b3761e-6727-4070-8190-396127ed8b0d',
  background_type = 'bunny_video'
WHERE page_name = 'index';