import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { LANGUAGE_CODES, LANGUAGE_IDS, supabaseForUser } from "../supabase";

export default defineTool({
  name: "upsert_insight",
  title: "Create or update an insight",
  description:
    "Create a new insight/blog article, or update an existing one (matched by slug), for one language. Content is HTML (headings, paragraphs, <img>, lists, tables). Requires an admin account.",
  inputSchema: {
    slug: z.string().min(1).describe("URL slug, e.g. 'ai-agents-for-ecommerce-2026'."),
    language: z.enum(LANGUAGE_CODES).default("en").describe("Language of title/excerpt/content."),
    title: z.string().min(1).optional(),
    excerpt: z.string().optional().describe("Short summary shown in listings."),
    content: z.string().optional().describe("Full article body as HTML."),
    featured_image: z.string().url().optional().describe("Public image URL (use upload_image first)."),
    category: z.string().optional(),
    author: z.string().optional(),
    type: z.string().optional().describe("Article type, e.g. 'insight'."),
    published_date: z.string().optional().describe("ISO date, e.g. '2026-08-13'. Defaults to today on create."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { slug, language, title, excerpt, content, ...rest } = input;
    const sb = supabaseForUser(ctx);

    const { data: existing, error: findErr } = await sb
      .from("insights")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (findErr) return { content: [{ type: "text", text: findErr.message }], isError: true };

    const base: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) if (v !== undefined) base[k] = v;

    let insightId = existing?.id as string | undefined;
    if (insightId) {
      if (Object.keys(base).length) {
        const { error } = await sb.from("insights").update(base).eq("id", insightId);
        if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      }
    } else {
      if (!title) {
        return { content: [{ type: "text", text: "title is required when creating a new insight" }], isError: true };
      }
      const { data, error } = await sb
        .from("insights")
        .insert({
          slug,
          published_date: (base.published_date as string) ?? new Date().toISOString().slice(0, 10),
          ...base,
        })
        .select("id")
        .single();
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      insightId = data.id;
    }

    const languageId = LANGUAGE_IDS[language];
    const { data: tr, error: trFindErr } = await sb
      .from("insights_translations")
      .select("id")
      .eq("insights_id", insightId!)
      .eq("language_id", languageId)
      .maybeSingle();
    if (trFindErr) return { content: [{ type: "text", text: trFindErr.message }], isError: true };

    const trFields: Record<string, unknown> = {};
    if (title !== undefined) trFields.title = title;
    if (excerpt !== undefined) trFields.excerpt = excerpt;
    if (content !== undefined) trFields.content = content;

    if (Object.keys(trFields).length) {
      const { error } = tr
        ? await sb.from("insights_translations").update(trFields).eq("id", tr.id)
        : await sb
            .from("insights_translations")
            .insert({ insights_id: insightId!, language_id: languageId, ...trFields });
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const result = { id: insightId, slug, language, created: !existing, url: `/insights/${slug}` };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
