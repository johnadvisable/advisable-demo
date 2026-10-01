import { QueryClient } from '@tanstack/react-query';

// Optimized React Query configuration for better performance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests only once
      retry: 1,
      // Don't refetch on window focus for better performance
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect unless data is stale
      refetchOnReconnect: 'always',
      // Enable background refetching for fresh data
      refetchInterval: false,
      // Dedupe identical requests within 1 second
      refetchIntervalInBackground: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

// Query keys factory for consistent caching
export const queryKeys = {
  // Hero content
  heroContent: (page: string, language: string) => ['hero-content', page, language] as const,
  
  // Services
  services: {
    all: (language: string) => ['services', language] as const,
    byCategory: (categorySlug: string, language: string) => ['services', 'category', categorySlug, language] as const,
    bySlug: (slug: string, language: string) => ['services', 'detail', slug, language] as const,
  },
  
  // Service categories
  serviceCategories: {
    all: (language: string) => ['service-categories', language] as const,
    bySlug: (slug: string, language: string) => ['service-categories', 'detail', slug, language] as const,
  },
  
  // Products
  products: {
    all: (language: string) => ['products', language] as const,
    bySlug: (slug: string, language: string) => ['products', 'detail', slug, language] as const,
  },
  
  // Clients
  clients: {
    all: (language: string) => ['clients', language] as const,
    bySlug: (slug: string, language: string) => ['clients', 'detail', slug, language] as const,
  },
  
  // Partners
  partners: {
    all: (language: string) => ['partners', language] as const,
  },
  
  // News & Blog
  news: {
    all: (language: string) => ['news', language] as const,
    bySlug: (slug: string, language: string) => ['news', 'detail', slug, language] as const,
  },
  
  blog: {
    all: (language: string) => ['blog', language] as const,
    bySlug: (slug: string, language: string) => ['blog', 'detail', slug, language] as const,
  },
  
  // Company info
  companyInfo: (language: string) => ['company-info', language] as const,
  
  // Team members
  teamMembers: (language: string) => ['team-members', language] as const,
  
  // Credentials
  credentials: (language: string) => ['credentials', language] as const,
  
  // Insights
  insights: {
    all: (language: string) => ['insights', language] as const,
    bySlug: (slug: string, language: string) => ['insights', 'detail', slug, language] as const,
  },
  
  // Translations
  translations: (language: string) => ['translations', language] as const,
  
  // Site settings
  siteSettings: (language: string) => ['site-settings', language] as const,
} as const;

// Prefetch utilities for critical data
export const prefetchCriticalData = async (language: string) => {
  const promises = [
    // Prefetch hero content for index page
    queryClient.prefetchQuery({
      queryKey: queryKeys.heroContent('index', language),
      queryFn: () => import('@/services/heroContentService').then(m => m.fetchHeroContentByPage('index', language)),
      staleTime: 10 * 60 * 1000, // 10 minutes for hero content
    }),
    
    // Prefetch service categories - disabled for now
    // queryClient.prefetchQuery({
    //   queryKey: queryKeys.serviceCategories.all(language),
    //   queryFn: () => import('@/services/serviceService').then(m => m.getAllServiceCategories(language)),
    //   staleTime: 15 * 60 * 1000, // 15 minutes for categories
    // }),
    
    // Prefetch company info
    queryClient.prefetchQuery({
      queryKey: queryKeys.companyInfo(language),
      queryFn: () => import('@/services/companyInfoService').then(m => m.fetchCompanyInfo(language)),
      staleTime: 30 * 60 * 1000, // 30 minutes for company info
    }),
  ];
  
  await Promise.allSettled(promises);
};
