-- Step 1: Add parent_service_id and is_parent columns to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS parent_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_parent BOOLEAN DEFAULT false;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_services_parent_id ON services(parent_service_id);

-- Step 2: Create 5 Parent Services for Digital Agency (with emoji field)
INSERT INTO services (id, category_id, slug, emoji, icon_name, display_order, is_parent, parent_service_id)
SELECT 
  gen_random_uuid(),
  sc.id,
  unnest(ARRAY['seo-ai-visibility', 'paid-growth-systems', 'ai-creative-studio', 'conversion-revenue-optimization', 'brand-product-story']),
  unnest(ARRAY['🔍', '📈', '✨', '📊', '🎨']),
  unnest(ARRAY['Search', 'TrendingUp', 'Sparkles', 'LineChart', 'Palette']),
  unnest(ARRAY[1, 2, 3, 4, 5]),
  true,
  NULL
FROM service_categories sc
WHERE sc.slug = 'digital-agency';

-- Step 3: Create English translations for parent services
INSERT INTO service_translations (service_id, language_id, title, short_description, long_description)
SELECT 
  s.id,
  l.id,
  CASE s.slug
    WHEN 'seo-ai-visibility' THEN 'SEO & AI Visibility'
    WHEN 'paid-growth-systems' THEN 'Paid Growth Systems'
    WHEN 'ai-creative-studio' THEN 'AI Creative Studio'
    WHEN 'conversion-revenue-optimization' THEN 'Conversion & Revenue Optimization'
    WHEN 'brand-product-story' THEN 'Brand & Product Story'
  END,
  CASE s.slug
    WHEN 'seo-ai-visibility' THEN 'Optimize your digital presence for search engines and AI platforms'
    WHEN 'paid-growth-systems' THEN 'Strategic paid advertising across all major platforms'
    WHEN 'ai-creative-studio' THEN 'AI-powered content and video creation'
    WHEN 'conversion-revenue-optimization' THEN 'Maximize conversions and revenue through technology'
    WHEN 'brand-product-story' THEN 'Craft compelling brand narratives and experiences'
  END,
  CASE s.slug
    WHEN 'seo-ai-visibility' THEN '<p>Comprehensive SEO and AI visibility services to ensure your brand is discoverable across traditional search engines and emerging AI platforms.</p>'
    WHEN 'paid-growth-systems' THEN '<p>Full-funnel paid advertising strategies across Google, Meta, TikTok, and other platforms to drive measurable growth.</p>'
    WHEN 'ai-creative-studio' THEN '<p>Leverage AI to create stunning content and videos that engage your audience and tell your story.</p>'
    WHEN 'conversion-revenue-optimization' THEN '<p>Data-driven optimization strategies and cutting-edge technology to maximize your conversion rates and revenue.</p>'
    WHEN 'brand-product-story' THEN '<p>Strategic brand development and design services that create memorable experiences and lasting impressions.</p>'
  END
FROM services s
CROSS JOIN languages l
WHERE s.slug IN ('seo-ai-visibility', 'paid-growth-systems', 'ai-creative-studio', 'conversion-revenue-optimization', 'brand-product-story')
AND s.is_parent = true
AND l.code = 'en';

