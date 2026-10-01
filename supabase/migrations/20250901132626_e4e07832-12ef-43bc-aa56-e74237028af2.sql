-- Create blog categories for categorization
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  keywords text[], -- Keywords to match for categorization
  target_table text NOT NULL CHECK (target_table IN ('blog_posts', 'news_items')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Only admins can modify blog_categories" 
ON public.blog_categories FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to blog_categories" 
ON public.blog_categories FOR SELECT 
USING (true);

-- Insert default categories
INSERT INTO public.blog_categories (name, slug, keywords, target_table) VALUES
('Insights', 'insights', ARRAY[
  'digital marketing', 'social media', 'facebook', 'instagram', 'twitter', 'linkedin',
  'seo', 'sem', 'content marketing', 'email marketing', 'analytics', 'strategy',
  'branding', 'advertising', 'campaigns', 'conversion', 'optimization', 'growth',
  'engagement', 'influencer', 'viral', 'trends', 'insights', 'tips', 'guide',
  'best practices', 'roi', 'kpi', 'metrics', 'algorithm', 'organic', 'paid',
  'b2b', 'b2c', 'ecommerce', 'mobile', 'video marketing', 'storytelling'
], 'blog_posts'),
('News', 'news', ARRAY[
  'news', 'announcement', 'update', 'launch', 'release', 'event', 'conference',
  'award', 'partnership', 'collaboration', 'acquisition', 'funding', 'expansion',
  'milestone', 'achievement', 'recognition', 'press', 'media', 'report',
  'study', 'research', 'survey', 'trend report', 'industry news', 'breaking',
  'latest', 'new', 'upcoming', 'recent', 'current', 'today', 'this week'
], 'news_items');

-- Create function to categorize content
CREATE OR REPLACE FUNCTION public.categorize_blog_content(
  p_title text,
  p_content text
) RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_content_lower text;
  v_category_rec record;
  v_match_count integer;
  v_best_category text := 'insights'; -- default
  v_best_match_count integer := 0;
BEGIN
  -- Combine title and content, convert to lowercase
  v_content_lower := lower(p_title || ' ' || p_content);
  
  -- Check each category's keywords
  FOR v_category_rec IN 
    SELECT slug, keywords, target_table 
    FROM public.blog_categories 
  LOOP
    -- Count keyword matches
    SELECT COUNT(*) INTO v_match_count
    FROM unnest(v_category_rec.keywords) AS keyword
    WHERE v_content_lower LIKE '%' || lower(keyword) || '%';
    
    -- If this category has more matches, use it
    IF v_match_count > v_best_match_count THEN
      v_best_match_count := v_match_count;
      v_best_category := v_category_rec.slug;
    END IF;
  END LOOP;
  
  RETURN v_best_category;
END;
$$;