import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeneratedContent {
  long_description: string;
  faqs: Array<{ question: string; answer: string }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 50, offset = 0 } = await req.json().catch(() => ({}));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get services that already have FAQs (to skip)
    const { data: existingFaqs } = await supabase
      .from("service_faqs")
      .select("service_id");
    
    const processedServiceIds = new Set((existingFaqs || []).map(f => f.service_id));
    console.log(`Found ${processedServiceIds.size} services already processed`);

    // Fetch services with their English translations (language_id = 1)
    const { data: allServices, error: servicesError } = await supabase
      .from("services")
      .select(`
        id,
        slug,
        category_id,
        service_categories!inner(name, slug),
        service_translations!inner(
          id,
          title,
          short_description,
          long_description,
          language_id
        )
      `)
      .eq("service_translations.language_id", 1);

    if (servicesError) {
      console.error("Error fetching services:", servicesError);
      throw servicesError;
    }

    // Filter out already processed services
    const services = (allServices || []).filter(s => !processedServiceIds.has(s.id)).slice(0, limit);

    console.log(`Found ${services?.length || 0} services to process (skipped ${processedServiceIds.size} already done)`);

    const results = {
      processed: 0,
      updated: 0,
      faqsCreated: 0,
      errors: [] as string[],
    };

    for (const service of services || []) {
      try {
        const translation = service.service_translations[0];
        const category = Array.isArray(service.service_categories) 
          ? service.service_categories[0] 
          : service.service_categories;
        
        if (!translation?.title) {
          console.log(`Skipping service ${service.id} - no title`);
          continue;
        }

        console.log(`Processing: ${translation.title}`);

        const prompt = `You are an expert SEO copywriter for a digital marketing agency called Advisable.

Generate content for the service: "${translation.title}"
Category: "${category?.name || 'Digital Services'}"
Current short description: "${translation.short_description || ''}"

TASK 1: Generate an SEO-optimized long description (200-300 words max) in HTML format.

Requirements:
- Start with a compelling intro paragraph (no H1, just <p>)
- Include ONE <h2> subheading for key benefits
- Use <ul> with <li> bullet points for features/benefits (4-6 items)
- Include <strong> tags for important keywords
- End with a call-to-action paragraph
- Focus on user benefits, not just features
- Use action verbs and persuasive language
- Include relevant industry keywords naturally

TASK 2: Generate 4-6 FAQs specific to this service.

Requirements:
- Questions should be what real customers would ask
- Answers should be helpful, concise (2-3 sentences each)
- Include practical information about the service
- Cover: what it is, benefits, process, pricing approach, timeline, results

Return ONLY valid JSON in this exact format:
{
  "long_description": "<p>First paragraph...</p><h2>Benefits Title</h2><ul><li>...</li></ul><p>CTA paragraph...</p>",
  "faqs": [
    {"question": "Question 1?", "answer": "Answer 1"},
    {"question": "Question 2?", "answer": "Answer 2"}
  ]
}`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              { role: "system", content: "You are an SEO expert. Return only valid JSON, no markdown code blocks." },
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI error for ${translation.title}:`, errorText);
          results.errors.push(`${translation.title}: AI request failed`);
          continue;
        }

        const aiData = await aiResponse.json();
        let content = aiData.choices?.[0]?.message?.content || "";
        
        // Clean up the response - remove markdown code blocks if present
        content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        
        let parsed: GeneratedContent;
        try {
          parsed = JSON.parse(content);
        } catch (parseError) {
          console.error(`JSON parse error for ${translation.title}:`, content.substring(0, 200));
          results.errors.push(`${translation.title}: Invalid JSON response`);
          continue;
        }

        // Update the long_description
        const { error: updateError } = await supabase
          .from("service_translations")
          .update({ 
            long_description: parsed.long_description,
            updated_at: new Date().toISOString()
          })
          .eq("id", translation.id);

        if (updateError) {
          console.error(`Update error for ${translation.title}:`, updateError);
          results.errors.push(`${translation.title}: Failed to update description`);
        } else {
          results.updated++;
          console.log(`Updated long_description for: ${translation.title}`);
        }

        // Create FAQs
        if (parsed.faqs && parsed.faqs.length > 0) {
          for (let i = 0; i < parsed.faqs.length; i++) {
            const faq = parsed.faqs[i];
            
            // Insert FAQ
            const { data: faqData, error: faqError } = await supabase
              .from("service_faqs")
              .insert({
                service_id: service.id,
                display_order: i + 1,
                is_active: true,
              })
              .select("id")
              .single();

            if (faqError) {
              console.error(`FAQ insert error:`, faqError);
              continue;
            }

            // Insert FAQ translation (English, language_id = 1)
            const { error: faqTransError } = await supabase
              .from("service_faq_translations")
              .insert({
                faq_id: faqData.id,
                language_id: 1,
                question: faq.question,
                answer: faq.answer,
              });

            if (faqTransError) {
              console.error(`FAQ translation insert error:`, faqTransError);
            } else {
              results.faqsCreated++;
            }
          }
          console.log(`Created ${parsed.faqs.length} FAQs for: ${translation.title}`);
        }

        results.processed++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (serviceError) {
        console.error(`Error processing service:`, serviceError);
        results.errors.push(`Service ${service.id}: ${serviceError}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${results.processed} services, updated ${results.updated} descriptions, created ${results.faqsCreated} FAQs`,
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
