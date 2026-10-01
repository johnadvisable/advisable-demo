-- Fix team_members RLS policies to prevent email exposure
-- Drop the redundant/conflicting policies
DROP POLICY IF EXISTS "Admins can view all team member data including emails" ON public.team_members;
DROP POLICY IF EXISTS "Restrict team_members access to admins and secure functions onl" ON public.team_members;

-- Create a single, clear SELECT policy that only allows admin access to the table directly
CREATE POLICY "Only admins can select team_members table directly" 
ON public.team_members 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure the public function can still access the table via SECURITY DEFINER
-- (This allows the get_all_team_members_public_safe function to work while excluding emails)

-- Add a comment to clarify the security model
COMMENT ON TABLE public.team_members IS 'Team members table with email addresses. Direct access restricted to admins only. Public access should use get_all_team_members_public_safe function which excludes sensitive data.';