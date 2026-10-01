-- Add SEO fields to service_categories table
ALTER TABLE public.service_categories
ADD COLUMN seo_title TEXT,
ADD COLUMN seo_description TEXT,
ADD COLUMN hero_image TEXT,
ADD COLUMN icon_name VARCHAR(100);

-- Update existing categories with SEO data
UPDATE public.service_categories
SET seo_title = 'Advisable Digital Agency',
    seo_description = 'Transform your digital presence with Advisable Digital Agency. Expert web development, digital marketing, UX/UI design and creative solutions that drive business growth.',
    icon_name = 'Rocket'
WHERE slug = 'digital-agency';

UPDATE public.service_categories
SET seo_title = 'Advisable Venture Studio',
    seo_description = 'Build the next big thing with Advisable Venture Studio. We partner with visionary founders to create, launch and scale innovative startups from concept to success.',
    icon_name = 'Lightbulb'
WHERE slug = 'venture-studio';