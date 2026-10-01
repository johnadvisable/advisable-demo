# Grouping proposal for the other service categories

Same visual treatment as Cybersecurity: group headings are labels only, no new pages, no new links, no changes to the services themselves.

## Digital Agency (7 services)

**Demand & Acquisition**
- Performance Marketing
- SEO & AI Visibility
- Organic Growth Systems

**Brand & Creative**
- Brand Strategy
- AI Creative Studio

**Conversion & Commerce**
- Conversion & Revenue Optimization
- eCommerce Platform Development

## Technology (8 services)

**AI Solutions**
- AI automations & AI Integration services
- Custom AI Solutions for Enterprises
- AI Agents & MCP Development

**Build & Integrate**
- AI Web & App Development
- ERP/CRM Integrations
- Kubernetes Experts - Consulting & DevOps Services

**Advisory**
- Fractional Chief AI Officer
- AI Readiness Audit

## Venture Studio (6 services)

**Validate**
- Ideation & Venture Thesis
- Validation & Market Proof

**Build**
- Venture Product Development
- Engineering & Platform

**Scale**
- Go to Market Strategy
- Fundraising & Venture Readiness

## Where the grouping appears

The same four places already used for Cybersecurity:
- the category page service grid
- the desktop mega menu
- the mobile menu (expanded category)
- the Cybersecurity mini header stays as is

## Technical notes

- Extend `src/utils/cybersecurityGroups.ts` into a generic `src/utils/serviceGroups.ts`: a map of category slug to ordered groups of service slugs, plus a `groupServices(categorySlug, items)` helper that falls back to a single unlabelled group when a category has no definition. Keep the existing Cybersecurity export working.
- Update the four consumers (`ServiceCategory.tsx`, `DesktopNavigation.tsx`, `MobileMenuSheet.tsx`, `CyberHeader.tsx`) to call the generic helper with the relevant category slug.
- Group labels are English-only strings in the map unless translations are requested; they can move to the locale files later.
- Any service not listed in a group renders after the labelled groups, so newly added services never disappear.
