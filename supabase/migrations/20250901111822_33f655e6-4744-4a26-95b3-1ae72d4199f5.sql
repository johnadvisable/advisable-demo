-- Fix blog post featured images with relative paths
UPDATE blog_posts 
SET featured_image = CASE 
  WHEN featured_image LIKE '/files/uploads/%' THEN 
    'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/blog-images' || featured_image
  ELSE featured_image
END
WHERE featured_image IS NOT NULL AND featured_image != '';

-- Also add some sample featured images for posts that don't have any
UPDATE blog_posts 
SET featured_image = 'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/blog-images/articles/default-blog-image.jpg'
WHERE (featured_image IS NULL OR featured_image = '') 
AND id IN (
  SELECT id FROM blog_posts 
  WHERE (featured_image IS NULL OR featured_image = '')
  LIMIT 10
);