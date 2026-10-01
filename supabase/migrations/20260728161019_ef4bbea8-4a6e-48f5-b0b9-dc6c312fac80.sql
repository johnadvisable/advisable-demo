UPDATE public.insights
SET featured_image = 'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/blog-images/insights/venture-studio-deck-evaluation.jpg'
WHERE id = 'fd043770-b334-4e34-b6c8-de34fc2da8d5';

UPDATE public.insights_translations
SET content = replace(content, '/images/insights/venture-studio-deck-evaluation', 'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/blog-images/insights/venture-studio-deck-evaluation')
WHERE insights_id = 'fd043770-b334-4e34-b6c8-de34fc2da8d5';