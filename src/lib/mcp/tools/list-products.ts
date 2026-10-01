import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List Advisable products (Ecommercen, SizeTheMarket, Findloom, e-Prescription, Recommendable).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const sb = supabaseAnon();
    const { data, error } = await sb
      .from("products")
      .select("id, slug, website_url, product_translations(title, description, language_id)")
      .order("display_order", { ascending: true });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = (data ?? []).map((p: any) => {
      const en = p.product_translations?.find((t: any) => t.language_id === 1) ?? p.product_translations?.[0];
      return { slug: p.slug, website: p.website_url, title: en?.title, description: en?.description };
    });
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { products: rows },
    };
  },
});
