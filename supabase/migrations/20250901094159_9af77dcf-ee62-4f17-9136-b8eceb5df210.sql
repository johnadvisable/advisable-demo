-- Add slug column to news_items table
ALTER TABLE public.news_items 
ADD COLUMN slug text;

-- Create a function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    slug_text text;
BEGIN
    -- Convert to lowercase, replace spaces and special chars with hyphens
    slug_text := lower(input_text);
    slug_text := regexp_replace(slug_text, '[^a-z0-9]+', '-', 'g');
    slug_text := trim(both '-' from slug_text);
    
    RETURN slug_text;
END;
$$;

-- Generate slugs for existing news items based on their English titles
UPDATE public.news_items 
SET slug = public.generate_slug(
    COALESCE(
        (SELECT title FROM public.news_item_translations 
         WHERE news_item_id = news_items.id 
         AND language_id = (SELECT id FROM public.languages WHERE code = 'en' LIMIT 1)
         LIMIT 1),
        'untitled-' || substring(news_items.id::text from 1 for 8)
    )
);

-- Handle potential duplicates by appending numbers
WITH duplicate_slugs AS (
    SELECT slug, COUNT(*) as count, 
           ARRAY_AGG(id ORDER BY created_at) as ids
    FROM public.news_items 
    WHERE slug IS NOT NULL
    GROUP BY slug 
    HAVING COUNT(*) > 1
)
UPDATE public.news_items 
SET slug = news_items.slug || '-' || (
    SELECT ROW_NUMBER() OVER (ORDER BY created_at) - 1
    FROM unnest(duplicate_slugs.ids) WITH ORDINALITY t(item_id, rn)
    WHERE item_id = news_items.id
)
FROM duplicate_slugs
WHERE news_items.slug = duplicate_slugs.slug
AND news_items.id = ANY(duplicate_slugs.ids);

-- Make slug NOT NULL and UNIQUE
ALTER TABLE public.news_items 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE public.news_items 
ADD CONSTRAINT news_items_slug_unique UNIQUE (slug);

-- Create index for performance
CREATE INDEX idx_news_items_slug ON public.news_items (slug);

-- Create function to get news item by slug
CREATE OR REPLACE FUNCTION public.get_news_item_by_slug_with_translation(p_slug text, p_language_code character varying)
RETURNS TABLE(id uuid, title text, excerpt text, content text, featured_image text, thumbnail_url text, published_date timestamp with time zone, type text, video_url text, slug text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
    n.thumbnail_url,
    n.published_date,
    n.type,
    n.video_url,
    n.slug
  FROM public.news_items n
  WHERE n.slug = p_slug;
END;
$$;

-- Update the existing function to include slug
CREATE OR REPLACE FUNCTION public.get_all_news_items_with_translation(p_language_code character varying)
RETURNS TABLE(id uuid, title text, excerpt text, content text, featured_image text, thumbnail_url text, published_date timestamp with time zone, type text, video_url text, slug text)
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
    n.thumbnail_url,
    n.published_date,
    n.type,
    n.video_url,
    n.slug
  FROM public.news_items n
  ORDER BY n.published_date DESC;
END;
$function$;