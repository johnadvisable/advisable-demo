-- Populate SEO fields for all service translations with language-appropriate data

-- English
UPDATE public.service_translations 
SET 
  seo_title = title || ' Services | Advisable',
  meta_description = CASE 
    WHEN LENGTH(short_description) > 155 THEN LEFT(short_description, 152) || '...'
    ELSE short_description
  END
WHERE language_id = 1;

-- Spanish  
UPDATE public.service_translations 
SET 
  seo_title = 'Servicios de ' || title || ' | Advisable',
  meta_description = CASE 
    WHEN LENGTH(short_description) > 155 THEN LEFT(short_description, 152) || '...'
    ELSE short_description
  END
WHERE language_id = 2;

-- French
UPDATE public.service_translations 
SET 
  seo_title = 'Services ' || title || ' | Advisable',
  meta_description = CASE 
    WHEN LENGTH(short_description) > 155 THEN LEFT(short_description, 152) || '...'
    ELSE short_description
  END
WHERE language_id = 3;

-- German
UPDATE public.service_translations 
SET 
  seo_title = title || ' Dienstleistungen | Advisable',
  meta_description = CASE 
    WHEN LENGTH(short_description) > 155 THEN LEFT(short_description, 152) || '...'
    ELSE short_description
  END
WHERE language_id = 4;

-- Greek
UPDATE public.service_translations 
SET 
  seo_title = 'Υπηρεσίες ' || title || ' | Advisable',
  meta_description = CASE 
    WHEN LENGTH(short_description) > 155 THEN LEFT(short_description, 152) || '...'
    ELSE short_description
  END
WHERE language_id = 5;

-- Italian
UPDATE public.service_translations 
SET 
  seo_title = 'Servizi ' || title || ' | Advisable',
  meta_description = CASE 
    WHEN LENGTH(short_description) > 155 THEN LEFT(short_description, 152) || '...'
    ELSE short_description
  END
WHERE language_id = 10;