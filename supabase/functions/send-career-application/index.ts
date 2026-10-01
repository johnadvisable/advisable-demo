import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://difvvdmelbtjxxvpjuvw.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function sanitizeInput(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
    .substring(0, 2000);
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.error("TURNSTILE_SECRET_KEY not configured");
    return false;
  }
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token }),
      }
    );
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function base64ToUint8Array(base64: string): Uint8Array {
  // Strip data URI prefix if present
  const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function buildEmailHtml(sanitized: Record<string, string>, cvFilename: string | null): string {
  const field = (label: string, value: string | null | undefined, isLink = false) => {
    const display = value && value.trim() ? value : "<em style='color:#999;'>Not provided</em>";
    const content = isLink && value && value.trim()
      ? `<a href="${value}">${value}</a>`
      : display;
    return `<p><strong>${label}:</strong> ${content}</p>`;
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a2e;">New Job Application</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Position: ${sanitized.job_title || "Unknown"}</h3>
        ${field("Name", sanitized.name)}
        ${field("Email", sanitized.email, true)}
        ${field("Phone", sanitized.phone)}
        ${field("LinkedIn", sanitized.linkedin_url, true)}
        ${field("Portfolio", sanitized.portfolio_url, true)}
        ${cvFilename ? `<p><strong>CV:</strong> ${cvFilename} (attached)</p>` : `<p><strong>CV:</strong> <em style='color:#999;'>No file attached</em></p>`}
      </div>
      <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">AI Tools Experience</h3>
        ${field("AI Tools Usage", sanitized.ai_tools_usage)}
        ${field("Preferred Tool", sanitized.ai_tool_preference)}
        ${field("AI Agents Experience", sanitized.ai_agents_experience)}
      </div>
      ${sanitized.cover_letter && sanitized.cover_letter.trim() ? `
      <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Cover Letter</h3>
        <p style="white-space: pre-wrap;">${sanitized.cover_letter}</p>
      </div>` : `
      <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Cover Letter</h3>
        <p><em style='color:#999;'>Not provided</em></p>
      </div>`}
      <p style="font-size: 12px; color: #666;">Submitted: ${new Date().toISOString()}</p>
    </div>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();

    // Log received fields for debugging
    console.log("Received application fields:", {
      name: data.name ? "✓" : "✗",
      email: data.email ? "✓" : "✗",
      phone: data.phone ? "✓" : "✗",
      cover_letter: data.cover_letter ? `✓ (${data.cover_letter.length} chars)` : "✗",
      linkedin_url: data.linkedin_url ? "✓" : "✗",
      portfolio_url: data.portfolio_url ? "✓" : "✗",
      job_title: data.job_title ? "✓" : "✗",
      ai_tools_usage: data.ai_tools_usage ? "✓" : "✗",
      ai_tool_preference: data.ai_tool_preference ? "✓" : "✗",
      ai_agents_experience: data.ai_agents_experience ? "✓" : "✗",
      cv_file: data.cv_file ? `✓ (name: ${data.cv_file.name}, type: ${data.cv_file.type})` : "✗",
    });

    // Turnstile verification
    if (TURNSTILE_SECRET_KEY && data.turnstileToken) {
      const isValid = await verifyTurnstileToken(data.turnstileToken);
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "Security verification failed" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      console.log("Turnstile verification passed");
    } else if (!TURNSTILE_SECRET_KEY) {
      console.log("Turnstile secret not configured, skipping verification");
    } else {
      console.log("No turnstile token provided, skipping verification");
    }

    const sanitized: Record<string, string> = {
      name: sanitizeInput(data.name).substring(0, 100),
      email: sanitizeInput(data.email).substring(0, 254),
      phone: sanitizeInput(data.phone).substring(0, 20),
      cover_letter: sanitizeInput(data.cover_letter).substring(0, 2000),
      linkedin_url: sanitizeInput(data.linkedin_url).substring(0, 300),
      portfolio_url: sanitizeInput(data.portfolio_url).substring(0, 300),
      job_listing_id: data.job_listing_id || "",
      job_title: sanitizeInput(data.job_title).substring(0, 200),
      ai_tools_usage: sanitizeInput(data.ai_tools_usage).substring(0, 50),
      ai_tool_preference: sanitizeInput(data.ai_tool_preference).substring(0, 100),
      ai_agents_experience: sanitizeInput(data.ai_agents_experience).substring(0, 10),
    };

    if (!sanitized.name || !sanitized.email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate and decode CV file if provided
    let cvAttachment: { filename: string; content: string } | null = null;
    if (data.cv_file && data.cv_file.base64 && data.cv_file.name) {
      if (!ALLOWED_MIME_TYPES.includes(data.cv_file.type)) {
        return new Response(
          JSON.stringify({ error: "Invalid file type. Only PDF, Word and PowerPoint files are allowed." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      const approxSize = (data.cv_file.base64.length * 3) / 4;
      if (approxSize > MAX_FILE_SIZE_BYTES) {
        return new Response(
          JSON.stringify({ error: "File size must be under 5MB." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Pass base64 string directly to Resend (Uint8Array doesn't work in Deno)
      const cleanBase64 = data.cv_file.base64.includes(",") ? data.cv_file.base64.split(",")[1] : data.cv_file.base64;
      const filename = sanitizeInput(data.cv_file.name).substring(0, 255);
      cvAttachment = { filename, content: cleanBase64 };
      console.log(`CV attachment prepared: ${filename} (base64 length: ${cleanBase64.length})`);
    }

    // Save to database
    if (supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { error: dbError } = await supabase.from("job_applications").insert({
        job_listing_id: sanitized.job_listing_id,
        name: sanitized.name,
        email: sanitized.email,
        phone: sanitized.phone || null,
        cover_letter: sanitized.cover_letter || null,
        linkedin_url: sanitized.linkedin_url || null,
        portfolio_url: sanitized.portfolio_url || null,
      });
      if (dbError) console.error("DB save error:", dbError);
      else console.log("Job application saved");
    }

    // Build attachments array
    const attachments = cvAttachment ? [cvAttachment] : [];

    // Send notification to career@advisable.com
    const notificationEmail = await resend.emails.send({
      from: "Advisable Careers <noreply@advisable.com>",
      to: ["career@advisable.com"],
      reply_to: sanitized.email,
      subject: `New Job Application: ${sanitized.job_title || "Unknown Position"} - ${sanitized.name}`,
      attachments,
      html: buildEmailHtml(sanitized, cvAttachment?.filename || null),
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation to applicant
    await resend.emails.send({
      from: "Advisable <noreply@advisable.com>",
      to: [sanitized.email],
      subject: `Application Received - ${sanitized.job_title || "Your Application"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Thank you for your application, ${sanitized.name}!</h2>
          <p>We have received your application for the <strong>${sanitized.job_title || "the open"}</strong> position.</p>
          <p>Our team will review your application and get back to you as soon as possible.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>The Advisable Team</strong></p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">Advisable<br><a href="https://advisable.com">www.advisable.com</a></p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-career-application:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
