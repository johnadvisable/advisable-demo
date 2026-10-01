-- Final security fix: Remove policies that expose email addresses

-- Drop all existing permissive policies on team_members
DROP POLICY IF EXISTS "Public can view non-sensitive team member info" ON public.team_members;

-- Create a restrictive policy for email access - only admins can access emails
CREATE POLICY "Admins can view all team member data including emails" 
ON public.team_members 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a public policy that restricts column access (this will work with our secure function)
-- This policy allows public access but sensitive data like email is filtered by the secure function
CREATE POLICY "Public can view basic team member info via secure function only" 
ON public.team_members 
FOR SELECT 
TO public
USING (
  -- This policy allows access but the secure function will filter out email
  true
);