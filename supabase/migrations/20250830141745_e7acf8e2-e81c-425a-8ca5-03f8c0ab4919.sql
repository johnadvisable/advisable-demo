-- Update hero content with direct video URLs instead of iframe URLs
UPDATE public.hero_content 
SET 
  bunny_video_desktop = 'https://vz-f673989f-138.b-cdn.net/ec6f582f-3525-41a0-b0db-73353848636b/play_720p.mp4',
  bunny_video_mobile = 'https://vz-f673989f-138.b-cdn.net/02b3761e-6727-4070-8190-396127ed8b0d/play_720p.mp4'
WHERE page_name = 'index';