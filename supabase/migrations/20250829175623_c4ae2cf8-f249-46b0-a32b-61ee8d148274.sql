-- First, check if columns exist and add them if needed
DO $$
BEGIN
    -- Add bunny_video_desktop column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_content' AND column_name = 'bunny_video_desktop') THEN
        ALTER TABLE public.hero_content ADD COLUMN bunny_video_desktop TEXT;
    END IF;
    
    -- Add bunny_video_mobile column if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hero_content' AND column_name = 'bunny_video_mobile') THEN
        ALTER TABLE public.hero_content ADD COLUMN bunny_video_mobile TEXT;
    END IF;
END $$;

-- Update hero content with correct Bunny CDN video URLs
UPDATE public.hero_content 
SET 
    bunny_video_desktop = 'https://iframe.mediadelivery.net/play/485602/ec6f582f-3525-41a0-b0db-73353848636b',
    bunny_video_mobile = 'https://iframe.mediadelivery.net/play/485602/02b3761e-6727-4070-8190-396127ed8b0d'
WHERE page_name = 'index';