import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LANGUAGE_MAP: Record<string, { id: number; name: string; nativeName: string }> = {
  es: { id: 2, name: "Spanish", nativeName: "Español" },
  fr: { id: 3, name: "French", nativeName: "Français" },
  de: { id: 4, name: "German", nativeName: "Deutsch" },
  el: { id: 5, name: "Greek", nativeName: "Ελληνικά" },
  it: { id: 10, name: "Italian", nativeName: "Italiano" },
};

const ENGLISH_LANGUAGE_ID = 1;

function getSystemPrompt(langCode: string, langName: string): string {
  if (langCode === "el") {
    return `Είσαι επαγγελματίας μεταφραστής με άριστη γνώση ελληνικών και ειδίκευση σε επιχειρηματικό/τεχνολογικό περιεχόμενο.

ΑΠΟΛΥΤΟΙ ΚΑΝΟΝΕΣ:
1. ΜΗΝ ΧΡΗΣΙΜΟΠΟΙΕΙΣ ΠΟΤΕ ΤΟ ΣΥΜΒΟΛΟ — (em dash). Αντί αυτού χρησιμοποίησε " - " (κενό παύλα κενό) ή αναδιατύπωσε.
2. ΜΗΝ ΜΕΤΑΦΡΑΖΕΙΣ τεχνικούς όρους: SEO, AI, ML, API, CRM, UX, UI, ROI, KPI, MVP, LLM, RAG, E-E-A-T, vibe coding, agentic engineering, framework, open source, pull request, startup, marketing, branding, performance, growth, e-commerce, blog, case study, lead, funnel, landing page, CTA, newsletter, podcast, WordPress, Shopify, React, Node.js, Google Ads, Meta Ads, ChatGPT, Perplexity, Claude, OpenAI, Gemini.
3. ΚΡΑΤΗΣΕ ΑΚΡΙΒΩΣ όλα τα HTML tags, attributes, URLs, links, brand names, αριθμούς.
4. Επίσημο ύφος (εσείς). Φυσικά, ρέοντα ελληνικά.
5. ΠΟΤΕ τόνος σε κεφαλαίο γράμμα (γράφε Ενα, Οχι, Ολα). Τα ερωτηματικά είναι ";".
6. ΜΟΡΦΗ ΑΠΑΝΤΗΣΗΣ: Επέστρεψε ΜΟΝΟ το μεταφρασμένο κείμενο. Τίποτα άλλο.`;
  }

  return `You are a professional ${langName} translator specializing in technology, business, and digital marketing content.

CRITICAL RULES:
1. Translate from English to ${langName}. Output ONLY the translated text, nothing else.
2. DO NOT translate these terms - keep them in English: SEO, AI, ML, API, CRM, UX, UI, ROI, KPI, MVP, LLM, RAG, E-E-A-T, vibe coding, agentic engineering, framework, open source, pull request, startup, marketing, branding, performance, growth, e-commerce, blog, case study, lead, funnel, landing page, CTA, newsletter, podcast, WordPress, Shopify, React, Node.js, Google Ads, Meta Ads, ChatGPT, Perplexity, Claude, OpenAI, Gemini.
3. PRESERVE EXACTLY all HTML tags, attributes, URLs, links, brand names, numbers, and dates.
4. Use formal tone appropriate for professional ${langName} readership.
5. Ensure natural, fluent ${langName} - not word-for-word translation.
6. Maintain the same paragraph structure and HTML formatting.`;
}

