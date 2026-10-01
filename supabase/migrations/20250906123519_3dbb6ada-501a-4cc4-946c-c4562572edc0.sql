-- Complete service category ID swap with proper constraint handling
DO $$
DECLARE
    temp_id_1 UUID := gen_random_uuid();
    temp_id_2 UUID := gen_random_uuid();
    digital_agency_old_id UUID := '54d5b665-a721-4b1d-8c3f-517c402125de';
    venture_studio_old_id UUID := '164b114a-ccb9-4900-8777-70fb9dcb5108';
    digital_agency_new_id UUID := '164b114a-ccb9-4900-8777-70fb9dcb5108';
    venture_studio_new_id UUID := '54d5b665-a721-4b1d-8c3f-517c402125de';
BEGIN
    -- Step 1: Update service categories to temporary IDs
    UPDATE public.service_categories SET id = temp_id_1 WHERE id = digital_agency_old_id;
    UPDATE public.service_categories SET id = temp_id_2 WHERE id = venture_studio_old_id;
    
    -- Step 2: Update all foreign key references to temporary IDs
    UPDATE public.services SET category_id = temp_id_1 WHERE category_id = digital_agency_old_id;
    UPDATE public.services SET category_id = temp_id_2 WHERE category_id = venture_studio_old_id;
    
    UPDATE public.service_category_translations SET category_id = temp_id_1 WHERE category_id = digital_agency_old_id;
    UPDATE public.service_category_translations SET category_id = temp_id_2 WHERE category_id = venture_studio_old_id;
    
    -- Step 3: Update categories to final correct IDs
    UPDATE public.service_categories SET id = digital_agency_new_id WHERE id = temp_id_1;
    UPDATE public.service_categories SET id = venture_studio_new_id WHERE id = temp_id_2;
    
    -- Step 4: Update all foreign key references to final IDs
    UPDATE public.services SET category_id = digital_agency_new_id WHERE category_id = temp_id_1;
    UPDATE public.services SET category_id = venture_studio_new_id WHERE category_id = temp_id_2;
    
    UPDATE public.service_category_translations SET category_id = digital_agency_new_id WHERE category_id = temp_id_1;
    UPDATE public.service_category_translations SET category_id = venture_studio_new_id WHERE category_id = temp_id_2;
    
END $$;