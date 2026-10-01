-- Fix partners table ID column to use auto-generated UUID
ALTER TABLE public.partners ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;
ALTER TABLE public.partners ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update partner_partner_categories table to use uuid type for partner_id
ALTER TABLE public.partner_partner_categories ALTER COLUMN partner_id SET DATA TYPE uuid USING partner_id::uuid;

-- Update partner_translations table to use uuid type for partner_id  
ALTER TABLE public.partner_translations ALTER COLUMN partner_id SET DATA TYPE uuid USING partner_id::text::uuid;