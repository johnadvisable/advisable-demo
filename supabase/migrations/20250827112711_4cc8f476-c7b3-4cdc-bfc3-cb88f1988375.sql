-- Create storage bucket for credential images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('credential-images', 'credential-images', true);

-- Create RLS policies for credential images bucket
CREATE POLICY "Public read access to credential images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'credential-images');

CREATE POLICY "Admins can upload credential images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'credential-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update credential images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'credential-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete credential images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'credential-images' AND has_role(auth.uid(), 'admin'::app_role));