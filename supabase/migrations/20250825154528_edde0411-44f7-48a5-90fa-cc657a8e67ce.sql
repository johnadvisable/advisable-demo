-- Add bunny_video_id field to track uploaded videos and avoid re-uploading
ALTER TABLE public.news_items 
ADD COLUMN bunny_video_id text;