-- Insert default credentials if they don't exist
DO $$
DECLARE
    credential_count INTEGER;
    english_lang_id INTEGER;
    awards_credential_id UUID;
    elevate_credential_id UUID;
    google_credential_id UUID;
BEGIN
    -- Check if credentials already exist
    SELECT COUNT(*) INTO credential_count FROM credentials;
    
    -- Get English language ID
    SELECT id INTO english_lang_id FROM languages WHERE code = 'en' LIMIT 1;
    
    -- Only insert if no credentials exist
    IF credential_count = 0 THEN
        -- Insert Awards credential
        INSERT INTO credentials (icon_name, display_order, image_url)
        VALUES ('Award', 1, 'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/credential-images/awards-badge.png')
        RETURNING id INTO awards_credential_id;
        
        INSERT INTO credential_translations (credential_id, language_id, title, description)
        VALUES (awards_credential_id, english_lang_id, 'Over 50 times awarded', 'Recognized for excellence in digital solutions and innovation');
        
        -- Insert Elevate Greece credential
        INSERT INTO credentials (icon_name, display_order, image_url)
        VALUES ('CheckCircle', 2, 'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/credential-images/elevate-greece.png')
        RETURNING id INTO elevate_credential_id;
        
        INSERT INTO credential_translations (credential_id, language_id, title, description)
        VALUES (elevate_credential_id, english_lang_id, 'Member of Elevate Greece', 'Part of Greece''s national startup ecosystem initiative');
        
        -- Insert Google Partner credential
        INSERT INTO credentials (icon_name, display_order, image_url)
        VALUES ('Medal', 3, 'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/credential-images/google-partner.png')
        RETURNING id INTO google_credential_id;
        
        INSERT INTO credential_translations (credential_id, language_id, title, description)
        VALUES (google_credential_id, english_lang_id, 'Google Premier Partner', 'Certified Google Premier Partner for 2025');
    END IF;
END $$;