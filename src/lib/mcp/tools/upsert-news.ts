import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { LANGUAGE_CODES, LANGUAGE_IDS, supabaseForUser } from "../supabase";

export default defineTool({
  name: "upsert_news",
  title: "Create or update a news item",
  description:
    "Create a new news item (article or media post), or update an existing one (matched by slug), for one language. Content is HTML. Requires an admin account.",
  inputSchema: {
    slug: z.string().min(1),
    language: z.enum(LANGUAGE_CODES).default("en"),
    type: z.enum(["article", "media"]).default("article").describe("News type."),
    title: z.string().min(1).optional(),
    excerpt: z.string().optional(),
    content: z.string().optional().describe("Full body as HTML."),
    featured_image: z.string().url().optional().describe("Public image URL (use upload_image first)."),
    thumbnail_url: z.string().url().optional(),
    video_url: z.string().url().optional(),
    published_date: z.string().optional().describe("ISO date. Defaults to today on create."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { slug, language, title, excerpt, content, ...rest } = input;
    const sb = supabaseForUser(ctx);

    const { data: existing, error: findErr } = await sb
      .from("news")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (findErr) return { content: [{ type: "text", text: findErr.message }], isError: true };

    const base: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) if (v !== undefined) base[k] = v;

    let newsId = existing?.id as string | undefined;
    if (newsId) {
      if (Object.keys(base).length) {
        const { error } = await sb.from("news").update(base).eq("id", newsId);
        if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      }
    } else {
      if (!title) {
        return { content: [{ type: "text", text: "title is required when creating a news item" }], isError: true };
      }
      const { data, error } = await sb
        .from("news")
        .insert({
          slug,
          type: (base.type as string) ?? "article",
          published_date: (base.published_date as string) ?? new Date().toISOString().slice(0, 10),
          ...base,
        })
        .select("id")
        .single();
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      newsId = data.id;
    }

    const languageId = LANGUAGE_IDS[language];
    const { data: tr, error: trFindErr } = await sb
      .from("news_translations")
      .select("id")
      .eq("news_id", newsId!)
      .eq("language_id", languageId)
      .maybeSingle();
    if (trFindErr) return { content: [{ type: "text", text: trFindErr.message }], isError: true };

    const trFields: Record<string, unknown> = {};
    if (title !== undefined) trFields.title = title;
    if (excerpt !== undefined) trFields.excerpt = excerpt;
    if (content !== undefined) trFields.content = content;

    if (Object.keys(trFields).length) {
      const { error } = tr
        ? await sb.from("news_translations").update(trFields).eq("id", tr.id)
        : await sb
            .from("news_translations")
            .insert({ news_id: newsId!, language_id: languageId, ...trFields });
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const result = { id: newsId, slug, language, created: !existing, url: `/news/${slug}` };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
