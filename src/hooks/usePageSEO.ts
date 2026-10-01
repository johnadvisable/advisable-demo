import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { getSEOConfig, getPageName } from '@/config/seoConfig';
import { getCleanPathForRouting } from '@/utils/multilanguageUtils';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  type: 'website' | 'article' | 'product';
  pageName: string;
  image_url: string;
}

interface UsePageSEOOptions {
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string;
  dynamicData?: any; // For dynamic content like blog posts, products, etc.
}

export const usePageSEO = (options: UsePageSEOOptions = {}): SEOData => {
  const location = useLocation();
  const currentLanguage = useCurrentLanguage();

  // Memoize options to prevent unnecessary recalculations
  const memoizedOptions = useMemo(() => options, [
    options.customTitle,
    options.customDescription, 
    options.customKeywords,
    options.dynamicData
  ]);

  return useMemo(() => {
    try {
      // Get clean path for SEO config lookup
      const cleanPath = getCleanPathForRouting(location.pathname, currentLanguage);
      
      // Get SEO configuration for this route
      const seoConfig = getSEOConfig(location.pathname,cleanPath);
      
      // Get page name for title generation
      const pageName = getPageName(cleanPath);
      
    // Generate title
    let title = memoizedOptions.customTitle;
    if (!title && seoConfig?.generateTitle && memoizedOptions.dynamicData) {
      title = seoConfig.generateTitle(memoizedOptions.dynamicData);
    }
    if (!title && seoConfig?.title) {
      title = seoConfig.title;
    }
    if (!title) {
      // Fallback title generation based on page name
      if (cleanPath === '/') {
        title = 'Advisable - Digital Transformation & Technology Consulting';
      } else {
        title = `${pageName} - Advisable`;
      }
    }

    // Generate description
    let description = memoizedOptions.customDescription;
    if (!description && seoConfig?.generateDescription && memoizedOptions.dynamicData) {
      description = seoConfig.generateDescription(memoizedOptions.dynamicData);
    }
    if (!description && seoConfig?.description) {
      description = seoConfig.description;
    }
    if (!description) {
      // Fallback description
      description = `Explore ${pageName.toLowerCase()} at Advisable - your trusted partner for digital transformation and innovative technology solutions.`;
    }

    // Generate keywords
    const keywords = memoizedOptions.customKeywords || seoConfig?.keywords || `${pageName.toLowerCase()}, advisable, digital transformation, technology consulting`;

    // Determine content type
    const type = seoConfig?.type || 'website';

      return {
        title,
        description,
        keywords,
        type,
        pageName,
        image_url: seoConfig?.image_url || ''
      };
    } catch (error) {
      console.error('Error in usePageSEO hook:', error);
      // Return safe fallback values
      return {
        title: 'Advisable - Digital Transformation & Technology Consulting',
        description: 'Leading digital transformation consultancy providing innovative technology solutions.',
        keywords: 'digital transformation, technology consulting, advisable',
        type: 'website' as const,
        pageName: 'Home',
        image_url: ''
      };
    }
  }, [location.pathname, currentLanguage, memoizedOptions]);
};