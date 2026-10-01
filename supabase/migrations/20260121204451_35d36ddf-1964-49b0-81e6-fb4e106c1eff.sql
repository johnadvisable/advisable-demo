-- Add og_image and twitter_image fields to all content entities
-- These fields store URLs for social media preview images

-- 1. Services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- 2. Service Categories table
ALTER TABLE public.service_categories 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- 3. Products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- 4. Insights table
ALTER TABLE public.insights 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- 5. News table
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- 6. Investments table
ALTER TABLE public.investments 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- 7. Partners table
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- 8. Clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- 9. Static Pages table
ALTER TABLE public.static_pages 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.services.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.services.twitter_image IS 'Twitter card image URL for social sharing';
COMMENT ON COLUMN public.service_categories.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.service_categories.twitter_image IS 'Twitter card image URL for social sharing';
COMMENT ON COLUMN public.products.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.products.twitter_image IS 'Twitter card image URL for social sharing';
COMMENT ON COLUMN public.insights.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.insights.twitter_image IS 'Twitter card image URL for social sharing';
COMMENT ON COLUMN public.news.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.news.twitter_image IS 'Twitter card image URL for social sharing';
COMMENT ON COLUMN public.investments.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.investments.twitter_image IS 'Twitter card image URL for social sharing';
COMMENT ON COLUMN public.partners.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.partners.twitter_image IS 'Twitter card image URL for social sharing';
COMMENT ON COLUMN public.clients.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.clients.twitter_image IS 'Twitter card image URL for social sharing';
COMMENT ON COLUMN public.static_pages.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN public.static_pages.twitter_image IS 'Twitter card image URL for social sharing';