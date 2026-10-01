# OpenAI Ads Measurement Pixel

Install the OpenAI Ads pixel (`XLSsrTpEhyQNkN5wSXWvjq`) and fire a lead conversion when a contact form is completed.

## 1. Pixel install (site-wide)

Add the OpenAI pixel loader to the `<head>` of `index.html`, next to the existing Google Tag Manager block:

- Inline stub defining `window.oaiq` + `oaiq("init", { pixelId: "XLSsrTpEhyQNkN5wSXWvjq" })`
- Async `<script src="https://bzrcdn.openai.com/sdk/oaiq.min.js">`

Because the app is a single-page React app, the pixel loads once and stays available on every route.

## 2. Conversion event on form completion

The site already redirects every completed contact form to `/thank-you-contact`, which pushes `contact_form_submitted` / `Lead` into `dataLayer`. Add the OpenAI call in the same effect in `src/pages/ThankYouContact.tsx`:

```
oaiq("measure", "lead", {}, { event_id: <unique id> });
```

- `event_id` is generated per submission (timestamp + random) so it can be de-duplicated later against server events.
- Guarded by `typeof window.oaiq === "function"` so nothing breaks if the script is blocked by consent tooling.

## 3. Cookie consent

The pixel is a marketing tag. It is added as a plain script tag like GTM is today, so it follows the same behaviour as the current setup. If you want it gated behind the cookie banner instead, say so and it will be loaded only after marketing consent.

## Not included (needs your decision)

- The **conversion event name** must match what you create in OpenAI Ads Manager. The plan uses `lead`. If you created something else (for example `order_created`), tell me the exact name.
- The **Conversions API** server-side duplicate (step 4 of the email) requires a conversions API key stored as a secret and an edge function that posts to `https://bzr.openai.com/v1/events`. Not included here; can be added as a follow-up.

## Technical notes

- Files touched: `index.html`, `src/pages/ThankYouContact.tsx`.
- No database or backend changes.
- Amount/currency are omitted since a contact lead has no monetary value.
