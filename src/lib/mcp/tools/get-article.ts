import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { LANGUAGE_CODES, LANGUAGE_IDS, supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_article",
  title: "Get article",
  description:
    "Fetch the full record of one insight or news article by slug, including the HTML content of a given language. Use this before updating an article so you can edit its existing content.",
  inputSchema: {
    kind: z.enum(["insight", "news"]).describe("Which collection the article lives in."),
    slug: z.string().min(1),
    language: z.enum(LANGUAGE_CODES).default("en"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ kind, slug, language }) => {
    const sb = supabaseAnon();
    const table = kind === "insight" ? "insights" : "news";
    const tTable = kind === "insight" ? "insights_translations" : "news_translations";
    const fk = kind === "insight" ? "insights_id" : "news_id";

    const { data: row, error } = await sb.from(table).select("*").eq("slug", slug).maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!row) return { content: [{ type: "text", text: `No ${kind} with slug "${slug}"` }], isError: true };

    const { data: translations, error: tErr } = await sb
      .from(tTable)
      .select("language_id, title, excerpt, content")
      .eq(fk, (row as any).id);
    if (tErr) return { content: [{ type: "text", text: tErr.message }], isError: true };

    const wanted = (translations ?? []).find((t: any) => t.language_id === LANGUAGE_IDS[language]);
    const result = {
      ...row,
      language,
      title: wanted?.title ?? null,
      excerpt: wanted?.excerpt ?? null,
      content: wanted?.content ?? null,
      available_languages: (translations ?? []).map((t: any) => t.language_id),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: { article: result },
    };
  },
});
