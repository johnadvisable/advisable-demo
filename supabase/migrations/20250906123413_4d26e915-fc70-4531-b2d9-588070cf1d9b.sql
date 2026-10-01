-- Proper approach to swap service categories with all required fields
-- First, let's create the new categories with correct structure
INSERT INTO public.service_categories (id, slug, name) 
VALUES 
  ('164b114a-ccb9-4900-8777-70fb9dcb5108', 'digital-agency-new', 'Digital Agency Services'),
  ('54d5b665-a721-4b1d-8c3f-517c402125de', 'venture-studio-new', 'Venture Studio Services');

-- Update foreign key references in services table
UPDATE public.services 
SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE category_id = (SELECT id FROM public.service_categories WHERE slug = 'digital-agency' AND slug != 'digital-agency-new' LIMIT 1);

UPDATE public.services 
SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE category_id = (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' AND slug != 'venture-studio-new' LIMIT 1);

-- Update foreign key references in service_category_translations
UPDATE public.service_category_translations 
SET category_id = '164b114a-ccb9-4900-8777-70fb9dcb5108'
WHERE category_id = (SELECT id FROM public.service_categories WHERE slug = 'digital-agency' AND slug != 'digital-agency-new' LIMIT 1);

UPDATE public.service_category_translations 
SET category_id = '54d5b665-a721-4b1d-8c3f-517c402125de'
WHERE category_id = (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' AND slug != 'venture-studio-new' LIMIT 1);

-- Delete the old categories
DELETE FROM public.service_categories WHERE slug IN ('digital-agency', 'venture-studio') AND slug NOT IN ('digital-agency-new', 'venture-studio-new');

-- Update the new categories to have the correct slugs
UPDATE public.service_categories 
SET slug = 'digital-agency' 
WHERE slug = 'digital-agency-new';

UPDATE public.service_categories 
SET slug = 'venture-studio' 
WHERE slug = 'venture-studio-new';