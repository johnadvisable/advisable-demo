-- Swap service category IDs to fix the display issue
-- Current state:
-- Digital Agency Services: 54d5b665-a721-4b1d-8c3f-517c402125de 
-- Venture Studio Services: 164b114a-ccb9-4900-8777-70fb9dcb5108
-- Expected state:
-- Digital Agency Services: 164b114a-ccb9-4900-8777-70fb9dcb5108
-- Venture Studio Services: 54d5b665-a721-4b1d-8c3f-517c402125de

-- Step 1: Use temporary IDs to avoid constraint conflicts
UPDATE public.service_categories 
SET id = gen_random_uuid() 
WHERE id IN ('54d5b665-a721-4b1d-8c3f-517c402125de', '164b114a-ccb9-4900-8777-70fb9dcb5108');

-- Step 2: Get the temporary IDs and update to final IDs
-- Update Digital Agency Services to have the expected ID
UPDATE public.service_categories 
SET id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE slug = 'digital-agency';

-- Update Venture Studio Services to have the expected ID  
UPDATE public.service_categories 
SET id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE slug = 'venture-studio';

-- Step 3: Update all services to use the correct category IDs
-- Update services that should belong to Digital Agency (now 164b114a-ccb9-4900-8777-70fb9dcb5108)
UPDATE public.services 
SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE category_id NOT IN ('164b114a-ccb9-4900-8777-70fb9dcb5108', '54d5b665-a721-4b1d-8c3f-517c402125de')
   OR category_id = (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' AND id != '54d5b665-a721-4b1d-8c3f-517c402125de');

-- Update services that should belong to Venture Studio (now 54d5b665-a721-4b1d-8c3f-517c402125de)  
UPDATE public.services 
SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE category_id NOT IN ('164b114a-ccb9-4900-8777-70fb9dcb5108', '54d5b665-a721-4b1d-8c3f-517c402125de')
   OR category_id = (SELECT id FROM public.service_categories WHERE slug = 'digital-agency' AND id != '164b114a-ccb9-4900-8777-70fb9dcb5108');

-- Step 4: Update service category translations to reference the correct category IDs
UPDATE public.service_category_translations 
SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE category_id NOT IN ('164b114a-ccb9-4900-8777-70fb9dcb5108', '54d5b665-a721-4b1d-8c3f-517c402125de')
   AND category_id IN (SELECT id FROM public.service_categories WHERE slug = 'digital-agency');

UPDATE public.service_category_translations 
SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'  
WHERE category_id NOT IN ('164b114a-ccb9-4900-8777-70fb9dcb5108', '54d5b665-a721-4b1d-8c3f-517c402125de')
   AND category_id IN (SELECT id FROM public.service_categories WHERE slug = 'venture-studio');