-- Update E Commerce Solutions to eCommerce Solutions (EN) and add featured image
UPDATE public.service_translations 
SET title = 'eCommerce Solutions' 
WHERE service_id = '0c0ede58-fcd5-4fee-ae88-edf55482a84d' AND language_id = 1;

-- Update featured_image for e-commerce-solutions
UPDATE public.services 
SET featured_image = '/images/services/ecommerce-solutions.jpg' 
WHERE slug = 'e-commerce-solutions';