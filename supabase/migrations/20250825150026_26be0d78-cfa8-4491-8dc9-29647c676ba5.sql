-- Update all news items with type 'video' to 'media'
UPDATE news_items 
SET type = 'media' 
WHERE type = 'video';

-- Drop the old constraint and add the new one
ALTER TABLE news_items DROP CONSTRAINT IF EXISTS news_items_type_check;
ALTER TABLE news_items ADD CONSTRAINT news_items_type_check 
CHECK (type IN ('article', 'media'));