async function translateText(
  text: string,
  fieldType: string,
  langCode: string,
  langName: string,
  apiKey: string
): Promise<string> {
  if (!text || text.trim() === '') return text;

  const contextHints: Record<string, Record<string, string>> = {
    title: {
      en: `Translate this article title to ${langName}. Keep it concise and professional.`,
      el: `Μετάφρασε αυτόν τον τίτλο άρθρου στα Ελληνικά. Σύντομος και επαγγελματικός.`,
    },
    excerpt: {
      en: `Translate this article excerpt/meta description to ${langName}. Keep it engaging and SEO-friendly.`,
      el: `Μετάφρασε αυτήν την περίληψη στα Ελληνικά. Σύντομη και ελκυστική.`,
    },
    content: {
      en: `Translate the following full article content to ${langName}. Preserve ALL HTML formatting exactly.`,
      el: `Μετάφρασε το παρακάτω περιεχόμενο στα Ελληνικά. Διατήρησε όλο το HTML formatting ακριβώς.`,
    },
  };

  const hint = langCode === "el"
    ? contextHints[fieldType]?.el || contextHints.content.el
    : contextHints[fieldType]?.en || contextHints.content.en;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.1-pro-preview",
      messages: [
        { role: "system", content: getSystemPrompt(langCode, langName) },
        { role: "user", content: `${hint}\n\n${text}` },
      ],
      temperature: 0.15,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Translation API error for ${langCode}: ${response.status} - ${errorText}`);
    throw new Error(`Translation to ${langName} failed: ${response.status}`);
  }

  const data = await response.json();
  let translated = data.choices?.[0]?.message?.content?.trim();
  if (!translated) throw new Error(`No translation returned for ${langName}`);

  // Clean up em dashes and accented capitals for Greek
  if (langCode === "el") {
    translated = translated.replace(/—/g, ' - ');
    const capMap: Record<string, string> = { 'Ά':'Α','Έ':'Ε','Ή':'Η','Ί':'Ι','Ό':'Ο','Ύ':'Υ','Ώ':'Ω','Ϊ':'Ϊ','Ϋ':'Ϋ' };
    translated = translated.replace(/[ΆΈΉΊΌΎΏ]/g, (m) => capMap[m] ?? m);
  }

  return translated;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { slug, languages } = await req.json().catch(() => ({}));
    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: slug" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine which languages to translate
    const targetLangs: string[] = languages && Array.isArray(languages) && languages.length > 0
      ? languages.filter((l: string) => l in LANGUAGE_MAP)
      : Object.keys(LANGUAGE_MAP);

    console.log(`Translating insight "${slug}" to: ${targetLangs.join(', ')}`);

    // Fetch English source
    const { data: englishData, error: englishError } = await supabase
      .from('insights_translations')
      .select('title, excerpt, content, insights_id, insights!inner(slug)')
      .eq('insights.slug', slug)
      .eq('language_id', ENGLISH_LANGUAGE_ID)
      .single();

    if (englishError || !englishData) {
      return new Response(
        JSON.stringify({ error: `English version not found for slug: ${slug}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check existing translations
    const { data: existing } = await supabase
      .from('insights_translations')
      .select('language_id, id')
      .eq('insights_id', englishData.insights_id);

    const existingMap = new Map((existing || []).map((r: any) => [r.language_id, r.id]));

    const results: any[] = [];

    for (const langCode of targetLangs) {
      const lang = LANGUAGE_MAP[langCode];
      try {
        console.log(`--- Translating to ${lang.name} (${langCode}) ---`);

        const [title, excerpt, content] = await Promise.all([
          translateText(englishData.title, "title", langCode, lang.name, LOVABLE_API_KEY),
          translateText(englishData.excerpt, "excerpt", langCode, lang.name, LOVABLE_API_KEY),
          translateText(englishData.content, "content", langCode, lang.name, LOVABLE_API_KEY),
        ]);

        const existingId = existingMap.get(lang.id);

        if (existingId) {
          // Update existing
          const { error } = await supabase
            .from('insights_translations')
            .update({ title, excerpt, content, updated_at: new Date().toISOString() })
            .eq('id', existingId);
          if (error) throw error;
          console.log(`Updated ${lang.name} translation`);
        } else {
          // Insert new
          const { error } = await supabase
            .from('insights_translations')
            .insert({
              insights_id: englishData.insights_id,
              language_id: lang.id,
              title, excerpt, content,
            });
          if (error) throw error;
          console.log(`Inserted ${lang.name} translation`);
        }

        results.push({ language: langCode, status: 'success', titleLength: title.length, contentLength: content.length });

        // Rate limit delay between languages
        if (targetLangs.indexOf(langCode) < targetLangs.length - 1) {
          await new Promise(r => setTimeout(r, 3000));
        }
      } catch (err) {
        console.error(`Failed ${lang.name}:`, err);
        results.push({ language: langCode, status: 'error', error: err instanceof Error ? err.message : 'Unknown' });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Translated "${slug}" to ${results.filter(r => r.status === 'success').length}/${targetLangs.length} languages`,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
