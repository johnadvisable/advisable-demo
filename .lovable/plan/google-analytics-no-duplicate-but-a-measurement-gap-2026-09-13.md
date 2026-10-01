# Google Analytics: no duplicate, but a measurement gap

Checked the site code: unlike the Meta pixel, Google Analytics is **not** installed twice. There is no GA tag in the site code at all — it loads only through Google Tag Manager. So no double counting there.

There is a different problem instead.

## What is wrong today

1. **Page views inside the site are likely missed.** The site is a single-page app: moving from one page to another does not reload the browser. Unless Tag Manager is configured to listen for those in-site page changes, Analytics only counts the first page a visitor opens.
2. **Some events may never arrive.** A few places in the site (contact form, thank-you pages, seminar page clicks) send events in a format that works when Analytics is installed directly, but that Tag Manager does not pick up by default. Those events can be silently lost.

## Proposed fix

1. Send a clean page-change signal on every in-site navigation, once per page, with the page path and title, so Analytics counts real page views.
2. Make the existing events (form submitted, lead, booking click, FAQ open, scroll depth) all use the same signal format that Tag Manager reads reliably, without removing what is sent today.
3. Give you the short list of what to switch on inside Tag Manager (one page-view tag on the new signal, and the event tags), since that part lives in your Tag Manager account, not in the site.
4. Verify in a real browser that each navigation produces exactly one page-view signal and no duplicates.

## Technical notes

- No GA4 measurement ID and no `gtag/js` loader exist in the codebase; only the GTM container `GTM-P5Q7H86` plus Consent Mode v2 defaults.
- Add a small route listener (in the app router) that pushes a `page_view_spa` event with `page_path` / `page_title` to `dataLayer`, guarded against firing twice for the initial load.
- Normalise `window.gtag('event', ...)` calls in `ThankYouContact.tsx`, `AcademySeminarThankYou.tsx`, `BuiltInContactForm.tsx` and `src/lib/academyTracking.ts` to also push a named `dataLayer` event.
- Consent Mode defaults stay untouched; events still respect the cookie banner.
- Files: router component, the four files above. No database or backend changes.
