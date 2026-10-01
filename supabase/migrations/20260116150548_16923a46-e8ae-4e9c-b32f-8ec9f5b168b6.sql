-- Remove version query params from service images
UPDATE services SET featured_image = '/images/services/ideation-venture-thesis.jpg' WHERE slug = 'ideation-venture-thesis';
UPDATE services SET featured_image = '/images/services/validation-market-proof.jpg' WHERE slug = 'validation-market-proof';
UPDATE services SET featured_image = '/images/services/venture-product-development.jpg' WHERE slug IN ('venture-product-dev-parent', 'venture-product-development');
UPDATE services SET featured_image = '/images/services/engineering-platform.jpg' WHERE slug = 'engineering-platform';
UPDATE services SET featured_image = '/images/services/go-to-market-growth.jpg' WHERE slug = 'go-to-market-growth';
UPDATE services SET featured_image = '/images/services/fundraising-venture-readiness.jpg' WHERE slug = 'fundraising-venture-readiness';

-- Remove version from category
UPDATE service_categories SET hero_image = '/images/services/venture-studio.jpg' WHERE slug = 'venture-studio';