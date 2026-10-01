-- Create redirects table for old URLs
CREATE TABLE public.redirects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  old_path TEXT NOT NULL UNIQUE,
  new_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only admins can modify redirects" 
ON public.redirects 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to redirects" 
ON public.redirects 
FOR SELECT 
USING (true);

-- Add index for fast lookups
CREATE INDEX idx_redirects_old_path ON public.redirects(old_path);

-- Create function to get news item with translation by ID
CREATE OR REPLACE FUNCTION public.get_news_item_with_translation(p_news_item_id uuid, p_language_code character varying)
RETURNS TABLE(id uuid, title text, excerpt text, content text, featured_image text, published_date timestamp with time zone, type text, video_url text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  -- Get language ID
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  -- Get default language ID
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    n.id,
    COALESCE(
      (SELECT nt.title FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.title FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_default_language_id),
      'Untitled'
    ) AS title,
    COALESCE(
      (SELECT nt.excerpt FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.excerpt FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_default_language_id),
      ''
    ) AS excerpt,
    COALESCE(
      (SELECT nt.content FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_language_id),
      (SELECT nt.content FROM public.news_item_translations nt 
       WHERE nt.news_item_id = n.id AND nt.language_id = v_default_language_id),
      ''
    ) AS content,
    n.featured_image,
    n.published_date,
    n.type,
    n.video_url
  FROM public.news_items n
  WHERE n.id = p_news_item_id;
END;
$function$;