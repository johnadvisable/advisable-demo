-- Update the featured_image for Brand & Strategy parent service
UPDATE services 
SET featured_image = '/images/services/brand-strategy.jpg'
WHERE slug = 'brand-strategy-parent' AND is_parent = true;