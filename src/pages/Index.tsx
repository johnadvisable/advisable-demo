import { useEffect, Suspense, lazy, memo, useState, useCallback } from "react";
import HeaderContainer from "@/components/HeaderContainer";
import CriticalCSS from "@/components/CriticalCSS";
import CriticalResourceLoader from "@/components/CriticalResourceLoader";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import Metrics from "@/components/Metrics";
import VideoLoader from "@/components/VideoLoader";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import { useOptimizedHeroContent } from "@/hooks/useQueries";
import { useIsMobile } from "@/hooks/use-mobile";
import useWebVitals from "@/hooks/useWebVitals";
import { Loader2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import WebSiteSchema from "@/components/SEO/WebSiteSchema";

// Lazy load below-the-fold components
const CompanyPresentation = lazy(() => import("@/components/CompanyPresentation"));
const Products = lazy(() => import("@/components/Products"));
const Services = lazy(() => import("@/components/Services"));
const ClientsSection = lazy(() => import("@/components/ClientsSection"));
const PartnersSection = lazy(() => import("@/components/PartnersSection"));

const NextSeminar = lazy(() => import("@/components/NextSeminar"));
const News = lazy(() => import("@/components/News"));
const Blog = lazy(() => import("@/components/Blog"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = memo(() => {
  const { isMobile, isInitialized } = useIsMobile();
  const { t } = useTranslation('index');
  const [isVideoReady, setIsVideoReady] = useState(false);

  useWebVitals();

  const { data: heroContent, isLoading: isHeroLoading } = useOptimizedHeroContent('index');

  const handleVideoReady = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  // Determine if header should show black background (video not ready on bunny_video type)
  const shouldForceHeaderBlack = heroContent?.background_type === 'bunny_video' && !isVideoReady;

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = target.closest('a')?.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    const forceVideoPlay = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (video.paused) {
          video.play().catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      });
    };

    document.addEventListener('click', handleAnchorClick);
    const playTimer = setTimeout(forceVideoPlay, 1000);
    
    const handleFirstClick = () => {
      forceVideoPlay();
      document.removeEventListener('click', handleFirstClick);
    };
    document.addEventListener('click', handleFirstClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('click', handleFirstClick);
      clearTimeout(playTimer);
    };
  }, []);

  const renderHeroBackground = () => {
    // Use pure black fallback for all cases - no green/teal gradients
    if (!heroContent) return <div className="absolute inset-0 bg-black"></div>;
    
    switch (heroContent.background_type) {
      case 'image':
        return heroContent.background_image ? (
          <img
            src={heroContent.background_image}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : <div className="absolute inset-0 bg-black"></div>;
      
      case 'video':
        return heroContent.background_video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroContent.background_video} type="video/mp4" />
          </video>
        ) : <div className="absolute inset-0 bg-black"></div>;
      
      case 'bunny_video':
        if (!isInitialized) {
          return <div className="absolute inset-0 bg-black"></div>;
        }
        
        return (
          <VideoLoader
            desktopVideoId={heroContent.desktop_video_id || undefined}
            mobileVideoId={heroContent.mobile_video_id || undefined}
            isMobile={isMobile}
            className="absolute inset-0 w-full h-full object-cover"
            fallbackGradient="bg-black"
            onVideoReady={handleVideoReady}
          />
        );
      
      default:
        return <div className="absolute inset-0 bg-black"></div>;
    }
  };

  return (
    <SEOWrapper {...heroContent}>
      <WebSiteSchema />
      <CriticalCSS />
      <CriticalResourceLoader />
      <PerformanceOptimizer />
      <div className="min-h-screen bg-background">
        <HeaderContainer forceScrolled={shouldForceHeaderBlack} />

        {/* Hero Section - Apple Style */}
        <section 
          data-hero-section 
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        >
        <div className="absolute inset-0 z-0 bg-black">
          {isHeroLoading ? (
            <div className="flex items-center justify-center h-full bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : (
              renderHeroBackground()
            )}
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10"></div>
          
          {/* Hero Content */}
          <div className="relative z-20 container mx-auto px-4 text-center text-white">
            {isHeroLoading ? (
              <div className="animate-pulse">
                <div className="h-16 bg-white/20 rounded-lg max-w-2xl mx-auto mb-6"></div>
                <div className="h-8 bg-white/10 rounded-lg max-w-xl mx-auto"></div>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6 leading-[1.1]">
                  {heroContent?.heading || t('hero.title')}
                </h1>
                <p className="hidden md:block text-xl md:text-2xl lg:text-3xl font-light text-white/80 max-w-3xl mx-auto mb-10">
                  {heroContent?.subheading || t('hero.subtitle')}
                </p>
                
                {heroContent?.cta_text && heroContent?.cta_link && (
                  <a 
                    href={heroContent.cta_link} 
                    className="apple-button-white"
                  >
                    {heroContent.cta_text}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
          
          {/* Metrics Bar */}
          <div className="absolute bottom-0 w-full z-20">
            <Metrics />
          </div>
        </section>
        
        {/* Content Sections */}
        <Suspense fallback={<div className="h-96 bg-background" />}>
          <NextSeminar />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-background" />}>
          <CompanyPresentation />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-secondary/30" />}>
          <Products />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-background" />}>
          <Services />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-secondary/30" />}>
          <ClientsSection />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-background" />}>
          <PartnersSection />
        </Suspense>


        <Suspense fallback={<div className="h-96 bg-secondary/30" />}>
          <Blog />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-background" />}>
          <News />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-background" />}>
          <Contact />
        </Suspense>
        
        <Suspense fallback={<div className="h-32 bg-secondary/50" />}>
          <Footer />
        </Suspense>
      </div>
    </SEOWrapper>
  );
});

export default Index;
