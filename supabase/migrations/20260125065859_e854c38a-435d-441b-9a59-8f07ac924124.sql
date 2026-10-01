-- Remove em dashes (—) from all translations of the AI SEO article

-- Update English
UPDATE insights_translations 
SET 
  title = REPLACE(title, '—', ' - '),
  excerpt = REPLACE(excerpt, '—', ' - '),
  content = REPLACE(content, '—', ' - '),
  updated_at = now()
WHERE id = '477394b1-dcee-4d90-9a14-a1b0dd8ca15f';

-- Update German
UPDATE insights_translations 
SET 
  title = REPLACE(title, '—', ' - '),
  excerpt = REPLACE(excerpt, '—', ' - '),
  content = REPLACE(content, '—', ' - '),
  updated_at = now()
WHERE id = 'bca2ce36-c545-4c21-a174-e2ead14916ee';

-- Update Spanish
UPDATE insights_translations 
SET 
  title = REPLACE(title, '—', ' - '),
  excerpt = REPLACE(excerpt, '—', ' - '),
  content = REPLACE(content, '—', ' - '),
  updated_at = now()
WHERE id = '91c4bde8-9fc7-4522-9371-1340de702353';

-- Update French
UPDATE insights_translations 
SET 
  title = REPLACE(title, '—', ' - '),
  excerpt = REPLACE(excerpt, '—', ' - '),
  content = REPLACE(content, '—', ' - '),
  updated_at = now()
WHERE id = '01762d0d-ced4-4351-8d06-35887f5664c3';

-- Update Italian
UPDATE insights_translations 
SET 
  title = REPLACE(title, '—', ' - '),
  excerpt = REPLACE(excerpt, '—', ' - '),
  content = REPLACE(content, '—', ' - '),
  updated_at = now()
WHERE id = '79e5d468-c3a1-4a7b-96cc-c31f00910e77';

-- Update Greek
UPDATE insights_translations 
SET 
  title = REPLACE(title, '—', ' - '),
  excerpt = REPLACE(excerpt, '—', ' - '),
  content = REPLACE(content, '—', ' - '),
  updated_at = now()
WHERE id = 'adafd567-909d-44c7-ab57-f881684804b2';