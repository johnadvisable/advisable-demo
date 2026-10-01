import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const BUCKETS = ["blog-images", "news-media", "images"] as const;

export default defineTool({
  name: "upload_image",
  title: "Upload image",
  description:
    "Upload an image to Advisable storage and get back a public URL to use as a featured image or inside article HTML. Provide either source_url (image is fetched and re-hosted) or base64 data.",
  inputSchema: {
    filename: z
      .string()
      .min(1)
      .describe("File name with extension, e.g. 'tiktok-shop-hero.jpg'."),
    bucket: z.enum(BUCKETS).default("blog-images").describe("Target storage bucket."),
    source_url: z.string().url().optional().describe("Public URL of the image to re-host."),
    base64: z.string().optional().describe("Base64-encoded image data (no data: prefix needed)."),
    content_type: z.string().optional().describe("MIME type, e.g. image/jpeg. Inferred when omitted."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  handler: async ({ filename, bucket, source_url, base64, content_type }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!source_url && !base64) {
      return { content: [{ type: "text", text: "Provide source_url or base64" }], isError: true };
    }

    let bytes: Uint8Array;
    let mime = content_type;
    if (source_url) {
      const res = await fetch(source_url);
      if (!res.ok) {
        return { content: [{ type: "text", text: `Fetch failed: ${res.status}` }], isError: true };
      }
      bytes = new Uint8Array(await res.arrayBuffer());
      mime = mime ?? res.headers.get("content-type") ?? undefined;
    } else {
      const raw = base64!.includes(",") ? base64!.slice(base64!.indexOf(",") + 1) : base64!;
      const bin = atob(raw.trim());
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    }

    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    const fallback: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
    };
    mime = mime ?? fallback[ext] ?? "application/octet-stream";

    const safe = filename.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
    const path = `${Date.now()}-${safe}`;

    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, bytes, { contentType: mime, upsert: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return {
      content: [{ type: "text", text: data.publicUrl }],
      structuredContent: { url: data.publicUrl, bucket, path },
    };
  },
});
