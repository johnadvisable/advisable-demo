
-- Move Pixaera to the middle
UPDATE public.clients SET display_order = 15 WHERE slug = 'pixaera';

-- Insert SeaJets
WITH new_client AS (
  INSERT INTO public.clients (slug, logo, website, industry, country, product_category, featured, display_order)
  VALUES (
    'seajets',
    '/__l5e/assets-v1/fb4842d2-a826-42c9-a4c2-c4f11e8c9c62/seajets-logo.svg',
    'https://www.seajets.com',
    'Travel & Ferries',
    'Greece',
    'Digital Agency',
    true,
    1
  )
  RETURNING id
)
INSERT INTO public.clients_translations (client_id, language_id, name)
SELECT new_client.id, lang_id, 'SeaJets'
FROM new_client, unnest(ARRAY[1,2,3,4,5,10]) AS lang_id;
