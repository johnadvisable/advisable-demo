-- Final batch of security fixes for remaining functions

CREATE OR REPLACE FUNCTION public.get_partner_categories(p_partner_id text)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN ARRAY(
    SELECT category 
    FROM public.partner_partner_categories 
    WHERE partner_id = p_partner_id
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_client_categories(p_client_id uuid)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN ARRAY(
    SELECT category 
    FROM public.client_categories 
    WHERE client_id = p_client_id
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(user_ip inet)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  attempt_count integer;
  time_window interval := '15 minutes';
  max_attempts integer := 5;
BEGIN
  -- Count recent failed attempts from this IP
  SELECT COUNT(*) INTO attempt_count
  FROM public.security_audit_log
  WHERE ip_address = user_ip
    AND action = 'auth_failed'
    AND created_at > NOW() - time_window;
  
  -- Return false if too many attempts
  IF attempt_count >= max_attempts THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_client_categories()
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  FROM client_categories;
  
  -- Filter and sort categories according to the specified order
  SELECT ARRAY_AGG(category)
  INTO sorted_categories
  FROM unnest(category_order) AS category
  WHERE category = ANY(COALESCE(db_categories, ARRAY[]::TEXT[]));
  
  RETURN COALESCE(sorted_categories, ARRAY[]::TEXT[]);
END;
$function$;