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

const SYSTEM_PROMPT = `You are an expert Greek translator specializing in business and technology content for a digital agency website.

CRITICAL TRANSLATION RULES:

1. NEVER translate these terms - keep them EXACTLY in English:
   - Technical terms: SEO, UX, UI, UX/UI, API, CRM, ERP, SaaS, PaaS, IaaS, CMS, AI, ML, B2B, B2C, ROI, KPI, MVP, SDK, CSS, HTML, JavaScript, TypeScript
   - Business terms: Startup, Startups, Mentorship, Branding, Marketing, E-commerce, E-shop, Online, Digital, Growth Hacking, Venture Studio, Digital Agency
   - Product names: WordPress, Shopify, Magento, WooCommerce, React, Node.js, Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads
   - Common English terms used in Greek business: team, partner, partners, coaching, consulting, performance, analytics, insights, blog

2. Keep ALL brand names, company names, and product names EXACTLY as provided (e.g., "Advisable", "MarketData", "Ecommercen", "CardiaCloud")

3. Preserve ALL HTML tags, markdown formatting, and special characters exactly as they appear

4. Use formal Greek language ("εσείς" form, not "εσύ")

5. Create natural, fluent Greek translations - NOT word-by-word literal translations

6. For button text and CTAs, use action-oriented Greek that feels natural

7. Keep numbers, dates, and measurements in their original format

8. If the English text is very short (1-3 words) and is a common English term used in Greek business context, you may keep it in English

RESPONSE FORMAT:
Return ONLY the translated Greek text, nothing else. No explanations, no quotes, no prefixes.`;

