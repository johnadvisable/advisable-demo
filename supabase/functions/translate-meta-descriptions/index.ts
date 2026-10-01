import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Language codes and their full names for better translation context
// IDs from database: en=1, es=2, fr=3, de=4, el=5, it=10
const LANGUAGES = [
  { code: 'en', name: 'English', id: 1 },
  { code: 'es', name: 'Spanish', id: 2 },
  { code: 'fr', name: 'French', id: 3 },
  { code: 'de', name: 'German', id: 4 },
  { code: 'el', name: 'Greek', id: 5 },
  { code: 'it', name: 'Italian', id: 10 },
];

// Technical and marketing terms that should NOT be translated
const PRESERVE_TERMS = [
  // Marketing terms
  'SEO', 'ROAS', 'ROI', 'CRO', 'KPI', 'CTA', 'CTR', 'CPM', 'CPC', 'PPC',
  'B2B', 'B2C', 'SaaS', 'MVP', 'USP', 'UVP', 'SWOT',
  // Technical terms
  'AI', 'API', 'SDK', 'CMS', 'ERP', 'CRM', 'UI', 'UX', 'UI/UX',
  'iOS', 'Android', 'React', 'Node.js', 'TypeScript', 'JavaScript',
  'HTML', 'CSS', 'SQL', 'NoSQL', 'REST', 'GraphQL', 'JSON',
  // Platform names
  'Google Ads', 'Meta Ads', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok',
  'Shopify', 'WooCommerce', 'Magento', 'WordPress', 'Webflow',
  'Google Analytics', 'Google Tag Manager', 'GTM',
  // Brand names
  'Advisable', 'Supabase', 'Stripe', 'PayPal',
  // Service names (keep in English as technical definitions)
  'Brand Strategy', 'Content Creation', 'Digital Marketing', 'E-Commerce',
  'Performance Marketing', 'Growth Hacking', 'Venture Studio',
];

