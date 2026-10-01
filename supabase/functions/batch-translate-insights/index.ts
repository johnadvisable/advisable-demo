import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANGUAGE_MAP: Record<string, { id: number; name: string }> = {
  el: { id: 5, name: "Greek" },
  es: { id: 2, name: "Spanish" },
  fr: { id: 3, name: "French" },
  it: { id: 10, name: "Italian" },
};

function getSystemPrompt(langCode: string, langName: string): string {
  if (langCode === "el") {
    return `Είσαι επαγγελματίας μεταφραστής με άριστη γνώση ελληνικών και ειδίκευση σε επιχειρηματικό/τεχνολογικό περιεχόμενο. 

ΑΠΟΛΥΤΟΙ ΚΑΝΟΝΕΣ:
1. ΜΗΝ ΧΡΗΣΙΜΟΠΟΙΕΙΣ ΠΟΤΕ ΤΟ ΣΥΜΒΟΛΟ — (em dash). Αντί αυτού χρησιμοποίησε " - " (κενό παύλα κενό) ή αναδιατύπωσε.
2. ΜΗΝ ΜΕΤΑΦΡΑΖΕΙΣ τους παρακάτω όρους - κράτησέ τους στα Αγγλικά:
   SEO, AI, ML, API, CRM, ERP, SaaS, UX, UI, B2B, B2C, ROI, KPI, MVP, RAG, E-E-A-T, SERP, NLP, ROAS, CLV, AOV,
   Marketing, Branding, Performance, Growth, Startup, Venture Studio, E-commerce, Blog, Case Study, Lead, Funnel, Landing Page, CTA, Newsletter, Podcast,
   WordPress, Shopify, BigCommerce, Magento, React, Node.js, Google Ads, Meta Ads, ChatGPT, Perplexity, Claude, OpenAI, Gemini, Klaviyo, Omnisend, Nosto, Dynamic Yield, Bloomreach, Algolia, Gorgias, AdCreative.ai, Pencil AI, Madgicx, Rep AI, Tidio, Cin7, Prediko, ReConvert
3. Χρησιμοποίησε επίσημο ύφος κατάλληλο για επαγγελματικό αναγνωστικό κοινό.
4. ΔΙΑΤΗΡΗΣΕ ΑΚΡΙΒΩΣ όλα τα HTML tags, attributes, URLs, links, αριθμούς και ημερομηνίες.
5. Μην τυλίξεις το αποτέλεσμα σε markdown code blocks. Εξαγωγή ΜΟΝΟ μεταφρασμένου κειμένου.`;
  }

  if (langCode === "es") {
    return `You are a professional Spanish translator specializing in technology, business, and digital marketing content.
CRITICAL RULES:
1. Translate from English to Spanish. Output ONLY the translated text.
2. DO NOT translate these terms: SEO, AI, ML, API, CRM, UX, UI, ROI, KPI, MVP, LLM, RAG, E-E-A-T, ROAS, CLV, AOV, NLP, framework, startup, marketing, branding, performance, growth, e-commerce, blog, case study, lead, funnel, landing page, CTA, newsletter, podcast, WordPress, Shopify, BigCommerce, Magento, React, Node.js, Google Ads, Meta Ads, ChatGPT, Perplexity, Claude, OpenAI, Gemini, Klaviyo, Omnisend, Nosto, Dynamic Yield, Bloomreach, Algolia, Gorgias, AdCreative.ai, Pencil AI, Madgicx, Rep AI, Tidio, Cin7, Prediko, ReConvert.
3. PRESERVE EXACTLY all HTML tags, attributes, URLs, links, brand names, numbers, and dates.
4. Use formal tone. Use standard Spanish punctuation including inverted question marks.
5. Ensure natural, fluent Spanish. Do NOT wrap in code blocks.`;
  }

  return `You are a professional ${langName} translator specializing in technology, business, and digital marketing content.
CRITICAL RULES:
1. Translate from English to ${langName}. Output ONLY the translated text.
2. DO NOT translate these terms: SEO, AI, ML, API, CRM, UX, UI, ROI, KPI, MVP, LLM, RAG, E-E-A-T, ROAS, CLV, AOV, NLP, framework, startup, marketing, branding, performance, growth, e-commerce, blog, case study, lead, funnel, landing page, CTA, newsletter, podcast, WordPress, Shopify, BigCommerce, Magento, React, Node.js, Google Ads, Meta Ads, ChatGPT, Perplexity, Claude, OpenAI, Gemini, Klaviyo, Omnisend, Nosto, Dynamic Yield, Bloomreach, Algolia, Gorgias, AdCreative.ai, Pencil AI, Madgicx, Rep AI, Tidio, Cin7, Prediko, ReConvert.
3. PRESERVE EXACTLY all HTML tags, attributes, URLs, links, brand names, numbers, and dates.
4. Use formal tone appropriate for professional ${langName} readership.
5. Ensure natural, fluent ${langName}. Do NOT wrap in code blocks.`;
}

