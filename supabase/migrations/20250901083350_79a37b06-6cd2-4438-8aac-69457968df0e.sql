-- Create AI translations tracking table for the Gemini translation system
CREATE TABLE IF NOT EXISTS public.ai_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  translated_text TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'general',
  quality_score FLOAT DEFAULT 0.8,
  model_used VARCHAR(50) DEFAULT 'gemini-pro',
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ai_translations table
ALTER TABLE public.ai_translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_translations
CREATE POLICY "Admins can manage all ai_translations" 
ON public.ai_translations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to ai_translations" 
ON public.ai_translations 
FOR SELECT 
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_translations_language ON public.ai_translations(target_language);
CREATE INDEX IF NOT EXISTS idx_ai_translations_created_at ON public.ai_translations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_translations_content_type ON public.ai_translations(content_type);