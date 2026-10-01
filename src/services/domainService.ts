// Domain configuration service - fetches domain mappings from database
import { supabase } from '@/integrations/supabase/client';

export interface DomainConfig {
  id: string;
  language_code: string;
  domain: string;
  is_primary: boolean;
  homepage_url: string;
  created_at: string;
  updated_at: string;
}

// Cache for domain configs to avoid repeated DB calls
let domainConfigCache: DomainConfig[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all domain configurations from database
 */
export async function fetchDomainConfigs(): Promise<DomainConfig[]> {
  // Return cached data if still valid
  if (domainConfigCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return domainConfigCache;
  }

  try {
    const { data, error } = await supabase
      .from('domain_config')
      .select('*')
      .eq('is_primary', true)
      .order('language_code');

    if (error) {
      console.error('Error fetching domain configs:', error);
      return getDefaultDomainConfigs();
    }

    domainConfigCache = data as DomainConfig[];
    cacheTimestamp = Date.now();
    return domainConfigCache;
  } catch (error) {
    console.error('Failed to fetch domain configs:', error);
    return getDefaultDomainConfigs();
  }
}

/**
 * Get domain for a specific language (async version)
 */
export async function getDomainForLanguageAsync(languageCode: string): Promise<string> {
  const configs = await fetchDomainConfigs();
  const config = configs.find(c => c.language_code === languageCode);
  return config?.domain || 'advisable.com';
}

/**
 * Get full homepage URL for a language (async version)
 */
export async function getHomepageUrlAsync(languageCode: string): Promise<string> {
  const configs = await fetchDomainConfigs();
  const config = configs.find(c => c.language_code === languageCode);
  return config?.homepage_url || 'https://www.advisable.com';
}

/**
 * Get language code from domain (async version)
 */
export async function getLanguageFromDomainAsync(domain: string): Promise<string> {
  const configs = await fetchDomainConfigs();
  // Match by TLD
  const tld = domain.split('.').pop() || 'com';
  const config = configs.find(c => c.domain.endsWith(`.${tld}`));
  return config?.language_code || 'en';
}

/**
 * Generate entity URL with correct domain
 */
export async function generateEntityUrl(
  entitySlug: string, 
  entityType: 'service' | 'product' | 'client' | 'partner' | 'investment' | 'insight' | 'news' | 'blog',
  languageCode: string
): Promise<string> {
  const domain = await getDomainForLanguageAsync(languageCode);
  
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
}

/**
 * Generate all alternate URLs for an entity (for hreflang)
 */
export async function generateEntityAlternateUrls(
  entitySlug: string,
  entityType: 'service' | 'product' | 'client' | 'partner' | 'investment' | 'insight' | 'news' | 'blog'
): Promise<Record<string, string>> {
  const configs = await fetchDomainConfigs();
  const alternates: Record<string, string> = {};

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

  configs.forEach(config => {
    alternates[config.language_code] = `https://www.${config.domain}${prefix}/${entitySlug}`;
  });

  return alternates;
}

/**
 * Get all domain configs as a language -> domain map
 */
export async function getLanguageDomainMap(): Promise<Record<string, string>> {
  const configs = await fetchDomainConfigs();
  const map: Record<string, string> = {};
  configs.forEach(config => {
    map[config.language_code] = config.domain;
  });
  return map;
}

/**
 * Fallback domain configs (used when DB is unavailable)
 */
function getDefaultDomainConfigs(): DomainConfig[] {
  const now = new Date().toISOString();
  return [
    { id: '1', language_code: 'en', domain: 'advisable.com', is_primary: true, homepage_url: 'https://www.advisable.com', created_at: now, updated_at: now },
    { id: '2', language_code: 'el', domain: 'advisable.gr', is_primary: true, homepage_url: 'https://www.advisable.gr', created_at: now, updated_at: now },
    { id: '3', language_code: 'es', domain: 'advisable.es', is_primary: true, homepage_url: 'https://www.advisable.es', created_at: now, updated_at: now },
    { id: '4', language_code: 'fr', domain: 'advisable.fr', is_primary: true, homepage_url: 'https://www.advisable.fr', created_at: now, updated_at: now },
    { id: '5', language_code: 'it', domain: 'advisable.it', is_primary: true, homepage_url: 'https://www.advisable.it', created_at: now, updated_at: now },
  ];
}

/**
 * Clear the domain config cache
 */
export function clearDomainConfigCache(): void {
  domainConfigCache = null;
  cacheTimestamp = 0;
}

/**
 * Preload domain configs into cache
 */
export async function preloadDomainConfigs(): Promise<void> {
  await fetchDomainConfigs();
}
