/**
 * Visual grouping of services per category.
 * These groups are presentation-only: they have no pages/routes of their own.
 */
export interface ServiceGroupDefinition {
  label: string;
  slugs: string[];
}

export const SERVICE_GROUPS: Record<string, ServiceGroupDefinition[]> = {
  'cyber-security': [
    {
      label: 'Offensive Security',
      slugs: [
        'red-teaming',
        'penetration-testing',
        'vulnerability-assessment',
        'social-engineering',
      ],
    },
    {
      label: 'Cyber Defense',
      slugs: [
        'digital-forensics-and-incident-response',
        'threat-intelligence',
        'compromise-assessment',
        'incident-response-retainer',
      ],
    },
    {
      label: 'Consulting',
      slugs: [
        'vciso',
        'cybersecurity-consulting',
        'grc',
        'configuration-review',
      ],
    },
  ],
  'digital-agency': [
    {
      label: 'Demand & Acquisition',
      slugs: [
        'performance-marketing',
        'seo-ai-visibility',
        'organic-growth-systems',
      ],
    },
    {
      label: 'Brand & Creative',
      slugs: ['brand-strategy-parent', 'ai-creative-studio'],
    },
    {
      label: 'Conversion & Commerce',
      slugs: [
        'conversion-revenue-optimization',
        'ecommerce-platform-development',
      ],
    },
  ],
  technology: [
    {
      label: 'AI Solutions',
      slugs: [
        'ai-automations-and-ai-integrations',
        'custom-ai-solutions-for-enterprises',
        'ai-agents-and-mcp-development',
      ],
    },
    {
      label: 'Build & Integrate',
      slugs: [
        'ai-web-app-development',
        'erp-crm-integrations',
        'cloud-infrastructure-k8s',
      ],
    },
    {
      label: 'Advisory',
      slugs: ['fractional-chief-ai-officer', 'ai-readiness-audit'],
    },
  ],
  'venture-studio': [
    {
      label: 'Validate',
      slugs: ['ideation-venture-thesis', 'validation-market-proof'],
    },
    {
      label: 'Build',
      slugs: ['venture-product-dev-parent', 'engineering-platform'],
    },
    {
      label: 'Scale',
      slugs: ['go-to-market-growth', 'fundraising-venture-readiness'],
    },
  ],
};

export interface GroupedServices<T> {
  label: string;
  items: T[];
}

/**
 * Groups services (any object with a `slug`) into the visual groups defined for
 * the given category, preserving the order defined above. Services that do not
 * belong to a group are returned in a final unlabeled group. Categories without
 * a definition return a single unlabeled group with all services.
 */
export function groupServices<T extends { slug: string }>(
  categorySlug: string | undefined | null,
  services: T[] | undefined | null
): GroupedServices<T>[] {
  const list = services ?? [];
  const definitions = categorySlug ? SERVICE_GROUPS[categorySlug] : undefined;

  if (!definitions || list.length === 0) {
    return list.length > 0 ? [{ label: '', items: list }] : [];
  }

  const used = new Set<string>();

  const groups = definitions
    .map(({ label, slugs }) => {
      const items = slugs
        .map((slug) => list.find((s) => s.slug === slug))
        .filter((s): s is T => Boolean(s));
      items.forEach((s) => used.add(s.slug));
      return { label, items };
    })
    .filter((g) => g.items.length > 0);

  const rest = list.filter((s) => !used.has(s.slug));
  if (rest.length > 0) {
    groups.push({ label: '', items: rest });
  }

  return groups;
}

/** Backwards-compatible helper for the Cybersecurity pages. */
export function groupCyberServices<T extends { slug: string }>(
  services: T[] | undefined | null
): GroupedServices<T>[] {
  return groupServices('cyber-security', services);
}
