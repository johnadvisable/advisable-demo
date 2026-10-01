-- Create storage buckets for case study migrator
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'client-logos', 
    'client-logos', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'case-study-images', 
    'case-study-images', 
    true, 
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for client logos bucket
CREATE POLICY "Public can view client logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'client-logos');

CREATE POLICY "Authenticated users can upload client logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'client-logos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update client logos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'client-logos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete client logos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'client-logos' AND 
  auth.role() = 'authenticated'
);

-- Create RLS policies for case study images bucket
CREATE POLICY "Public can view case study images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'case-study-images');

CREATE POLICY "Authenticated users can upload case study images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'case-study-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update case study images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'case-study-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete case study images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'case-study-images' AND 
  auth.role() = 'authenticated'
);