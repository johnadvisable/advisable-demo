-- Clean up duplicate company_info records by keeping only one
WITH ranked_company_info AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.company_info
)
DELETE FROM public.company_info 
WHERE id IN (
  SELECT id FROM ranked_company_info WHERE rn > 1
);