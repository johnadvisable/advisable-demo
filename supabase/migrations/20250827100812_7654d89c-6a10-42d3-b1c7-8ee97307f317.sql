-- Create a temporary table with proper ordering
CREATE TEMP TABLE temp_partner_order AS
SELECT id, row_number() OVER (ORDER BY name) - 1 as new_display_order
FROM public.partners;

-- Update partners with proper sequential display_order values
UPDATE public.partners 
SET display_order = temp_partner_order.new_display_order
FROM temp_partner_order 
WHERE public.partners.id = temp_partner_order.id;