async function callAI(prompt: string, systemPrompt: string, apiKey: string, model: string = "google/gemini-2.5-flash"): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.15,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  let translated = data.choices?.[0]?.message?.content?.trim();
  if (!translated) throw new Error("No translation returned");
  translated = translated.replace(/^```html\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return translated;
}

function splitContentByH2(text: string): string[] {
  const h2Regex = /<h2[^>]*>/gi;
  const matches = [...text.matchAll(h2Regex)];
  let chunks: string[] = [];

  if (matches.length === 0) {
    const chunkSize = 5000;
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  }

  let lastIndex = 0;
  for (const match of matches) {
    if (match.index! > lastIndex) {
      const chunk = text.substring(lastIndex, match.index!);
      if (chunk.trim()) chunks.push(chunk);
    }
    lastIndex = match.index!;
  }
  if (lastIndex < text.length) chunks.push(text.substring(lastIndex));

  // Merge small chunks, keep under 6000 chars
  const merged: string[] = [];
  let current = "";
  for (const chunk of chunks) {
    if (current.length + chunk.length > 6000 && current.length > 0) {
      merged.push(current);
      current = chunk;
    } else {
      current += chunk;
    }
  }
  if (current) merged.push(current);
  return merged;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const slug_filter = body.slug_filter || null;
    const lang = body.lang; // single language code: "el", "es", "fr", "it"
    const phase = body.phase || "meta"; // "meta" (title+excerpt) or "content"
    const chunk_index = body.chunk_index ?? 0; // for content phase
    const force = body.force || false;
    const model = body.model || "google/gemini-2.5-flash";
    
    // Legacy multi-language support
    const target_languages = body.target_languages;
    if (target_languages) {
      // Old API: redirect to single language processing
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please use single language mode: {lang: 'el', phase: 'meta'|'content', chunk_index: 0, slug_filter: '...', force: true}",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!lang || !LANGUAGE_MAP[lang]) {
      return new Response(
        JSON.stringify({ error: `Invalid lang. Use: ${Object.keys(LANGUAGE_MAP).join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const langInfo = LANGUAGE_MAP[lang];

    // Get the insight
    let query = supabase.from("insights").select("id, slug");
    if (slug_filter) query = query.eq("slug", slug_filter);
    const { data: insights, error: insightsError } = await query.limit(1);
    if (insightsError) throw insightsError;
    if (!insights?.length) throw new Error("No insight found");

    const insight = insights[0];

    // Get English source
    const { data: enTranslation } = await supabase
      .from("insights_translations")
      .select("title, excerpt, content")
      .eq("insights_id", insight.id)
      .eq("language_id", 1)
      .single();

    if (!enTranslation?.content) throw new Error("No English content found");

    // Get existing translation
    const { data: existing } = await supabase
      .from("insights_translations")
      .select("id, title, excerpt, content")
      .eq("insights_id", insight.id)
      .eq("language_id", langInfo.id)
      .single();

    const systemPrompt = getSystemPrompt(lang, langInfo.name);

    if (phase === "meta") {
      // Translate title and excerpt
      console.log(`Translating meta for "${insight.slug}" → ${lang}`);

      const [translatedTitle, translatedExcerpt] = await Promise.all([
        callAI(`Translate this article title to ${langInfo.name}. Keep it concise and professional.\n\n${enTranslation.title}`, systemPrompt, LOVABLE_API_KEY, model),
        callAI(`Translate this article excerpt to ${langInfo.name}. Keep it engaging and SEO-friendly.\n\n${enTranslation.excerpt || ""}`, systemPrompt, LOVABLE_API_KEY, model),
      ]);

      if (existing) {
        await supabase
          .from("insights_translations")
          .update({ title: translatedTitle, excerpt: translatedExcerpt, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("insights_translations")
          .insert({ insights_id: insight.id, language_id: langInfo.id, title: translatedTitle, excerpt: translatedExcerpt, content: "" });
      }

      // Calculate total chunks needed
      const chunks = splitContentByH2(enTranslation.content);

      return new Response(
        JSON.stringify({
          success: true,
          phase: "meta",
          slug: insight.slug,
          lang,
          title: translatedTitle,
          excerpt_length: translatedExcerpt.length,
          total_content_chunks: chunks.length,
          next: { phase: "content", chunk_index: 0 },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (phase === "content") {
      const chunks = splitContentByH2(enTranslation.content);
      
      if (chunk_index >= chunks.length) {
        return new Response(
          JSON.stringify({ success: true, phase: "content", status: "complete", slug: insight.slug, lang }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Translating content chunk ${chunk_index + 1}/${chunks.length} for "${insight.slug}" → ${lang} (${chunks[chunk_index].length} chars)`);

      const translatedChunk = await callAI(
        `Translate this HTML content chunk (${chunk_index + 1} of ${chunks.length}) to ${langInfo.name}. Preserve ALL HTML tags exactly. Output ONLY the translated HTML.\n\n${chunks[chunk_index]}`,
        systemPrompt,
        LOVABLE_API_KEY,
        model
      );

      // Get current translation to append
      const { data: current } = await supabase
        .from("insights_translations")
        .select("id, content")
        .eq("insights_id", insight.id)
        .eq("language_id", langInfo.id)
        .single();

      const newContent = chunk_index === 0
        ? translatedChunk
        : (current?.content || "") + translatedChunk;

      if (current) {
        await supabase
          .from("insights_translations")
          .update({ content: newContent, updated_at: new Date().toISOString() })
          .eq("id", current.id);
      }

      const isLast = chunk_index + 1 >= chunks.length;

      return new Response(
        JSON.stringify({
          success: true,
          phase: "content",
          slug: insight.slug,
          lang,
          chunk: `${chunk_index + 1}/${chunks.length}`,
          chunk_chars: translatedChunk.length,
          total_content_length: newContent.length,
          complete: isLast,
          next: isLast ? null : { phase: "content", chunk_index: chunk_index + 1 },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid phase. Use 'meta' or 'content'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
