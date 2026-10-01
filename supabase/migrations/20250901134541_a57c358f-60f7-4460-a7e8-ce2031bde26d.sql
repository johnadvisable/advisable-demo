-- First update any existing 'blog_posts' references to 'insights' before adding constraint
UPDATE public.blog_categories 
SET target_table = 'insights' 
WHERE target_table = 'blog_posts';

-- Update any other invalid target_table values to valid ones
UPDATE public.blog_categories 
SET target_table = 'insights' 
WHERE target_table NOT IN ('news_items', 'insights');

-- Now add the constraint
ALTER TABLE public.blog_categories 
ADD CONSTRAINT blog_categories_target_table_check 
CHECK (target_table IN ('insights', 'news_items'));

-- Rename blog_posts table to insights
ALTER TABLE public.blog_posts RENAME TO insights;

-- Rename blog_post_translations table to insights_translations
ALTER TABLE public.blog_post_translations RENAME TO insights_translations;

-- Rename the foreign key column in insights_translations
ALTER TABLE public.insights_translations RENAME COLUMN blog_post_id TO insights_id;