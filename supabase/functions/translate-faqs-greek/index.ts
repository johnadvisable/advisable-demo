import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { faqs, targetLanguageId } = await req.json();

    if (!faqs || !targetLanguageId) {
      return new Response(JSON.stringify({ error: 'Missing faqs or targetLanguageId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const faqText = faqs.map((f: any, i: number) => 
      `FAQ_${i+1}_ID: ${f.id}\nFAQ_${i+1}_Q: ${f.question}\nFAQ_${i+1}_A: ${f.answer}`
    ).join('\n\n');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a professional Greek translator for a digital agency called Advisable. 
Rules:
- Translate to formal Greek (πληθυντικός ευγενείας)
- Keep technical terms in English: ROI, ROAS, CAC, KPIs, Google Ads, Facebook, full-funnel, A/B testing, etc.
- Do NOT use em dashes (—), use spaced hyphens ( - ) instead
- Preserve the exact format: FAQ_N_ID, FAQ_N_Q, FAQ_N_A
- Do NOT translate the IDs
- Respond ONLY with the translated FAQs in the same format, nothing else`
          },
          {
            role: "user", 
            content: `Translate these FAQs to Greek:\n\n${faqText}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();

    if (!translatedText) throw new Error("No translation received");

    // Parse translated FAQs
    const translations: { id: string; question: string; answer: string }[] = [];
    const faqBlocks = translatedText.split(/\n\n+/);
    
    for (const block of faqBlocks) {
      const idMatch = block.match(/FAQ_\d+_ID:\s*(.+)/);
      const qMatch = block.match(/FAQ_\d+_Q:\s*(.+)/);
      const aMatch = block.match(/FAQ_\d+_A:\s*([\s\S]+?)$/m);
      
      if (idMatch && qMatch && aMatch) {
        translations.push({
          id: idMatch[1].trim(),
          question: qMatch[1].trim(),
          answer: aMatch[1].trim(),
        });
      }
    }

    // Insert translations
    const insertData = translations.map(t => ({
      faq_id: t.id,
      language_id: targetLanguageId,
      question: t.question,
      answer: t.answer,
    }));

    if (insertData.length > 0) {
      const { error: dbError } = await supabase
        .from('service_faq_translations')
        .upsert(insertData, { onConflict: 'faq_id,language_id' });

      if (dbError) {
        console.error('DB insert error:', dbError);
        throw new Error(`DB error: ${dbError.message}`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      translated: translations.length,
      rawTranslation: translatedText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});