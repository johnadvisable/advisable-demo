-- CRITICAL SECURITY FIX: Restrict ai_translations table access
-- Remove dangerous public read access that exposes user translation data

-- Remove the existing public read policy that allows anyone to access all translation data
DROP POLICY IF EXISTS "Public read access to ai_translations" ON public.ai_translations;

-- Add secure user-specific policies
-- Users can only view their own translation data
CREATE POLICY "Users can view their own ai_translations" 
ON public.ai_translations 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can only insert their own translation data  
CREATE POLICY "Users can insert their own ai_translations" 
ON public.ai_translations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow service role (for edge functions) to insert translations
CREATE POLICY "Service role can insert ai_translations"
ON public.ai_translations
FOR INSERT
TO service_role
WITH CHECK (true);

-- Keep admin access for legitimate administrative purposes
-- First ensure the admin policy exists with correct permissions
DROP POLICY IF EXISTS "Admins can manage all ai_translations" ON public.ai_translations;
CREATE POLICY "Admins can manage all ai_translations" 
ON public.ai_translations 
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));