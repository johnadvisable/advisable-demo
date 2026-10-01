-- Add thumbnail_url field to news_items table for Instagram thumbnails
ALTER TABLE public.news_items 
ADD COLUMN thumbnail_url text;