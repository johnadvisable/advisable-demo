// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';
import axios from 'axios';
import uploadRoutes from './api/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

// If behind a proxy (Render/Heroku/Nginx), keep client IP for reCAPTCHA rate checks
app.set('trust proxy', 1);

/**
 * ------- CORS: robust dev + allowlist from .env -------
 * Accepts FRONTEND_URL="http://localhost:8080,http://127.0.0.1:5173"
 * Also adds regex patterns for any localhost/127.0.0.1:port during dev.
 */
const rawAllowed = (process.env.FRONTEND_URL || 'http://localhost:8080')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

const allowedStrings = rawAllowed.map(o => o.replace(/\/+$/, '')); // normalize trailing slashes
const allowedRegexes = [
  /^http:\/\/localhost:\d+$/,      // any localhost:PORT
  /^http:\/\/127\.0\.0\.1:\d+$/,   // any 127.0.0.1:PORT
];

const isOriginAllowed = (origin) => {
  if (!origin) return true; // curl/server-to-server
  const normalized = origin.replace(/\/+$/, '');
  if (allowedStrings.includes(normalized)) return true;
  return allowedRegexes.some(rx => rx.test(normalized));
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) res.header('Access-Control-Allow-Origin', origin);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Belt & suspenders: answer all preflights explicitly via middleware above

/** ---------- Parsers ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** ---------- Mail transport ---------- */
let transporter;
try {
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465, // 465 = implicit TLS
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
} catch (err) {
  console.error('Failed to create SMTP transporter, falling back to jsonTransport:', err?.message || err);
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

if (process.env.NODE_ENV !== 'test') {
  transporter.verify((error) => {
    if (error) {
      console.error('SMTP connection error (verify):', error?.message || error);
    }
  });
}

/** ---------- Health ---------- */
app.get('/api/health', (req, res) => {
  res.set('Content-Type', 'application/json');
  return res.status(200).json({ ok: true, time: new Date().toISOString() });
});

/** ---------- Contact form ---------- */
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Incoming /api/contact', {
      ip: req.ip,
      origin: req.headers.origin,
      bodyKeys: Object.keys(req.body || {}),
    });

    const {
      name, email, company, phone, interest, message, selectedServices, recaptchaToken
    } = req.body || {};

    if (!name || !email || !message) {
      console.warn('Missing required fields', { name: !!name, email: !!email, message: !!message });
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    if (!recaptchaToken) {
      console.error('No reCAPTCHA token provided');
      return res.status(400).json({ success: false, message: 'No reCAPTCHA token provided' });
    }

    // Verify reCAPTCHA (v3 or Enterprise fallback URL differs—adjust if you use Enterprise)
    const recaptchaResp = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken,
            remoteip: req.ip,
          },
          timeout: 8000,
        }
    );

    const verification = recaptchaResp.data;
    if (!verification?.success) {
      console.error('reCAPTCHA verification failed:', verification);
      return res.status(400).json({ success: false, phase: 'recaptcha', message: 'reCAPTCHA verification failed' });
    }

    const servicesArr = Array.isArray(selectedServices) ? selectedServices : [];
    const notificationContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || ''}</p>
      <p><strong>Phone:</strong> ${phone || ''}</p>
      <p><strong>Interest:</strong> ${interest || ''}</p>
      ${servicesArr.length ? `<p><strong>Selected Services:</strong> ${servicesArr.join(', ')}</p>` : ''}
      <p><strong>Message:</strong><br>${message}</p>
    `;

    const confirmationContent = `
      <h2>Thank you for contacting ADVISABLE - We received your message</h2>
      <p>Dear ${name},</p>
      <p>Thank you for contacting us! We have received your message and will get back to you as soon as possible.</p>
      <h3>Your message details:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || ''}</p>
      <p><strong>Phone:</strong> ${phone || ''}</p>
      <p><strong>Interest:</strong> ${interest || ''}</p>
      ${servicesArr.length ? `<p><strong>Selected Services:</strong> ${servicesArr.join(', ')}</p>` : ''}
      <p><strong>Your Message:</strong><br>${message}</p>
      <hr style="margin: 20px 0;">
      <p>Best regards,<br>The ADVISABLE Team</p>
      <p><a href="https://advisable.com">www.advisable.com</a></p>
    `;

    const notificationEmail = {
      from: process.env.SENDER_EMAIL || 'welcome@advisable.com',
      to: process.env.CONTACT_EMAIL || 'info@advisable.com',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: notificationContent,
    };

    const confirmationEmail = {
      from: process.env.SENDER_EMAIL || 'welcome@advisable.com',
      to: email,
      subject: 'Thank you for contacting ADVISABLE - We received your message',
      html: confirmationContent,
    };

    await Promise.all([
      transporter.sendMail(notificationEmail),
      transporter.sendMail(confirmationEmail),
    ]);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error processing contact form:', { message: error?.message, stack: error?.stack });
    res.set('Content-Type', 'application/json');
    return res.status(500).json({ success: false, phase: 'server', message: error?.message || 'Failed to process form' });
  }
});

/** ---------- Static + other API ---------- */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/upload', uploadRoutes);

// SPA fallback (serve your built index.html)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/** ---------- Error handler LAST ---------- */
app.use((err, req, res, next) => {
  console.error('Server error:', { message: err?.message, stack: err?.stack });
  res.set('Content-Type', 'application/json');
  res.status(500).json({ success: false, message: 'Internal server error' });
});

/** ---------- Start ---------- */
app.listen(PORT, () => {
  console.log(`Server on :${PORT}`);
  console.log('[CORS] allowed strings:', allowedStrings);
  console.log('[CORS] allowed regexes:', allowedRegexes.map(r => r.toString()));
});
