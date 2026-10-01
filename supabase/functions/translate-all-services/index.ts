import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const languageConfig: Record<string, { id: number; name: string }> = {
  el: { id: 5, name: "Greek" },
  fr: { id: 3, name: "French" },
  it: { id: 10, name: "Italian" },
  es: { id: 2, name: "Spanish" },
  de: { id: 4, name: "German" },
};

// Technical terms and marketing concepts to NEVER translate - keep in English
const technicalTerms = [
  // Digital Marketing Terms
  "SEO", "AI", "CRM", "CRO", "MVP", "SaaS", "B2B", "B2C", "API", "UX", "UI",
  "Google Ads", "Meta Ads", "TikTok", "LinkedIn", "Instagram", "Facebook",
  "eCommerce", "e-commerce", "ROI", "KPI", "A/B", "PPC", "CTR", "CPM", "CPC",
  "Growth Hacking", "Marketing", "Branding", "Digital", "Analytics", "Data",
  "Automation", "Machine Learning", "Deep Learning", "Startup", "Venture",
  "Pitch Deck", "Data Room", "Due Diligence", "Series A", "Seed", "Pre-seed",
  "Email Marketing", "Content Marketing", "Performance Marketing",
  "Web Development", "Mobile App", "Software", "Platform", "Framework",
  "Attribution", "Tracking", "Funnel", "Pipeline", "Lead", "Conversion",
  // Service Names and Industry Terms (NEVER translate)
  "Venture Studio", "Go-to-Market", "GTM", "Product-Market Fit", "PMF",
  "Landing Page", "Lead Generation", "Lead Magnet", "Retargeting", "Remarketing",
  "Copywriting", "Creative", "Design System", "Brand Identity", "Brand Strategy",
  "Paid Media", "Organic", "Social Media", "Influencer Marketing",
  "Video Marketing", "Display Ads", "Native Ads", "Programmatic",
  "Search Ads", "Shopping Ads", "Discovery Ads", "YouTube Ads",
  "Shopify", "WooCommerce", "Magento", "WordPress", "Webflow",
  "React", "Node.js", "TypeScript", "JavaScript", "Python",
  "HubSpot", "Salesforce", "Mailchimp", "Klaviyo", "ActiveCampaign",
  "Google Analytics", "Google Tag Manager", "Hotjar", "Mixpanel",
  "Conversion Rate Optimization", "Search Engine Optimization",
  "User Experience", "User Interface", "Artificial Intelligence",
  "Customer Relationship Management", "Business Intelligence",
  "Customer Acquisition Cost", "CAC", "LTV", "Lifetime Value",
  "ROAS", "Return on Ad Spend", "Cost per Lead", "CPL",
  "Click-Through Rate", "Bounce Rate", "Exit Rate", "Session",
  "Impressions", "Reach", "Engagement", "Engagement Rate",
  "Brand Awareness", "Demand Generation", "Account Based Marketing", "ABM",
  "Marketing Automation", "Sales Enablement", "Revenue Operations", "RevOps",
  "Omnichannel", "Multichannel", "Cross-channel", "Customer Journey",
  "Touchpoint", "Attribution Model", "First-touch", "Last-touch", "Multi-touch",
  "Lookalike Audience", "Custom Audience", "Retargeting Audience",
  "Pixel", "Tag", "Script", "SDK", "Integration", "Webhook",
  "A/B Testing", "Split Testing", "Multivariate Testing",
  "Heatmap", "Scroll Map", "Click Map", "Session Recording",
  "Form Optimization", "Checkout Optimization", "Cart Abandonment",
  "Upsell", "Cross-sell", "Bundle", "Subscription", "Recurring Revenue",
  "MRR", "ARR", "Churn", "Retention", "NPS", "Net Promoter Score"
];

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateText(
  apiKey: string,
  text: string,
  targetLang: string,
  contentType: "title" | "short_description" | "long_description" | "h2_title" | "faq_question" | "faq_answer",
  context?: string
): Promise<string | null> {
  if (!text || text.trim() === "" || text === "<p></p>") {
    return text || "";
  }

  const langName = languageConfig[targetLang]?.name || targetLang;
  const termsNote = `Keep these terms in English: ${technicalTerms.slice(0, 30).join(", ")}`;

  let systemPrompt = "";
  
  switch (contentType) {
    case "title":
      // TITLES SHOULD NEVER BE TRANSLATED - Return as-is
      return text;
       
    case "h2_title":
      systemPrompt = `You are an SEO copywriter translating marketing headlines. Translate this H2 title from English to ${langName}.
CRITICAL RULES:
1. NEVER translate technical terms, marketing concepts, or industry terminology - keep them in English
2. Keep terms like: SEO, CRO, AI, Marketing, Branding, eCommerce, Google Ads, Meta, Conversion, Lead, etc. in English
3. Return ONLY the translated H2 title - no explanations
4. Keep the powerful, action-oriented tone
5. Max 60 characters
6. ${termsNote}`;
      break;
      
    case "short_description":
      systemPrompt = `You are a professional translator for a digital agency. Translate this short service description from English to ${langName}.
CRITICAL RULES:
1. NEVER translate technical terms, marketing concepts, or industry terminology - keep them in English
2. Terms like SEO, CRO, AI, Marketing, Branding, Google Ads, Conversion, Lead Generation, etc. MUST stay in English
3. Return ONLY the translated text - no HTML tags
4. Keep it concise (1-2 sentences)
5. Maintain the professional marketing tone
6. ${termsNote}
Context: This is for the service "${context}"`;
      break;
      
    case "long_description":
      systemPrompt = `You are a professional translator for a digital agency. Translate this service description from English to ${langName}.
CRITICAL RULES:
1. NEVER translate technical terms, marketing concepts, or industry terminology - keep them in English
2. Terms like SEO, CRO, AI, Marketing, Branding, Google Ads, Conversion, Lead Generation, Attribution, Funnel, etc. MUST stay in English
3. Preserve ALL HTML formatting exactly as provided
4. Maintain the professional tone and style
5. ${termsNote}`;
      break;
      
    case "faq_question":
      systemPrompt = `Translate this FAQ question from English to ${langName}.
CRITICAL RULES:
1. NEVER translate technical terms or marketing concepts - keep them in English
2. Return ONLY the translated question
3. Keep it natural and conversational
4. ${termsNote}`;
      break;
      
    case "faq_answer":
      systemPrompt = `Translate this FAQ answer from English to ${langName}.
CRITICAL RULES:
1. NEVER translate technical terms or marketing concepts - keep them in English
2. Preserve any HTML formatting
3. Maintain the helpful, informative tone
4. ${termsNote}`;
      break;
  }

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Translate to ${langName}:\n\n${text}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error (${response.status}):`, errorText);
      
      if (response.status === 429 || response.status >= 500) {
        await delay(3000);
        return translateText(apiKey, text, targetLang, contentType, context);
      }
      return null;
    }

    const data = await response.json();
    let translated = data.choices?.[0]?.message?.content?.trim();
    
    if (!translated) return null;
    
    // Clean up for non-HTML content types
    if (contentType !== "long_description" && contentType !== "faq_answer") {
      translated = translated.replace(/<[^>]*>/g, "").replace(/^[\"']|[\"']$/g, "").trim();
    }
    
    return translated;
  } catch (error) {
    console.error(`Translation error:`, error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { targetLanguages = ["el", "fr", "it", "es", "de"], limit = 10, offset = 0, translateFaqs = true, seoOnly = false } = await req.json().catch(() => ({}));
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    let englishServices: any[] | null = null;
    let fetchError: any = null;

    if (seoOnly) {
      // Get SEO-only service IDs first, then fetch their English translations
      const { data: seoServices, error: seoError } = await supabase
        .from("services")
        .select("id")
        .eq("is_seo_only", true);

      if (seoError) throw new Error(`Failed to fetch SEO services: ${seoError.message}`);
      
      const seoIds = (seoServices || []).map((s: any) => s.id);
      console.log(`Found ${seoIds.length} SEO-only services`);

      if (seoIds.length > 0) {
        const { data, error } = await supabase
          .from("service_translations")
          .select("id, service_id, title, short_description, long_description, seo_h2_title")
          .eq("language_id", 1)
          .in("service_id", seoIds)
          .range(offset, offset + limit - 1);
        englishServices = data;
        fetchError = error;
      }
    } else {
      const { data, error } = await supabase
        .from("service_translations")
        .select("id, service_id, title, short_description, long_description, seo_h2_title")
        .eq("language_id", 1)
        .range(offset, offset + limit - 1);
      englishServices = data;
      fetchError = error;
    }

    if (fetchError) throw new Error(`Failed to fetch services: ${fetchError.message}`);
    if (!englishServices || englishServices.length === 0) {
      return new Response(JSON.stringify({ message: "No services found", processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing ${englishServices.length} services for languages: ${targetLanguages.join(", ")}`);

    const results = {
      processed: 0,
      failed: 0,
      details: [] as any[],
    };

    for (const service of englishServices) {
      console.log(`\n--- Translating: ${service.title} ---`);
      
      for (const langCode of targetLanguages) {
        const langInfo = languageConfig[langCode];
        if (!langInfo) continue;

        try {
          // Check if translation already exists
          const { data: existing } = await supabase
            .from("service_translations")
            .select("id, title")
            .eq("service_id", service.service_id)
            .eq("language_id", langInfo.id)
            .single();

          // Translate all fields
          const translatedTitle = await translateText(LOVABLE_API_KEY, service.title || "", langCode, "title");
          await delay(300);
          
          const translatedH2 = await translateText(LOVABLE_API_KEY, service.seo_h2_title || "", langCode, "h2_title");
          await delay(300);
          
          const translatedShort = await translateText(LOVABLE_API_KEY, service.short_description || "", langCode, "short_description", service.title);
          await delay(300);
          
          const translatedLong = await translateText(LOVABLE_API_KEY, service.long_description || "", langCode, "long_description");
          await delay(300);

          if (!translatedTitle) {
            console.error(`Failed to translate title for ${service.title} to ${langCode}`);
            results.failed++;
            continue;
          }

          // Upsert the translation
          const { error: upsertError } = await supabase
            .from("service_translations")
            .upsert({
              service_id: service.service_id,
              language_id: langInfo.id,
              title: translatedTitle,
              short_description: translatedShort || service.short_description,
              long_description: translatedLong || service.long_description,
              seo_h2_title: translatedH2 || service.seo_h2_title,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: "service_id,language_id",
            });

          if (upsertError) {
            console.error(`Upsert error:`, upsertError);
            results.failed++;
            continue;
          }

          console.log(`✓ ${service.title} → ${langCode}: ${translatedTitle}`);
          results.processed++;
          results.details.push({
            service: service.title,
            language: langCode,
            translatedTitle,
            translatedH2,
            status: "success",
          });

          await delay(500);
        } catch (error) {
          console.error(`Error translating ${service.title} to ${langCode}:`, error);
          results.failed++;
        }
      }

      // Translate FAQs for this service
      if (translateFaqs) {
        const { data: faqs } = await supabase
          .from("service_faqs")
          .select("id, question, answer")
          .eq("service_id", service.service_id);

        if (faqs && faqs.length > 0) {
          console.log(`Translating ${faqs.length} FAQs for ${service.title}`);
          
          for (const faq of faqs) {
            for (const langCode of targetLanguages) {
              const langInfo = languageConfig[langCode];
              if (!langInfo) continue;

              try {
                const translatedQuestion = await translateText(LOVABLE_API_KEY, faq.question, langCode, "faq_question");
                await delay(200);
                
                const translatedAnswer = await translateText(LOVABLE_API_KEY, faq.answer, langCode, "faq_answer");
                await delay(200);

                if (translatedQuestion && translatedAnswer) {
                  await supabase
                    .from("service_faq_translations")
                    .upsert({
                      faq_id: faq.id,
                      language_id: langInfo.id,
                      question: translatedQuestion,
                      answer: translatedAnswer,
                      updated_at: new Date().toISOString(),
                    }, {
                      onConflict: "faq_id,language_id",
                    });
                  
                  console.log(`✓ FAQ translated to ${langCode}`);
                }
              } catch (error) {
                console.error(`FAQ translation error:`, error);
              }
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: "Translation completed",
        summary: {
          processed: results.processed,
          failed: results.failed,
          services: englishServices.length,
          languages: targetLanguages,
        },
        details: results.details,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in translate-all-services:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

