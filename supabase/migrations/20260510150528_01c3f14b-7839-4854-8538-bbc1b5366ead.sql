
-- Startup applications table
CREATE TABLE public.startup_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  email TEXT NOT NULL,
  startup_website TEXT,
  problem_solving TEXT NOT NULL,
  market_tam_sam_som TEXT NOT NULL,
  competitive_advantage TEXT NOT NULL,
  evaluation_signals TEXT NOT NULL,
  target_users TEXT NOT NULL,
  vertical TEXT NOT NULL,
  business_model TEXT NOT NULL,
  business_model_other TEXT,
  stage TEXT NOT NULL,
  uniqueness TEXT NOT NULL,
  pitch_deck_url TEXT,
  pitch_deck_link TEXT,
  pitch_deck_filename TEXT,
  language TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.startup_applications ENABLE ROW LEVEL SECURITY;

-- No public read; only service role (used by edge function) can read/write.
-- We intentionally do NOT add an INSERT policy for anon; the edge function uses service role.

CREATE INDEX idx_startup_applications_created_at ON public.startup_applications (created_at DESC);
CREATE INDEX idx_startup_applications_email ON public.startup_applications (email);

-- Storage bucket for pitch deck uploads (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('startup-applications', 'startup-applications', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous uploads ONLY into this bucket (write-only).
CREATE POLICY "Anyone can upload pitch deck to startup-applications"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'startup-applications');
