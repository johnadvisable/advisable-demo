import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { getServiceBySlug, getServiceCategoryBySlug } from '@/services/serviceService';
import { useChildServices } from '@/hooks/useChildServices';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustedBySection from '@/components/services/TrustedBySection';
import CyberHeader from '@/components/cyber/CyberHeader';
import CyberFooter from '@/components/cyber/CyberFooter';
import { Skeleton } from '@/components/ui/skeleton';
import SEOWrapper from "@/components/SEO/SEOWrapper";
import FAQSchema from "@/components/SEO/FAQSchema";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import PageBreadcrumb from "@/components/SEO/PageBreadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { 
  ArrowRight, 
  Sparkles, 
  MessageCircle, 
  Phone,
  HelpCircle
} from 'lucide-react';

interface ServiceUVP {
  id: string;
  icon_name: string;
  metric_value: string;
  label: string;
  description: string;
}

type ServiceDetailProps = {
  categorySlugOverride?: string;
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ categorySlugOverride }) => {
  const { categorySlug: categorySlugParam, serviceSlug } = useParams<{
    categorySlug: string;
    serviceSlug: string;
  }>();
  const categorySlug = categorySlugOverride ?? categorySlugParam;
  const { t } = useTranslation('servicedetail');
  const currentLanguage = useCurrentLanguage();
  const ctaPath =
    categorySlug === 'venture-studio'
      ? '/lets-build-together'
      : categorySlug === 'cyber-security'
        ? '/cyber-security/contact'
        : '/contact';
  const ctaHref = buildNavigationUrl(ctaPath, currentLanguage);

  const { data: service, isLoading: serviceLoading, error: serviceError } = useQuery({
    queryKey: ['service', serviceSlug, currentLanguage],
    queryFn: () => getServiceBySlug(serviceSlug!, currentLanguage),
    enabled: !!serviceSlug,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['serviceCategory', categorySlug, currentLanguage],
    queryFn: () => getServiceCategoryBySlug(categorySlug!, currentLanguage),
    enabled: !!categorySlug,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch child services if this is a parent service
  const { data: childServices = [] } = useChildServices(
    service?.id,
    categorySlug!,
    currentLanguage
  );

  // Fetch FAQs for this service
  const languageIdMap: Record<string, number> = { en: 1, es: 2, fr: 3, de: 4, el: 5, it: 10 };
  const languageId = languageIdMap[currentLanguage] || 1;
  
  const { data: faqs = [] } = useQuery({
    queryKey: ['service-faqs', service?.id, currentLanguage],
    queryFn: async () => {
      if (!service?.id) return [];
      const { data, error } = await supabase
        .from('service_faqs')
        .select(`
          id,
          display_order,
          service_faq_translations!inner(
            question,
            answer,
            language_id
          )
        `)
        .eq('service_id', service.id)
        .eq('is_active', true)
        .eq('service_faq_translations.language_id', languageId)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching FAQs:', error);
        return [];
      }
      
      return (data || []).map(faq => ({
        id: faq.id,
        question: faq.service_faq_translations[0]?.question || '',
        answer: faq.service_faq_translations[0]?.answer || '',
      })).filter(faq => faq.question && faq.answer);
    },
    enabled: !!service?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch UVPs for this service (or parent service if child has none)
  const { data: uvps = [] } = useQuery<ServiceUVP[]>({
    queryKey: ['service-uvps', service?.id, currentLanguage],
    queryFn: async () => {
      if (!service?.id) return [];
      
      // First try to get UVPs for this service
      let { data, error } = await supabase
        .from('service_uvps')
        .select(`
          id,
          icon_name,
          metric_value,
          display_order,
          service_uvp_translations!inner(
            label,
            description,
            language_id
          )
        `)
        .eq('service_id', service.id)
        .eq('is_active', true)
        .eq('service_uvp_translations.language_id', languageId)
        .order('display_order');
      
      // If no UVPs found, check for parent service's UVPs
      if ((!data || data.length === 0) && !error) {
        const { data: parentData } = await supabase
          .from('services')
          .select('parent_service_id')
          .eq('id', service.id)
          .single();
        
        if (parentData?.parent_service_id) {
          const result = await supabase
            .from('service_uvps')
            .select(`
              id,
              icon_name,
              metric_value,
              display_order,
              service_uvp_translations!inner(
                label,
                description,
                language_id
              )
            `)
            .eq('service_id', parentData.parent_service_id)
            .eq('is_active', true)
            .eq('service_uvp_translations.language_id', languageId)
            .order('display_order');
          
          data = result.data;
          error = result.error;
        }
      }
      
      if (error) {
        console.error('Error fetching UVPs:', error);
        return [];
      }
      
      return (data || []).map(uvp => ({
        id: uvp.id,
        icon_name: uvp.icon_name,
        metric_value: uvp.metric_value,
        label: (uvp.service_uvp_translations as any)[0]?.label || '',
        description: (uvp.service_uvp_translations as any)[0]?.description || '',
      })).filter(uvp => uvp.label);
    },
    enabled: !!service?.id,
    staleTime: 5 * 60 * 1000,
  });


  // Memoize child service links
  const childServiceLinks = useMemo(() => {
    if (!childServices || !categorySlug) return {};
    const links: Record<string, string> = {};
    childServices.forEach(child => {
      links[child.id] = buildNavigationUrl(`/${categorySlug}/${child.slug}`, currentLanguage);
    });
    return links;
  }, [childServices, categorySlug, currentLanguage]);

  const isLoading = serviceLoading || categoryLoading;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center px-4">
              <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-8 w-1/2 mx-auto mb-8" />
              <Skeleton className="h-14 w-48 mx-auto rounded-full" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!service || !category || serviceError || categoryError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('notFound.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              {t('notFound.message')}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full hover:opacity-90 transition-all font-medium text-lg"
            >
              {t('notFound.goHome')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (service.category_id !== category.id) {
    return <Navigate to="/" replace />;
  }

  const getGradient = (slug?: string) => {
    switch (slug) {
      case 'digital-agency':
        return {
          bg: 'from-black via-gray-900 to-black',
          accent: 'bg-advisable-purple',
          accentHover: 'hover:bg-advisable-purple/90',
          light: 'bg-gradient-to-b from-gray-50 to-white dark:from-gray-950/20 dark:to-background',
          text: 'text-advisable-purple',
          border: 'border-gray-200 dark:border-gray-800',
          glow: 'shadow-advisable-purple/20'
        };
      case 'venture-studio':
        return {
          bg: 'from-black via-gray-900 to-black',
          accent: 'bg-emerald-600',
          accentHover: 'hover:bg-emerald-700',
          light: 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800',
          glow: 'shadow-emerald-500/20'
        };
      default:
        return {
          bg: 'from-black via-gray-900 to-black',
          accent: 'bg-primary',
          accentHover: 'hover:bg-primary/90',
          light: 'bg-muted/30',
          text: 'text-primary',
          border: 'border-border',
          glow: 'shadow-primary/20'
        };
    }
  };

  const colors = getGradient(categorySlug);

  const seoTitle = service.seo_title || `${service.title} - ${category?.name || 'Services'} - Advisable`;
  const seoDescription = service.meta_description || service.short_description || 'Professional consulting and technology services.';

  return (
    <SEOWrapper
      title={seoTitle}
      description={seoDescription}
      keywords="consulting services, digital transformation, technology implementation"
      type="website"
    >
      <FAQSchema faqs={faqs} />
      <ServiceSchema
        name={service.title}
        description={service.short_description || seoDescription}
        slug={serviceSlug!}
        categorySlug={categorySlug!}
        categoryName={category?.name}
      />
      <PageBreadcrumb items={[
        { name: category?.name || 'Services', path: `/${categorySlug}` },
        { name: service.title, path: `/${categorySlug}/${serviceSlug}` }
      ]} />
      {categorySlug === 'cyber-security' ? <CyberHeader /> : <Header variant="dark" />}
      
      <main className={`min-h-screen bg-background${categorySlug === 'cyber-security' ? ' cyber-dark' : ''}`}>
        {/* Hero Section */}
        <section className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br ${colors.bg} text-white overflow-hidden`}>
          {/* Featured image background */}
          {service.featured_image && (
            <div className="absolute inset-0">
              <img 
                src={service.featured_image} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Animated background (fallback if no image) */}
          {!service.featured_image && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          )}
          
          <div className="relative z-10 container mx-auto px-4 py-32 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {category.name}
            </div>
            
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[1.1]"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)' }}
            >
              {service.title}
            </h1>
            
            <p 
              className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
            >
              {service.short_description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={ctaHref}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-full hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-2xl shadow-black/20"
              >
                <MessageCircle className="w-5 h-5" />
                {t('cta.getStarted', { defaultValue: 'Get Started Today' })}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+302103000217"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all font-medium text-lg border border-white/20"
              >
                <Phone className="w-5 h-5" />
                {t('cta.callUs', { defaultValue: 'Schedule a Call' })}
              </a>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* UVP Slider Section */}
        {uvps.length > 0 && (
          <section className="py-8 bg-background border-b border-border">
            <div className="container mx-auto px-4">
              <Carousel
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full max-w-4xl mx-auto"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {uvps.map((uvp) => (
                    <CarouselItem key={uvp.id} className="pl-2 md:pl-4 basis-full md:basis-1/3">
                      <div className="text-center p-4 md:p-6">
                        <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                          {uvp.metric_value}
                        </p>
                        <p className="text-sm font-medium text-foreground mb-0.5">
                          {uvp.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {uvp.description}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 md:-left-10" />
                <CarouselNext className="right-0 md:-right-10" />
              </Carousel>
            </div>
          </section>
        )}

        {/* Trusted By Section - only for digital agency services */}
        {categorySlug !== 'venture-studio' && categorySlug !== 'cyber-security' && (
          <TrustedBySection currentLanguage={currentLanguage} />
        )}

        {/* Content Section */}
        {service.description && (
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                {/* SEO H2 Title */}
                {service.seo_h2_title && (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center tracking-tight mb-12">
                    {service.seo_h2_title}
                  </h2>
                )}
                <div 
                  className="service-content-wrapper max-w-none
                    [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:tracking-tight [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:first:mt-0
                    [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-semibold [&>h3]:text-foreground [&>h3]:tracking-tight [&>h3]:mt-10 [&>h3]:mb-4
                    [&>h4]:text-lg [&>h4]:md:text-xl [&>h4]:font-semibold [&>h4]:text-foreground [&>h4]:mt-6 [&>h4]:mb-3
                    [&>p]:text-base [&>p]:md:text-lg [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-5
                    [&>ul]:my-6 [&>ul]:space-y-3 [&>ul]:list-none [&>ul]:pl-0
                    [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:text-base [&>ul>li]:md:text-lg [&>ul>li]:text-muted-foreground [&>ul>li]:leading-relaxed
                    [&>ul>li]:before:content-['●'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-primary [&>ul>li]:before:font-bold
                    [&>ol]:my-6 [&>ol]:space-y-4 [&>ol]:list-decimal [&>ol]:pl-6
                    [&>ol>li]:text-base [&>ol>li]:md:text-lg [&>ol>li]:text-muted-foreground [&>ol>li]:leading-relaxed
                    [&_strong]:text-foreground [&_strong]:font-semibold
                    [&_em]:italic [&_em]:text-foreground/90
                    [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-muted-foreground [&_a]:transition-colors"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Child Services Section - Only shown for parent services */}
        {childServices && childServices.length > 0 && (
          <section className="py-24 lg:py-32 bg-background">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-16 lg:mb-20">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight mb-6">
                  {service.title} {t('childServices.servicesSuffix', { defaultValue: 'services' })}
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto">
                  {service.child_services_intro || service.short_description}
                </p>
              </div>

              {/* Services Grid - same style as ServiceCategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {childServices.map((childService, index) => (
                  <Link
                    key={childService.id}
                    to={childServiceLinks[childService.id]}
                    className="group block animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Electric 3D Card with animated gradient border */}
                    <div className="relative rounded-3xl p-[2px] transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_0_60px_rgba(120,119,198,0.5)]">
                      {/* Animated gradient border */}
                      <div 
                        className="absolute inset-0 rounded-3xl opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #5ddcff 60%, #667eea 80%, #764ba2 100%)',
                          backgroundSize: '400% 400%',
                          animation: 'electric-border 3s ease infinite',
                        }}
                      />
                      {/* Glow layer */}
                      <div 
                        className="absolute inset-0 rounded-3xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #5ddcff 60%, #667eea 80%, #764ba2 100%)',
                          backgroundSize: '400% 400%',
                          animation: 'electric-border 3s ease infinite',
                        }}
                      />
                      {/* Inner card */}
                      <div className="relative rounded-3xl p-8 md:p-10 min-h-[280px] flex flex-col justify-between overflow-hidden bg-background">
                        {/* Subtle inner glow */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: 'radial-gradient(ellipse at top left, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(118, 75, 162, 0.15) 0%, transparent 50%)',
                          }}
                        />
                        <div className="relative z-10">
                          <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">
                            {childService.title}
                          </h3>
                          <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
                            {childService.short_description}
                          </p>
                        </div>
                        <div className="relative z-10 mt-4">
                          <div className="inline-flex items-center text-foreground/90 font-medium group-hover:text-foreground transition-colors">
                            {t('childServices.details', { defaultValue: 'Learn More' })}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {faqs && faqs.length > 0 && (
          <section className="py-24 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                    <HelpCircle className="w-4 h-4" />
                    {t('faqs.badge', { defaultValue: 'Got Questions?' })}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                    {t('faqs.title', { defaultValue: 'Frequently Asked Questions' })}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t('faqs.subtitle', { defaultValue: 'Everything you need to know about this service' })}
                  </p>
                </div>

                {/* FAQs Accordion */}
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq) => (
                    <AccordionItem 
                      key={faq.id} 
                      value={faq.id}
                      className="bg-background border border-border rounded-2xl px-6 data-[state=open]:shadow-lg transition-shadow"
                    >
                      <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* CTA after FAQs */}
                <div className="text-center mt-12">
                  <p className="text-muted-foreground mb-4">
                    {t('faqs.moreQuestions', { defaultValue: "Still have questions? We're here to help." })}
                  </p>
                  <Link
                    to={ctaHref}
                    className={`inline-flex items-center gap-2 px-8 py-4 ${colors.accent} ${colors.accentHover} text-white rounded-full font-semibold transition-all`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t('faqs.contactUs', { defaultValue: 'Contact Us' })}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main CTA Section */}
        <section className={`py-32 bg-gradient-to-br ${colors.bg} text-white relative overflow-hidden`}>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight">
                {t('cta.mainTitle', { defaultValue: 'Ready to Transform Your Business?' })}
              </h2>
              <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
                {t('cta.mainDescription', { 
                  defaultValue: "Let's discuss how {{service}} can help you achieve your goals.",
                  service: service.title.toLowerCase()
                })}
              </p>
              
              <Link
                to={ctaHref}
                className="group inline-flex items-center gap-3 px-14 py-7 bg-white text-gray-900 rounded-full hover:scale-105 transition-all duration-300 font-bold text-xl shadow-2xl shadow-black/30"
              >
                {t('cta.startProject', { defaultValue: 'Start Your Project' })}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <p className="mt-8 text-white/60 text-sm">
                {t('cta.noObligation', { defaultValue: 'Free consultation • No obligation • Response within 24h' })}
              </p>
            </div>
          </div>
        </section>

        {/* Floating CTA */}
        <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
          <Link
            to={ctaHref}
            className={`group flex items-center gap-3 px-6 py-4 ${colors.accent} ${colors.accentHover} text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-semibold`}
          >
            <MessageCircle className="w-5 h-5" />
            {t('cta.floatingButton', { defaultValue: 'Get a Quote' })}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
      
      {categorySlug === 'cyber-security' ? <CyberFooter /> : <Footer />}
    </SEOWrapper>
  );
};

export default ServiceDetail;
