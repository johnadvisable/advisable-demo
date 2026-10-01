-- Simple approach to swap service category IDs using temporary UUID
-- This avoids foreign key constraints and null column issues

DO $$
DECLARE
    temp_uuid uuid := gen_random_uuid();
    digital_agency_current_id uuid;
    venture_studio_current_id uuid;
BEGIN
    -- Get current IDs
    SELECT id INTO digital_agency_current_id FROM public.service_categories WHERE slug = 'digital-agency';
    SELECT id INTO venture_studio_current_id FROM public.service_categories WHERE slug = 'venture-studio';
    
    -- Step 1: Update Digital Agency to temporary UUID
    UPDATE public.service_categories SET id = temp_uuid WHERE slug = 'digital-agency';
    UPDATE public.service_category_translations SET category_id = temp_uuid WHERE category_id = digital_agency_current_id;
    UPDATE public.services SET category_id = temp_uuid WHERE category_id = digital_agency_current_id;
    
    -- Step 2: Update Venture Studio to Digital Agency's target ID (164b114a-ccb9-4900-8777-70fb9dcb5108)
    UPDATE public.service_categories SET id = '164b114a-ccb9-4900-8777-70fb9dcb5108' WHERE slug = 'venture-studio';
    UPDATE public.service_category_translations SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108' WHERE category_id = venture_studio_current_id;
    UPDATE public.services SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108' WHERE category_id = venture_studio_current_id;
    
    -- Step 3: Update Digital Agency from temporary to Venture Studio's target ID (54d5b665-a721-4b1d-8c3f-517c402125de)
    UPDATE public.service_categories SET id = '54d5b665-a721-4b1d-8c3f-517c402125de' WHERE id = temp_uuid;
    UPDATE public.service_category_translations SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de' WHERE category_id = temp_uuid;
    UPDATE public.services SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de' WHERE category_id = temp_uuid;
END $$;