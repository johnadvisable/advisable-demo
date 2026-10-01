-- Safe approach to swap service category IDs
-- Step 1: Create temporary categories with new IDs
INSERT INTO public.service_categories (id, slug) 
VALUES 
  ('164b114a-ccb9-4900-8777-70fb9dcb5108', 'digital-agency-temp'),
  ('54d5b665-a721-4b1d-8c3f-517c402125de', 'venture-studio-temp');

-- Step 2: Update all foreign key references to point to new temporary categories
-- Update services
UPDATE public.services 
SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE category_id = (SELECT id FROM public.service_categories WHERE slug = 'digital-agency' LIMIT 1);

UPDATE public.services 
SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE category_id = (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' LIMIT 1);

-- Update service category translations
UPDATE public.service_category_translations 
SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE category_id = (SELECT id FROM public.service_categories WHERE slug = 'digital-agency' LIMIT 1);

UPDATE public.service_category_translations 
SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE category_id = (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' LIMIT 1);

-- Step 3: Delete old categories
DELETE FROM public.service_categories WHERE slug IN ('digital-agency', 'venture-studio');

-- Step 4: Update the temporary categories to have the correct slugs
UPDATE public.service_categories 
SET slug = 'digital-agency' 
WHERE id = '164b114a-ccb9-4900-8777-70fb9dcb5108';

UPDATE public.service_categories 
SET slug = 'venture-studio' 
WHERE id = '54d5b665-a721-4b1d-8c3f-517c402125de';