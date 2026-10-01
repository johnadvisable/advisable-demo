import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json().catch(() => ({}));
  const limit: number = body.limit ?? 30;

  // Recent media news (Instagram-imported)
  const { data: newsRows, error: nErr } = await supabase
    .from('news')
    .select('id, created_at, type')
    .eq('type', 'media')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (nErr) return new Response(JSON.stringify({ error: nErr.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  const ids = (newsRows ?? []).map((r) => r.id);
  if (!ids.length) return new Response(JSON.stringify({ updated: 0 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  const { data: enRows, error: tErr } = await supabase
    .from('news_translations')
    .select('id, news_id, title, excerpt')
    .eq('language_id', 1)
    .in('news_id', ids);
  if (tErr) return new Response(JSON.stringify({ error: tErr.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  const isMostlyGreek = (s: string) => {
    const letters = (s || '').replace(/[^\p{L}]/gu, '');
    if (!letters) return false;
    const greek = letters.match(/[\u0370-\u03FF\u1F00-\u1FFF]/g)?.length ?? 0;
    return greek / letters.length > 0.2;
  };

  const translate = async (text: string): Promise<string> => {
    if (!text?.trim()) return text;
    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Translate the user text from Greek to English. Preserve emojis, line breaks, hashtags, mentions, URLs, and English brand/tech terms. Output only the translation, no commentary.' },
          { role: 'user', content: text },
        ],
      }),
    });
    if (!resp.ok) throw new Error(`AI ${resp.status}: ${await resp.text()}`);
    const j = await resp.json();
    return j.choices?.[0]?.message?.content?.trim() ?? text;
  };

  let updated = 0, skipped = 0, failed = 0;
  const errors: string[] = [];

  for (const row of enRows ?? []) {
    try {
      const needsTitle = isMostlyGreek(row.title || '');
      const needsExcerpt = isMostlyGreek(row.excerpt || '');
      if (!needsTitle && !needsExcerpt) { skipped++; continue; }
      const [newTitle, newExcerpt] = await Promise.all([
        needsTitle ? translate(row.title || '') : Promise.resolve(row.title),
        needsExcerpt ? translate(row.excerpt || '') : Promise.resolve(row.excerpt),
      ]);
      const { error: uErr } = await supabase
        .from('news_translations')
        .update({ title: newTitle, excerpt: newExcerpt })
        .eq('id', row.id);
      if (uErr) throw uErr;
      updated++;
    } catch (e) {
      failed++;
      errors.push(`${row.news_id}: ${(e as Error).message}`);
    }
  }

  return new Response(JSON.stringify({ updated, skipped, failed, errors }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
