-- Update the featured_image for SEO & AI Visibility parent service and its children
UPDATE services 
SET featured_image = '/images/services/seo-ai-visibility.jpg'
WHERE slug = 'seo-ai-visibility' AND is_parent = true;

UPDATE services 
SET featured_image = '/images/services/seo-ai-visibility.jpg'
WHERE parent_service_id = (SELECT id FROM services WHERE slug = 'seo-ai-visibility' AND is_parent = true);