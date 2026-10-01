-- Remove unsafe unauthenticated/public upload path on the general images bucket.
DROP POLICY IF EXISTS "Service role can upload images" ON storage.objects;

-- Recreate collaborator access explicitly for signed-in users on the general images bucket.
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- Drop confusing rules named blog-images that actually target the general images bucket.
DROP POLICY IF EXISTS "Admin can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete blog images" ON storage.objects;

-- Drop redundant service-role-only policies; service-role clients bypass RLS already.
DROP POLICY IF EXISTS "Admin users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can delete blog images" ON storage.objects;

-- Recreate collaborator access explicitly for signed-in users on the blog-images bucket.
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');