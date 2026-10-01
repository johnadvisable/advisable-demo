-- Create storage bucket for Instagram images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('instagram-media', 'instagram-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for Instagram media
CREATE POLICY "Allow public read access to Instagram media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'instagram-media');

CREATE POLICY "Allow authenticated insert to Instagram media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'instagram-media' AND auth.role() = 'service_role');