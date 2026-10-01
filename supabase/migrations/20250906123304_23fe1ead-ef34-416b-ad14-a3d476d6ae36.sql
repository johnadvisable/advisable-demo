-- Disable foreign key constraints temporarily and swap IDs
-- This approach avoids constraint violations during the swap

DO $$
DECLARE
    temp_uuid uuid := gen_random_uuid();
BEGIN
    -- Temporarily disable foreign key constraint
    ALTER TABLE public.service_category_translations DROP CONSTRAINT IF EXISTS service_category_translations_category_id_fkey1;
    ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_category_id_fkey;
    
    -- Now we can safely update the IDs
    -- Step 1: Digital Agency to temp
    UPDATE public.service_categories SET id = temp_uuid WHERE slug = 'digital-agency';
    UPDATE public.service_category_translations SET category_id = temp_uuid WHERE category_id IN (
        SELECT id FROM public.service_categories WHERE slug = 'digital-agency' AND id != temp_uuid
    );
    UPDATE public.services SET category_id = temp_uuid WHERE category_id IN (
        SELECT id FROM public.service_categories WHERE slug = 'digital-agency' AND id != temp_uuid  
    );
    
    -- Step 2: Venture Studio to Digital Agency target ID
    UPDATE public.service_categories SET id = '164b114a-ccb9-4900-8777-70fb9dcb5108' WHERE slug = 'venture-studio';
    UPDATE public.service_category_translations 
    SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108' 
    WHERE category_id IN (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' AND id != '164b114a-ccb9-4900-8777-70fb9dcb5108');
    UPDATE public.services 
    SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
    WHERE category_id IN (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' AND id != '164b114a-ccb9-4900-8777-70fb9dcb5108');
    
    -- Step 3: Digital Agency from temp to Venture Studio target ID
    UPDATE public.service_categories SET id = '54d5b665-a721-4b1d-8c3f-517c402125de' WHERE id = temp_uuid;
    UPDATE public.service_category_translations SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de' WHERE category_id = temp_uuid;
    UPDATE public.services SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de' WHERE category_id = temp_uuid;
    
    -- Re-enable foreign key constraints
    ALTER TABLE public.service_category_translations 
    ADD CONSTRAINT service_category_translations_category_id_fkey1 
    FOREIGN KEY (category_id) REFERENCES public.service_categories(id);
    
    ALTER TABLE public.services 
    ADD CONSTRAINT services_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES public.service_categories(id);
END $$;