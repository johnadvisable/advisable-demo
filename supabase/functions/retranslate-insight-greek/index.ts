import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const GREEK_LANGUAGE_ID = 5;
const ENGLISH_LANGUAGE_ID = 1;

const SYSTEM_PROMPT = `Είσαι επαγγελματίας μεταφραστής με άριστη γνώση ελληνικών και ειδίκευση σε επιχειρηματικό/τεχνολογικό περιεχόμενο. 

ΑΠΟΛΥΤΟΙ ΚΑΝΟΝΕΣ:

1. ΜΗΝ ΧΡΗΣΙΜΟΠΟΙΕΙΣ ΠΟΤΕ ΤΟ ΣΥΜΒΟΛΟ — (em dash). Αντί αυτού χρησιμοποίησε " - " (κενό παύλα κενό) ή αναδιατύπωσε.

2. ΜΗΝ ΜΕΤΑΦΡΑΖΕΙΣ τους παρακάτω όρους - κράτησέ τους στα Αγγλικά:
   
   Τεχνικοί όροι:
   SEO, AI, ML, API, CRM, ERP, SaaS, PaaS, IaaS, CMS, UX, UI, B2B, B2C, ROI, KPI, MVP, SDK, CSS, HTML, JavaScript, TypeScript, Python, RAG, E-E-A-T, SERP, GA4, UTM, SSR, WAF, ARIA, JSON, schema, canonical, noindex, robots.txt, sitemap, crawler, bot, chunk, passage, snippet, framework, cluster, topic cluster, pillar, structured data, rich snippet, featured snippet, knowledge graph, entity, entities
   
   Marketing/Business:
   Marketing, Branding, Performance, Growth, Growth Hacking, Startup, Startups, Venture Studio, Digital Agency, PR, Consulting, Coaching, Mentorship, E-commerce, E-shop, Online, Digital, Team, Partner, Partners, Analytics, Insights, Blog, Checklist, Benchmark, Case Study, Case Studies, Lead, Leads, Funnel, Landing Page, CTA, CTAs, Newsletter, Podcast
   
   Προϊόντα/Πλατφόρμες:
   WordPress, Shopify, Magento, WooCommerce, React, Node.js, Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads, ChatGPT, ChatGPT Search, Perplexity, PerplexityBot, Bing, Bing Copilot, Copilot, Google AI Overviews, Google AI Mode, Search Console, OAI-SearchBot, GPTBot, Googlebot, OpenAI, Google Gemini, Claude, Anthropic
   
   Έννοιες AI Search:
   Generative Engine Optimization, GEO, LLM, generative search, generative answers, retrieval, chunking, AI Overviews, AI Mode, citations, answer engine, answer engines

3. ΚΡΑΤΗΣΕ ΑΚΡΙΒΩΣ όλα τα:
   - HTML tags και attributes
   - URLs και links
   - Brand names (Advisable, MarketData, κλπ)
   - Αριθμούς και ημερομηνίες
   - JSON/code blocks μέσα σε <pre><code>

4. ΥΦΟΣ ΓΡΑΦΗΣ:
   - Επίσημο ύφος (εσείς, όχι εσύ)
   - Φυσικά, ρέοντα ελληνικά - όχι ξύλινη μετάφραση
   - Σύντομες, καθαρές προτάσεις
   - Αποφυγή παθητικής φωνής όπου γίνεται

5. ΠΑΡΑΔΕΙΓΜΑΤΑ ΣΩΣΤΗΣ ΜΕΤΑΦΡΑΣΗΣ:
   - "The shift" → "Η αλλαγή" ή "Η μεγάλη στροφή"
   - "Be the Best Source" → "Γίνετε η Καλύτερη Πηγή"
   - "Non-Negotiable Requirements" → "Απαραίτητες Προϋποθέσεις"
   - "Answer Engineering" → "Μηχανική Απαντήσεων"
   - "Platform-Specific Optimization" → "Βελτιστοποίηση ανά Πλατφόρμα"
   - "Measurement That Matters" → "Μέτρηση που Έχει Νόημα"

ΜΟΡΦΗ ΑΠΑΝΤΗΣΗΣ:
Επέστρεψε ΜΟΝΟ το μεταφρασμένο κείμενο. Τίποτα άλλο.`;

async function translateText(text: string, fieldType: string = "content"): Promise<string> {
  if (!text || text.trim() === '') return text;

  const contextHint = fieldType === "title" 
    ? "Μετάφρασε αυτόν τον τίτλο άρθρου στα Ελληνικά. Σύντομος και επαγγελματικός. ΟΧΙ em dash (—)."
    : fieldType === "excerpt"
    ? "Μετάφρασε αυτήν την περίληψη στα Ελληνικά. Σύντομη και ελκυστική. ΟΧΙ em dash (—)."
    : "Μετάφρασε το παρακάτω περιεχόμενο στα Ελληνικά. Διατήρησε όλο το HTML formatting ακριβώς. ΟΧΙ em dash (—).";

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `${contextHint}\n\n${text}` },
      ],
      temperature: 0.15,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Translation API error: ${response.status} - ${errorText}`);
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();
  let translatedText = data.choices?.[0]?.message?.content?.trim();
  
  if (!translatedText) {
    throw new Error("No translation returned");
  }

  // Post-process: replace any remaining em dashes with spaced hyphens
  translatedText = translatedText.replace(/—/g, ' - ');
  
  return translatedText;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { slug, dryRun = false } = await req.json().catch(() => ({}));
    
    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: slug" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Retranslating insight: ${slug}`);

    // Get English version
    const { data: englishData, error: englishError } = await supabase
      .from('insights_translations')
      .select(`
        id,
        title,
        excerpt,
        content,
        insights_id,
        insights!inner(slug)
      `)
      .eq('insights.slug', slug)
      .eq('language_id', ENGLISH_LANGUAGE_ID)
      .single();

    if (englishError || !englishData) {
      console.error('Error fetching English insight:', englishError);
      return new Response(
        JSON.stringify({ error: `English version not found for slug: ${slug}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Greek version ID
    const { data: greekData, error: greekError } = await supabase
      .from('insights_translations')
      .select('id')
      .eq('insights_id', englishData.insights_id)
      .eq('language_id', GREEK_LANGUAGE_ID)
      .single();

    if (greekError || !greekData) {
      console.error('Error fetching Greek insight:', greekError);
      return new Response(
        JSON.stringify({ error: `Greek version not found for slug: ${slug}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Translating title...');
    const translatedTitle = await translateText(englishData.title, "title");
    console.log(`Title: ${translatedTitle}`);

    console.log('Translating excerpt...');
    const translatedExcerpt = await translateText(englishData.excerpt, "excerpt");
    console.log(`Excerpt: ${translatedExcerpt}`);

    console.log('Translating content (this may take a while)...');
    const translatedContent = await translateText(englishData.content, "content");
    console.log(`Content translated, length: ${translatedContent.length}`);

    const updates = {
      title: translatedTitle,
      excerpt: translatedExcerpt,
      content: translatedContent,
      updated_at: new Date().toISOString()
    };

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          greekId: greekData.id,
          updates
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update Greek translation
    const { error: updateError } = await supabase
      .from('insights_translations')
      .update(updates)
      .eq('id', greekData.id);

    if (updateError) {
      console.error('Error updating Greek translation:', updateError);
      return new Response(
        JSON.stringify({ error: `Failed to update Greek translation: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully retranslated insight "${slug}" to Greek`,
        greekId: greekData.id,
        titleLength: translatedTitle.length,
        excerptLength: translatedExcerpt.length,
        contentLength: translatedContent.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Retranslation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
