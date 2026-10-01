-- Add unique constraint for blog_posts slug to prevent duplicates
ALTER TABLE blog_posts ADD CONSTRAINT unique_blog_post_slug UNIQUE (slug);

-- Add indexes for better performance on duplicate checks
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_news_items_type ON news_items (type);
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_title ON blog_post_translations (title);
CREATE INDEX IF NOT EXISTS idx_news_item_translations_title ON news_item_translations (title);

-- Add composite index for better translation queries
CREATE INDEX IF NOT EXISTS idx_blog_translations_composite ON blog_post_translations (blog_post_id, language_id);
CREATE INDEX IF NOT EXISTS idx_news_translations_composite ON news_item_translations (news_item_id, language_id);