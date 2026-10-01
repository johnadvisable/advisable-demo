import { useLanguage } from '@/context/LanguageContext';
import { getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';

interface ServiceSchemaProps {
  name: string;
  description: string;
  slug: string;
  categorySlug: string;
  categoryName?: string;
}

export default function ServiceSchema({ name, description, slug, categorySlug, categoryName }: ServiceSchemaProps) {
  const { currentLanguage } = useLanguage();
  const domain = getDomainForLanguage(currentLanguage);
  const baseUrl = isLocalDevelopment() ? window.location.origin : `https://www.${domain}`;
  const serviceUrl = `${baseUrl}/${categorySlug}/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    "name": name,
    "description": description,
    "url": serviceUrl,
    "provider": {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      "name": "Advisable",
      "url": baseUrl
    },
    "areaServed": {
      "@type": "Place",
      "name": "Europe"
    },
    ...(categoryName && { "category": categoryName }),
    "serviceType": name
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
