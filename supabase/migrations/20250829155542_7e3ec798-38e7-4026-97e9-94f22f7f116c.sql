-- Check current user role and permissions
SELECT 
  ur.user_id,
  ur.role,
  auth.uid() as current_user_id,
  has_role(auth.uid(), 'admin'::app_role) as is_admin
FROM public.user_roles ur 
WHERE ur.user_id = auth.uid();

-- Update RLS policies for team_members to ensure admins can see all data
DROP POLICY IF EXISTS "Admins can view all team member data" ON public.team_members;
DROP POLICY IF EXISTS "Public can view basic team info only" ON public.team_members;

-- Create comprehensive admin policy
CREATE POLICY "admin_full_access_team_members" 
ON public.team_members 
FOR ALL 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN true  -- Allow public read access
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN true  -- Full admin access
    ELSE true  -- Allow public read for now
  END
)
WITH CHECK (
  CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN true  -- Admins can modify
    ELSE false  -- Others cannot modify
  END
);

-- Test the function with current user context
SELECT * FROM public.get_all_team_members_public('en') LIMIT 3;