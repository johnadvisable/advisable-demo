
-- Venture Product Development children
UPDATE services 
SET featured_image = '/images/services/venture-product-development.jpg'
WHERE parent_service_id = '2201c320-1dcf-4c99-bfea-2f8ae88ae5fd';

-- Engineering & Platform children
UPDATE services 
SET featured_image = '/images/services/engineering-platform.jpg'
WHERE parent_service_id = 'f299cd06-3f82-4e0f-a424-2edaadfc74d1';

-- Go-to-Market & Growth children
UPDATE services 
SET featured_image = '/images/services/go-to-market-growth.jpg'
WHERE parent_service_id = '0a2dc7e9-1db5-4e54-9766-e2077f08e37e';

-- Fundraising & Venture Readiness children
UPDATE services 
SET featured_image = '/images/services/fundraising-venture-readiness.jpg'
WHERE parent_service_id = '0c09cd5e-fe86-4b7f-8d64-8576d97370cf';
