-- Create proper service categories for Digital Agency Services and Venture Studio Services
DELETE FROM public.service_categories WHERE slug IN ('digital-agency', 'venture-studio');

INSERT INTO public.service_categories (id, name, slug, description) VALUES 
(gen_random_uuid(), 'Digital Agency Services', 'digital-agency', 'Full-service digital agency solutions'),
(gen_random_uuid(), 'Venture Studio Services', 'venture-studio', 'Venture studio and startup incubation services');

-- Get the English language ID
DO $$
DECLARE
    digital_agency_id UUID;
    venture_studio_id UUID;
    english_lang_id INTEGER;
BEGIN
    -- Get language ID for English
    SELECT id INTO english_lang_id FROM public.languages WHERE code = 'en';
    
    -- Get category IDs
    SELECT id INTO digital_agency_id FROM public.service_categories WHERE slug = 'digital-agency';
    SELECT id INTO venture_studio_id FROM public.service_categories WHERE slug = 'venture-studio';
    
    -- Insert translations for service categories
    INSERT INTO public.service_category_translations (category_id, language_id, name, description) VALUES
    (digital_agency_id, english_lang_id, 'Digital Agency Services', 'Full-service digital agency solutions'),
    (venture_studio_id, english_lang_id, 'Venture Studio Services', 'Venture studio and startup incubation services');
    
    -- Update existing services to use proper categories
    UPDATE public.services 
    SET category_id = digital_agency_id 
    WHERE category_id IS NOT NULL AND category_id != digital_agency_id AND category_id != venture_studio_id;
END $$;