async function translateText(text: string): Promise<string> {
  if (!text || text.trim() === '') return text;
  
  // Skip if already looks like good Greek (has Greek characters and is substantial)
  const greekCharCount = (text.match(/[\u0370-\u03FF\u1F00-\u1FFF]/g) || []).length;
  const totalCharCount = text.replace(/\s/g, '').length;
  
  // If more than 60% is Greek and has substantial content, skip
  if (totalCharCount > 20 && greekCharCount / totalCharCount > 0.6) {
    console.log(`Skipping already Greek text: ${text.substring(0, 50)}...`);
    return text;
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Translate the following English text to Greek:\n\n${text}` },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Translation API error: ${response.status} - ${errorText}`);
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();
  const translatedText = data.choices?.[0]?.message?.content?.trim();
  
  if (!translatedText) {
    throw new Error("No translation returned");
  }

  return translatedText;
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface TranslationTask {
  tableName: string;
  idColumn: string;
  foreignKeyColumn: string;
  fields: string[];
}

const TRANSLATION_TASKS: TranslationTask[] = [
  {
    tableName: "service_translations",
    idColumn: "id",
    foreignKeyColumn: "service_id",
    fields: ["title", "short_description", "long_description"]
  },
  {
    tableName: "service_category_translations",
    idColumn: "id", 
    foreignKeyColumn: "service_category_id",
    fields: ["name", "description"]
  },
  {
    tableName: "product_translations",
    idColumn: "id",
    foreignKeyColumn: "product_id",
    fields: ["title", "description", "page_title", "page_subtitle", "page_description", "cta_section_title", "cta_section_description", "cta_button_text"]
  },
  {
    tableName: "insights_translations",
    idColumn: "id",
    foreignKeyColumn: "insights_id",
    fields: ["title", "excerpt", "content"]
  },
  {
    tableName: "news_translations",
    idColumn: "id",
    foreignKeyColumn: "news_id",
    fields: ["title", "excerpt", "content"]
  },
  {
    tableName: "clients_translations",
    idColumn: "id",
    foreignKeyColumn: "client_id",
    fields: ["description", "case_study_challenge", "case_study_solution"]
  },
  {
    tableName: "partner_translations",
    idColumn: "id",
    foreignKeyColumn: "partner_id",
    fields: ["name", "description", "long_description", "use_case"]
  },
  {
    tableName: "team_member_translations",
    idColumn: "id",
    foreignKeyColumn: "team_member_id",
    fields: ["role", "bio"]
  },
  {
    tableName: "hero_content_translations",
    idColumn: "id",
    foreignKeyColumn: "hero_content_id",
    fields: ["heading", "subheading", "cta_text"]
  },
  {
    tableName: "company_info_translations",
    idColumn: "id",
    foreignKeyColumn: "company_info_id",
    fields: ["title", "content", "mission", "vision", "history", "approach", "team_intro"]
  },
  {
    tableName: "credential_translations",
    idColumn: "id",
    foreignKeyColumn: "credential_id",
    fields: ["title", "description"]
  },
  {
    tableName: "company_value_translations",
    idColumn: "id",
    foreignKeyColumn: "company_value_id",
    fields: ["title", "description"]
  },
  {
    tableName: "metric_translations",
    idColumn: "id",
    foreignKeyColumn: "metric_id",
    fields: ["label", "description"]
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { table, dryRun = false } = await req.json().catch(() => ({}));
    
    const tasksToRun = table 
      ? TRANSLATION_TASKS.filter(t => t.tableName === table)
      : TRANSLATION_TASKS;

    if (tasksToRun.length === 0) {
      return new Response(
        JSON.stringify({ error: `Unknown table: ${table}`, availableTables: TRANSLATION_TASKS.map(t => t.tableName) }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Record<string, any> = {};
    let totalTranslated = 0;
    let totalErrors = 0;

    for (const task of tasksToRun) {
      console.log(`\n=== Processing ${task.tableName} ===`);
      
      // Get Greek records
      const { data: greekRecords, error: greekError } = await supabase
        .from(task.tableName)
        .select(`*, ${task.foreignKeyColumn}`)
        .eq("language_id", GREEK_LANGUAGE_ID);

      if (greekError) {
        console.error(`Error fetching Greek records from ${task.tableName}:`, greekError);
        results[task.tableName] = { error: greekError.message };
        continue;
      }

      // Get English records for reference
      const { data: englishRecords, error: englishError } = await supabase
        .from(task.tableName)
        .select("*")
        .eq("language_id", ENGLISH_LANGUAGE_ID);

      if (englishError) {
        console.error(`Error fetching English records from ${task.tableName}:`, englishError);
        results[task.tableName] = { error: englishError.message };
        continue;
      }

      // Create lookup map for English records
      const englishMap = new Map();
      for (const record of englishRecords || []) {
        englishMap.set(record[task.foreignKeyColumn], record);
      }

      let tableTranslated = 0;
      let tableErrors = 0;
      const translations: any[] = [];

      for (const greekRecord of greekRecords || []) {
        const foreignKey = (greekRecord as unknown as Record<string, unknown>)[task.foreignKeyColumn];
        const englishRecord = englishMap.get(foreignKey);
        
        if (!englishRecord) {
          console.log(`No English record found for ${task.foreignKeyColumn}: ${foreignKey}`);
          continue;
        }

        const updates: Record<string, string> = {};
        
        for (const field of task.fields) {
          const englishValue = englishRecord[field];
          
          // Skip if no English value
          if (!englishValue || englishValue.trim() === '') continue;
          
          try {
            console.log(`Translating ${task.tableName}.${field}: ${englishValue.substring(0, 50)}...`);
            
            const translatedValue = await translateText(englishValue);
            updates[field] = translatedValue;
            
            console.log(`  → ${translatedValue.substring(0, 50)}...`);
            
            // Rate limiting delay
            await delay(800);
            
            tableTranslated++;
          } catch (error) {
            console.error(`Error translating ${task.tableName}.${field}:`, error);
            tableErrors++;
          }
        }

        if (Object.keys(updates).length > 0) {
          const recordId = (greekRecord as unknown as Record<string, unknown>)[task.idColumn];
          if (dryRun) {
            translations.push({
              id: recordId,
              updates
            });
          } else {
            // Update the record
            const { error: updateError } = await supabase
              .from(task.tableName)
              .update(updates)
              .eq(task.idColumn, recordId);

            if (updateError) {
              console.error(`Error updating ${task.tableName}:`, updateError);
              tableErrors++;
            } else {
              translations.push({
                id: recordId,
                updates
              });
            }
          }
        }
      }

      results[task.tableName] = {
        translated: tableTranslated,
        errors: tableErrors,
        records: translations.length,
        dryRun
      };
      
      totalTranslated += tableTranslated;
      totalErrors += tableErrors;
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalTranslated,
        totalErrors,
        results,
        dryRun
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
