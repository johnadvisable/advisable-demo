import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  contentType?: string;
  context?: string;
}

interface TranslationResponse {
  translatedText: string;
  qualityScore: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { text, sourceLanguage, targetLanguage, contentType = 'general', context = '' }: TranslationRequest = await req.json()

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text, targetLanguage' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Build SEO-optimized prompt based on content type
    const buildPrompt = (text: string, contentType: string, context: string) => {
      const basePrompt = `You are a professional translator specializing in SEO-optimized content translation. 

CRITICAL REQUIREMENTS:
- Translate the following ${contentType} from ${sourceLanguage} to ${targetLanguage}
- Maintain SEO best practices (keyword optimization, natural flow, readability)
- Preserve HTML tags and formatting exactly as provided
- Keep the same tone and style as the original
- Ensure the translation is culturally appropriate for the target market
- Maintain the same length and structure when possible
- For product/service descriptions: emphasize benefits and call-to-actions
- For meta descriptions: keep under 160 characters and include primary keywords
- For titles: maintain keyword density while being natural

${context ? `CONTEXT: ${context}` : ''}

TEXT TO TRANSLATE:
"${text}"

Respond ONLY with the translated text, no explanations or additional formatting.`

      return basePrompt
    }

    const prompt = buildPrompt(text, contentType, context)

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!translatedText) {
      throw new Error('No translation received from Gemini API')
    }

    // Calculate quality score based on length ratio and basic checks
    const calculateQualityScore = (original: string, translated: string): number => {
      const lengthRatio = translated.length / original.length
      let score = 0.8 // Base score
      
      // Penalize extreme length differences
      if (lengthRatio < 0.5 || lengthRatio > 2.0) score -= 0.2
      
      // Bonus for reasonable length
      if (lengthRatio >= 0.7 && lengthRatio <= 1.3) score += 0.1
      
      // Bonus for preserving HTML tags
      const originalTags = (original.match(/<[^>]+>/g) || []).length
      const translatedTags = (translated.match(/<[^>]+>/g) || []).length
      if (originalTags === translatedTags && originalTags > 0) score += 0.1
      
      return Math.min(Math.max(score, 0), 1)
    }

    const qualityScore = calculateQualityScore(text, translatedText)

    // Store translation in ai_translations table
    const { error: dbError } = await supabase
      .from('ai_translations')
      .insert({
        source_text: text,
        target_language: targetLanguage,
        translated_text: translatedText,
        content_type: contentType,
        quality_score: qualityScore,
        model_used: 'gemini-pro'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Don't fail the request if DB logging fails
    }

    const result: TranslationResponse = {
      translatedText,
      qualityScore
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Translation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})