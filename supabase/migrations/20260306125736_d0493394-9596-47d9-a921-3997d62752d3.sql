-- Add translatable jsonb columns to product_translations
ALTER TABLE public.product_translations
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stats jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS testimonials jsonb DEFAULT NULL;

-- Update the RPC to use translated features/stats/testimonials with fallback to base product
CREATE OR REPLACE FUNCTION public.get_product_by_slug_with_translation(p_slug text, p_language_code text)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  image_url text,
  hero_image text,
  website_url text,
  display_order integer,
  slug text,
  page_title text,
  page_subtitle text,
  page_description text,
  page_background_color text,
  highlight_color text,
  features jsonb,
  stats jsonb,
  testimonials jsonb,
  cta_section_title text,
  cta_section_description text,
  cta_button_text text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    p.id,
    COALESCE(
      (SELECT pt.title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      'Product'
    )::text AS title,
    COALESCE(
      (SELECT pt.description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS description,
    COALESCE(p.image_url, '')::text,
    COALESCE(p.hero_image, '')::text,
    COALESCE(p.website_url, '')::text,
    COALESCE(p.display_order, 0),
    COALESCE(p.slug, '')::text,
    COALESCE(
      (SELECT pt.page_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.page_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS page_title,
    COALESCE(
      (SELECT pt.page_subtitle FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.page_subtitle FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS page_subtitle,
    COALESCE(
      (SELECT pt.page_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.page_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS page_description,
    COALESCE(p.page_background_color, 'advisable-darkPurple')::text,
    COALESCE(p.highlight_color, 'advisable-purple')::text,
    COALESCE(
      (SELECT pt.features FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id AND pt.features IS NOT NULL),
      (SELECT pt.features FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id AND pt.features IS NOT NULL),
      COALESCE(p.features, '[]'::jsonb)
    ),
    COALESCE(
      (SELECT pt.stats FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id AND pt.stats IS NOT NULL),
      (SELECT pt.stats FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id AND pt.stats IS NOT NULL),
      COALESCE(p.stats, '[]'::jsonb)
    ),
    COALESCE(
      (SELECT pt.testimonials FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id AND pt.testimonials IS NOT NULL),
      (SELECT pt.testimonials FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id AND pt.testimonials IS NOT NULL),
      COALESCE(p.testimonials, '[]'::jsonb)
    ),
    COALESCE(
      (SELECT pt.cta_section_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.cta_section_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS cta_section_title,
    COALESCE(
      (SELECT pt.cta_section_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.cta_section_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS cta_section_description,
    COALESCE(
      (SELECT pt.cta_button_text FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.cta_button_text FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS cta_button_text
  FROM public.products p
  WHERE p.slug = p_slug
  ORDER BY p.display_order;
END;
$$;

-- Also update get_all_products_with_translation
CREATE OR REPLACE FUNCTION public.get_all_products_with_translation(p_language_code text)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  image_url text,
  hero_image text,
  website_url text,
  display_order integer,
  slug text,
  page_title text,
  page_subtitle text,
  page_description text,
  page_background_color text,
  highlight_color text,
  features jsonb,
  stats jsonb,
  testimonials jsonb,
  cta_section_title text,
  cta_section_description text,
  cta_button_text text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_language_id INTEGER;
  v_default_language_id INTEGER;
BEGIN
  SELECT l.id INTO v_language_id 
  FROM public.languages l
  WHERE l.code = p_language_code;
  
  SELECT l.id INTO v_default_language_id 
  FROM public.languages l
  WHERE l.is_default = TRUE 
  LIMIT 1;
  
  RETURN QUERY
  SELECT 
    p.id,
    COALESCE(
      (SELECT pt.title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      'Product'
    )::text AS title,
    COALESCE(
      (SELECT pt.description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS description,
    COALESCE(p.image_url, '')::text,
    COALESCE(p.hero_image, '')::text,
    COALESCE(p.website_url, '')::text,
    COALESCE(p.display_order, 0),
    COALESCE(p.slug, '')::text,
    COALESCE(
      (SELECT pt.page_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.page_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS page_title,
    COALESCE(
      (SELECT pt.page_subtitle FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.page_subtitle FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS page_subtitle,
    COALESCE(
      (SELECT pt.page_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.page_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS page_description,
    COALESCE(p.page_background_color, 'advisable-darkPurple')::text,
    COALESCE(p.highlight_color, 'advisable-purple')::text,
    COALESCE(
      (SELECT pt.features FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id AND pt.features IS NOT NULL),
      (SELECT pt.features FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id AND pt.features IS NOT NULL),
      COALESCE(p.features, '[]'::jsonb)
    ),
    COALESCE(
      (SELECT pt.stats FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id AND pt.stats IS NOT NULL),
      (SELECT pt.stats FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id AND pt.stats IS NOT NULL),
      COALESCE(p.stats, '[]'::jsonb)
    ),
    COALESCE(
      (SELECT pt.testimonials FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id AND pt.testimonials IS NOT NULL),
      (SELECT pt.testimonials FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id AND pt.testimonials IS NOT NULL),
      COALESCE(p.testimonials, '[]'::jsonb)
    ),
    COALESCE(
      (SELECT pt.cta_section_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.cta_section_title FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS cta_section_title,
    COALESCE(
      (SELECT pt.cta_section_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.cta_section_description FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS cta_section_description,
    COALESCE(
      (SELECT pt.cta_button_text FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_language_id),
      (SELECT pt.cta_button_text FROM public.product_translations pt 
       WHERE pt.product_id = p.id AND pt.language_id = v_default_language_id),
      ''
    )::text AS cta_button_text
  FROM public.products p
  ORDER BY p.display_order;
END;
$$;

-- Now populate translated features for Findloom (ES=2, FR=3, IT=10)

-- Spanish features
UPDATE product_translations SET features = '[
  {"icon": "Globe", "title": "Soporte Multi-Dominio", "description": "Gestiona la búsqueda en múltiples tiendas desde un único panel con analíticas unificadas."},
  {"icon": "FileCode", "title": "Integración de Feeds XML", "description": "Conecta tus feeds XML de productos en minutos. La sincronización automática mantiene tu índice de búsqueda siempre actualizado."},
  {"icon": "Zap", "title": "Búsqueda Ultrarrápida", "description": "Respuestas de búsqueda en menos de 50ms entre millones de productos con infraestructura desplegada en el edge."},
  {"icon": "Brain", "title": "Búsqueda Inteligente", "description": "Tolerancia a errores tipográficos, coincidencia de sinónimos y filtrado por facetas entregan los resultados correctos siempre."},
  {"icon": "Shield", "title": "Seguridad Empresarial", "description": "Infraestructura compatible con SOC 2 con datos cifrados en reposo y en tránsito."},
  {"icon": "BarChart3", "title": "Analíticas e Insights", "description": "Analíticas de búsqueda en tiempo real, seguimiento de clics y atribución de conversiones para optimizar tu catálogo."}
]'::jsonb,
stats = '[
  {"value": "<50ms", "label": "Tiempo de Respuesta Promedio"},
  {"value": "10M+", "label": "Productos Indexados"},
  {"value": "99.9%", "label": "SLA de Disponibilidad"}
]'::jsonb
WHERE product_id = '7cf28a46-72e0-4130-8864-b9b659b0d35c' AND language_id = 2;

-- French features
UPDATE product_translations SET features = '[
  {"icon": "Globe", "title": "Support Multi-Domaine", "description": "Gérez la recherche sur plusieurs boutiques depuis un tableau de bord unique avec des analyses unifiées."},
  {"icon": "FileCode", "title": "Intégration de Flux XML", "description": "Connectez vos flux XML de produits en quelques minutes. La synchronisation automatique maintient votre index de recherche toujours à jour."},
  {"icon": "Zap", "title": "Recherche Ultra-Rapide", "description": "Temps de réponse inférieur à 50ms sur des millions de produits grâce à une infrastructure déployée en edge."},
  {"icon": "Brain", "title": "Recherche Intelligente", "description": "Tolérance aux fautes de frappe, correspondance de synonymes et filtrage à facettes pour des résultats toujours pertinents."},
  {"icon": "Shield", "title": "Sécurité Entreprise", "description": "Infrastructure conforme SOC 2 avec chiffrement des données au repos et en transit."},
  {"icon": "BarChart3", "title": "Analyses et Insights", "description": "Analyses de recherche en temps réel, suivi des clics et attribution des conversions pour optimiser votre catalogue."}
]'::jsonb,
stats = '[
  {"value": "<50ms", "label": "Temps de Réponse Moyen"},
  {"value": "10M+", "label": "Produits Indexés"},
  {"value": "99.9%", "label": "SLA de Disponibilité"}
]'::jsonb
WHERE product_id = '7cf28a46-72e0-4130-8864-b9b659b0d35c' AND language_id = 3;

-- Italian features
UPDATE product_translations SET features = '[
  {"icon": "Globe", "title": "Supporto Multi-Dominio", "description": "Gestisci la ricerca su più negozi da un''unica dashboard con analisi unificate."},
  {"icon": "FileCode", "title": "Integrazione Feed XML", "description": "Collega i tuoi feed XML dei prodotti in pochi minuti. La sincronizzazione automatica mantiene il tuo indice di ricerca sempre aggiornato."},
  {"icon": "Zap", "title": "Ricerca Ultra-Rapida", "description": "Risposte di ricerca in meno di 50ms su milioni di prodotti con infrastruttura edge-deployed."},
  {"icon": "Brain", "title": "Ricerca Intelligente", "description": "Tolleranza agli errori di battitura, corrispondenza dei sinonimi e filtraggio a faccette per risultati sempre pertinenti."},
  {"icon": "Shield", "title": "Sicurezza Enterprise", "description": "Infrastruttura conforme SOC 2 con crittografia dei dati a riposo e in transito."},
  {"icon": "BarChart3", "title": "Analisi e Insights", "description": "Analisi di ricerca in tempo reale, tracciamento dei clic e attribuzione delle conversioni per ottimizzare il tuo catalogo."}
]'::jsonb,
stats = '[
  {"value": "<50ms", "label": "Tempo di Risposta Medio"},
  {"value": "10M+", "label": "Prodotti Indicizzati"},
  {"value": "99.9%", "label": "SLA di Disponibilità"}
]'::jsonb
WHERE product_id = '7cf28a46-72e0-4130-8864-b9b659b0d35c' AND language_id = 10;