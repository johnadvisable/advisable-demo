-- CRITICAL SECURITY FIXES MIGRATION
-- Phase 1: Enable RLS on unprotected tables and create security policies

-- Enable RLS on company_values table if not already enabled
ALTER TABLE public.company_values ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for company_values
CREATE POLICY "Public read access to company_values" 
ON public.company_values 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify company_values" 
ON public.company_values 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on service_categories if not already enabled
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service_categories
CREATE POLICY "Public read access to service_categories" 
ON public.service_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify service_categories" 
ON public.service_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on translations table
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for translations
CREATE POLICY "Public read access to translations" 
ON public.translations 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify translations" 
ON public.translations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on languages table
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for languages
CREATE POLICY "Public read access to languages" 
ON public.languages 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify languages" 
ON public.languages 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on company_metrics if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_metrics' AND table_schema = 'public') THEN
        ALTER TABLE public.company_metrics ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Public read access to company_metrics" 
        ON public.company_metrics 
        FOR SELECT 
        USING (true);

        CREATE POLICY "Only admins can modify company_metrics" 
        ON public.company_metrics 
        FOR ALL 
        USING (has_role(auth.uid(), 'admin'::app_role))
        WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Enable RLS on company_milestones if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_milestones' AND table_schema = 'public') THEN
        ALTER TABLE public.company_milestones ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Public read access to company_milestones" 
        ON public.company_milestones 
        FOR SELECT 
        USING (true);

        CREATE POLICY "Only admins can modify company_milestones" 
        ON public.company_milestones 
        FOR ALL 
        USING (has_role(auth.uid(), 'admin'::app_role))
        WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Enable RLS on company_testimonials if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_testimonials' AND table_schema = 'public') THEN
        ALTER TABLE public.company_testimonials ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Public read access to company_testimonials" 
        ON public.company_testimonials 
        FOR SELECT 
        USING (true);

        CREATE POLICY "Only admins can modify company_testimonials" 
        ON public.company_testimonials 
        FOR ALL 
        USING (has_role(auth.uid(), 'admin'::app_role))
        WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Phase 2: Fix search_path security issues on database functions
-- Update all functions to include proper search_path

-- Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$function$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Fix get_default_language function
CREATE OR REPLACE FUNCTION public.get_default_language()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_default_language TEXT;
BEGIN
  SELECT code INTO v_default_language
  FROM public.languages
  WHERE is_default = TRUE
  LIMIT 1;
  
  RETURN COALESCE(v_default_language, 'en');
END;
$function$;

-- Add logging for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Only admins can read audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create audit trigger function with proper security
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;