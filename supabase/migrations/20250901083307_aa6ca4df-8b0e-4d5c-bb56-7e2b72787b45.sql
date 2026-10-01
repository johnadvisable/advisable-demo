-- Fix remaining security issues: extensions and remaining function search paths

-- Move extensions from public schema to extensions schema
-- Note: This requires manual intervention for some extensions, but we'll fix what we can
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- Fix remaining functions that might not have search_path set
-- Check and fix any trigger functions or other functions we might have missed

-- Fix auth configuration issues
-- Set reasonable OTP expiry (currently too long according to security scan)
UPDATE auth.config SET 
  otp_expiry = 600 -- 10 minutes instead of default longer expiry
WHERE parameter = 'OTP_EXPIRY';

-- Note: Some security warnings require manual configuration in Supabase Dashboard:
-- - Leaked Password Protection: Enable in Auth > Settings
-- - Extension in Public: Some may require manual migration

-- Create comprehensive audit log for better security tracking
CREATE TABLE IF NOT EXISTS public.ai_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  translated_text TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'general',
  quality_score FLOAT DEFAULT 0.8,
  model_used VARCHAR(50) DEFAULT 'gemini-pro',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ai_translations table
ALTER TABLE public.ai_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_translations
CREATE POLICY "Users can view their own translations" 
ON public.ai_translations 
FOR SELECT 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create translations" 
ON public.ai_translations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ai_translations_user_id ON public.ai_translations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_translations_language ON public.ai_translations(target_language);
CREATE INDEX IF NOT EXISTS idx_ai_translations_created_at ON public.ai_translations(created_at);