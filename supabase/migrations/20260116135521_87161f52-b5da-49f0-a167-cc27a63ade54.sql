-- Update the featured_image for Paid Growth Systems parent service and its children
UPDATE services 
SET featured_image = '/images/services/paid-growth-systems.jpg'
WHERE slug = 'paid-growth-systems' AND is_parent = true;

UPDATE services 
SET featured_image = '/images/services/paid-growth-systems.jpg'
WHERE parent_service_id = (SELECT id FROM services WHERE slug = 'paid-growth-systems' AND is_parent = true);