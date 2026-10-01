-- Update all news items with type 'video' to 'media'
UPDATE news_items 
SET type = 'media' 
WHERE type = 'video';