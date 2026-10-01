-- Add icon_name column to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS icon_name VARCHAR(50);

-- Update Digital Agency services with Lucide icon names
UPDATE public.services SET icon_name = 'ShoppingCart' WHERE slug = 'e-commerce-solutions';
UPDATE public.services SET icon_name = 'Smartphone' WHERE slug = 'mobile-app-development';
UPDATE public.services SET icon_name = 'Palette' WHERE slug = 'ui-ux-design';
UPDATE public.services SET icon_name = 'TrendingUp' WHERE slug = 'digital-marketing';
UPDATE public.services SET icon_name = 'LineChart' WHERE slug = 'marketing-growth';
UPDATE public.services SET icon_name = 'PenTool' WHERE slug = 'content-creation';
UPDATE public.services SET icon_name = 'Target' WHERE slug = 'brand-strategy';
UPDATE public.services SET icon_name = 'Video' WHERE slug = 'video-creation';
UPDATE public.services SET icon_name = 'Search' WHERE slug = 'google-ads-campaigns';
UPDATE public.services SET icon_name = 'Users' WHERE slug = 'meta-ads-campaigns';

-- Update Venture Studio services with Lucide icon names
UPDATE public.services SET icon_name = 'Rocket' WHERE slug = 'startup-incubation';
UPDATE public.services SET icon_name = 'Lightbulb' WHERE slug = 'consulting';
UPDATE public.services SET icon_name = 'Cog' WHERE slug = 'venture-product-development';
UPDATE public.services SET icon_name = 'Zap' WHERE slug = 'startup-growth-acceleration';
UPDATE public.services SET icon_name = 'Code' WHERE slug = 'development';
UPDATE public.services SET icon_name = 'Wrench' WHERE slug = 'technology-services';
UPDATE public.services SET icon_name = 'BarChart3' WHERE slug = 'data';
UPDATE public.services SET icon_name = 'GraduationCap' WHERE slug = 'mentorship-expertise';
UPDATE public.services SET icon_name = 'Search' WHERE slug = 'market-research';
UPDATE public.services SET icon_name = 'Brush' WHERE slug = 'creatives';