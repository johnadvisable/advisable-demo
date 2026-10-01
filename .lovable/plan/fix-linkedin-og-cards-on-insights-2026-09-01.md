# Fix LinkedIn OG cards on Insights

## What I checked

- `nginx/conf.d/default.conf` already routes `linkedinbot` (plus facebookexternalhit, twitterbot, slackbot, whatsapp, discordbot) to the prerender service. So prerender is **not** the missing piece — LinkedIn already gets rendered HTML.
- `index.html` contains a second, hardcoded set of social tags that Helmet cannot replace:
  - line 76 `og:image` = `/images/og-home.png`
  - line 87 `twitter:image` = `/images/og-home.png`
  - lines 125-128 `og:title`, `twitter:title`, `og:description`, `twitter:description`
  These have **no** `data-rh="true"` attribute, so react-helmet leaves them in place and the prerendered page ends up with two `og:image` / `og:title` / `og:description` tags. LinkedIn takes the first occurrence, which is the generic homepage image and homepage title/description.
- `DynamicMetaTags.tsx` does emit per-article `og:image`, `og:title`, `og:description`, `og:url` (from `insight.featured_image`), so once the duplicates are gone the correct values are the only ones present.

## The fix

1. **Remove the duplicate non-Helmet tags in `index.html`**: delete the raw `og:image`, `twitter:image` (lines 76, 87) and the four tags at lines 125-128, and re-add them once each carrying `data-rh="true"` so Helmet overrides them per route while social crawlers still get a sitewide fallback on pages without Helmet SEO.
2. **Guarantee absolute image URLs** in `DynamicMetaTags`: if `ogImage`/`image` is a relative path, prefix it with the current origin. LinkedIn drops relative `og:image` values.
3. **Emit `og:image:width` / `og:image:height` / `og:image:type`** from Helmet when a per-page image exists, and mark the static ones in `index.html` with `data-rh="true"` so the 1200x630 values from the homepage image do not get attached to a differently sized article image.
4. **Keep `og:url` self-referencing**: confirm `InsightsItem` passes the localized article URL so `og:url` and `canonical` both point at the article, not the homepage.

## Notes

- LinkedIn caches scrapes aggressively. After deploying, each affected URL needs a re-scrape in the LinkedIn Post Inspector before the new card shows.
- Featured images should be at least 1200x627 for a large card; smaller images render as a small thumbnail even when everything else is correct.
- No prerender/nginx change is required, but I can add `X-Prerender` verification steps if you want to confirm LinkedIn actually receives the prerendered HTML in production.
