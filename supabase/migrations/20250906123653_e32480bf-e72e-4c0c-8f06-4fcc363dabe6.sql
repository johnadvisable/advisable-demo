-- Fix the swap to match user requirements exactly
-- User wants: Digital Agency = 164b114a-ccb9-4900-8777-70fb9dcb5108
-- User wants: Venture Studio = 54d5b665-a721-4b1d-8c3f-517c402125de

-- Step 1: Update slugs to temporary values
UPDATE public.service_categories SET slug = 'digital-agency-temp' WHERE slug = 'digital-agency';
UPDATE public.service_categories SET slug = 'venture-studio-temp' WHERE slug = 'venture-studio';

-- Step 2: Swap the slugs to correct mapping
UPDATE public.service_categories SET slug = 'digital-agency' WHERE id = '164b114a-ccb9-4900-8777-70fb9dcb5108';
UPDATE public.service_categories SET slug = 'venture-studio' WHERE id = '54d5b665-a721-4b1d-8c3f-517c402125de';

-- Step 3: Update names to match
UPDATE public.service_categories SET name = 'Digital Agency Services' WHERE slug = 'digital-agency';
UPDATE public.service_categories SET name = 'Venture Studio Services' WHERE slug = 'venture-studio';