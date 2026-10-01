// Dynamic meta tags component for SEO optimization
import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { 
  generateAlternateUrls, 
  getCleanPathForRouting,
  getDomainForLanguage,
  buildLocalizedUrl,
  getDefaultLanguageForDomain,
  isLocalDevelopment
} from '@/utils/multilanguageUtils';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
  locale?: string;
  alternateUrls?: Record<string, string>;
  // Canonical URL override (auto-generated if not provided)
  canonicalUrl?: string;
  // Open Graph overrides
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  // Twitter overrides
  twitterDescription?: string;
  twitterImage?: string;
}

export default function DynamicMetaTags({
  title,
  description,
  keywords,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  siteName = 'Advisable',
  locale,
  alternateUrls = {},
  canonicalUrl,
  ogDescription,
  ogUrl,
  ogImage,
  twitterDescription,
  twitterImage
}: MetaTagsProps) {
  const { currentLanguage, languages } = useLanguage();
  const location = useLocation();
  
  // Use synchronous domain detection for production SEO tags
  // This ensures correct URLs on first render, before async language loading completes
  const effectiveLanguage = isLocalDevelopment() 
    ? currentLanguage  // Development/preview: use context (may be from URL)
    : getDefaultLanguageForDomain();  // Production: synchronous domain detection
  
  // Memoize expensive calculations
  const metaData = useMemo(() => {
    // Get clean path for alternate URLs generation
    const cleanPath = getCleanPathForRouting(location.pathname, effectiveLanguage);
    
    // Generate the current page URL based on domain-detected language
    // This ensures correct URL generation (e.g., advisable.gr → el, advisable.com → en)
    const currentDomain = getDomainForLanguage(effectiveLanguage);
    const localizedPath = buildLocalizedUrl(cleanPath, effectiveLanguage);
    const currentPageUrl = `https://www.${currentDomain}${localizedPath === '/' ? '' : localizedPath}`;
    
    // Generate alternate URLs for all languages
    const generatedAlternates = generateAlternateUrls(cleanPath, languages);
    const finalAlternates = { ...generatedAlternates, ...alternateUrls };
    
    return {
      cleanPath,
      currentPageUrl,
      finalAlternates
    };
  }, [location.pathname, effectiveLanguage, languages, alternateUrls]);
  
  // Build structured data for different content types
  const structuredData = useMemo(() => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? "Article" : type === 'product' ? "Product" : "WebPage",
      "name": title,
      "description": description,
      "url": metaData.currentPageUrl,
      "inLanguage": effectiveLanguage,
    };

    if (type === 'article') {
      return {
        ...baseData,
        "headline": title,
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "author": {
          "@type": "Organization",
          "name": author || siteName
        },
        "publisher": {
          "@type": "Organization",
          "name": siteName
        },
        "image": image
      };
    }

    if (type === 'product') {
      return {
        ...baseData,
        "brand": {
          "@type": "Organization",
          "name": siteName
        },
        "image": image
      };
    }

    return baseData;
  }, [type, title, description, metaData.currentPageUrl, effectiveLanguage, publishedTime, modifiedTime, author, siteName, image]);

  // Social crawlers (LinkedIn, Facebook) drop relative og:image / twitter:image
  // values, so always resolve them to absolute URLs on the current domain.
  const toAbsoluteUrl = (src?: string) => {
    if (!src) return undefined;
    if (/^https?:\/\//i.test(src)) return src;
    const origin = isLocalDevelopment()
      ? (typeof window !== 'undefined' ? window.location.origin : '')
      : `https://www.${getDomainForLanguage(effectiveLanguage)}`;
    return `${origin}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  const resolvedOgImage = toAbsoluteUrl(ogImage || image);
  const resolvedTwitterImage = toAbsoluteUrl(twitterImage || image);


  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL - critical for SEO */}
      <link rel="canonical" href={canonicalUrl || metaData.currentPageUrl} />
      
      {/* Language and Locale */}
      <html lang={effectiveLanguage} />
      <meta property="og:locale" content={locale || `${effectiveLanguage}_${effectiveLanguage.toUpperCase()}`} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={ogUrl || metaData.currentPageUrl} />
      <meta property="og:site_name" content={siteName} />
      {resolvedOgImage && <meta property="og:image" content={resolvedOgImage} />}
      {resolvedOgImage && <meta property="og:image:secure_url" content={resolvedOgImage} />}
      {resolvedOgImage && <meta property="og:image:alt" content={title} />}
      {resolvedOgImage && <meta property="og:image:width" content="1200" />}
      {resolvedOgImage && <meta property="og:image:height" content="630" />}
      {resolvedOgImage && (
        <meta
          property="og:image:type"
          content={resolvedOgImage.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'}
        />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:url" content={metaData.currentPageUrl} />
      {resolvedTwitterImage && <meta name="twitter:image" content={resolvedTwitterImage} />}
      {resolvedTwitterImage && <meta name="twitter:image:alt" content={title} />}

      
      {/* Article-specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Language alternates - proper hreflang implementation */}
      {languages.filter(lang => lang.isActive).map(lang => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={metaData.finalAlternates[lang.code]}
        />
      ))}
      
      {/* Default language alternate (x-default points to English) */}
      <link rel="alternate" hrefLang="x-default" href={metaData.finalAlternates['en']} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}