-- Step 4: Create Greek translations for parent services
INSERT INTO service_translations (service_id, language_id, title, short_description, long_description)
SELECT 
  s.id,
  l.id,
  CASE s.slug
    WHEN 'seo-ai-visibility' THEN 'SEO & AI Visibility'
    WHEN 'paid-growth-systems' THEN 'Συστήματα Πληρωμένης Ανάπτυξης'
    WHEN 'ai-creative-studio' THEN 'AI Creative Studio'
    WHEN 'conversion-revenue-optimization' THEN 'Βελτιστοποίηση Μετατροπών & Εσόδων'
    WHEN 'brand-product-story' THEN 'Brand & Product Story'
  END,
  CASE s.slug
    WHEN 'seo-ai-visibility' THEN 'Βελτιστοποιήστε την ψηφιακή σας παρουσία για μηχανές αναζήτησης και πλατφόρμες AI'
    WHEN 'paid-growth-systems' THEN 'Στρατηγική πληρωμένη διαφήμιση σε όλες τις μεγάλες πλατφόρμες'
    WHEN 'ai-creative-studio' THEN 'Δημιουργία περιεχομένου και βίντεο με τη δύναμη του AI'
    WHEN 'conversion-revenue-optimization' THEN 'Μεγιστοποιήστε τις μετατροπές και τα έσοδα μέσω τεχνολογίας'
    WHEN 'brand-product-story' THEN 'Δημιουργήστε συναρπαστικές ιστορίες brand και εμπειρίες'
  END,
  CASE s.slug
    WHEN 'seo-ai-visibility' THEN '<p>Ολοκληρωμένες υπηρεσίες SEO και AI visibility για να διασφαλίσετε ότι το brand σας είναι ανακαλύψιμο.</p>'
    WHEN 'paid-growth-systems' THEN '<p>Στρατηγικές πληρωμένης διαφήμισης σε Google, Meta, TikTok και άλλες πλατφόρμες.</p>'
    WHEN 'ai-creative-studio' THEN '<p>Αξιοποιήστε το AI για να δημιουργήσετε εντυπωσιακό περιεχόμενο και βίντεο.</p>'
    WHEN 'conversion-revenue-optimization' THEN '<p>Στρατηγικές βελτιστοποίησης βασισμένες σε δεδομένα για μεγιστοποίηση μετατροπών.</p>'
    WHEN 'brand-product-story' THEN '<p>Στρατηγική ανάπτυξη brand και σχεδιαστικές υπηρεσίες που δημιουργούν αξέχαστες εμπειρίες.</p>'
  END
FROM services s
CROSS JOIN languages l
WHERE s.slug IN ('seo-ai-visibility', 'paid-growth-systems', 'ai-creative-studio', 'conversion-revenue-optimization', 'brand-product-story')
AND s.is_parent = true
AND l.code = 'el';

-- Step 5: Create 5 New Child Services (with emoji field)
INSERT INTO services (id, category_id, slug, emoji, icon_name, display_order, is_parent, parent_service_id)
SELECT 
  gen_random_uuid(),
  sc.id,
  child_data.slug,
  child_data.emoji,
  child_data.icon,
  child_data.display_order,
  false,
  parent.id
FROM service_categories sc
CROSS JOIN (VALUES 
  ('seo-ai-visibility-implementation', '🪄', 'Wand2', 2, 'seo-ai-visibility'),
  ('tracking-attribution', '🎯', 'Target', 8, 'paid-growth-systems'),
  ('ai-web-app-development', '🌐', 'Globe', 4, 'conversion-revenue-optimization'),
  ('ai-automations-agents', '🤖', 'Bot', 6, 'conversion-revenue-optimization'),
  ('ai-mvp-build', '🚀', 'Rocket', 8, 'conversion-revenue-optimization')
) AS child_data(slug, emoji, icon, display_order, parent_slug)
JOIN services parent ON parent.slug = child_data.parent_slug AND parent.is_parent = true
WHERE sc.slug = 'digital-agency';

