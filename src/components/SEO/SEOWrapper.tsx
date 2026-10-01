// SEO Wrapper component for pages with dynamic content
import { ReactNode } from 'react';
// HelmetProvider is at App root level
import DynamicMetaTags from './DynamicMetaTags';
import { usePageSEO } from '@/hooks/usePageSEO';

interface SEOWrapperProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string | null;
  children?: ReactNode;
  className?: string;
  autoDetect?: boolean; // Whether to automatically detect SEO from current page
  // Open Graph overrides
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  // Twitter overrides
  twitterDescription?: string;
  twitterImage?: string;
}

export default function SEOWrapper({
  title,
  description,
  keywords,
  image,
  type,
  children,
  className,
  publishedTime,
  modifiedTime,
  author,
  ogDescription,
  ogUrl,
  ogImage,
  twitterDescription,
  twitterImage
}: SEOWrapperProps) {
  // Use automatic SEO detection as fallback
  let pageSEO = null;
  
  try {
    // Only try to use SEO hook if we're in the browser and router is ready
    if (typeof window !== 'undefined') {
      pageSEO = usePageSEO();
    }
  } catch (error) {
    console.error('Error in SEOWrapper:', error);
    // Use safe fallback values
    pageSEO = {
      title: 'Advisable - Digital Transformation & Technology Consulting',
      description: 'Leading digital transformation consultancy providing innovative technology solutions.',
      keywords: 'digital transformation, technology consulting, advisable',
      type: 'website' as const,
      canonicalUrl: '/',
      pageName: 'Home',
      image_url: undefined
    };
  }
  
  // Custom props override pageSEO values
  const finalTitle = title || pageSEO!.title;
  const finalDescription = description || pageSEO!.description;
  const finalKeywords = keywords || pageSEO!.keywords;
  const finalType = type || pageSEO!.type;
  const finalImage = image || pageSEO!.image_url;

  return (
    <>
      {/* Only render SEO meta tags if we're in the browser to avoid SSR issues */}
      {typeof window !== 'undefined' && (
        <DynamicMetaTags
          title={finalTitle}
          description={finalDescription}
          keywords={finalKeywords}
          image={finalImage}
          type={finalType}
          publishedTime={publishedTime || undefined}
          modifiedTime={modifiedTime || undefined}
          author={author || undefined}
          ogDescription={ogDescription || finalDescription}
          ogUrl={ogUrl}
          ogImage={ogImage || finalImage}
          twitterDescription={twitterDescription || finalDescription}
          twitterImage={twitterImage || finalImage}
        />
      )}
      <div className={className}>
        {children}
      </div>
    </>
  );
}