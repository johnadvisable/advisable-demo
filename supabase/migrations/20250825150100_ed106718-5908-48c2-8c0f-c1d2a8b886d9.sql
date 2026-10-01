-- First, drop all existing check constraints on news_items type
ALTER TABLE news_items DROP CONSTRAINT IF EXISTS news_items_type_check;
ALTER TABLE news_items DROP CONSTRAINT IF EXISTS check_news_items_type;
ALTER TABLE news_items DROP CONSTRAINT IF EXISTS news_items_type_check1;

-- Now update all 'video' types to 'media'
UPDATE news_items 
SET type = 'media' 
WHERE type = 'video';

-- Add the new constraint that allows 'article' and 'media'
ALTER TABLE news_items ADD CONSTRAINT news_items_type_check 
CHECK (type IN ('article', 'media'));