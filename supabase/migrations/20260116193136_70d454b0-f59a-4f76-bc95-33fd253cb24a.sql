-- Update the service title to "AI Video Creation"
UPDATE service_translations 
SET title = 'AI Video Creation'
WHERE service_id = '072dd7ab-8369-45a4-9349-03f9e8b88cf5' AND language_id = 1;

-- Also update the slug to match
UPDATE services 
SET slug = 'ai-video-creation'
WHERE id = '072dd7ab-8369-45a4-9349-03f9e8b88cf5';