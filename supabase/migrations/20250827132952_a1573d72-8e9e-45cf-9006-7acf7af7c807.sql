-- Add missing columns to team_members table
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS position text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS role_description text;

-- Update existing records to have non-null names if needed
UPDATE public.team_members 
SET name = COALESCE(name, 'Unknown'), 
    position = COALESCE(position, 'Team Member'),
    bio = COALESCE(bio, ''),
    role_description = COALESCE(role_description, position, 'Team Member')
WHERE name IS NULL OR position IS NULL;