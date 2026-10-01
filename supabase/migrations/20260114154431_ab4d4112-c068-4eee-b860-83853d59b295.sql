-- Update Elevate Greece credential with new image
UPDATE credentials 
SET image_url = '/images/elevate-greece-logo.png',
    updated_at = now()
WHERE id = '1cc602a9-983f-4cd7-87d4-93fd2f2fd097';