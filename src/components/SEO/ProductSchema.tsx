import { useLanguage } from '@/context/LanguageContext';
import { getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';

interface ProductSchemaProps {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  websiteUrl?: string;
}

export default function ProductSchema({ name, description, slug, imageUrl, websiteUrl }: ProductSchemaProps) {
  const { currentLanguage } = useLanguage();
  const domain = getDomainForLanguage(currentLanguage);
  const baseUrl = isLocalDevelopment() ? window.location.origin : `https://www.${domain}`;
  const productUrl = `${baseUrl}/products/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    "name": name,
    "description": description,
    "url": productUrl,
    ...(imageUrl && { "image": imageUrl }),
    "brand": {
      "@type": "Organization",
      "name": "Advisable",
      "url": baseUrl
    },
    ...(websiteUrl && { "offers": {
      "@type": "Offer",
      "url": websiteUrl,
      "availability": "https://schema.org/InStock"
    }})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
