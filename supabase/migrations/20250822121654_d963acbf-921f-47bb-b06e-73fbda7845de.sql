-- Delete any existing untitled blog posts and their translations
DELETE FROM blog_post_translations 
WHERE blog_post_id IN (
  SELECT bp.id FROM blog_posts bp 
  LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id 
  WHERE bpt.title IS NULL 
     OR bpt.title = '' 
     OR bpt.title ILIKE '%untitled%'
     OR bpt.title ILIKE '%no title%'
     OR bpt.title ILIKE '%άχ τίτλο%'
     OR bpt.title ILIKE '%χωρίς τίτλο%'
     OR LENGTH(TRIM(bpt.title)) < 10
);

DELETE FROM blog_posts 
WHERE id IN (
  SELECT bp.id FROM blog_posts bp 
  LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id 
  WHERE bpt.blog_post_id IS NULL  -- No translation exists
);

-- Delete any existing untitled news items and their translations
DELETE FROM news_item_translations 
WHERE news_item_id IN (
  SELECT ni.id FROM news_items ni 
  LEFT JOIN news_item_translations nit ON ni.id = nit.news_item_id 
  WHERE nit.title IS NULL 
     OR nit.title = '' 
     OR nit.title ILIKE '%untitled%'
     OR nit.title ILIKE '%no title%'
     OR nit.title ILIKE '%άχ τίτλο%'
     OR nit.title ILIKE '%χωρίς τίτλο%'
     OR LENGTH(TRIM(nit.title)) < 10
);

DELETE FROM news_items 
WHERE id IN (
  SELECT ni.id FROM news_items ni 
  LEFT JOIN news_item_translations nit ON ni.id = nit.news_item_id 
  WHERE nit.news_item_id IS NULL  -- No translation exists
);