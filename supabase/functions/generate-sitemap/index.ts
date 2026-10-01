import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DOMAIN_LANGUAGE_MAP: Record<string, string> = {
  'gr': 'el',
  'es': 'es',
  'fr': 'fr',
  'it': 'it',
  'de': 'de',
  'com': 'en',
};

const LANGUAGE_DOMAIN_MAP: Record<string, string> = {
  'el': 'advisable.gr',
  'es': 'advisable.es',
  'fr': 'advisable.fr',
  'it': 'advisable.it',
  'de': 'advisable.de',
  'en': 'advisable.com',
};

// Updated to match actual LanguageRouter.tsx routes
const STATIC_ROUTES = [
  '/',
  '/about-company',
  '/advisable-team',
  '/partners-and-integrations',
  '/our-clients',
  '/contact',
  '/blog',
  '/insights',
  '/news',
  '/products',
  '/investments',
  '/digital-agency',
  '/venture-studio',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/sled-to-advisable',
];

function getLanguageFromDomain(host: string): string {
  const parts = host.split('.');
  const tld = parts[parts.length - 1]?.toLowerCase() || 'com';
  return DOMAIN_LANGUAGE_MAP[tld] || 'en';
}

function getDomainFromLanguage(lang: string): string {
  return LANGUAGE_DOMAIN_MAP[lang] || 'advisable.com';
}

function generateUrlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const host = req.headers.get('host') || url.host;
    
    const langParam = url.searchParams.get('lang');
    const language = langParam || getLanguageFromDomain(host);
    const domain = getDomainFromLanguage(language);
    const baseUrl = `https://www.${domain}`;
    
    console.log(`Generating sitemap for language: ${language}, domain: ${domain}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: langData } = await supabase
      .from('languages')
      .select('id')
      .eq('code', language)
      .single();

    const languageId = langData?.id || 1;
    console.log(`Language ID for ${language}: ${languageId}`);

    const now = new Date().toISOString().split('T')[0];
    const urls: string[] = [];

    // Static routes
    for (const route of STATIC_ROUTES) {
      urls.push(generateUrlEntry(`${baseUrl}${route}`, now, 'weekly', route === '/' ? '1.0' : '0.8'));
    }

    // Services with their category for proper URL structure: /{categorySlug}/{serviceSlug}
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select(`
        slug, 
        updated_at, 
        category_id,
        service_translations!inner(language_id)
      `)
      .eq('service_translations.language_id', languageId);

    if (servicesError) {
      console.error('Services error:', servicesError);
    } else if (services) {
      // Fetch all categories to map category_id to slug
      const { data: allCategories } = await supabase
        .from('service_categories')
        .select('id, slug');
      
      const categoryMap = new Map(allCategories?.map(c => [c.id, c.slug]) || []);
      
      console.log(`Found ${services.length} services`);
      for (const service of services) {
        const categorySlug = categoryMap.get(service.category_id) || 'digital-agency';
        urls.push(generateUrlEntry(
          `${baseUrl}/${categorySlug}/${service.slug}`,
          service.updated_at?.split('T')[0] || now,
          'weekly',
          '0.8'
        ));
      }
    }

    // Service categories as root-level routes: /{categorySlug}
    const { data: categories, error: categoriesError } = await supabase
      .from('service_categories')
      .select('slug, updated_at, service_category_translations!inner(language_id)')
      .eq('service_category_translations.language_id', languageId);

    if (categoriesError) {
      console.error('Categories error:', categoriesError);
    } else if (categories) {
      console.log(`Found ${categories.length} categories`);
      for (const category of categories) {
        // Skip if already in static routes
        if (!STATIC_ROUTES.includes(`/${category.slug}`)) {
          urls.push(generateUrlEntry(
            `${baseUrl}/${category.slug}`,
            category.updated_at?.split('T')[0] || now,
            'weekly',
            '0.7'
          ));
        }
      }
    }

    // Insights: /insights/{slug}
    const { data: insights, error: insightsError } = await supabase
      .from('insights')
      .select('slug, updated_at, insights_translations!inner(language_id)')
      .eq('insights_translations.language_id', languageId);

    if (insightsError) {
      console.error('Insights error:', insightsError);
    } else if (insights) {
      console.log(`Found ${insights.length} insights`);
      for (const insight of insights) {
        urls.push(generateUrlEntry(
          `${baseUrl}/insights/${insight.slug}`,
          insight.updated_at?.split('T')[0] || now,
          'monthly',
          '0.6'
        ));
      }
    }

    // News: /news/{slug}
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('slug, updated_at, news_translations!inner(language_id)')
      .eq('news_translations.language_id', languageId);

    if (newsError) {
      console.error('News error:', newsError);
    } else if (news) {
      console.log(`Found ${news.length} news items`);
      for (const item of news) {
        urls.push(generateUrlEntry(
          `${baseUrl}/news/${item.slug}`,
          item.updated_at?.split('T')[0] || now,
          'monthly',
          '0.6'
        ));
      }
    }

    // Products: /product/{slug} (except ecommercen which uses /products/)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('slug, updated_at, product_translations!inner(language_id)')
      .eq('product_translations.language_id', languageId);

    if (productsError) {
      console.error('Products error:', productsError);
    } else if (products) {
      console.log(`Found ${products.length} products`);
      for (const product of products) {
        // ecommercen uses /products/, others use /product/
        const prefix = product.slug === 'ecommercen' ? 'products' : 'product';
        urls.push(generateUrlEntry(
          `${baseUrl}/${prefix}/${product.slug}`,
          product.updated_at?.split('T')[0] || now,
          'monthly',
          '0.7'
        ));
      }
    }

    // Investments: /investments/{slug}
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('slug, updated_at, investment_translations!inner(language_id)')
      .eq('is_active', true)
      .eq('investment_translations.language_id', languageId);

    if (investmentsError) {
      console.error('Investments error:', investmentsError);
    } else if (investments) {
      console.log(`Found ${investments.length} investments`);
      for (const investment of investments) {
        urls.push(generateUrlEntry(
          `${baseUrl}/investments/${investment.slug}`,
          investment.updated_at?.split('T')[0] || now,
          'monthly',
          '0.7'
        ));
      }
    }

    // Clients: /our-clients/{slug}
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('slug, updated_at, clients_translations!clients_translations_client_id_fkey!inner(language_id)')
      .eq('clients_translations.language_id', languageId);

    if (clientsError) {
      console.error('Clients error:', clientsError);
    } else if (clients) {
      console.log(`Found ${clients.length} clients`);
      for (const client of clients) {
        urls.push(generateUrlEntry(
          `${baseUrl}/our-clients/${client.slug}`,
          client.updated_at?.split('T')[0] || now,
          'monthly',
          '0.6'
        ));
      }
    }

    // Partners with detail pages: /partners-and-integrations/{slug}
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('slug, partner_translations!inner(language_id)')
      .eq('has_detail_page', true)
      .eq('partner_translations.language_id', languageId);

    if (partnersError) {
      console.error('Partners error:', partnersError);
    } else if (partners) {
      console.log(`Found ${partners.length} partners`);
      for (const partner of partners) {
        if (partner.slug) {
          urls.push(generateUrlEntry(
            `${baseUrl}/partners-and-integrations/${partner.slug}`,
            now,
            'monthly',
            '0.6'
          ));
        }
      }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    console.log(`Generated sitemap with ${urls.length} URLs`);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.advisable.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/xml',
        },
        status: 200,
      }
    );
  }
});
