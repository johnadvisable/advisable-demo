-- Update hero content with correct Bunny CDN video URLs
UPDATE public.hero_content 
SET 
    bunny_video_desktop = 'https://iframe.mediadelivery.net/play/485602/ec6f582f-3525-41a0-b0db-73353848636b',
    bunny_video_mobile = 'https://iframe.mediadelivery.net/play/485602/02b3761e-6727-4070-8190-396127ed8b0d'
WHERE page_name = 'index';