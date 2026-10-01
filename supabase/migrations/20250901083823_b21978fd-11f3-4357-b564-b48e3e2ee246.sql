-- Fix product translations constraint and create Gemini translation system

-- First, let's check the actual constraint name and fix it
ALTER TABLE public.product_translations 
DROP CONSTRAINT IF EXISTS product_translations_product_id_language_id_key;

-- Create the correct constraint name
ALTER TABLE public.product_translations 
ADD CONSTRAINT product_translations_product_id_language_id_key 
UNIQUE (product_id, language_id);

-- Create constraint for all other translation tables to ensure consistency
ALTER TABLE public.service_translations 
DROP CONSTRAINT IF EXISTS service_translations_service_id_language_id_key;
ALTER TABLE public.service_translations 
ADD CONSTRAINT service_translations_service_id_language_id_key 
UNIQUE (service_id, language_id);

ALTER TABLE public.news_item_translations 
DROP CONSTRAINT IF EXISTS news_item_translations_news_item_id_language_id_key;
ALTER TABLE public.news_item_translations 
ADD CONSTRAINT news_item_translations_news_item_id_language_id_key 
UNIQUE (news_item_id, language_id);

ALTER TABLE public.blog_post_translations 
DROP CONSTRAINT IF EXISTS blog_post_translations_blog_post_id_language_id_key;
ALTER TABLE public.blog_post_translations 
ADD CONSTRAINT blog_post_translations_blog_post_id_language_id_key 
UNIQUE (blog_post_id, language_id);

ALTER TABLE public.clients_translations 
DROP CONSTRAINT IF EXISTS clients_translations_client_id_language_id_key;
ALTER TABLE public.clients_translations 
ADD CONSTRAINT clients_translations_client_id_language_id_key 
UNIQUE (client_id, language_id);

ALTER TABLE public.partner_translations 
DROP CONSTRAINT IF EXISTS partner_translations_partner_id_language_id_key;
ALTER TABLE public.partner_translations 
ADD CONSTRAINT partner_translations_partner_id_language_id_key 
UNIQUE (partner_id, language_id);

ALTER TABLE public.team_member_translations 
DROP CONSTRAINT IF EXISTS team_member_translations_team_member_id_language_id_key;
ALTER TABLE public.team_member_translations 
ADD CONSTRAINT team_member_translations_team_member_id_language_id_key 
UNIQUE (team_member_id, language_id);

-- Create translation jobs table to track Gemini AI translation tasks
CREATE TABLE IF NOT EXISTS public.translation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  source_language VARCHAR(5) NOT NULL DEFAULT 'en',
  target_language VARCHAR(5) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  user_id UUID
);

-- Enable RLS on translation_jobs
ALTER TABLE public.translation_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for translation_jobs
CREATE POLICY "Admins can manage all translation_jobs" 
ON public.translation_jobs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_translation_jobs_status ON public.translation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_record ON public.translation_jobs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_created_at ON public.translation_jobs(created_at);