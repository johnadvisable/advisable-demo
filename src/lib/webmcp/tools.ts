// @ts-nocheck
/**
 * WebMCP tool definitions exposed in-page via `document.modelContext`.
 *
 * All tools are read-only, or "prepare + human confirms". Nothing writes to the
 * database without an explicit user action in the UI (Turnstile protected forms).
 */
import { supabase } from '@/integrations/supabase/client';

export const LANGUAGE_IDS: Record<string, number> = { en: 1, es: 2, fr: 3, de: 4, el: 5, it: 10 };
const LANGS = ['en', 'el', 'es', 'fr', 'it', 'de'];

type ToolCtx = {
  /** Language derived from the current TLD (advisable.com -> en, .gr -> el, ...) */
  language: string;
  navigate: (path: string) => void;
};

const text = (value: unknown) => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});
const fail = (message: string) => ({ content: [{ type: 'text', text: message }], isError: true });

const langProp = {
  type: 'string',
  enum: LANGS,
  description: 'Language code. Defaults to the language of the current domain.',
};

function stripHtml(html?: string | null): string {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildWebMcpTools(ctx: ToolCtx) {
  const langId = (code?: string) => LANGUAGE_IDS[code || ctx.language] ?? LANGUAGE_IDS.en;

  return [
    {
      name: 'get_page_context',
      description:
        'Return what the visitor is currently looking at on the Advisable website: URL, path, page type and the language of this domain.',
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        const path = window.location.pathname;
        const type = path === '/' ? 'home'
          : path.startsWith('/insights') ? 'insights'
          : path.startsWith('/academy') ? 'academy'
          : path.startsWith('/products') ? 'products'
          : path.startsWith('/contact') ? 'contact'
          : path.split('/')[1] || 'page';
        return text({ url: window.location.href, path, pageType: type, language: ctx.language });
      },
    },

    {
      name: 'list_services',
      description:
        'List Advisable services (digital agency, technology, AI services, venture studio) with slug, title and page URL.',
      inputSchema: {
        type: 'object',
        properties: {
          language: langProp,
          limit: { type: 'integer', minimum: 1, maximum: 200, description: 'Max services to return (default 50).' },
        },
      },
      async execute({ language, limit }: any = {}) {
        const { data, error } = await supabase
          .from('services')
          .select('id, slug, display_order, service_translations(title, short_description, language_id)')
          .order('display_order', { ascending: true })
          .limit(limit ?? 50);
        if (error) return fail(error.message);
        const id = langId(language);
        const rows = (data ?? []).map((s: any) => {
          const t = s.service_translations?.find((x: any) => x.language_id === id) ?? s.service_translations?.[0];
          return { slug: s.slug, title: t?.title ?? s.slug, summary: t?.short_description ?? null, url: `/services/${s.slug}` };
        });
        return text({ services: rows });
      },
    },

    {
      name: 'list_products',
      description: 'List Advisable products (Ecommercen, SizeTheMarket, Findloom, e-Prescription, Recommendable).',
      inputSchema: { type: 'object', properties: { language: langProp } },
      async execute({ language }: any = {}) {
        const { data, error } = await supabase
          .from('products')
          .select('slug, website_url, display_order, product_translations(title, description, language_id)')
          .order('display_order', { ascending: true });
        if (error) return fail(error.message);
        const id = langId(language);
        const rows = (data ?? []).map((p: any) => {
          const t = p.product_translations?.find((x: any) => x.language_id === id) ?? p.product_translations?.[0];
          return { slug: p.slug, website: p.website_url, title: t?.title, description: t?.description, url: `/products/${p.slug}` };
        });
        return text({ products: rows });
      },
    },

    {
      name: 'list_clients',
      description: 'List Advisable clients and case-study companies with industry, country and website.',
      inputSchema: {
        type: 'object',
        properties: {
          industry: { type: 'string', description: 'Optional industry filter.' },
          limit: { type: 'integer', minimum: 1, maximum: 200 },
        },
      },
      async execute({ industry, limit }: any = {}) {
        let q = supabase
          .from('clients')
          .select('slug, website, industry, country, product_category')
          .order('display_order', { ascending: true })
          .limit(limit ?? 50);
        if (industry) q = q.eq('industry', industry);
        const { data, error } = await q;
        if (error) return fail(error.message);
        return text({ clients: data ?? [] });
      },
    },

    {
      name: 'search_insights',
      description:
        'Search Advisable insights and news articles by keyword. Returns slug, title, excerpt, published date and the page URL.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Keyword to search titles and excerpts.' },
          language: langProp,
          limit: { type: 'integer', minimum: 1, maximum: 50 },
        },
        required: ['query'],
      },
      async execute({ query, language, limit }: any) {
        const id = langId(language);
        const max = limit ?? 10;
        const like = `title.ilike.%${query}%,excerpt.ilike.%${query}%`;

        const [ins, news] = await Promise.all([
          supabase
            .from('insights_translations')
            .select('title, excerpt, insights(slug, published_date)')
            .eq('language_id', id)
            .or(like)
            .limit(max),
          supabase
            .from('news_translations')
            .select('title, excerpt, news(slug, published_date)')
            .eq('language_id', id)
            .or(like)
            .limit(max),
        ]);
        if (ins.error) return fail(ins.error.message);

        const results = [
          ...(ins.data ?? []).map((r: any) => ({
            kind: 'insight',
            slug: r.insights?.slug,
            title: r.title,
            excerpt: r.excerpt,
            published_date: r.insights?.published_date,
            url: `/insights/${r.insights?.slug}`,
          })),
          ...(news.error ? [] : (news.data ?? []).map((r: any) => ({
            kind: 'news',
            slug: r.news?.slug,
            title: r.title,
            excerpt: r.excerpt,
            published_date: r.news?.published_date,
            url: `/news/${r.news?.slug}`,
          }))),
        ].filter((r) => r.slug).slice(0, max);

        return text({ results });
      },
    },

    {
      name: 'get_article',
      description: 'Fetch one Advisable insight or news article by slug, as plain readable text.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          kind: { type: 'string', enum: ['insight', 'news'], description: 'Defaults to insight.' },
          language: langProp,
        },
        required: ['slug'],
      },
      async execute({ slug, kind, language }: any) {
        const isNews = kind === 'news';
        const table = isNews ? 'news' : 'insights';
        const tTable = isNews ? 'news_translations' : 'insights_translations';
        const fk = isNews ? 'news_id' : 'insights_id';

        const { data: row, error } = await supabase.from(table).select('id, slug, published_date, featured_image').eq('slug', slug).maybeSingle();
        if (error) return fail(error.message);
        if (!row) return fail(`No ${isNews ? 'news' : 'insight'} with slug "${slug}"`);

        const { data: tr, error: tErr } = await supabase
          .from(tTable)
          .select('language_id, title, excerpt, content')
          .eq(fk, (row as any).id);
        if (tErr) return fail(tErr.message);

        const id = langId(language);
        const t = (tr ?? []).find((x: any) => x.language_id === id) ?? (tr ?? [])[0];
        return text({
          slug: (row as any).slug,
          url: `/${isNews ? 'news' : 'insights'}/${(row as any).slug}`,
          published_date: (row as any).published_date,
          title: t?.title ?? null,
          excerpt: t?.excerpt ?? null,
          content: stripHtml(t?.content),
        });
      },
    },

    {
      name: 'list_seminars',
      description:
        'List upcoming Advisable Academy seminars with dates, times, venue, seats and pricing, plus the page to book them.',
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        const { data, error } = await supabase
          .from('seminars')
          .select('slug, title, subtitle, start_date, end_date, start_time, end_time, sessions_label, seats, price_onsite, price_online, currency, allows_onsite, allows_online, venue_name, venue_address, language, status')
          .order('display_order', { ascending: true })
          .order('start_date', { ascending: true });
        if (error) return fail(error.message);
        const rows = (data ?? []).map((s: any) => ({ ...s, url: `/academy/${s.slug}` }));
        return text({ seminars: rows, academy_url: '/academy', business_training_url: '/academy/ai-training-for-business' });
      },
    },

    {
      name: 'navigate_to',
      description:
        'Navigate the browser to a page of the Advisable website. Use a relative path such as /academy, /insights or /contact.',
      inputSchema: {
        type: 'object',
        properties: { path: { type: 'string', description: 'Relative path starting with /.' } },
        required: ['path'],
      },
      async execute({ path }: any) {
        if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
          return fail('path must be a relative path starting with a single "/".');
        }
        ctx.navigate(path);
        return text(`Navigated to ${path}`);
      },
    },

    {
      name: 'prepare_contact_request',
      description:
        'Prefill the Advisable contact form with the visitor details and open it. The form is bot protected, so the visitor has to press submit themselves. This tool never sends the request on its own.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          company: { type: 'string' },
          interest: { type: 'string', description: 'For example: AI Services, Training, Technology, Digital Marketing.' },
          message: { type: 'string' },
        },
        required: ['email'],
      },
      async execute(args: any = {}) {
        const draft = {
          name: args.name ?? '',
          email: args.email ?? '',
          phone: args.phone ?? '',
          company: args.company ?? '',
          interest: args.interest ?? '',
          message: args.message ?? '',
          source: 'webmcp',
        };
        try {
          sessionStorage.setItem('advisable:contact-draft', JSON.stringify(draft));
        } catch {
          /* storage may be unavailable */
        }
        window.dispatchEvent(new CustomEvent('advisable:contact-draft', { detail: draft }));
        ctx.navigate('/contact');
        return text(
          'The contact form has been opened and prefilled. The visitor must review it and press submit, because the form is protected against automated submissions.'
        );
      },
    },

    {
      name: 'prepare_seminar_interest',
      description:
        'Open the Advisable Academy page with a prefilled interest note for a seminar or corporate training. The visitor confirms and submits the form themselves.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          company: { type: 'string' },
          seminar_slug: { type: 'string', description: 'Slug from list_seminars, optional.' },
          notes: { type: 'string' },
        },
        required: ['email'],
      },
      async execute(args: any = {}) {
        const draft = {
          name: args.name ?? '',
          email: args.email ?? '',
          company: args.company ?? '',
          interest: 'Training',
          message: [args.seminar_slug ? `Seminar: ${args.seminar_slug}` : '', args.notes ?? ''].filter(Boolean).join('\n'),
          source: 'webmcp',
        };
        try {
          sessionStorage.setItem('advisable:contact-draft', JSON.stringify(draft));
        } catch {
          /* storage may be unavailable */
        }
        window.dispatchEvent(new CustomEvent('advisable:contact-draft', { detail: draft }));
        ctx.navigate(args.seminar_slug ? `/academy/${args.seminar_slug}` : '/academy');
        return text('Academy page opened with the interest details prefilled. The visitor has to submit the form to register.');
      },
    },
  ];
}
