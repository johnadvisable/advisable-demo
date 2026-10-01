# Send the thank-you conversion straight to Meta

Today the thank-you pages only push a `Lead` signal into Google Tag Manager. The Meta pixel is not in the site code at all, so if the tag is not set up inside Tag Manager, Meta receives nothing. This adds the pixel (ID `371899483403936`) directly to the site so the conversion fires on its own.

## 1. Pixel on every page

Add the standard Meta pixel snippet to the `<head>` of the site, next to the Tag Manager block:

- Loads `fbevents.js`, runs `fbq('init', '371899483403936')` and `fbq('track', 'PageView')`.
- A `<noscript>` image fallback goes in the body (not the head).
- Loaded the same way Tag Manager is today, so behaviour around the cookie banner stays unchanged.

## 2. Lead event on both thank-you pages

On the two thank-you pages, fire the Meta conversion once when the page opens:

- `/thank-you-contact` (contact forms)
- `/academy/seminar/thank-you` (AI for Business seminar, the Eventora redirect target)

Each fires `fbq('track', 'Lead', ..., { eventID: <unique id> })` alongside the existing Tag Manager, Google and OpenAI events. The unique event ID means that if you later also send server-side events, Meta can de-duplicate them.

Because the site is a single-page app, the pixel is fired from the page code rather than relying on a page reload, so it works both when a visitor is redirected in from Eventora and when they land there after submitting a form.

## 3. Avoid double counting

If a Meta pixel tag already exists inside your Tag Manager container, the same pageview/lead would be counted twice. After this goes live, check Tag Manager and remove the duplicate Meta tag there, or tell me and I can gate the in-site pixel instead.

## How to verify

Open a thank-you page with the Meta Pixel Helper browser extension, or check Events Manager > Test Events: you should see one `PageView` and one `Lead`.

## Technical notes

- Files touched: `index.html`, `src/pages/ThankYouContact.tsx`, `src/pages/AcademySeminarThankYou.tsx`, plus a `fbq` type declaration in `src/types/gtag.d.ts`.
- No database or backend changes. The Conversions API (server-side) is not included; it can follow later using the same event IDs.
