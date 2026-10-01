import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_clients",
  title: "List clients",
  description: "List Advisable's clients / case-study companies with slug, industry, country, and website.",
  inputSchema: {
    industry: z.string().optional().describe("Optional industry filter."),
    limit: z.number().int().min(1).max(200).default(50),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ industry, limit }) => {
    const sb = supabaseAnon();
    let q = sb
      .from("clients")
      .select("id, slug, website, industry, country, product_category, logo")
      .order("display_order", { ascending: true })
      .limit(limit);
    if (industry) q = q.eq("industry", industry);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { clients: data ?? [] },
    };
  },
});
