
CREATE POLICY "Admins can view contact_submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update contact_submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete contact_submissions" ON public.contact_submissions
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND length(name) BETWEEN 1 AND 200
    AND email IS NOT NULL AND length(email) BETWEEN 3 AND 320
  );

DROP POLICY IF EXISTS "Anyone can insert job_applications" ON public.job_applications;
CREATE POLICY "Anyone can insert job_applications" ON public.job_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND length(name) BETWEEN 1 AND 200
    AND email IS NOT NULL AND length(email) BETWEEN 3 AND 320
  );
CREATE POLICY "Admins can update job_applications" ON public.job_applications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view startup_applications" ON public.startup_applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update startup_applications" ON public.startup_applications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete startup_applications" ON public.startup_applications
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Authenticated can insert news media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update news media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete news media" ON storage.objects;
CREATE POLICY "Only admins can upload news media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update news media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete news media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Authenticated can insert product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete product images" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload pitch deck to startup-applicatio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload pitch deck to startup-applications" ON storage.objects;
