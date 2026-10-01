-- Update icon names in the base products table features JSONB
UPDATE products 
SET features = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'icon' = 'BarChart3' THEN jsonb_set(elem, '{icon}', '"chart-no-axes-column"')
      WHEN elem->>'icon' = 'FileCode' THEN jsonb_set(elem, '{icon}', '"file-code"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(features) AS elem
)
WHERE id = '7cf28a46-72e0-4130-8864-b9b659b0d35c';

-- Update icon names in product_translations features JSONB
UPDATE product_translations 
SET features = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'icon' = 'BarChart3' THEN jsonb_set(elem, '{icon}', '"chart-no-axes-column"')
      WHEN elem->>'icon' = 'FileCode' THEN jsonb_set(elem, '{icon}', '"file-code"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(features) AS elem
)
WHERE product_id = '7cf28a46-72e0-4130-8864-b9b659b0d35c' AND features IS NOT NULL;