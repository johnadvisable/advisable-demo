-- Add Greek translation for TikTok Advertising service
INSERT INTO service_translations (service_id, language_id, title, short_description)
VALUES (
  'eea33e01-b395-4a05-b120-de0a859f1f4c',
  5,
  'Διαφήμιση TikTok',
  'Διαφημίσεις που τραβούν την προσοχή και φέρνουν αποτελέσματα'
)
ON CONFLICT (service_id, language_id) 
DO UPDATE SET 
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  updated_at = now();