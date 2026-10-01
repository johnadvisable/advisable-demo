-- Clean up orphaned news item translations
-- Delete translations that don't have a corresponding news item
DELETE FROM news_item_translations 
WHERE news_item_id NOT IN (
  SELECT id FROM news_items
);

-- Also clean up any orphaned blog post translations while we're at it
DELETE FROM blog_post_translations 
WHERE blog_post_id NOT IN (
  SELECT id FROM blog_posts
);