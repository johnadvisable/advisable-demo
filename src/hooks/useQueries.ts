import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { useLanguage } from '@/context/LanguageContext';

// Optimized hooks with proper caching and deduplication
export const useOptimizedHeroContent = (page: string) => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.heroContent(page, currentLanguage),
    queryFn: async () => {
      const { fetchHeroContentByPage } = await import('@/services/heroContentService');
      return fetchHeroContentByPage(page, currentLanguage);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useOptimizedServices = (categorySlug?: string) => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: categorySlug 
      ? queryKeys.services.byCategory(categorySlug, currentLanguage)
      : queryKeys.services.all(currentLanguage),
    queryFn: async () => {
      if (categorySlug) {
        const { getServicesByCategorySlug } = await import('@/services/serviceService');
        return getServicesByCategorySlug(categorySlug, currentLanguage);
      } else {
        // Import functions don't exist anymore, return empty array for now
        return [];
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes
  });
};

export const useOptimizedServiceCategories = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.serviceCategories.all(currentLanguage),
    queryFn: async () => {
      // Function doesn't exist anymore, return empty array for now
      return [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes
  });
};

export const useOptimizedProducts = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.products.all(currentLanguage),
    queryFn: async () => {
      const { getProducts } = await import('@/services/productService');
      return getProducts(currentLanguage);
    },
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useOptimizedClients = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.clients.all(currentLanguage),
    queryFn: async () => {
      const { getUnifiedClientsForAdmin } = await import('@/services/clients/clientService');
      return getUnifiedClientsForAdmin(currentLanguage);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

export const useOptimizedPartners = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.partners.all(currentLanguage),
    queryFn: async () => {
      const { getUnifiedPartnersForAdmin } = await import('@/services/admin/partnersService');
      return getUnifiedPartnersForAdmin(currentLanguage);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

export const useOptimizedNews = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.news.all(currentLanguage),
    queryFn: async () => {
      const { getAllNewsItems } = await import('@/services/newsService');
      return getAllNewsItems({ queryKey: ['news', currentLanguage] });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for news
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useOptimizedBlog = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.blog.all(currentLanguage),
    queryFn: async () => {
      const { getAllBlogPosts } = await import('@/services/blogService');
      return getAllBlogPosts({ queryKey: ['blog', currentLanguage] });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useOptimizedCredentials = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.credentials(currentLanguage),
    queryFn: async () => {
      const { getAllCredentials } = await import('@/services/credentialService');
      return getAllCredentials(currentLanguage);
    },
    staleTime: 60 * 60 * 1000, // 1 hour for credentials
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
  });
};

export const useOptimizedCompanyInfo = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: queryKeys.companyInfo(currentLanguage),
    queryFn: async () => {
      const { fetchCompanyInfo } = await import('@/services/companyInfoService');
      return fetchCompanyInfo(currentLanguage);
    },
    staleTime: 60 * 60 * 1000, // 1 hour for company info
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
  });
};
