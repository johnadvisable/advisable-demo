import { ArrowLeft, BarChart, LineChart, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { useTranslation } from "react-i18next";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import SEOWrapper from "@/components/SEO/SEOWrapper";

const MarketDataProduct = () => {
  const { t } = useTranslation('marketdataproduct');
  const currentLanguage = useCurrentLanguage();

  return (
    <SEOWrapper
      title="SizeTheMarket - Market Data Analytics - Advisable"
      description="SizeTheMarket is a professional market data analytics platform providing real-time insights, trend analysis, and business intelligence for informed decision making."
      keywords="SizeTheMarket, market data, business analytics, data visualization, market intelligence, financial data, competitive analysis"
      type="product"
    >
      <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-advisable-darkPurple">
        <div className="absolute inset-0 bg-gradient-to-br from-advisable-darkPurple to-blue-600 opacity-90"></div>
        <div className="container relative mx-auto px-4 py-12 md:py-24 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <div className="flex items-center mb-4 space-x-2">
                <Link to={buildNavigationUrl("/products", currentLanguage)} className="text-white/80 hover:text-white flex items-center space-x-1 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t('hero.backToProducts')}</span>
                </Link>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">{t('hero.title')}</h1>
              <p className="text-xl md:text-2xl font-light">{t('hero.subtitle')}</p>
              <p className="text-lg">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                  <a href="https://sizethemarket.com" target="_blank" rel="noopener noreferrer">
                    {t('hero.visitWebsite')}
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden h-80 w-full max-w-md">
                <img 
                  src="/marketdata-dashboard.jpg" 
                  alt="MarkeData Dashboard" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-advisable-darkPurple">{t('features.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-blue-100 p-4 rounded-full inline-block">
                <BarChart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">{t('features.competitiveAnalysis.title')}</h3>
              <p className="text-gray-600">
                {t('features.competitiveAnalysis.description')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-blue-100 p-4 rounded-full inline-block">
                <LineChart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">{t('features.priceTracking.title')}</h3>
              <p className="text-gray-600">
                {t('features.priceTracking.description')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-blue-100 p-4 rounded-full inline-block">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">{t('features.marketIntelligence.title')}</h3>
              <p className="text-gray-600">
                {t('features.marketIntelligence.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-advisable-darkPurple">{t('useCases.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple border-b pb-2">{t('useCases.retailOptimization.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('useCases.retailOptimization.description')}
              </p>
              <p className="font-medium text-blue-600">{t('useCases.retailOptimization.result')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple border-b pb-2">{t('useCases.productAnalysis.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('useCases.productAnalysis.description')}
              </p>
              <p className="font-medium text-blue-600">{t('useCases.productAnalysis.result')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-advisable-darkPurple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            {t('cta.description')}
          </p>
          <Button asChild size="lg" className="bg-advisable-purple hover:bg-advisable-purple/90 text-primary-foreground">
            <a href="https://sizethemarket.com" target="_blank" rel="noopener noreferrer">
              {t('cta.button')}
            </a>
          </Button>
        </div>
      </section>
      
      <Footer />
      </div>
    </SEOWrapper>
  );
};

export default MarketDataProduct;
