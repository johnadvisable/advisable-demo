-- Update the featured_image for AI Web & App Development parent service and its children
UPDATE services 
SET featured_image = '/images/services/ai-web-app-development.jpg'
WHERE slug = 'ai-web-app-development' AND is_parent = true;

UPDATE services 
SET featured_image = '/images/services/ai-web-app-development.jpg'
WHERE parent_service_id = (SELECT id FROM services WHERE slug = 'ai-web-app-development' AND is_parent = true);