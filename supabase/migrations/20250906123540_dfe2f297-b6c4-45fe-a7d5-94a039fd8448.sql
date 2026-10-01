-- Simple fix: Swap the slugs and names instead of IDs
-- This will make Digital Agency display correctly without complex ID changes

-- Step 1: Update slugs to temporary values to avoid conflicts
UPDATE public.service_categories SET slug = 'digital-agency-temp' WHERE slug = 'digital-agency';
UPDATE public.service_categories SET slug = 'venture-studio-temp' WHERE slug = 'venture-studio';

-- Step 2: Swap the slugs
UPDATE public.service_categories SET slug = 'venture-studio' WHERE slug = 'digital-agency-temp';
UPDATE public.service_categories SET slug = 'digital-agency' WHERE slug = 'venture-studio-temp';

-- Step 3: Update names to match (optional, for consistency)
UPDATE public.service_categories SET name = 'Digital Agency Services' WHERE slug = 'digital-agency';
UPDATE public.service_categories SET name = 'Venture Studio Services' WHERE slug = 'venture-studio';