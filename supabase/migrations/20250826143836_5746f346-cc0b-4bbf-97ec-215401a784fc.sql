-- Create client-logos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('client-logos', 'client-logos', true);

-- Create storage policies for client logos
CREATE POLICY "Client logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'client-logos');

CREATE POLICY "Admins can upload client logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update client logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete client logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));