-- Ensure all featured partners have translations for all active languages
-- This creates missing translations using the partner's name as fallback

DO $$
DECLARE
  partner_record RECORD;
  lang_record RECORD;
  existing_translation_record RECORD;
BEGIN
  -- Loop through all featured partners
  FOR partner_record IN 
    SELECT id, name FROM public.partners WHERE featured = true
  LOOP
    -- Get an existing translation to use as template
    SELECT name, description, long_description, use_case 
    INTO existing_translation_record
    FROM public.partner_translations 
    WHERE partner_id = partner_record.id 
    LIMIT 1;
    
    -- Loop through all active languages
    FOR lang_record IN 
      SELECT id, code FROM public.languages WHERE is_active = true
    LOOP
      -- Check if translation exists for this partner and language
      IF NOT EXISTS (
        SELECT 1 FROM public.partner_translations 
        WHERE partner_id = partner_record.id 
        AND language_id = lang_record.id
      ) THEN
        -- Insert missing translation using existing translation or defaults
        INSERT INTO public.partner_translations (
          partner_id, 
          language_id, 
          name, 
          description, 
          long_description, 
          use_case
        ) VALUES (
          partner_record.id,
          lang_record.id,
          COALESCE(existing_translation_record.name, partner_record.name, 'Partner Name'),
          COALESCE(existing_translation_record.description, 'Partner integration solution'),
          COALESCE(existing_translation_record.long_description, 'Detailed partner information and benefits'),
          COALESCE(existing_translation_record.use_case, 'Integration and partnership use case')
        );
        
        RAISE NOTICE 'Created translation for partner % in language %', 
          COALESCE(partner_record.name, 'Unknown'), lang_record.code;
      END IF;
    END LOOP;
  END LOOP;
END $$;