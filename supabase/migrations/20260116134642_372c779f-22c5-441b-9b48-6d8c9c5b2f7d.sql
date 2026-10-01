-- Update the service slug and translations from "Brand & Product Story" to "Brand & Strategy"
-- and make it first in display order

-- Update slug in services table
UPDATE services 
SET slug = 'brand-strategy-parent', display_order = 1
WHERE slug = 'brand-product-story' AND is_parent = true;

-- Update English translations
UPDATE service_translations 
SET title = 'Brand & Strategy'
WHERE service_id = (SELECT id FROM services WHERE slug = 'brand-strategy-parent' AND is_parent = true)
AND language_id = (SELECT id FROM languages WHERE code = 'en');

-- Update Greek translations
UPDATE service_translations 
SET title = 'Brand & Strategy'
WHERE service_id = (SELECT id FROM services WHERE slug = 'brand-strategy-parent' AND is_parent = true)
AND language_id = (SELECT id FROM languages WHERE code = 'el');

-- Update Spanish translations
UPDATE service_translations 
SET title = 'Brand & Strategy'
WHERE service_id = (SELECT id FROM services WHERE slug = 'brand-strategy-parent' AND is_parent = true)
AND language_id = (SELECT id FROM languages WHERE code = 'es');

-- Update French translations
UPDATE service_translations 
SET title = 'Brand & Strategy'
WHERE service_id = (SELECT id FROM services WHERE slug = 'brand-strategy-parent' AND is_parent = true)
AND language_id = (SELECT id FROM languages WHERE code = 'fr');

-- Update German translations
UPDATE service_translations 
SET title = 'Brand & Strategy'
WHERE service_id = (SELECT id FROM services WHERE slug = 'brand-strategy-parent' AND is_parent = true)
AND language_id = (SELECT id FROM languages WHERE code = 'de');

-- Update Italian translations
UPDATE service_translations 
SET title = 'Brand & Strategy'
WHERE service_id = (SELECT id FROM services WHERE slug = 'brand-strategy-parent' AND is_parent = true)
AND language_id = (SELECT id FROM languages WHERE code = 'it');

-- Make other parent services have higher display_order
UPDATE services 
SET display_order = display_order + 1
WHERE is_parent = true 
AND category_id = (SELECT id FROM service_categories WHERE slug = 'digital-agency')
AND slug != 'brand-strategy-parent';