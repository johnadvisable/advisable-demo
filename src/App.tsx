// @ts-nocheck
import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import LanguageRouter from '@/components/routing/LanguageRouter';
import ErrorBoundary from '@/components/ErrorBoundary';
import LanguageProvider from '@/context/LanguageContext';
import { queryClient } from '@/lib/queryClient';
import CookieConsent from '@/components/CookieConsent';
import WebMcpProvider from '@/lib/webmcp/WebMcpProvider';
import AnalyticsPageViews from '@/components/routing/AnalyticsPageViews';


function App() {
  console.log('🎯 App component rendering...');
  
  try {
    return (
      <ErrorBoundary>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AnalyticsPageViews />
              <LanguageProvider>
                <TooltipProvider>
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                    <LanguageRouter />
                  </Suspense>
                  <Toaster />
                  <CookieConsent />
                  <WebMcpProvider />
                </TooltipProvider>


              </LanguageProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('❌ Error in App component:', error);
    return <div>Error in App component: {error.message}</div>;
  }
}

export default App;