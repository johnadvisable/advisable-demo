-- Update hero titles to remove "Advisable" prefix
UPDATE public.service_categories
SET seo_title = 'Digital Agency'
WHERE slug = 'digital-agency';

UPDATE public.service_categories
SET seo_title = 'Venture Studio'
WHERE slug = 'venture-studio';