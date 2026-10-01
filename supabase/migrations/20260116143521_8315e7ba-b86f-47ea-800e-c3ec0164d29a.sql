-- Update featured_image for venture-studio parent service category
UPDATE services
SET featured_image = '/images/services/venture-studio.jpg'
WHERE slug = 'venture-studio';

-- Update featured_image for all venture-studio child services
UPDATE services s
SET featured_image = '/images/services/venture-studio.jpg'
FROM services parent
WHERE parent.slug = 'venture-studio'
AND s.parent_service_id = parent.id;