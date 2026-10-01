import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "latest_news",
  title: "Latest news",
  description: "Get the latest news posts from Advisable (including synced Instagram posts).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(10),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ limit }) => {
    const sb = supabaseAnon();
    const { data, error } = await sb
      .from("news")
      .select("slug, type, featured_image, published_date, news_translations(title, excerpt, language_id)")
      .order("published_date", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = (data ?? []).map((n: any) => ({
      slug: n.slug,
      type: n.type,
      published_date: n.published_date,
      featured_image: n.featured_image,
      title: n.news_translations?.find((t: any) => t.language_id === 1)?.title
        ?? n.news_translations?.[0]?.title,
      excerpt: n.news_translations?.find((t: any) => t.language_id === 1)?.excerpt
        ?? n.news_translations?.[0]?.excerpt,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { news: rows },
    };
  },
});
