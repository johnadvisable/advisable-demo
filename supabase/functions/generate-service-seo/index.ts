import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeneratedContent {
  short_description: string;
  seo_title: string;
  meta_description: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 10, offset = 0, forceAll = false } = await req.json().catch(() => ({}));
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch services with their translations and category info
    const { data: services, error: servicesError } = await supabase
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
          seo_title,
          meta_description,
          language_id
        )
      `)
      .eq("service_translations.language_id", 1)
      .range(offset, offset + limit - 1);

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`);
    }

    console.log(`Processing ${services?.length || 0} services (offset: ${offset}, limit: ${limit})`);

    const results: { 
      success: Array<{ title: string; content: GeneratedContent }>; 
      skipped: string[];
      failed: string[] 
    } = {
      success: [],
      skipped: [],
      failed: [],
    };

    for (const service of services || []) {
      const translation = service.service_translations[0];
      const category = Array.isArray(service.service_categories) 
        ? service.service_categories[0] 
        : service.service_categories;
      
      // Check if content needs updating
      const hasValidContent = translation.short_description && 
        translation.seo_title && 
        translation.meta_description &&
        !translation.short_description?.includes("tailored to your business needs") &&
        !translation.short_description?.includes("Professional") &&
        (translation.short_description?.split(" ").length || 0) <= 25;

      if (hasValidContent && !forceAll) {
        console.log(`Skipping ${translation.title} - already has good content`);
        results.skipped.push(translation.title);
        continue;
      }

      try {
        const isVentureStudio = category?.slug === "venture-studio";
        const categoryContext = isVentureStudio 
          ? "Venture Studio - startup building, investment readiness, innovation, scaling ventures"
          : "Digital Agency - marketing, growth, digital transformation, measurable results";

        const prompt = `You are a senior copywriter for Advisable, a premium ${isVentureStudio ? 'venture studio' : 'digital agency'} in Greece.

Service: "${translation.title}" under "${category?.name || 'Digital Services'}"
Context: ${categoryContext}

STRICT REQUIREMENTS:

1. short_description (EXACTLY 15-23 words):
   - Corporate, sophisticated, punchy
   - Value-driven, no fluff
   - Start with action verb
   - NO generic phrases like "tailored to your needs", "comprehensive solutions"
   - Be specific about outcomes

2. seo_title (under 60 characters):
   - Format: "{Short Service Title} | Advisable"
   - Keep it concise

3. meta_description (under 155 characters):
   - Benefit-first
   - Include subtle CTA
   - Mention Advisable

Tone: ${isVentureStudio ? 'Bold, innovative, investor-focused' : 'Results-driven, data-backed, growth-focused'}`;

        console.log(`Generating for: ${translation.title}`);

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-5",
            messages: [
              { 
                role: "system", 
                content: "You are an expert SEO copywriter. Return structured content via the tool." 
              },
              { role: "user", content: prompt }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "generate_seo_content",
                  description: "Generate SEO content for a service",
                  parameters: {
                    type: "object",
                    properties: {
                      short_description: { 
                        type: "string", 
                        description: "15-23 words, corporate, value-driven description" 
                      },
                      seo_title: { 
                        type: "string", 
                        description: "Under 60 chars, format: Title | Advisable" 
                      },
                      meta_description: { 
                        type: "string", 
                        description: "Under 155 chars, benefit-focused with CTA" 
                      }
                    },
                    required: ["short_description", "seo_title", "meta_description"],
                    additionalProperties: false
                  }
                }
              }
            ],
            tool_choice: { type: "function", function: { name: "generate_seo_content" } }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI error for ${translation.title}: ${response.status} - ${errorText}`);
          results.failed.push(translation.title);
          continue;
        }

        const aiResult = await response.json();
        const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
        
        if (!toolCall) {
          console.error(`No tool call for ${translation.title}`);
          results.failed.push(translation.title);
          continue;
        }

        const generatedContent: GeneratedContent = JSON.parse(toolCall.function.arguments);

        // Validate and fix word count
        let shortDesc = generatedContent.short_description;
        const wordCount = shortDesc.split(/\s+/).length;
        
        if (wordCount > 23) {
          const words = shortDesc.split(/\s+/).slice(0, 23);
          shortDesc = words.join(" ");
          if (!shortDesc.endsWith(".")) shortDesc += ".";
        }

        // Validate seo_title length
        let seoTitle = generatedContent.seo_title;
        if (seoTitle.length > 60) {
          seoTitle = seoTitle.substring(0, 57) + "...";
        }

        // Validate meta_description length
        let metaDesc = generatedContent.meta_description;
        if (metaDesc.length > 155) {
          metaDesc = metaDesc.substring(0, 152) + "...";
        }

        // Update the translation
        const { error: updateError } = await supabase
          .from("service_translations")
          .update({
            short_description: shortDesc,
            seo_title: seoTitle,
            meta_description: metaDesc,
            updated_at: new Date().toISOString()
          })
          .eq("id", translation.id);

        if (updateError) {
          console.error(`Update failed ${translation.title}: ${updateError.message}`);
          results.failed.push(translation.title);
        } else {
          console.log(`✅ ${translation.title}`);
          console.log(`   ${shortDesc} (${shortDesc.split(/\s+/).length} words)`);
          results.success.push({ 
            title: translation.title, 
            content: { short_description: shortDesc, seo_title: seoTitle, meta_description: metaDesc } 
          });
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (serviceError) {
        console.error(`Error ${translation.title}:`, serviceError);
        results.failed.push(translation.title);
      }
    }

    return new Response(
      JSON.stringify({
        message: "SEO content generation complete",
        batch: { offset, limit, processed: services?.length || 0 },
        success: results.success.length,
        skipped: results.skipped.length,
        failed: results.failed.length,
        details: results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
