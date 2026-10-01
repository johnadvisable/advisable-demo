-- Drop foreign key constraints first
ALTER TABLE public.partner_translations DROP CONSTRAINT IF EXISTS partner_translations_partner_id_fkey;
ALTER TABLE public.partner_partner_categories DROP CONSTRAINT IF EXISTS partner_partner_categories_partner_id_fkey;

-- Convert partners.id from text to uuid
ALTER TABLE public.partners ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;
ALTER TABLE public.partners ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Convert partner_translations.partner_id from text to uuid
ALTER TABLE public.partner_translations ALTER COLUMN partner_id SET DATA TYPE uuid USING partner_id::uuid;

-- Convert partner_partner_categories.partner_id from text to uuid  
ALTER TABLE public.partner_partner_categories ALTER COLUMN partner_id SET DATA TYPE uuid USING partner_id::uuid;

-- Re-add foreign key constraints
ALTER TABLE public.partner_translations ADD CONSTRAINT partner_translations_partner_id_fkey 
  FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;
  
ALTER TABLE public.partner_partner_categories ADD CONSTRAINT partner_partner_categories_partner_id_fkey 
  FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;