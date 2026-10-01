-- Step 1: Drop the existing constraint temporarily
ALTER TABLE public.blog_categories DROP CONSTRAINT IF EXISTS blog_categories_target_table_check;

-- Step 2: Rename tables first
ALTER TABLE public.blog_posts RENAME TO insights;
ALTER TABLE public.blog_post_translations RENAME TO insights_translations;

-- Step 3: Rename the foreign key column
ALTER TABLE public.insights_translations RENAME COLUMN blog_post_id TO insights_id;

-- Step 4: Update the data references
UPDATE public.blog_categories 
SET target_table = 'insights' 
WHERE target_table = 'blog_posts';

-- Step 5: Add the constraint back with correct values
ALTER TABLE public.blog_categories 
ADD CONSTRAINT blog_categories_target_table_check 
CHECK (target_table IN ('insights', 'news_items'));

-- Step 6: Update RLS policies for insights
DROP POLICY IF EXISTS "Allow public read access to blog posts" ON public.insights;
DROP POLICY IF EXISTS "Only admins can delete blog_posts" ON public.insights;
DROP POLICY IF EXISTS "Only admins can insert blog_posts" ON public.insights;
DROP POLICY IF EXISTS "Only admins can update blog_posts" ON public.insights;

CREATE POLICY "Allow public read access to insights" ON public.insights
FOR SELECT USING (true);

CREATE POLICY "Only admins can delete insights" ON public.insights
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert insights" ON public.insights
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update insights" ON public.insights
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 7: Update RLS policies for insights_translations
DROP POLICY IF EXISTS "Only admins can modify blog_post_translations" ON public.insights_translations;
DROP POLICY IF EXISTS "Public read access to blog_post_translations" ON public.insights_translations;

CREATE POLICY "Only admins can modify insights_translations" ON public.insights_translations
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access to insights_translations" ON public.insights_translations
FOR SELECT USING (true);