-- Add missing columns to clients table only (translations table already has them)
ALTER TABLE public.clients 
ADD COLUMN name text NOT NULL DEFAULT 'Unnamed Client',
ADD COLUMN description text,
ADD COLUMN testimonial text,
ADD COLUMN case_study_challenge text,
ADD COLUMN case_study_solution text;

-- Remove the default after adding the column
ALTER TABLE public.clients ALTER COLUMN name DROP DEFAULT;