-- Add some basic hero content translations for the index page
DO $$
DECLARE
    v_hero_content_id UUID;
    v_en_language_id INTEGER;
    v_el_language_id INTEGER;
BEGIN
    -- Get the hero content ID for index page
    SELECT id INTO v_hero_content_id FROM public.hero_content WHERE page_name = 'index';
    
    -- Get language IDs
    SELECT id INTO v_en_language_id FROM public.languages WHERE code = 'en';
    SELECT id INTO v_el_language_id FROM public.languages WHERE code = 'el';
    
    -- Insert English translations
    INSERT INTO public.hero_content_translations (hero_content_id, language_id, heading, subheading, cta_text)
    VALUES (
        v_hero_content_id, 
        v_en_language_id, 
        'Future-Proof Your Business',
        'State-of-the-art digital solutions for modern businesses, driving growth through innovation and expertise',
        'Get Started'
    )
    ON CONFLICT (hero_content_id, language_id) DO UPDATE SET
        heading = EXCLUDED.heading,
        subheading = EXCLUDED.subheading,
        cta_text = EXCLUDED.cta_text;
    
    -- Insert Greek translations (if Greek language exists)
    IF v_el_language_id IS NOT NULL THEN
        INSERT INTO public.hero_content_translations (hero_content_id, language_id, heading, subheading, cta_text)
        VALUES (
            v_hero_content_id, 
            v_el_language_id, 
            'Ασφαλίστε το Μέλλον της Επιχείρησής σας',
            'Τελευταίας τεχνολογίας ψηφιακές λύσεις για σύγχρονες επιχειρήσεις, προωθώντας την ανάπτυξη μέσω καινοτομίας και εμπειρίας',
            'Ξεκινήστε'
        )
        ON CONFLICT (hero_content_id, language_id) DO UPDATE SET
            heading = EXCLUDED.heading,
            subheading = EXCLUDED.subheading,
            cta_text = EXCLUDED.cta_text;
    END IF;
END $$;