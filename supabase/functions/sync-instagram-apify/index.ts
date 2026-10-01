import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EL = 5;
const EN = 1;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'instagram-post';
}

function truncateAtPunct(s: string, max = 80): string {
  const cut = s.split(/[.\n!?]/)[0].trim();
  return (cut.length > 3 ? cut : s).slice(0, max);
}

async function ensureUniqueSlug(supabase: any, base: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const { data } = await supabase.from('news').select('id').eq('slug', slug).maybeSingle();
    if (!data) return slug;
    i++;
    slug = `${base}-${i}`;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const APIFY = Deno.env.get('APIFY_API_TOKEN');
    if (!APIFY) throw new Error('APIFY_API_TOKEN not set');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json().catch(() => ({}));
    const username = body.username || 'advisable_com';
    const limit = body.limit || 20;

    // 1) Scrape via Apify
    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY}&timeout=180`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: [`https://www.instagram.com/${username}/`],
          resultsType: 'posts',
          resultsLimit: limit,
          addParentData: false,
        }),
      }
    );
    if (!apifyRes.ok) throw new Error(`Apify ${apifyRes.status}: ${await apifyRes.text()}`);
    const posts = await apifyRes.json();

    let inserted = 0, skipped = 0, failed = 0;
    const details: any[] = [];

    for (const p of posts) {
      try {
        const permalink = p.url || `https://www.instagram.com/p/${p.shortCode}/`;
        const { data: existing } = await supabase
          .from('news').select('id').eq('video_url', permalink).maybeSingle();
        if (existing) { skipped++; continue; }

        // Download the display image
        const imgRes = await fetch(p.displayUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!imgRes.ok) throw new Error(`img fetch ${imgRes.status}`);
        const bytes = new Uint8Array(await imgRes.arrayBuffer());
        const filename = `apify_${p.shortCode}_${Date.now()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from('instagram-media')
          .upload(filename, bytes, { contentType: 'image/jpeg', upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('instagram-media').getPublicUrl(filename);
        const featured = pub.publicUrl;

        const caption = (p.caption || 'Latest update from Advisable').trim();
        const title = truncateAtPunct(caption, 80);
        const excerpt = caption.length > 200 ? caption.slice(0, 200) + '...' : caption;
        const slug = await ensureUniqueSlug(supabase, slugify(title));

        const { data: newsRow, error: insErr } = await supabase
          .from('news')
          .insert({
            type: 'media',
            featured_image: featured,
            thumbnail_url: featured,
            video_url: permalink,
            published_date: p.timestamp,
            slug,
          })
          .select('id').single();
        if (insErr) throw insErr;

        const trs = [
          { news_id: newsRow.id, language_id: EL, title, excerpt, content: caption },
          { news_id: newsRow.id, language_id: EN, title, excerpt, content: caption },
        ];
        const { error: trErr } = await supabase.from('news_translations').insert(trs);
        if (trErr) throw trErr;

        inserted++;
        details.push({ shortCode: p.shortCode, slug, id: newsRow.id });
      } catch (e) {
        failed++;
        details.push({ shortCode: p.shortCode, error: String(e) });
      }
    }

    return new Response(
      JSON.stringify({ ok: true, total: posts.length, inserted, skipped, failed, details }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
