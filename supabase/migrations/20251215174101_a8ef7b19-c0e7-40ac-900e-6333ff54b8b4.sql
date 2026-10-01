-- Delete bad translations (with HTML tags in title, placeholder titles, or empty values)
DELETE FROM service_translations 
WHERE language_id IN (SELECT id FROM languages WHERE code IN ('el', 'de', 'fr', 'es', 'it')) 
AND (
  title LIKE '%<p>%' 
  OR title LIKE '%</%' 
  OR title = 'Ψηφιακή Υπηρεσία' 
  OR title IS NULL 
  OR title = ''
  OR short_description IS NULL 
  OR short_description = ''
);