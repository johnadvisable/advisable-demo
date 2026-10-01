-- Create storage bucket for blog images if it doesn't exist
DO $$
BEGIN
    -- Check if bucket exists and create it if not
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
    END IF;
END $$;

-- Create storage policies for blog images (check for existence first)
DO $$
BEGIN
    -- Public read access to images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public read access to images'
    ) THEN
        CREATE POLICY "Public read access to images" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'images');
    END IF;

    -- Admin can upload blog images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Admin can upload blog images'
    ) THEN
        CREATE POLICY "Admin can upload blog images" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'images' AND has_role(auth.uid(), 'admin'::app_role));
    END IF;

    -- Admin can update blog images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Admin can update blog images'
    ) THEN
        CREATE POLICY "Admin can update blog images" 
        ON storage.objects FOR UPDATE 
        USING (bucket_id = 'images' AND has_role(auth.uid(), 'admin'::app_role));
    END IF;

    -- Admin can delete blog images
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Admin can delete blog images'
    ) THEN
        CREATE POLICY "Admin can delete blog images" 
        ON storage.objects FOR DELETE 
        USING (bucket_id = 'images' AND has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;