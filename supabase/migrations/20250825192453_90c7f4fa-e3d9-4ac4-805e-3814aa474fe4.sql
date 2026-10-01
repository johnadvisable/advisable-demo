-- Add unique constraints for blog_posts to prevent duplicates
ALTER TABLE blog_posts ADD CONSTRAINT unique_blog_post_slug UNIQUE (slug);

-- Add unique constraints for news_items (news articles don't have slugs, so we'll use a different approach)
-- Create a partial unique index on title for news items of type 'article'
CREATE UNIQUE INDEX unique_news_article_title 
ON news_items (title) 
WHERE type = 'article';

-- Add indexes for better performance on duplicate checks
CREATE INDEX IF NOT EXISTS idx_blog_posts_title ON blog_posts (title);
CREATE INDEX IF NOT EXISTS idx_news_items_title ON news_items (title);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_news_items_type ON news_items (type);