-- Create storage bucket for client logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-logos', 'client-logos', true);

-- Create RLS policies for client logos bucket
CREATE POLICY "Allow public access to client logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'client-logos');

CREATE POLICY "Allow admins to upload client logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow admins to update client logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow admins to delete client logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'client-logos' AND has_role(auth.uid(), 'admin'::app_role));