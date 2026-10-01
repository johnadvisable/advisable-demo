-- Update the featured_image for child services of Brand & Strategy
UPDATE services 
SET featured_image = '/images/services/brand-strategy.jpg'
WHERE parent_service_id = (SELECT id FROM services WHERE slug = 'brand-strategy-parent' AND is_parent = true);