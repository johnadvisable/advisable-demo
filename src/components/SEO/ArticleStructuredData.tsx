import { useLanguage } from '@/context/LanguageContext';
import { getDomainForLanguage, isLocalDevelopment } from '@/utils/multilanguageUtils';

interface ArticleStructuredDataProps {
  title: string;
  excerpt?: string;
  content?: string;
  slug: string;
  publishedDate: string;
  updatedDate?: string | null;
  author?: string | null;
  featuredImage?: string | null;
  section: 'blog' | 'news';
}

export default function ArticleStructuredData({
  title,
  excerpt,
  content,
  slug,
  publishedDate,
  updatedDate,
  author,
  featuredImage,
  section
}: ArticleStructuredDataProps) {
  const { currentLanguage } = useLanguage();
  const domain = getDomainForLanguage(currentLanguage);
  const baseUrl = isLocalDevelopment() ? window.location.origin : `https://www.${domain}`;
  const articleUrl = `${baseUrl}/${section}/${slug}`;
  const logoUrl = `${baseUrl}/files-uploads/advisableLogo.png`;
  const defaultImage = `${baseUrl}/images/og-home.png`;

  const wordCount = content ? content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length : 0;

  const schema = {
    "@context": "https://schema.org",
    "@type": section === 'blog' ? "BlogPosting" : "NewsArticle",
    "@id": `${articleUrl}#article`,
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
    "headline": title,
    ...(excerpt && { "description": excerpt }),
    "image": {
      "@type": "ImageObject",
      "url": featuredImage || defaultImage,
      "width": 1200,
      "height": 630
    },
    "datePublished": publishedDate,
    "dateModified": updatedDate || publishedDate,
    "author": {
      "@type": "Person",
      "name": author || "Advisable Team",
      "url": `${baseUrl}/advisable-team`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Advisable",
      "url": baseUrl,
      "logo": { "@type": "ImageObject", "url": logoUrl, "width": 280, "height": 60 },
      "sameAs": [
        "https://www.linkedin.com/company/advisable",
        "https://www.facebook.com/advisable.gr",
        "https://www.instagram.com/advisable.gr"
      ]
    },
    "inLanguage": currentLanguage,
    "articleSection": section === 'blog' ? "Blog" : "News",
    ...(wordCount > 0 && { "wordCount": wordCount })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
