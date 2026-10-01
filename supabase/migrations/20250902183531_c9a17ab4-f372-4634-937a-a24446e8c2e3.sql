-- Ensure the images bucket exists for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create proper RLS policies for the images bucket
CREATE POLICY "Public Access to images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Service role can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');