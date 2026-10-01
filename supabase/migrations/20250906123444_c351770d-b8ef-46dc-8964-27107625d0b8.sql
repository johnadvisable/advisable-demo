-- Final fix: Swap service category IDs using temporary IDs to avoid conflicts
-- Step 1: Update both categories to temporary IDs to avoid constraint violations
UPDATE public.service_categories 
SET id = gen_random_uuid() 
WHERE id = '54d5b665-a721-4b1d-8c3f-517c402125de';

UPDATE public.service_categories 
SET id = gen_random_uuid() 
WHERE id = '164b114a-ccb9-4900-8777-70fb9dcb5108';

-- Step 2: Get the temporary IDs and update to final correct IDs
UPDATE public.service_categories 
SET id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE slug = 'digital-agency';

UPDATE public.service_categories 
SET id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE slug = 'venture-studio';

-- Step 3: Update services to use the correct category IDs
UPDATE public.services 
SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE category_id NOT IN ('164b114a-ccb9-4900-8777-70fb9dcb5108', '54d5b665-a721-4b1d-8c3f-517c402125de');

-- Assign remaining services to venture studio category  
UPDATE public.services 
SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE category_id NOT IN ('164b114a-ccb9-4900-8777-70fb9dcb5108', '54d5b665-a721-4b1d-8c3f-517c402125de');

-- Step 4: Update service_category_translations to reference correct categories
UPDATE public.service_category_translations 
SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE category_id NOT IN ('164b114a-ccb9-4900-8777-70fb9dcb5108', '54d5b665-a721-4b1d-8c3f-517c402125de');

UPDATE public.service_category_translations 
SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE category_id NOT IN ('164b114a-ccb9-4900-8777-70fb9dcb5108', '54d5b665-a721-4b1d-8c3f-517c402125de');