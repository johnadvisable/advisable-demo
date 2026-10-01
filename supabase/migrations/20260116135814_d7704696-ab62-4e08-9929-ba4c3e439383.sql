-- Update the featured_image for AI Creative Studio parent service and its children
UPDATE services 
SET featured_image = '/images/services/ai-creative-studio.jpg'
WHERE slug = 'ai-creative-studio' AND is_parent = true;

UPDATE services 
SET featured_image = '/images/services/ai-creative-studio.jpg'
WHERE parent_service_id = (SELECT id FROM services WHERE slug = 'ai-creative-studio' AND is_parent = true);