-- Step 6: Create English translations for new child services
INSERT INTO service_translations (service_id, language_id, title, short_description, long_description)
SELECT 
  s.id,
  l.id,
  CASE s.slug
    WHEN 'seo-ai-visibility-implementation' THEN 'SEO & AI Visibility Implementation'
    WHEN 'tracking-attribution' THEN 'Tracking & Attribution'
    WHEN 'ai-web-app-development' THEN 'AI Web & App Development'
    WHEN 'ai-automations-agents' THEN 'AI Automations & Agents'
    WHEN 'ai-mvp-build' THEN 'AI MVP Build (Launch Sprint)'
  END,
  CASE s.slug
    WHEN 'seo-ai-visibility-implementation' THEN 'Technical SEO implementation and AI-ready content optimization'
    WHEN 'tracking-attribution' THEN 'Advanced tracking setup and multi-touch attribution modeling'
    WHEN 'ai-web-app-development' THEN 'Modern web and app development powered by AI technologies'
    WHEN 'ai-automations-agents' THEN 'Intelligent automation workflows and AI agent development'
    WHEN 'ai-mvp-build' THEN 'Rapid MVP development sprints to validate and launch your product'
  END,
  CASE s.slug
    WHEN 'seo-ai-visibility-implementation' THEN '<p>Complete technical SEO implementation including on-page optimization, schema markup, Core Web Vitals, and AI-ready content structuring.</p>'
    WHEN 'tracking-attribution' THEN '<p>Server-side tracking, conversion API setup, multi-touch attribution modeling, and comprehensive analytics implementation.</p>'
    WHEN 'ai-web-app-development' THEN '<p>Build modern, scalable web applications and mobile apps leveraging AI for enhanced functionality and user experience.</p>'
    WHEN 'ai-automations-agents' THEN '<p>Design and deploy intelligent automation workflows and AI agents that streamline operations and enhance productivity.</p>'
    WHEN 'ai-mvp-build' THEN '<p>Accelerated MVP development using AI-powered tools and methodologies. Launch your product in weeks, not months.</p>'
  END
FROM services s
CROSS JOIN languages l
WHERE s.slug IN ('seo-ai-visibility-implementation', 'tracking-attribution', 'ai-web-app-development', 'ai-automations-agents', 'ai-mvp-build')
AND s.is_parent = false
AND l.code = 'en';

-- Step 7: Create Greek translations for new child services
INSERT INTO service_translations (service_id, language_id, title, short_description, long_description)
SELECT 
  s.id,
  l.id,
  CASE s.slug
    WHEN 'seo-ai-visibility-implementation' THEN 'SEO & AI Visibility Implementation'
    WHEN 'tracking-attribution' THEN 'Tracking & Attribution'
    WHEN 'ai-web-app-development' THEN 'AI Web & App Development'
    WHEN 'ai-automations-agents' THEN 'AI Automations & Agents'
    WHEN 'ai-mvp-build' THEN 'AI MVP Build (Launch Sprint)'
  END,
  CASE s.slug
    WHEN 'seo-ai-visibility-implementation' THEN 'Τεχνική υλοποίηση SEO και βελτιστοποίηση περιεχομένου για AI'
    WHEN 'tracking-attribution' THEN 'Προηγμένη ρύθμιση tracking και μοντελοποίηση attribution'
    WHEN 'ai-web-app-development' THEN 'Ανάπτυξη web και εφαρμογών με τη δύναμη του AI'
    WHEN 'ai-automations-agents' THEN 'Έξυπνες αυτοματοποιήσεις και ανάπτυξη AI agents'
    WHEN 'ai-mvp-build' THEN 'Ταχεία ανάπτυξη MVP για επικύρωση και λανσάρισμα'
  END,
  CASE s.slug
    WHEN 'seo-ai-visibility-implementation' THEN '<p>Ολοκληρωμένη τεχνική υλοποίηση SEO συμπεριλαμβανομένης on-page βελτιστοποίησης και AI-ready δομής περιεχομένου.</p>'
    WHEN 'tracking-attribution' THEN '<p>Server-side tracking, conversion API, multi-touch attribution modeling και ολοκληρωμένη υλοποίηση analytics.</p>'
    WHEN 'ai-web-app-development' THEN '<p>Κατασκευή σύγχρονων web εφαρμογών και mobile apps αξιοποιώντας AI για βελτιωμένη λειτουργικότητα.</p>'
    WHEN 'ai-automations-agents' THEN '<p>Σχεδιασμός και ανάπτυξη έξυπνων αυτοματισμών και AI agents που βελτιστοποιούν τις λειτουργίες.</p>'
    WHEN 'ai-mvp-build' THEN '<p>Επιταχυνόμενη ανάπτυξη MVP με AI-powered εργαλεία. Λανσάρετε το προϊόν σας σε εβδομάδες.</p>'
  END
