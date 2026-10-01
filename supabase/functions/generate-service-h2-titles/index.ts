import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 50, offset = 0, forceAll = false } = await req.json().catch(() => ({}));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials are not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get English language ID
    const { data: langData } = await supabase
      .from("languages")
      .select("id")
      .eq("code", "en")
      .single();

    if (!langData) {
      throw new Error("English language not found");
    }

    const englishLangId = langData.id;

    // Fetch services with their translations and category info
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select(`
        id,
        slug,
        service_categories(name),
        service_translations!inner(
          id,
          language_id,
          title,
          short_description,
          long_description,
          seo_h2_title
        )
      `)
      .eq("service_translations.language_id", englishLangId)
      .range(offset, offset + limit - 1);

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`);
    }

    if (!services || services.length === 0) {
      return new Response(
        JSON.stringify({ message: "No services found", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = {
      processed: 0,
      skipped: 0,
      failed: 0,
      details: [] as Array<{ service: string; status: string; h2_title?: string; error?: string }>,
    };

    for (const service of services) {
      const translations = service.service_translations;
      if (!translations || translations.length === 0) {
        results.skipped++;
        continue;
      }

      const translation = translations[0];

      // Skip if already has seo_h2_title and forceAll is false
      if (translation.seo_h2_title && !forceAll) {
        results.skipped++;
        results.details.push({
          service: service.slug,
          status: "skipped",
          h2_title: translation.seo_h2_title,
        });
        continue;
      }

      const categories = service.service_categories as unknown as { name: string } | { name: string }[] | null;
      const categoryName = (Array.isArray(categories) ? categories[0]?.name : categories?.name) || "Business Services";
      const serviceTitle = translation.title || service.slug;
      const shortDesc = translation.short_description || "";

      // Build prompt for AI
      const prompt = `You are an SEO expert for a digital agency called Advisable. Generate a compelling, SEO-friendly H2 heading for a service page.

Service: ${serviceTitle}
Category: ${categoryName}
Short Description: ${shortDesc}

Requirements:
1. Create ONE powerful H2 heading (max 60 characters)
2. Include the main service keyword naturally
3. Focus on the benefit or outcome for the client
4. Make it action-oriented or outcome-focused
5. Avoid generic phrases like "Our Services" or "What We Offer"
6. Use power words that convey value (Transform, Accelerate, Elevate, Master, etc.)

Examples of good H2 titles:
- "Transform Your Brand into a Market Leader"
- "Accelerate Growth with Data-Driven Marketing"
- "Build Digital Products That Users Love"

Return ONLY the H2 title text, nothing else.`;

      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              { role: "system", content: "You are an SEO copywriting expert. Return only the requested content with no additional text or formatting." },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI API error for ${service.slug}:`, errorText);
          results.failed++;
          results.details.push({
            service: service.slug,
            status: "failed",
            error: `API error: ${response.status}`,
          });
          continue;
        }

        const aiResult = await response.json();
        let h2Title = aiResult.choices?.[0]?.message?.content?.trim() || "";

        // Clean up the response
        h2Title = h2Title.replace(/^["']|["']$/g, "").trim();
        
        // Truncate if too long
        if (h2Title.length > 80) {
          h2Title = h2Title.substring(0, 77) + "...";
        }

        if (!h2Title) {
          results.failed++;
          results.details.push({
            service: service.slug,
            status: "failed",
            error: "Empty AI response",
          });
          continue;
        }

        // Update the translation with the new H2 title
        const { error: updateError } = await supabase
          .from("service_translations")
          .update({ seo_h2_title: h2Title })
          .eq("id", translation.id);

        if (updateError) {
          console.error(`Update error for ${service.slug}:`, updateError);
          results.failed++;
          results.details.push({
            service: service.slug,
            status: "failed",
            error: updateError.message,
          });
          continue;
        }

        results.processed++;
        results.details.push({
          service: service.slug,
          status: "success",
          h2_title: h2Title,
        });

        console.log(`Generated H2 for ${service.slug}: ${h2Title}`);

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (aiError) {
        console.error(`AI error for ${service.slug}:`, aiError);
        results.failed++;
        results.details.push({
          service: service.slug,
          status: "failed",
          error: aiError instanceof Error ? aiError.message : "Unknown error",
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: "H2 title generation completed",
        summary: {
          processed: results.processed,
          skipped: results.skipped,
          failed: results.failed,
          total: services.length,
        },
        details: results.details,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-service-h2-titles:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
