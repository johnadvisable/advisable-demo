import { useLanguage } from '@/context/LanguageContext';
import { 
  getDomainForLanguage, 
  buildLocalizedUrl,
  isLocalDevelopment 
} from '@/utils/multilanguageUtils';

interface InsightStructuredDataProps {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  publishedDate: string;
  updatedDate?: string | null;
  author?: string | null;
  featuredImage?: string | null;
  keywords?: string;
}

export default function InsightStructuredData({
  title,
  excerpt,
  content,
  slug,
  publishedDate,
  updatedDate,
  author,
  featuredImage,
  keywords
}: InsightStructuredDataProps) {
  const { currentLanguage } = useLanguage();
  
  // Generate proper URLs
  const domain = getDomainForLanguage(currentLanguage);
  const baseUrl = isLocalDevelopment() 
    ? window.location.origin 
    : `https://www.${domain}`;
  
  const articleUrl = `${baseUrl}${buildLocalizedUrl(`/insights/${slug}`, currentLanguage)}`;
  const logoUrl = `${baseUrl}/files-uploads/advisableLogo.png`;
  const defaultImage = `${baseUrl}/images/og-home.png`;
  
  // BlogPosting schema with full details
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "headline": title,
    "description": excerpt,
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
      "url": `${baseUrl}${buildLocalizedUrl('/advisable-team', currentLanguage)}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Advisable",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": logoUrl,
        "width": 280,
        "height": 60
      },
      "sameAs": [
        "https://www.linkedin.com/company/advisable",
        "https://www.facebook.com/advisable.gr",
        "https://www.instagram.com/advisable.gr"
      ]
    },
    "inLanguage": currentLanguage,
    ...(keywords && { "keywords": keywords }),
    "articleSection": "Insights",
    "wordCount": content ? content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length : 0
  };

  // Organization schema for the publisher
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    "name": "Advisable",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": logoUrl,
      "width": 280,
      "height": 60
    },
    "sameAs": [
      "https://www.linkedin.com/company/advisable",
      "https://www.facebook.com/advisable.gr",
      "https://www.instagram.com/advisable.gr"
    ]
  };

  return (
    <>
      {/* BlogPosting Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      
      {/* Organization Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
