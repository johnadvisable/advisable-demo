-- Update existing blog post slugs to remove category prefixes
UPDATE blog_posts 
SET slug = SUBSTRING(slug FROM POSITION('/' IN slug) + 1)
WHERE slug LIKE '%/%';

-- Create 301 redirects from old category-based URLs to new simple URLs
INSERT INTO redirects (old_path, new_path, status_code)
SELECT 
  '/blog/' || bp.category || '/' || SUBSTRING(bp.slug FROM POSITION('/' IN bp.slug) + 1) as old_path,
  '/blog/' || SUBSTRING(bp.slug FROM POSITION('/' IN bp.slug) + 1) as new_path,
  301 as status_code
FROM blog_posts bp 
WHERE bp.slug LIKE '%/%'
ON CONFLICT (old_path) DO NOTHING;