FROM services s
CROSS JOIN languages l
WHERE s.slug IN ('seo-ai-visibility-implementation', 'tracking-attribution', 'ai-web-app-development', 'ai-automations-agents', 'ai-mvp-build')
AND s.is_parent = false
AND l.code = 'el';

-- Step 8: Update existing services with their parent references
-- SEO & AI Visibility children
UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'seo-ai-visibility' AND is_parent = true), display_order = 1
WHERE slug = 'seo-audit';

-- Paid Growth Systems children
UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'paid-growth-systems' AND is_parent = true), display_order = 1
WHERE slug = 'performance-marketing';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'paid-growth-systems' AND is_parent = true), display_order = 2
WHERE slug = 'google-ads-campaigns';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'paid-growth-systems' AND is_parent = true), display_order = 3
WHERE slug = 'meta-ads-campaigns';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'paid-growth-systems' AND is_parent = true), display_order = 4
WHERE slug = 'tiktok-advertising';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'paid-growth-systems' AND is_parent = true), display_order = 6
WHERE slug = 'social-media-management';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'paid-growth-systems' AND is_parent = true), display_order = 7
WHERE slug = 'email-marketing';

-- AI Creative Studio children
UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'ai-creative-studio' AND is_parent = true), display_order = 1
WHERE slug = 'content-creation';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'ai-creative-studio' AND is_parent = true), display_order = 2
WHERE slug = 'video-creation';

-- Conversion & Revenue Optimization children
UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'conversion-revenue-optimization' AND is_parent = true), display_order = 1
WHERE slug = 'marketing-growth';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'conversion-revenue-optimization' AND is_parent = true), display_order = 3
WHERE slug = 'web-development';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'conversion-revenue-optimization' AND is_parent = true), display_order = 5
WHERE slug = 'mobile-app-development';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'conversion-revenue-optimization' AND is_parent = true), display_order = 7
WHERE slug = 'e-commerce-solutions';

-- Brand & Product Story children
UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'brand-product-story' AND is_parent = true), display_order = 1
WHERE slug = 'ui-ux-design';

UPDATE services SET parent_service_id = (SELECT id FROM services WHERE slug = 'brand-product-story' AND is_parent = true), display_order = 2
WHERE slug = 'brand-strategy';

-- Step 9: Delete obsolete digital-marketing service
DELETE FROM service_translations WHERE service_id = (SELECT id FROM services WHERE slug = 'digital-marketing');
DELETE FROM services WHERE slug = 'digital-marketing';

-- Step 10: Create RPC function for hierarchical services
CREATE OR REPLACE FUNCTION get_services_hierarchical(
  p_category_slug TEXT,
  p_language TEXT DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  short_description TEXT,
  icon_name TEXT,
  is_parent BOOLEAN,
  parent_service_id UUID,
  parent_slug TEXT,
  display_order INT,
  featured_image TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.slug,
    COALESCE(st.title, st_en.title, s.slug) as title,
    COALESCE(st.short_description, st_en.short_description, '') as short_description,
    s.icon_name,
    COALESCE(s.is_parent, false) as is_parent,
    s.parent_service_id,
    ps.slug as parent_slug,
    s.display_order,
    s.featured_image
  FROM services s
  JOIN service_categories sc ON s.category_id = sc.id
  LEFT JOIN languages l ON l.code = p_language
  LEFT JOIN service_translations st ON st.service_id = s.id AND st.language_id = l.id
  LEFT JOIN languages l_en ON l_en.code = 'en'
  LEFT JOIN service_translations st_en ON st_en.service_id = s.id AND st_en.language_id = l_en.id
  LEFT JOIN services ps ON s.parent_service_id = ps.id
  WHERE sc.slug = p_category_slug
  ORDER BY 
    CASE WHEN s.is_parent = true THEN 0 ELSE 1 END,
    COALESCE(ps.display_order, s.display_order),
    s.display_order;
END;
$$;