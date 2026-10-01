-- Create user roles system to fix critical admin authentication bypass

-- Create enum for application roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update existing admin-related tables with proper RLS policies

-- Fix credentials table policies
DROP POLICY IF EXISTS "Authenticated users can insert credentials" ON public.credentials;
DROP POLICY IF EXISTS "Authenticated users can update credentials" ON public.credentials;
DROP POLICY IF EXISTS "Authenticated users can delete credentials" ON public.credentials;

CREATE POLICY "Only admins can insert credentials" 
ON public.credentials 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update credentials" 
ON public.credentials 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete credentials" 
ON public.credentials 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Fix clients table policies
DROP POLICY IF EXISTS "Authenticated users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;

CREATE POLICY "Only admins can insert clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update clients" 
ON public.clients 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete clients" 
ON public.clients 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Fix other admin tables
-- Blog posts
DROP POLICY IF EXISTS "Authenticated users can insert blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog_posts" ON public.blog_posts;

CREATE POLICY "Only admins can insert blog_posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update blog_posts" 
ON public.blog_posts 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete blog_posts" 
ON public.blog_posts 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- News items
DROP POLICY IF EXISTS "Authenticated users can insert news_items" ON public.news_items;
DROP POLICY IF EXISTS "Authenticated users can update news_items" ON public.news_items;
DROP POLICY IF EXISTS "Authenticated users can delete news_items" ON public.news_items;

CREATE POLICY "Only admins can insert news_items" 
ON public.news_items 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update news_items" 
ON public.news_items 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete news_items" 
ON public.news_items 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Products
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "Only admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update products" 
ON public.products 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete products" 
ON public.products 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Services
DROP POLICY IF EXISTS "Authenticated users can insert services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON public.services;

CREATE POLICY "Only admins can insert services" 
ON public.services 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update services" 
ON public.services 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete services" 
ON public.services 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Team members
DROP POLICY IF EXISTS "Authenticated users can insert team_members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated users can update team_members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated users can delete team_members" ON public.team_members;

CREATE POLICY "Only admins can insert team_members" 
ON public.team_members 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update team_members" 
ON public.team_members 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete team_members" 
ON public.team_members 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Metrics
DROP POLICY IF EXISTS "Authenticated users can insert metrics" ON public.metrics;
DROP POLICY IF EXISTS "Authenticated users can update metrics" ON public.metrics;
DROP POLICY IF EXISTS "Authenticated users can delete metrics" ON public.metrics;

CREATE POLICY "Only admins can insert metrics" 
ON public.metrics 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update metrics" 
ON public.metrics 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete metrics" 
ON public.metrics 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Partners
DROP POLICY IF EXISTS "Authenticated users can insert partners" ON public.partners;
DROP POLICY IF EXISTS "Authenticated users can update partners" ON public.partners;
DROP POLICY IF EXISTS "Authenticated users can delete partners" ON public.partners;

CREATE POLICY "Only admins can insert partners" 
ON public.partners 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update partners" 
ON public.partners 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete partners" 
ON public.partners 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Hero content
DROP POLICY IF EXISTS "Authenticated users can insert hero_content" ON public.hero_content;
DROP POLICY IF EXISTS "Authenticated users can update hero_content" ON public.hero_content;
DROP POLICY IF EXISTS "Authenticated users can delete hero_content" ON public.hero_content;

CREATE POLICY "Only admins can insert hero_content" 
ON public.hero_content 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update hero_content" 
ON public.hero_content 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete hero_content" 
ON public.hero_content 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Company info
DROP POLICY IF EXISTS "Authenticated users can insert company_info" ON public.company_info;
DROP POLICY IF EXISTS "Authenticated users can update company_info" ON public.company_info;
DROP POLICY IF EXISTS "Authenticated users can delete company_info" ON public.company_info;

CREATE POLICY "Only admins can insert company_info" 
ON public.company_info 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update company_info" 
ON public.company_info 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete company_info" 
ON public.company_info 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies to translation tables that were missing them

-- Enable RLS on all translation tables
ALTER TABLE public.clients_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_item_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_value_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_categories_translations ENABLE ROW LEVEL SECURITY;

-- Add policies for translation tables
-- Public read, admin write pattern for all translation tables

-- Clients translations
CREATE POLICY "Public read access to clients_translations" 
ON public.clients_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify clients_translations" 
ON public.clients_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Blog post translations
CREATE POLICY "Public read access to blog_post_translations" 
ON public.blog_post_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify blog_post_translations" 
ON public.blog_post_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- News item translations
CREATE POLICY "Public read access to news_item_translations" 
ON public.news_item_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify news_item_translations" 
ON public.news_item_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Product translations
CREATE POLICY "Public read access to product_translations" 
ON public.product_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify product_translations" 
ON public.product_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Service translations
CREATE POLICY "Public read access to service_translations" 
ON public.service_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify service_translations" 
ON public.service_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Services translations
CREATE POLICY "Public read access to services_translations" 
ON public.services_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify services_translations" 
ON public.services_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Credential translations
CREATE POLICY "Public read access to credential_translations" 
ON public.credential_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify credential_translations" 
ON public.credential_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Hero content translations
CREATE POLICY "Public read access to hero_content_translations" 
ON public.hero_content_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify hero_content_translations" 
ON public.hero_content_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Team member translations
CREATE POLICY "Public read access to team_member_translations" 
ON public.team_member_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify team_member_translations" 
ON public.team_member_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Metric translations
CREATE POLICY "Public read access to metric_translations" 
ON public.metric_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify metric_translations" 
ON public.metric_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Company value translations
CREATE POLICY "Public read access to company_value_translations" 
ON public.company_value_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify company_value_translations" 
ON public.company_value_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Partner translations
CREATE POLICY "Public read access to partner_translations" 
ON public.partner_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify partner_translations" 
ON public.partner_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Partner category translations
CREATE POLICY "Public read access to partner_category_translations" 
ON public.partner_category_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify partner_category_translations" 
ON public.partner_category_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Company info translations
CREATE POLICY "Public read access to company_info_translations" 
ON public.company_info_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify company_info_translations" 
ON public.company_info_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Services categories translations
CREATE POLICY "Public read access to services_categories_translations" 
ON public.services_categories_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify services_categories_translations" 
ON public.services_categories_translations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();