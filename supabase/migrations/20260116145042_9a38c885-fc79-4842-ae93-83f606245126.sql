-- Update featured_image for Venture Studio child services

-- 1. Ideation & Venture Thesis
UPDATE services
SET featured_image = '/images/services/ideation-venture-thesis.jpg?v=20260116'
WHERE slug = 'ideation-venture-thesis';

-- 2. Validation & Market Proof
UPDATE services
SET featured_image = '/images/services/validation-market-proof.jpg?v=20260116'
WHERE slug = 'validation-market-proof';

-- 3. Venture Product Development (parent)
UPDATE services
SET featured_image = '/images/services/venture-product-development.jpg?v=20260116'
WHERE slug = 'venture-product-dev-parent';

-- Also update the child venture-product-development
UPDATE services
SET featured_image = '/images/services/venture-product-development.jpg?v=20260116'
WHERE slug = 'venture-product-development';

-- 4. Engineering & Platform
UPDATE services
SET featured_image = '/images/services/engineering-platform.jpg?v=20260116'
WHERE slug = 'engineering-platform';

-- 5. Go-to-Market & Growth
UPDATE services
SET featured_image = '/images/services/go-to-market-growth.jpg?v=20260116'
WHERE slug = 'go-to-market-growth';

-- 6. Fundraising & Venture Readiness
UPDATE services
SET featured_image = '/images/services/fundraising-venture-readiness.jpg?v=20260116'
WHERE slug = 'fundraising-venture-readiness';