-- Update the featured_image for Conversion & Revenue Optimization parent service and its children
UPDATE services 
SET featured_image = '/images/services/conversion-revenue-optimization.jpg'
WHERE slug = 'conversion-revenue-optimization' AND is_parent = true;

UPDATE services 
SET featured_image = '/images/services/conversion-revenue-optimization.jpg'
WHERE parent_service_id = (SELECT id FROM services WHERE slug = 'conversion-revenue-optimization' AND is_parent = true);