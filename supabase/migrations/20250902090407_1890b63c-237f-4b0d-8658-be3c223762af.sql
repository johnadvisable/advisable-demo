-- Create storage bucket for blog images if it doesn't exist
DO $$
BEGIN
    -- Check if bucket exists and create it if not
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
    END IF;
END $$;

-- Create storage policies for blog images
CREATE POLICY IF NOT EXISTS "Public read access to images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Admin can upload blog images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY IF NOT EXISTS "Admin can update blog images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY IF NOT EXISTS "Admin can delete blog images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'images' AND has_role(auth.uid(), 'admin'::app_role));