# New Cyber Security services tier

Add a fourth services column, "Cyber Security", with 12 service pages built exactly like the existing Digital Agency / Venture Studio / Technology services (hero, content, CTA, clients, FAQ blocks).

## Menu

- The Services mega menu currently has: Venture Studio, Digital Agency, Technology, and a "Latest Insights" column.
- The Latest Insights column is removed and replaced by a "Cyber Security" column listing the 12 services, linking to `/cyber-security/<service>`. The column title links to the category page `/cyber-security`.
- The mobile menu gets the same Cyber Security entries.

## Category page

`/cyber-security` reuses the existing category page (same template as `/digital-agency`), with its own title, intro text and SEO title/description, and the grid of the 12 services.

## Services created

1. Penetration Testing
2. Red Teaming
3. Vulnerability Assessment
4. Digital Forensics & Incident Response
5. Compromise Assessment
6. Threat Intelligence
7. Incident Response Retainer
8. Configuration Review
9. Cybersecurity Consulting
10. GRC
11. vCISO
12. Social Engineering

Each page uses the text you supplied as the intro/short description, plus a longer body written in the same structure and tone as the existing service pages (what it is, how we run it, what you get), a hero, the standard contact CTA, and the Trusted By / clients section. No invented metrics, client names or certifications.

Language: English only for now (other languages can be translated later on request).

## Technical notes

- New row in `service_categories` (slug `cyber-security`) plus an English row in `service_category_translations`.
- 12 rows in `services` (parent services, `is_parent = true`, sequential `display_order`, category-linked) with English rows in `service_translations` (`title`, `short_description`, `long_description`, `seo_title`, `meta_description`).
- Routes added in `src/components/routing/LanguageRouter.tsx`: `/cyber-security`, `/cyber-security/:serviceSlug`, and the `/:lang/...` equivalents, reusing `ServiceCategory` / `ServiceDetail` with `categorySlugOverride="cyber-security"`.
- `ServicesMegaMenu` in `src/components/header/DesktopNavigation.tsx`: replace the insights column with a `useHierarchicalServices('cyber-security', ...)` column; the column scrolls like the Venture Studio one since it holds 12 items.
- `src/components/header/navigationConfig.ts` + shared locale files: add `nav.cyberSecurity` label (all six locale files get the key so nothing falls back to a raw key).
- Sitemap entries for the new URLs.
