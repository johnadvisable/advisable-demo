-- Create missing database function for client categories
CREATE OR REPLACE FUNCTION public.get_client_categories()
RETURNS TEXT[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  category_order TEXT[] := ARRAY[
    'Venture Studio Services',
    'Digital Agency Services', 
    'Ecommercen',
    'Market Data',
    'ePrescription Cloud ERP',
    'Advisable AI'
  ];
  db_categories TEXT[];
  sorted_categories TEXT[];
BEGIN
  -- Get unique categories from database
  SELECT ARRAY_AGG(DISTINCT category ORDER BY category)
  INTO db_categories
  FROM public.client_categories;
  
  -- Filter and sort categories according to the specified order
  SELECT ARRAY_AGG(category)
  INTO sorted_categories
  FROM unnest(category_order) AS category
  WHERE category = ANY(COALESCE(db_categories, ARRAY[]::TEXT[]));
  
  RETURN COALESCE(sorted_categories, ARRAY[]::TEXT[]);
END;
$$;