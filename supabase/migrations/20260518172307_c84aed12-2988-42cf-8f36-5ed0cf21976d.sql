
-- 1. app_settings: remove broad authenticated UPDATE
DROP POLICY IF EXISTS "Allow authenticated users to update app_settings" ON public.app_settings;

-- 2. route_seo_config: restrict write to admins
DROP POLICY IF EXISTS "Authenticated users can manage route SEO configs" ON public.route_seo_config;
CREATE POLICY "Admins can manage route SEO configs"
  ON public.route_seo_config
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. ai_usage_logs: restrict INSERT to admins (server-side functions use service_role and bypass RLS)
DROP POLICY IF EXISTS "System can insert ai_usage_logs" ON public.ai_usage_logs;
CREATE POLICY "Admins can insert ai_usage_logs"
  ON public.ai_usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. security_audit_log: restrict INSERT to admins (service_role bypasses RLS)
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;
CREATE POLICY "Admins can insert audit logs"
  ON public.security_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 5. startup-applications: require authentication
DROP POLICY IF EXISTS "Anyone can upload pitch deck to startup-applications" ON storage.objects;
CREATE POLICY "Authenticated users can upload pitch deck to startup-applications"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'startup-applications');

-- 6. Public buckets: restrict write to admins
-- blog-images
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- case-study-images
DROP POLICY IF EXISTS "Authenticated users can upload case study images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update case study images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete case study images" ON storage.objects;
CREATE POLICY "Admins can upload case study images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'case-study-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update case study images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'case-study-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete case study images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'case-study-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- client-logos
DROP POLICY IF EXISTS "Authenticated users can upload client logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update client logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete client logos" ON storage.objects;
CREATE POLICY "Admins can upload client logos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'client-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update client logos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'client-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete client logos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'client-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- client-images
DROP POLICY IF EXISTS "Authenticated users can upload to client-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update client-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from client-images" ON storage.objects;
CREATE POLICY "Admins can upload client-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'client-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update client-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'client-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete client-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'client-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- partner-logos
DROP POLICY IF EXISTS "Authenticated users can upload partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete partner logos" ON storage.objects;
CREATE POLICY "Admins can upload partner logos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update partner logos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete partner logos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- instagram-media
DROP POLICY IF EXISTS "Authenticated users can insert instagram-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update instagram-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete instagram-media" ON storage.objects;
CREATE POLICY "Admins can insert instagram-media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'instagram-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update instagram-media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'instagram-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete instagram-media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'instagram-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- news-media
DROP POLICY IF EXISTS "Authenticated users can insert news-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update news-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete news-media" ON storage.objects;
CREATE POLICY "Admins can insert news-media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update news-media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete news-media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));
