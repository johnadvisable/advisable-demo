-- Create storage buckets for client assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-assets', 'client-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for client assets bucket
CREATE POLICY "Admins can upload client assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'client-assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update client assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'client-assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete client assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'client-assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to client assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'client-assets');