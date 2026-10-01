import { useLanguage } from '@/context/LanguageContext';
import { getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';

export default function WebSiteSchema() {
  const { currentLanguage } = useLanguage();
  const domain = getDomainForLanguage(currentLanguage);
  const baseUrl = isLocalDevelopment() ? window.location.origin : `https://www.${domain}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    "name": "Advisable",
    "url": baseUrl,
    "inLanguage": currentLanguage,
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      "name": "Advisable"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/insights?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
