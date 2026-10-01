-- Security hardening: Fix function search_path mutable issues
-- This prevents SQL injection and ensures functions always operate in the correct schema context

ALTER FUNCTION public._lang_id_from_code(text) SET search_path TO 'public';
ALTER FUNCTION public.generate_client_slug(text) SET search_path TO 'public';
ALTER FUNCTION public.generate_entity_seo_urls() SET search_path TO 'public';
ALTER FUNCTION public.generate_slug(text) SET search_path TO 'public';
ALTER FUNCTION public.generate_slug_from_text(text) SET search_path TO 'public';
ALTER FUNCTION public.get_all_blog_posts_with_translation(varchar) SET search_path TO 'public';
ALTER FUNCTION public.get_blog_post_by_id_with_translation(uuid, varchar) SET search_path TO 'public';
ALTER FUNCTION public.get_blog_post_by_slug_with_translation(text, varchar) SET search_path TO 'public';
ALTER FUNCTION public.get_clients_by_category_with_translation(text, varchar) SET search_path TO 'public';
ALTER FUNCTION public.get_hero_content_by_page_with_translation(text, varchar) SET search_path TO 'public';
ALTER FUNCTION public.get_news_item_with_translation(uuid, text) SET search_path TO 'public';
ALTER FUNCTION public.get_service_category_with_translation(uuid, varchar) SET search_path TO 'public';
ALTER FUNCTION public.get_services_by_category_with_translation(uuid, varchar) SET search_path TO 'public';
ALTER FUNCTION public.migrate_company_value_translations() SET search_path TO 'public';
ALTER FUNCTION public.migrate_credential_translations() SET search_path TO 'public';
ALTER FUNCTION public.migrate_hero_content_translations() SET search_path TO 'public';
ALTER FUNCTION public.migrate_metric_translations() SET search_path TO 'public';
ALTER FUNCTION public.migrate_product_translations() SET search_path TO 'public';
ALTER FUNCTION public.migrate_service_category_translations() SET search_path TO 'public';
ALTER FUNCTION public.migrate_service_translations() SET search_path TO 'public';
ALTER FUNCTION public.update_blog_post_translations_updated_at() SET search_path TO 'public';
ALTER FUNCTION public.update_blog_posts_updated_at() SET search_path TO 'public';
