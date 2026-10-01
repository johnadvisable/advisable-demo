-- Rename blog_posts table to insights
ALTER TABLE public.blog_posts RENAME TO insights;

-- Rename blog_post_translations table to insights_translations
ALTER TABLE public.blog_post_translations RENAME TO insights_translations;

-- Rename the foreign key column in insights_translations
ALTER TABLE public.insights_translations RENAME COLUMN blog_post_id TO insights_id;

-- Update blog_categories target_table references
UPDATE public.blog_categories 
SET target_table = 'insights' 
WHERE target_table = 'blog_posts';

-- Update any existing RLS policies for the renamed tables
DROP POLICY IF EXISTS "Allow public read access to blog posts" ON public.insights;
DROP POLICY IF EXISTS "Only admins can delete blog_posts" ON public.insights;
DROP POLICY IF EXISTS "Only admins can insert blog_posts" ON public.insights;
DROP POLICY IF EXISTS "Only admins can update blog_posts" ON public.insights;

-- Create new RLS policies for insights table
CREATE POLICY "Allow public read access to insights" ON public.insights
FOR SELECT USING (true);

CREATE POLICY "Only admins can delete insights" ON public.insights
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert insights" ON public.insights
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update insights" ON public.insights
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Update RLS policies for insights_translations
DROP POLICY IF EXISTS "Only admins can modify blog_post_translations" ON public.insights_translations;
DROP POLICY IF EXISTS "Public read access to blog_post_translations" ON public.insights_translations;

CREATE POLICY "Only admins can modify insights_translations" ON public.insights_translations
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to insights_translations" ON public.insights_translations
FOR SELECT USING (true);

-- Update audit triggers if they exist
DROP TRIGGER IF EXISTS audit_trigger_blog_posts ON public.insights;
DROP TRIGGER IF EXISTS audit_trigger_blog_post_translations ON public.insights_translations;

CREATE TRIGGER audit_trigger_insights
AFTER INSERT OR UPDATE OR DELETE ON public.insights
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_trigger_insights_translations
AFTER INSERT OR UPDATE OR DELETE ON public.insights_translations
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();