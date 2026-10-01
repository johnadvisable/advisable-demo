-- Add RLS policy to allow public role read access to products table
CREATE POLICY "Allow public role read access to products" 
  ON public.products 
  FOR SELECT 
  TO public
  USING (true);