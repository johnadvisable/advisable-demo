import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://difvvdmelbtjxxvpjuvw.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const VENTURE_EMAIL = "venturestudio@advisable.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StartupApplicationRequest {
  startupName: string;
  founderName: string;
  email: string;
  startupWebsite?: string;
  problemSolving: string;
  marketTamSamSom: string;
  competitiveAdvantage: string;
  evaluationSignals: string;
  targetUsers: string;
  vertical: string;
  businessModel: string;
  businessModelOther?: string;
  stage: string;
  uniqueness: string;
  pitchDeckLink?: string;
  isLive?: string;
  liveProductUrl?: string;
  liveProductCredentials?: string;
  // Pitch deck file (base64 encoded)
  pitchDeckFile?: {
    name: string;
    type: string;
    base64: string;
  };
  language?: string;
  turnstileToken?: string;
}

function sanitize(value: string | undefined, max = 5000): string {
  if (!value) return "";
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
    .substring(0, max);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return true;
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token }),
      },
    );
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: StartupApplicationRequest = await req.json();

    if (data.turnstileToken && TURNSTILE_SECRET_KEY) {
      const ok = await verifyTurnstileToken(data.turnstileToken);
      if (!ok) {
        return new Response(
          JSON.stringify({ error: "Security verification failed. Please try again." }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }
    }

    const s = {
      startupName: sanitize(data.startupName, 200),
      founderName: sanitize(data.founderName, 200),
      email: sanitize(data.email, 254),
      startupWebsite: sanitize(data.startupWebsite, 500),
      problemSolving: sanitize(data.problemSolving, 4000),
      marketTamSamSom: sanitize(data.marketTamSamSom, 4000),
      competitiveAdvantage: sanitize(data.competitiveAdvantage, 4000),
      evaluationSignals: sanitize(data.evaluationSignals, 4000),
      targetUsers: sanitize(data.targetUsers, 2000),
      vertical: sanitize(data.vertical, 100),
      businessModel: sanitize(data.businessModel, 100),
      businessModelOther: sanitize(data.businessModelOther, 200),
      stage: sanitize(data.stage, 100),
      uniqueness: sanitize(data.uniqueness, 4000),
      pitchDeckLink: sanitize(data.pitchDeckLink, 500),
      isLive: sanitize(data.isLive, 10),
      liveProductUrl: sanitize(data.liveProductUrl, 500),
      liveProductCredentials: sanitize(data.liveProductCredentials, 2000),
      language: sanitize(data.language, 10),
    };

    // Required fields
    const required: Array<[keyof typeof s, string]> = [
      ["startupName", "Startup name"],
      ["founderName", "Founder's name"],
      ["email", "Email"],
      ["problemSolving", "Problem"],
      ["marketTamSamSom", "Market"],
      ["competitiveAdvantage", "Competitive advantage"],
      ["evaluationSignals", "Evaluation signals"],
      ["targetUsers", "Target users"],
      ["vertical", "Vertical"],
      ["businessModel", "Business model"],
      ["stage", "Stage"],
      ["uniqueness", "Uniqueness"],
    ];
    for (const [k, label] of required) {
      if (!s[k]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${label}` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (!data.pitchDeckFile && !s.pitchDeckLink) {
      return new Response(
        JSON.stringify({ error: "Please attach or link to your pitch deck." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") || "unknown";
    const userAgent = (req.headers.get("user-agent") || "unknown").substring(0, 500);

    // Upload pitch deck to storage if provided
    let pitchDeckUrl: string | null = null;
    let pitchDeckFilename: string | null = null;
    let attachment: { filename: string; content: string } | null = null;

    const supabase = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

    if (data.pitchDeckFile && data.pitchDeckFile.base64) {
      const safeName = (data.pitchDeckFile.name || "pitch-deck").replace(/[^\w.\-]/g, "_").substring(0, 120);
      pitchDeckFilename = safeName;
      const bytes = base64ToUint8Array(data.pitchDeckFile.base64);

      // 15MB hard limit
      if (bytes.length > 15 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: "Pitch deck file too large (max 15MB)." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }

      const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
      if (supabase) {
        const { error: uploadError } = await supabase.storage
          .from("startup-applications")
          .upload(path, bytes, {
            contentType: data.pitchDeckFile.type || "application/octet-stream",
            upsert: false,
          });
        if (uploadError) {
          console.error("Pitch deck upload error:", uploadError);
        } else {
          pitchDeckUrl = path;
        }
      }

      // Attach inline if <= 10MB
      if (bytes.length <= 10 * 1024 * 1024) {
        attachment = {
          filename: safeName,
          content: data.pitchDeckFile.base64,
        };
      }
    }

    // Save to DB
    if (supabase) {
      const { error: dbError } = await supabase
        .from("startup_applications")
        .insert({
          startup_name: s.startupName,
          founder_name: s.founderName,
          email: s.email,
          startup_website: s.startupWebsite || null,
          problem_solving: s.problemSolving,
          market_tam_sam_som: s.marketTamSamSom,
          competitive_advantage: s.competitiveAdvantage,
          evaluation_signals: s.evaluationSignals,
          target_users: s.targetUsers,
          vertical: s.vertical,
          business_model: s.businessModel,
          business_model_other: s.businessModelOther || null,
          stage: s.stage,
          uniqueness: s.uniqueness,
          pitch_deck_url: pitchDeckUrl,
          pitch_deck_link: s.pitchDeckLink || null,
          pitch_deck_filename: pitchDeckFilename,
          is_live: s.isLive || null,
          live_product_url: s.liveProductUrl || null,
          live_product_credentials: s.liveProductCredentials || null,
          language: s.language,
          ip_address: ipAddress,
          user_agent: userAgent,
        });
      if (dbError) console.error("DB save error:", dbError);
    }

    // Build email HTML
    const row = (label: string, value: string) =>
      value
        ? `<tr><td style="padding:8px 12px;background:#f8f8fb;border:1px solid #eee;font-weight:600;width:220px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #eee;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`
        : "";

    const fullHtml = `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#1a1a2e;">
        <h2 style="color:#1a1a2e;margin-bottom:6px;">Venture Studio - Startup Application</h2>
        <p style="color:#666;margin-top:0;">${escapeHtml(s.startupName)} - submitted ${new Date().toUTCString()}</p>
        <table style="border-collapse:collapse;width:100%;margin-top:16px;font-size:14px;">
          ${row("Startup name", s.startupName)}
          ${row("Founder's name", s.founderName)}
          ${row("Email", s.email)}
          ${row("Startup website", s.startupWebsite)}
          ${row("Vertical", s.vertical)}
          ${row("Business model", s.businessModel + (s.businessModelOther ? ` (${s.businessModelOther})` : ""))}
          ${row("Stage", s.stage)}
          ${row("Problem", s.problemSolving)}
          ${row("Market (TAM/SAM/SOM)", s.marketTamSamSom)}
          ${row("Competitive advantage", s.competitiveAdvantage)}
          ${row("Evaluation signals", s.evaluationSignals)}
          ${row("Target users", s.targetUsers)}
          ${row("Uniqueness", s.uniqueness)}
          ${row("Pitch deck link", s.pitchDeckLink)}
          ${pitchDeckFilename ? row("Pitch deck file", pitchDeckFilename + (attachment ? "" : " (too large for attachment, stored securely)")) : ""}
          ${row("Product live?", s.isLive)}
          ${row("Live product URL", s.liveProductUrl)}
          ${row("Access credentials / notes", s.liveProductCredentials)}
        </table>
      </div>`;

    const attachments = attachment ? [attachment] : undefined;

    // Send to applicant + CC venturestudio
    const confirmationEmail = await resend.emails.send({
      from: "Advisable Venture Studio <noreply@advisable.com>",
      to: [s.email],
      cc: [VENTURE_EMAIL],
      reply_to: VENTURE_EMAIL,
      subject: `We received your application - ${s.startupName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#1a1a2e;">
          <h2 style="color:#1a1a2e;">Thank you, ${escapeHtml(s.founderName)}!</h2>
          <p>We've received your Venture Studio application for <strong>${escapeHtml(s.startupName)}</strong>. Our team will review your submission and get back to you shortly.</p>
          <p>A copy of your submission is included below for your records.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          ${fullHtml}
          <p style="margin-top:24px;font-size:12px;color:#888;">Advisable Venture Studio &mdash; <a href="https://advisable.com" style="color:#0066cc;">www.advisable.com</a></p>
        </div>
      `,
      attachments,
    });

    // Internal notification (separate, in case CC is filtered)
    const internalEmail = await resend.emails.send({
      from: "Advisable Venture Studio <noreply@advisable.com>",
      to: [VENTURE_EMAIL],
      reply_to: s.email,
      subject: `New Startup Application: ${s.startupName}`,
      html: fullHtml,
      attachments,
    });

    return new Response(
      JSON.stringify({
        success: true,
        confirmationId: confirmationEmail.data?.id,
        internalId: internalEmail.data?.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: any) {
    console.error("send-startup-application error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
