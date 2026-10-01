-- Fix 1: Remove HTML tags from "creatives" short_description in Greek
UPDATE service_translations
SET short_description = regexp_replace(short_description, '</?p[^>]*>', '', 'g')
WHERE service_id = (SELECT id FROM services WHERE slug = 'creatives')
AND language_id = 5; -- Greek

-- Fix 2: Delete incomplete long_descriptions for mobile-app-development (those with < 200 chars)
UPDATE service_translations
SET long_description = NULL
WHERE service_id = (SELECT id FROM services WHERE slug = 'mobile-app-development')
AND language_id IN (2, 3, 4, 5, 10) -- es, fr, de, el, it
AND length(long_description) < 200;

-- Fix 3: Delete the Italian record for mobile-app-development if it exists but is incomplete
DELETE FROM service_translations
WHERE service_id = (SELECT id FROM services WHERE slug = 'mobile-app-development')
AND language_id = 10
AND (title IS NULL OR title = '' OR long_description IS NULL OR length(long_description) < 200);