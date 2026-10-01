import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ServiceData {
  id: string;
  title: string;
  short_description: string;
  long_description: string;
}

interface TranslationResult {
  title: string;
  short_description: string;
  long_description: string;
}

const languageNames: Record<string, string> = {
  'el': 'Greek',
  'de': 'German', 
  'fr': 'French',
  'es': 'Spanish',
  'it': 'Italian'
};

// Strip HTML tags from text (for titles)
function stripHtmlTags(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace nbsp
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Check if a title is a generic placeholder
function isPlaceholderTitle(title: string, targetLanguage: string): boolean {
  if (!title) return true;
  
  const placeholders: Record<string, string[]> = {
    'el': ['Ψηφιακή Υπηρεσία', 'Υπηρεσία', 'Τίτλος', 'Ψηφιακές Υπηρεσίες', 'Ψηφιακή'],
    'de': ['Digitaler Service', 'Dienst', 'Titel', 'Digitale Dienste', 'Digitale Dienstleistung', 'Digital Service', 'Digitaler Dienst'],
    'fr': ['Service Numérique', 'Service', 'Titre', 'Services Numériques', 'Service Digital'],
    'es': ['Servicio Digital', 'Servicio', 'Título', 'Servicios Digitales'],
    'it': ['Servizio Digitale', 'Servizio', 'Titolo', 'Servizi Digitali']
  };
  
  const langPlaceholders = placeholders[targetLanguage] || [];
  const cleanTitle = stripHtmlTags(title).toLowerCase().trim();
  
  // Check exact matches
  if (langPlaceholders.some(p => cleanTitle === p.toLowerCase())) {
    return true;
  }
  
  // Check if title contains a placeholder phrase
  if (langPlaceholders.some(p => cleanTitle.includes(p.toLowerCase()) && cleanTitle.length < p.length + 10)) {
    return true;
  }
  
  // Check minimum length
  if (cleanTitle.length < 5) {
    return true;
  }
  
  // Check for HTML tags
  if (title.includes('<p>') || title.includes('</')) {
    return true;
  }
  
  return false;
}

async function translateText(
  apiKey: string,
  text: string,
  targetLanguage: string,
  contentType: string,
  originalTitle?: string,
  retryCount: number = 0
): Promise<string | null> {
  if (!text || text.trim() === '' || text === '<p></p>') {
    return text || '';
  }

  const languageName = languageNames[targetLanguage] || targetLanguage;
  const cleanText = contentType === 'service title' ? stripHtmlTags(text) : text;
  
  let systemPrompt: string;
  
  if (contentType === 'service title') {
    systemPrompt = `You are a professional translator specializing in business and technology services. Translate the following service title from English to ${languageName}.

CRITICAL RULES:
1. Return ONLY the translated title - no HTML tags, no explanations, no quotes
2. Keep it concise and professional (similar length to original)
3. This is a business service name - translate the ACTUAL specific service name
4. DO NOT add any HTML tags like <p> or </p>
5. NEVER use generic terms like "Digital Service", "Digitaler Service", "Servicio Digital" etc.
6. The translation must be SPECIFIC to the original service name

For example:
- "Web Development" → "Webentwicklung" (German), NOT "Digitaler Service"
- "Email Marketing" → "E-Mail-Marketing" (German), NOT "Digitaler Service"
- "SEO Audit" → "SEO-Audit" (German), NOT "Digitaler Service"
- "Mobile App Development" → "Mobile App Entwicklung" (German)

The original service title to translate is: "${text}"
Provide ONLY the specific translated title, nothing else.`;
  } else if (contentType === 'short description') {
    systemPrompt = `You are a professional translator. Translate this short service description from English to ${languageName}.

CRITICAL RULES:
1. Return ONLY the translated text - no HTML tags, no explanations
2. Keep it concise (1-2 sentences max)
3. Maintain the professional, marketing-oriented tone
4. DO NOT wrap in <p> tags
5. This is for the service: "${originalTitle}"`;
  } else {
    systemPrompt = `You are a professional translator specializing in digital marketing and technology content.

RULES:
1. Translate from English to ${languageName}
2. Preserve ALL HTML tags and formatting EXACTLY as provided
3. Keep the same professional tone and style
4. Return ONLY the translated text, no explanations`;
  }

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Translate to ${languageName}:\n\n${cleanText}` }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Lovable AI error: ${response.status}`, error);
      
      // Retry on rate limit or temporary errors
      if ((response.status === 429 || response.status >= 500) && retryCount < 3) {
        console.log(`Retrying in ${(retryCount + 1) * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
        return translateText(apiKey, text, targetLanguage, contentType, originalTitle, retryCount + 1);
      }
      
      return null;
    }

    const data = await response.json();
    let translatedText = data.choices?.[0]?.message?.content?.trim();
    
    if (!translatedText) {
      console.error('No translation received from Lovable AI');
      return null;
    }

    // Clean up the result for titles
    if (contentType === 'service title') {
      translatedText = stripHtmlTags(translatedText);
      // Remove any quotes that might have been added
      translatedText = translatedText.replace(/^["']|["']$/g, '');
    }

    // Clean up short descriptions
    if (contentType === 'short description') {
      translatedText = stripHtmlTags(translatedText);
    }

    return translatedText;
  } catch (error) {
    console.error(`Translation error for "${text.substring(0, 50)}...":`, error);
    
    // Retry on network errors
    if (retryCount < 3) {
      console.log(`Retrying in ${(retryCount + 1) * 2} seconds...`);
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
      return translateText(apiKey, text, targetLanguage, contentType, originalTitle, retryCount + 1);
    }
    
    return null;
  }
}

async function translateService(
  apiKey: string,
  service: ServiceData,
  targetLanguage: string
): Promise<TranslationResult | null> {
  console.log(`Translating service "${service.title}" to ${targetLanguage}...`);
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Translate title first
  let title = await translateText(apiKey, service.title, targetLanguage, 'service title');
  
  // If title translation failed, return null
  if (title === null) {
    console.error(`Failed to translate title for "${service.title}" to ${targetLanguage}`);
    return null;
  }
  
  // Validate title - retry if it's a placeholder
  let attempts = 0;
  while (isPlaceholderTitle(title, targetLanguage) && attempts < 2) {
    console.log(`Retrying title translation (attempt ${attempts + 1}), got placeholder: "${title}"`);
    await delay(1000);
    const retryTitle = await translateText(apiKey, service.title, targetLanguage, 'service title');
    if (retryTitle !== null) {
      title = retryTitle;
    }
    attempts++;
  }
  
  // Final cleanup
  title = stripHtmlTags(title);
  
  if (isPlaceholderTitle(title, targetLanguage)) {
    console.warn(`WARNING: Still got placeholder title after retries: "${title}" - using as fallback`);
    // Continue with the placeholder rather than failing entirely
  }
  
  await delay(500);
  
  // Translate short description with context of the title
  let short_description = await translateText(
    apiKey, 
    service.short_description, 
    targetLanguage, 
    'short description',
    service.title
  );
  
  // Use original if translation failed
  if (short_description === null) {
    console.warn(`Short description translation failed, using original`);
    short_description = service.short_description || '';
  }
  
  await delay(500);
  
  // Translate long description (preserving HTML)
  let long_description = await translateText(
    apiKey, 
    service.long_description, 
    targetLanguage, 
    'detailed service description'
  );
  
  // Use original if translation failed
  if (long_description === null) {
    console.warn(`Long description translation failed, using original`);
    long_description = service.long_description || '';
  }
  
  console.log(`✓ Translated "${service.title}" → "${title}"`);
  
  return { title, short_description, long_description };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const targetLanguages = [
      { code: 'el', id: 5 },
      { code: 'de', id: 4 },
      { code: 'fr', id: 3 },
      { code: 'es', id: 2 },
      { code: 'it', id: 10 }
    ];

    // Get all services with their English translations
    const { data: services, error: servicesError } = await supabase
      .from('service_translations')
      .select(`
        service_id,
        title,
        short_description,
        long_description,
        services!inner(id, slug)
      `)
      .eq('language_id', 1);

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`);
    }

    console.log(`Found ${services?.length || 0} services to translate`);

    const results: any[] = [];
    const errors: any[] = [];
    const skipped: any[] = [];

    // Process services - translate ALL since we deleted existing translations
    for (const service of services || []) {
      const serviceData: ServiceData = {
        id: service.service_id,
        title: service.title || '',
        short_description: service.short_description || '',
        long_description: service.long_description || ''
      };

      // Skip if no English title
      if (!serviceData.title || serviceData.title.trim() === '') {
        console.log(`Skipping service ${serviceData.id} - no English title`);
        skipped.push({ service_id: serviceData.id, reason: 'no English title' });
        continue;
      }

      for (const lang of targetLanguages) {
        try {
          console.log(`\n--- Translating ${serviceData.title} to ${lang.code} ---`);
          
          const translation = await translateService(lovableApiKey, serviceData, lang.code);
          
          if (translation === null) {
            console.error(`Translation returned null for ${serviceData.title} in ${lang.code}`);
            errors.push({
              service: serviceData.title,
              language: lang.code,
              error: 'Translation failed after retries'
            });
            continue;
          }
          
          const { error: upsertError } = await supabase
            .from('service_translations')
            .upsert({
              service_id: serviceData.id,
              language_id: lang.id,
              title: translation.title,
              short_description: translation.short_description,
              long_description: translation.long_description,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'service_id,language_id'
            });

          if (upsertError) {
            console.error(`Failed to save translation for ${serviceData.title} in ${lang.code}:`, upsertError);
            errors.push({
              service: serviceData.title,
              language: lang.code,
              error: upsertError.message
            });
          } else {
            console.log(`✓ Saved ${serviceData.title} in ${lang.code}`);
            results.push({
              service: serviceData.title,
              language: lang.code,
              translatedTitle: translation.title,
              status: 'success'
            });
          }

          // Delay between translations to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 800));
          
        } catch (error) {
          console.error(`Error translating ${serviceData.title} to ${lang.code}:`, error);
          errors.push({
            service: serviceData.title,
            language: lang.code,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          // Continue to next translation instead of stopping
        }
      }
    }

    // Also translate service categories
    console.log('\n--- Translating service categories ---');
    
    const { data: categories, error: catError } = await supabase
      .from('service_category_translations')
      .select(`
        category_id,
        name,
        description,
        service_categories!inner(id, slug)
      `)
      .eq('language_id', 1);

    if (!catError && categories) {
      for (const cat of categories) {
        for (const lang of targetLanguages) {
          try {
            const translatedName = await translateText(
              lovableApiKey, 
              cat.name || '', 
              lang.code, 
              'service title'
            );
            
            if (translatedName === null) {
              console.error(`Failed to translate category name "${cat.name}" to ${lang.code}`);
              errors.push({
                category: cat.name,
                language: lang.code,
                error: 'Name translation failed'
              });
              continue;
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let translatedDesc = await translateText(
              lovableApiKey, 
              cat.description || '', 
              lang.code, 
              'short description'
            );
            
            // Use original if description translation failed
            if (translatedDesc === null) {
              translatedDesc = cat.description || '';
            }

            const { error: catUpsertError } = await supabase
              .from('service_category_translations')
              .upsert({
                category_id: cat.category_id,
                language_id: lang.id,
                name: translatedName,
                description: translatedDesc,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'category_id,language_id'
              });

            if (!catUpsertError) {
              console.log(`✓ Saved category ${cat.name} in ${lang.code}`);
              results.push({
                category: cat.name,
                language: lang.code,
                status: 'success'
              });
            } else {
              errors.push({
                category: cat.name,
                language: lang.code,
                error: catUpsertError.message
              });
            }

            await new Promise(resolve => setTimeout(resolve, 800));
          } catch (error) {
            console.error(`Error translating category ${cat.name} to ${lang.code}:`, error);
            errors.push({
              category: cat.name,
              language: lang.code,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            // Continue to next translation
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Translated ${results.length} items with ${errors.length} errors`,
        results,
        errors: errors.length > 0 ? errors : undefined,
        skipped: skipped.length > 0 ? skipped : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Batch translation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
