import { useLanguage } from '@/context/LanguageContext';
import { getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';

interface ListItem {
  name: string;
  url: string;
  image?: string;
  description?: string;
}

interface ItemListSchemaProps {
  items: ListItem[];
  listName: string;
}

export default function ItemListSchema({ items, listName }: ItemListSchemaProps) {
  if (!items || items.length === 0) return null;

  const { currentLanguage } = useLanguage();
  const domain = getDomainForLanguage(currentLanguage);
  const baseUrl = isLocalDevelopment() ? window.location.origin : `https://www.${domain}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listName,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "url": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
      ...(item.image && { "image": item.image }),
      ...(item.description && { "description": item.description })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
