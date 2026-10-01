-- Update marketing-growth service title to "Growth & CRO Optimization" and add featured image
UPDATE public.service_translations 
SET title = 'Growth & CRO Optimization' 
WHERE service_id = 'eadc6ac8-ef0f-481b-9103-dfe1d9ef504f' AND language_id = 1;

UPDATE public.services 
SET featured_image = '/images/services/growth-cro.jpg' 
WHERE slug = 'marketing-growth';