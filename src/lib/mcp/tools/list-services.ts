import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_services",
  title: "List services",
  description: "List Advisable services (digital agency, technology, venture studio, etc.) with slugs and titles.",
  inputSchema: {
    language: z.enum(["en", "el", "es", "fr", "it", "de"]).default("en").describe("Language code for titles."),
    limit: z.number().int().min(1).max(200).default(50),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ language, limit }) => {
    const sb = supabaseAnon();
    const langMap: Record<string, number> = { en: 1, es: 2, fr: 3, de: 4, el: 5, it: 10 };
    const { data, error } = await sb
      .from("services")
      .select("id, slug, display_order, service_translations(title, language_id)")
      .order("display_order", { ascending: true })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const langId = langMap[language];
    const rows = (data ?? []).map((s: any) => ({
      slug: s.slug,
      title: s.service_translations?.find((t: any) => t.language_id === langId)?.title
        ?? s.service_translations?.[0]?.title ?? s.slug,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { services: rows },
    };
  },
});
