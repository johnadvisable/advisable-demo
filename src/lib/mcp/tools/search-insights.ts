import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_insights",
  title: "Search insights",
  description: "Search Advisable insights/blog articles by keyword. Returns slug, title, excerpt, and published date.",
  inputSchema: {
    query: z.string().min(1).describe("Keyword to search titles and excerpts."),
    language: z.enum(["en", "el", "es", "fr", "it", "de"]).default("en"),
    limit: z.number().int().min(1).max(50).default(10),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ query, language, limit }) => {
    const sb = supabaseAnon();
    const langMap: Record<string, number> = { en: 1, es: 2, fr: 3, de: 4, el: 5, it: 10 };
    const { data, error } = await sb
      .from("insights_translations")
      .select("title, excerpt, insights(slug, published_date)")
      .eq("language_id", langMap[language])
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = (data ?? [])
      .map((r: any) => ({
        slug: r.insights?.slug,
        title: r.title,
        excerpt: r.excerpt,
        published_date: r.insights?.published_date,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { insights: rows },
    };
  },
});
