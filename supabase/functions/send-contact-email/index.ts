/**
 * send-contact-email
 *
 * Sends the contact notification + confirmation emails (source of truth).
 *
 * Optional side effect: Academy waitlist submissions (interest starting with
 * "academy-waitlist") are also appended as a row to a Google Sheet through a
 * Google Apps Script web app (doPost) deployed as "Anyone with the link".
 *
 * Required edge function secrets for that step (scoped to the September 2026
 * Academy waitlist cohort - a future cohort needs its own pair or a rename):
 *   - ACADEMY_25_26_SEPT_W8LIST_GSHEET_WEBHOOK_URL    : the Apps Script web app /exec URL
 *   - ACADEMY_25_26_SEPT_W8LIST_GSHEET_SHARED_SECRET  : shared secret validated inside the Apps Script
 *
 * If either secret is missing, or the request fails/times out, the step is
 * skipped, a warning is logged, and the email response still returns success.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");

// Initialize Supabase client with service role for database operations
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://difvvdmelbtjxxvpjuvw.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  interest: string;
  message: string;
  selectedServices?: string[];
  currentPage: string;
  language: string;
  turnstileToken: string;
  consent?: boolean;
}

// Append an Academy waitlist row to the Google Sheet (Apps Script web app).
// Never throws: failures are logged and ignored.
async function appendToGoogleSheet(payload: {
  email: string;
  name: string;
  interest: string;
  language: string;
  page: string;
  consent: boolean;
}): Promise<void> {
  const webhookUrl = Deno.env.get("ACADEMY_25_26_SEPT_W8LIST_GSHEET_WEBHOOK_URL");
  const sharedSecret = Deno.env.get("ACADEMY_25_26_SEPT_W8LIST_GSHEET_SHARED_SECRET");

  if (!webhookUrl || !sharedSecret) {
    console.warn("gsheet append skipped: ACADEMY_25_26_SEPT_W8LIST_GSHEET_WEBHOOK_URL or ACADEMY_25_26_SEPT_W8LIST_GSHEET_SHARED_SECRET not configured");
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: sharedSecret, ...payload }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text();
      // Diagnostic marker: never logs the secret, the webhook URL or the email
      console.error(`gsheet append failed: ${res.status}`);
      console.error(`gsheet append failed body: ${body.substring(0, 300)}`);
      return;
    }
    console.log("gsheet append: ok");
  } catch (error) {
    console.error(`gsheet append failed: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    clearTimeout(timeout);
  }
}

// Sanitize input to prevent XSS and injection
function sanitizeInput(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/expression\s*\(/gi, "")
    .replace(/eval\s*\(/gi, "")
    .trim()
    .substring(0, 2000); // Max length safety
}

// Verify Turnstile token
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
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );

    const result = await response.json();
    console.log("Turnstile verification result:", result);
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();
    
    // Verify Turnstile token if provided and secret key is configured
    if (data.turnstileToken && TURNSTILE_SECRET_KEY) {
      const isValidToken = await verifyTurnstileToken(data.turnstileToken);
      if (!isValidToken) {
        return new Response(
          JSON.stringify({ error: "Security verification failed. Please try again." }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else {
      console.log("Turnstile verification skipped:", !data.turnstileToken ? "no token provided" : "no secret key configured");
    }

    // Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(data.name).substring(0, 100),
      email: sanitizeInput(data.email).substring(0, 254),
      company: sanitizeInput(data.company).substring(0, 150),
      phone: sanitizeInput(data.phone).substring(0, 20),
      interest: sanitizeInput(data.interest).substring(0, 100),
      message: sanitizeInput(data.message).substring(0, 500),
      selectedServices: data.selectedServices?.map(s => sanitizeInput(s).substring(0, 100)) || [],
      currentPage: sanitizeInput(data.currentPage).substring(0, 500),
      language: sanitizeInput(data.language).substring(0, 10),
    };

    // Validate required fields
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, message" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedData.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get IP and User Agent for logging
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                      req.headers.get("x-real-ip") || 
                      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Save to database
    if (supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert({
          name: sanitizedData.name,
          email: sanitizedData.email,
          company: sanitizedData.company || null,
          phone: sanitizedData.phone || null,
          interest: sanitizedData.interest,
          message: sanitizedData.message,
          selected_services: sanitizedData.selectedServices.length > 0 ? sanitizedData.selectedServices : null,
          current_page: sanitizedData.currentPage,
          language: sanitizedData.language,
          ip_address: ipAddress,
          user_agent: userAgent.substring(0, 500),
        });

      if (dbError) {
        console.error("Error saving to database:", dbError);
        // Continue with email sending even if DB save fails
      } else {
        console.log("Contact submission saved to database");
      }
    } else {
      console.warn("SUPABASE_SERVICE_ROLE_KEY not configured, skipping database save");
    }

    // Build services list if present
    const servicesHtml = sanitizedData.selectedServices.length > 0
      ? `<p><strong>Selected Services:</strong> ${sanitizedData.selectedServices.join(", ")}</p>`
      : "";

    // Send notification email to Advisable
    const notificationEmail = await resend.emails.send({
      from: "Advisable Contact Form <noreply@advisable.com>",
      to: ["welcome@advisable.com"],
      reply_to: sanitizedData.email,
      subject: `New Contact Form Submission from ${sanitizedData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
            <p><strong>Name:</strong> ${sanitizedData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></p>
            ${sanitizedData.company ? `<p><strong>Company:</strong> ${sanitizedData.company}</p>` : ""}
            ${sanitizedData.phone ? `<p><strong>Phone:</strong> ${sanitizedData.phone}</p>` : ""}
            <p><strong>Interest:</strong> ${sanitizedData.interest}</p>
            ${servicesHtml}
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              <strong>Page:</strong> ${sanitizedData.currentPage}<br>
              <strong>Language:</strong> ${sanitizedData.language}<br>
              <strong>IP:</strong> ${ipAddress}<br>
              <strong>Submitted:</strong> ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email to the user
    const confirmationEmail = await resend.emails.send({
      from: "Advisable <noreply@advisable.com>",
      to: [sanitizedData.email],
      subject: "Thank you for contacting Advisable",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Thank you for reaching out, ${sanitizedData.name}!</h2>
          
          <p>We have received your message and our team will get back to you as soon as possible.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your Message</h3>
            <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
          </div>
          
          <p>In the meantime, feel free to explore our website or follow us on social media.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The Advisable Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666;">
            Advisable<br>
            <a href="https://advisable.com" style="color: #0066cc;">www.advisable.com</a>
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    // Academy waitlist rows also go to the Google Sheet (best effort, never blocking)
    if (sanitizedData.interest.startsWith("academy-waitlist")) {
      await appendToGoogleSheet({
        email: sanitizedData.email,
        name: sanitizedData.name,
        interest: sanitizedData.interest,
        language: sanitizedData.language,
        page: sanitizedData.currentPage,
        consent: data.consent === true,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully",
        notificationId: notificationEmail.data?.id,
        confirmationId: confirmationEmail.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
