
UPDATE services 
SET featured_image = '/images/services/validation-market-proof.jpg'
WHERE parent_service_id = (SELECT id FROM services WHERE slug = 'validation-market-proof');
