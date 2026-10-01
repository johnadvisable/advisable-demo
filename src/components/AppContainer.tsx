// @ts-nocheck
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, prefetchCriticalData } from '@/lib/queryClient';
import { LanguageProvider } from '@/context/LanguageContext';
import { useEffect } from 'react';
import { preloadDomainConfigs } from '@/services/domainService';

interface AppContainerProps {
  children: any;
}

const AppContainer = ({ children }: AppContainerProps) => {
  useEffect(() => {
    // Prefetch critical data on app initialization
    const initializeApp = async () => {
      try {
        // Preload domain configs first (for SEO/URL generation)
        await preloadDomainConfigs();
        
        // Get language from localStorage or default to 'en'
        const currentLanguage = localStorage.getItem('language') || 'en';
        
        // Prefetch critical data
        await prefetchCriticalData(currentLanguage);
        
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default AppContainer;