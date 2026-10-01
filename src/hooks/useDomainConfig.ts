// Hook for using domain configuration in components
import { useQuery } from '@tanstack/react-query';
import { fetchDomainConfigs, DomainConfig } from '@/services/domainService';

interface UseDomainConfigResult {
  domains: DomainConfig[];
  isLoading: boolean;
  error: Error | null;
  getDomainForLanguage: (langCode: string) => string;
  getHomepageUrl: (langCode: string) => string;
  getLanguageDomainMap: () => Record<string, string>;
}

/**
 * Hook to access domain configuration
 * Uses React Query for caching and automatic refetching
 */
export function useDomainConfig(): UseDomainConfigResult {
  const { data: domains = [], isLoading, error } = useQuery({
    queryKey: ['domain-config'],
    queryFn: fetchDomainConfigs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const getDomainForLanguage = (langCode: string): string => {
    const config = domains.find(d => d.language_code === langCode);
    return config?.domain || 'advisable.com';
  };

  const getHomepageUrl = (langCode: string): string => {
    const config = domains.find(d => d.language_code === langCode);
    return config?.homepage_url || 'https://www.advisable.com';
  };

  const getLanguageDomainMap = (): Record<string, string> => {
    const map: Record<string, string> = {};
    domains.forEach(config => {
      map[config.language_code] = config.domain;
    });
    return map;
  };

  return {
    domains,
    isLoading,
    error: error as Error | null,
    getDomainForLanguage,
    getHomepageUrl,
    getLanguageDomainMap,
  };
}

/**
 * Generate entity URL using domain config
 */
export function useEntityUrl() {
  const { getDomainForLanguage } = useDomainConfig();

  const getEntityUrl = (
    entitySlug: string,
    entityType: 'service' | 'product' | 'client' | 'partner' | 'investment' | 'insight' | 'news' | 'blog',
    languageCode: string
  ): string => {
    const domain = getDomainForLanguage(languageCode);

    const pathPrefixes: Record<string, string> = {
      service: '/services',
      product: '/products',
      client: '/clients',
      partner: '/partners',
      investment: '/investments',
      insight: '/insights',
      news: '/news',
      blog: '/blog',
    };

    const prefix = pathPrefixes[entityType] || '';
    return `https://www.${domain}${prefix}/${entitySlug}`;
  };

  return { getEntityUrl };
}
