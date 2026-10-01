import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ITALIAN_LANGUAGE_ID = 10;
const ENGLISH_LANGUAGE_ID = 1;

async function translateWithGemini(text: string, contentType: string, geminiApiKey: string): Promise<string> {
  if (!text || text.trim().length === 0) return '';

  const prompt = `You are a professional Italian translator specializing in SEO-optimized digital marketing content.

CRITICAL REQUIREMENTS:
- Translate the following ${contentType} from English to Italian
- Maintain SEO best practices (keyword optimization, natural flow, readability)
- Preserve ALL HTML tags, attributes, links, and formatting EXACTLY as provided
- Keep the same tone, style, and structure as the original
- Ensure the translation is culturally appropriate for the Italian market
- Do NOT translate brand names, company names, or proper nouns
- Do NOT add or remove any HTML elements
- Maintain the same paragraph structure

TEXT TO TRANSLATE:
${text}

Respond ONLY with the translated text, no explanations or additional formatting.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
        maxOutputTokens: 65536,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Gemini API error:', errorData);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!translatedText) {
    throw new Error('No translation received from Gemini API');
  }

  return translatedText;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) throw new Error('GEMINI_API_KEY is not set');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find all insights without Italian translations
    const { data: insights, error: fetchError } = await supabase
      .from('insights_translations')
      .select('insights_id, title, excerpt, content')
      .eq('language_id', ENGLISH_LANGUAGE_ID);

    if (fetchError) throw fetchError;

    // Find existing Italian translations
    const { data: existingIt, error: itError } = await supabase
      .from('insights_translations')
      .select('insights_id')
      .eq('language_id', ITALIAN_LANGUAGE_ID);

    if (itError) throw itError;

    const existingItIds = new Set((existingIt || []).map((r: any) => r.insights_id));
    const toTranslate = (insights || []).filter((i: any) => !existingItIds.has(i.insights_id));

    console.log(`Found ${toTranslate.length} insights to translate to Italian`);

    const results: any[] = [];

    for (const insight of toTranslate) {
      try {
        console.log(`Translating: ${insight.title}`);

        // Translate title, excerpt, and content
        const [titleIt, excerptIt, contentIt] = await Promise.all([
          translateWithGemini(insight.title || '', 'article title', geminiApiKey),
          translateWithGemini(insight.excerpt || '', 'article excerpt/meta description', geminiApiKey),
          translateWithGemini(insight.content || '', 'full article with HTML', geminiApiKey),
        ]);

        // Insert Italian translation
        const { error: insertError } = await supabase
          .from('insights_translations')
          .insert({
            insights_id: insight.insights_id,
            language_id: ITALIAN_LANGUAGE_ID,
            title: titleIt,
            excerpt: excerptIt,
            content: contentIt,
          });

        if (insertError) {
          console.error(`Error inserting translation for ${insight.title}:`, insertError);
          results.push({ slug: insight.title, status: 'error', error: insertError.message });
        } else {
          console.log(`Successfully translated: ${insight.title}`);
          results.push({ slug: insight.title, status: 'success' });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.error(`Failed to translate ${insight.title}:`, err);
        results.push({ slug: insight.title, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${results.length} insights`,
        translated: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Batch translation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
