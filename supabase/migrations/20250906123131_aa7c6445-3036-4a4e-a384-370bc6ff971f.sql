-- Safer approach to swap service category IDs
-- Use a transaction to ensure data consistency

BEGIN;

-- Step 1: Create new temporary category records with swapped IDs
INSERT INTO public.service_categories (id, slug, created_at, updated_at)
SELECT 
  CASE 
    WHEN slug = 'digital-agency' THEN '164b114a-ccb9-4900-8777-70fb9dcb5108'::uuid
    WHEN slug = 'venture-studio' THEN '54d5b665-a721-4b1d-8c3f-517c402125de'::uuid
  END as id,
  slug,
  created_at,
  updated_at
FROM public.service_categories 
WHERE slug IN ('digital-agency', 'venture-studio')
ON CONFLICT (id) DO NOTHING;

-- Step 2: Update service_category_translations to reference the new IDs
UPDATE public.service_category_translations 
SET category_id = CASE 
  WHEN category_id = (SELECT id FROM public.service_categories WHERE slug = 'digital-agency' AND id != '164b114a-ccb9-4900-8777-70fb9dcb5108' LIMIT 1)
  THEN '164b114a-ccb9-4900-8777-70fb9dcb5108'::uuid
  WHEN category_id = (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' AND id != '54d5b665-a721-4b1d-8c3f-517c402125de' LIMIT 1) 
  THEN '54d5b665-a721-4b1d-8c3f-517c402125de'::uuid
  ELSE category_id
END
WHERE category_id IN (
  SELECT id FROM public.service_categories 
  WHERE slug IN ('digital-agency', 'venture-studio') 
  AND (
    (slug = 'digital-agency' AND id != '164b114a-ccb9-4900-8777-70fb9dcb5108') OR
    (slug = 'venture-studio' AND id != '54d5b665-a721-4b1d-8c3f-517c402125de')
  )
);

-- Step 3: Update services to reference the new category IDs  
UPDATE public.services 
SET category_id = CASE 
  WHEN category_id = (SELECT id FROM public.service_categories WHERE slug = 'digital-agency' AND id != '164b114a-ccb9-4900-8777-70fb9dcb5108' LIMIT 1)
  THEN '164b114a-ccb9-4900-8777-70fb9dcb5108'::uuid
  WHEN category_id = (SELECT id FROM public.service_categories WHERE slug = 'venture-studio' AND id != '54d5b665-a721-4b1d-8c3f-517c402125de' LIMIT 1)
  THEN '54d5b665-a721-4b1d-8c3f-517c402125de'::uuid  
  ELSE category_id
END
WHERE category_id IN (
  SELECT id FROM public.service_categories 
  WHERE slug IN ('digital-agency', 'venture-studio')
  AND (
    (slug = 'digital-agency' AND id != '164b114a-ccb9-4900-8777-70fb9dcb5108') OR
    (slug = 'venture-studio' AND id != '54d5b665-a721-4b1d-8c3f-517c402125de')
  )
);

-- Step 4: Delete the old category records with wrong IDs
DELETE FROM public.service_categories 
WHERE slug IN ('digital-agency', 'venture-studio')
AND (
  (slug = 'digital-agency' AND id != '164b114a-ccb9-4900-8777-70fb9dcb5108') OR
  (slug = 'venture-studio' AND id != '54d5b665-a721-4b1d-8c3f-517c402125de')
);

COMMIT;