async function translateWithGemini(
  text: string,
  targetLang: string,
  targetLangName: string,
  apiKey: string
): Promise<string> {
  const preserveTermsStr = PRESERVE_TERMS.join(', ');
  
  const systemPrompt = `You are a professional translator specializing in business and technology content.

CRITICAL RULES:
1. Translate the text to ${targetLangName} (${targetLang})
2. DO NOT translate these terms - keep them in English: ${preserveTermsStr}
3. DO NOT translate brand names, product names, or technical acronyms
4. DO NOT translate marketing terminology like \"19x ROAS\", \"conversion rate\", etc.
5. Keep the professional, business tone
6. Return ONLY the translated text, no explanations or quotes
7. If the text is already in ${targetLangName}, return it as-is with minor improvements if needed`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Translate to ${targetLangName}:\n\n${text}` }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Translation API error: ${response.status}`, errorText);
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || text;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { entityType, dryRun = false, limit = 20 } = await req.json();
    
    if (!entityType) {
      return new Response(
        JSON.stringify({ 
          error: "entityType is required. Options: services, products, insights, news, investments, partners, clients",
          success: false 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: any[] = [];
    let totalTranslated = 0;
    let totalSkipped = 0;
    let processedCount = 0;

    // Helper to translate descriptions for an entity
    async function translateEntityDescriptions(
      tableName: string,
      translationTable: string,
      idField: string,
      descriptionFields: string[]
    ) {
      console.log(`\n=== Processing ${tableName} ===`);
      
      // Get all entities
      const { data: entities, error: entityError } = await supabase
        .from(tableName)
        .select('*');

      if (entityError) {
        console.error(`Error fetching ${tableName}:`, entityError);
        return;
      }

      if (!entities || entities.length === 0) {
        console.log(`No entities found in ${tableName}`);
        return;
      }

      console.log(`Found ${entities.length} entities in ${tableName}`);

      for (const entity of entities) {
        // Check if we've hit the limit
        if (processedCount >= limit) {
          console.log(`Reached limit of ${limit} translations`);
          break;
        }
        
        const entityId = entity.id;

        // Get existing translations
        const { data: translations, error: transError } = await supabase
          .from(translationTable)
          .select('*')
          .eq(idField, entityId);

        if (transError) {
          console.error(`Error fetching translations for ${entityId}:`, transError);
          continue;
        }

        // Check each language
        for (const lang of LANGUAGES) {
          // Skip English as it's the source
          if (lang.code === 'en') continue;

          const existingTrans = translations?.find(t => t.language_id === lang.id);
          
          // Get English version as source
          const englishTrans = translations?.find(t => t.language_id === 2);
          
          for (const field of descriptionFields) {
            const sourceText = englishTrans?.[field] || entity[field];
            
            if (!sourceText) continue;

            const currentTranslation = existingTrans?.[field];
            
            // Check if translation is missing or is same as English (not translated)
            const needsTranslation = !currentTranslation || 
              currentTranslation === sourceText ||
              currentTranslation.trim() === '';

            if (!needsTranslation) {
              totalSkipped++;
              continue;
            }

            console.log(`Translating ${field} for ${entityId} to ${lang.name}`);

            if (dryRun) {
              results.push({
                entity: tableName,
                entityId,
                field,
                language: lang.code,
                sourceText: sourceText.substring(0, 50) + '...',
                action: 'would_translate'
              });
              continue;
            }

            try {
              const apiKey = LOVABLE_API_KEY || '';
              const translated = await translateWithGemini(
                sourceText,
                lang.code,
                lang.name,
                apiKey
              );

              // Update or insert translation
              if (existingTrans) {
                const { error: updateError } = await supabase
                  .from(translationTable)
                  .update({ [field]: translated, updated_at: new Date().toISOString() })
                  .eq('id', existingTrans.id);

                if (updateError) {
                  console.error(`Error updating translation:`, updateError);
                } else {
                  totalTranslated++;
                  processedCount++;
                  results.push({
                    entity: tableName,
                    entityId,
                    field,
                    language: lang.code,
                    translated: translated.substring(0, 100) + '...',
                    action: 'updated'
                  });
                }
              } else {
                // Create new translation record using upsert to avoid duplicates
                const newRecord: any = {
                  [idField]: entityId,
                  language_id: lang.id,
                  [field]: translated,
                };
                
                const { error: upsertError } = await supabase
                  .from(translationTable)
                  .upsert(newRecord, { 
                    onConflict: `${idField},language_id`,
                    ignoreDuplicates: false 
                  });

                if (upsertError) {
                  console.error(`Error upserting translation:`, upsertError);
                } else {
                  totalTranslated++;
                  processedCount++;
                  results.push({
                    entity: tableName,
                    entityId,
                    field,
                    language: lang.code,
                    translated: translated.substring(0, 100) + '...',
                    action: 'upserted'
                  });
                }
              }

              // Rate limiting - shorter delay for faster processing
              await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error: unknown) {
              console.error(`Translation error for ${entityId}/${field}/${lang.code}:`, error);
              results.push({
                entity: tableName,
                entityId,
                field,
                language: lang.code,
                error: error instanceof Error ? error.message : String(error),
                action: 'error'
              });
            }
          }
        }
      }
    }

    // Define entities to translate based on entityType or do all
    const entitiesToProcess = entityType ? [entityType] : [
      'services',
      'products', 
      'insights',
      'news',
      'investments',
      'partners',
      'clients'
    ];

    for (const entity of entitiesToProcess) {
      switch (entity) {
        case 'services':
          await translateEntityDescriptions(
            'services',
            'service_translations',
            'service_id',
            ['short_description', 'long_description', 'meta_description']
          );
          break;
        case 'products':
          await translateEntityDescriptions(
            'products',
            'product_translations',
            'product_id',
            ['description', 'page_description']
          );
          break;
        case 'insights':
          await translateEntityDescriptions(
            'insights',
            'insights_translations',
            'insights_id',
            ['excerpt', 'content']
          );
          break;
        case 'news':
          await translateEntityDescriptions(
            'news',
            'news_translations',
            'news_id',
            ['excerpt', 'content']
          );
          break;
        case 'investments':
          await translateEntityDescriptions(
            'investments',
            'investment_translations',
            'investment_id',
            ['description', 'short_description']
          );
          break;
        case 'partners':
          await translateEntityDescriptions(
            'partners',
            'partner_translations',
            'partner_id',
            ['description', 'long_description']
          );
          break;
        case 'clients':
          await translateEntityDescriptions(
            'clients',
            'clients_translations',
            'client_id',
            ['description', 'case_study_challenge', 'case_study_solution']
          );
          break;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        dryRun,
        totalTranslated,
        totalSkipped,
        results: results.slice(0, 100), // Limit results to prevent huge response
        message: dryRun 
          ? `Dry run complete. Would translate ${results.length} fields.`
          : `Translation complete. Translated ${totalTranslated} fields, skipped ${totalSkipped}.`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
