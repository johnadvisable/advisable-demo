-- Fix Partners display_order: Replace 999/-1 values with proper sequential ordering
UPDATE public.partners 
SET display_order = row_number() OVER (ORDER BY name) - 1
WHERE display_order IS NULL OR display_order = 999 OR display_order = -1 OR display_order < 0;

-- Ensure all partners have valid display_order values (0, 1, 2, etc.)
WITH ordered_partners AS (
  SELECT id, row_number() OVER (ORDER BY display_order, name) - 1 as new_order
  FROM public.partners
)
UPDATE public.partners 
SET display_order = ordered_partners.new_order
FROM ordered_partners 
WHERE public.partners.id = ordered_partners.id;