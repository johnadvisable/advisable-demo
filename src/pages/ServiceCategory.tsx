import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { getServiceCategoryBySlug } from '@/services/serviceService';
import { useHierarchicalServices } from '@/hooks/useHierarchicalServices';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustedBySection from '@/components/services/TrustedBySection';
import CyberHeader from '@/components/cyber/CyberHeader';
import CyberFooter from '@/components/cyber/CyberFooter';

import SEOWrapper from "@/components/SEO/SEOWrapper";
import FAQSchema from "@/components/SEO/FAQSchema";
import { useTranslation } from 'react-i18next';
import { ArrowRight, Target, Zap, HelpCircle, MessageCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import digitalAgencyBg from "@/assets/digital-agency-bg.jpg";
import SeoServicesGrid from '@/components/services/SeoServicesGrid';
import { groupServices } from '@/utils/serviceGroups';

type ServiceCategoryProps = {
  categorySlugOverride?: string;
};

const ServiceCategory: React.FC<ServiceCategoryProps> = ({ categorySlugOverride }) => {
  const { categorySlug: categorySlugParam } = useParams<{ categorySlug: string }>();
  const categorySlug = categorySlugOverride ?? categorySlugParam;
  const currentLanguage = useCurrentLanguage();
  const { t } = useTranslation('front/servicecategory');

  // Fetch category data
  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['serviceCategory', categorySlug, currentLanguage],
    queryFn: () => getServiceCategoryBySlug(categorySlug!, currentLanguage),
    enabled: !!categorySlug,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch hierarchical services data - only parents for display
  const { data: hierarchicalData, isLoading: servicesLoading, error: servicesError } = useHierarchicalServices(
    categorySlug!,
    currentLanguage
  );

  // Fetch category FAQs
  const languageIdMap: Record<string, number> = { en: 1, es: 2, fr: 3, de: 4, el: 5, it: 10 };
  const languageId = languageIdMap[currentLanguage] || 1;

  const { data: faqs = [] } = useQuery({
    queryKey: ['category-faqs', category?.id, currentLanguage],
    queryFn: async () => {
      if (!category?.id) return [];
      const { data, error } = await supabase
        .from('service_category_faqs')
        .select(`
          id,
          display_order,
          service_category_faq_translations!inner(
            question,
            answer,
            language_id
          )
        `)
        .eq('category_id', category.id)
        .eq('is_active', true)
        .eq('service_category_faq_translations.language_id', languageId)
        .order('display_order');

      if (error) {
        console.error('Error fetching category FAQs:', error);
        return [];
      }

      return (data || []).map(faq => ({
        id: faq.id,
        question: (faq as any).service_category_faq_translations[0]?.question || '',
        answer: (faq as any).service_category_faq_translations[0]?.answer || '',
      })).filter(faq => faq.question && faq.answer);
    },
    enabled: !!category?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Get only parent services for display
  const parentServices = useMemo(() => {
    return hierarchicalData?.parents || [];
  }, [hierarchicalData]);

  const isLoading = categoryLoading || servicesLoading;

  // Venture Studio category routes CTAs to the dedicated startup application form
  const ctaPath =
    categorySlug === 'venture-studio'
      ? '/lets-build-together'
      : categorySlug === 'cyber-security'
        ? '/cyber-security/contact'
        : '/contact';

  // Memoize service links to make them reactive to language changes
  const serviceLinks = useMemo(() => {
    if (!parentServices) return {};

    const links: Record<string, string> = {};
    parentServices.forEach(service => {
      links[service.id] = buildNavigationUrl(`/${categorySlug}/${service.slug}`, currentLanguage);
    });
    return links;
  }, [parentServices, categorySlug, currentLanguage]);

  // Get background image based on category
  const backgroundImage = useMemo(() => {
    if (categorySlug === 'digital-agency') return digitalAgencyBg;
    if (categorySlug === 'cyber-security') return '/images/services/cyber-security.jpg';
    if (categorySlug === 'venture-studio') return '/images/services/venture-studio.jpg';
    if (categorySlug === 'technology') return '/images/services/technology.jpg';
    return digitalAgencyBg;
  }, [categorySlug]);

  // Loading state - Apple style
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="relative min-h-screen flex items-center justify-center bg-advisable-darkPurple">
            <div className="animate-pulse text-center">
              <div className="h-16 bg-white/20 rounded-lg w-96 mx-auto mb-6"></div>
              <div className="h-8 bg-white/10 rounded-lg w-64 mx-auto"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error or not found state
  if (!category || categoryError || servicesError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-muted flex items-center justify-center">
              <Target className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-semibold text-foreground mb-4 tracking-tight">
              {t('notFound')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto font-light">
              {t('notFoundDescription')}
            </p>
            <Link
              to="/"
              className="apple-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t('goHome')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <SEOWrapper
      title={category.seo_title || `${category.name} - Advisable`}
      description={category.seo_description || category.description || 'Professional consulting services to drive your digital transformation.'}
      keywords={`${category.name}, advisable, digital transformation, technology services, consulting`}
      type="website"
    >
      {categorySlug === 'cyber-security' ? <CyberHeader /> : <Header />}
      <main className={`min-h-screen bg-background${categorySlug === 'cyber-security' ? ' cyber-dark' : ''}`}>
        {/* Hero Section - Apple Style */}
        <section 
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundImage}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Gradient overlay - Apple style */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10" />
          
          {/* Hero Content - Apple centered typography */}
          <div className="relative z-20 container mx-auto px-4 text-center text-white">
            <div className="animate-fade-in">
              {/* Main Title - Large Apple-style typography */}
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6 leading-[1.1]"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)' }}
              >
                {categorySlug === 'cyber-security' ? category.name : (category.seo_title || category.name)}
              </h1>
              
              {/* Subtitle */}
              <p 
                className="text-xl md:text-2xl lg:text-3xl font-light text-white/80 max-w-3xl mx-auto mb-6"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
              >
                {category.description}
              </p>

              
              
              {/* CTA Button - Apple style */}
              <Link 
                to={buildNavigationUrl(ctaPath, currentLanguage)}
                className="apple-button-white"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/60 rounded-full" />
            </div>
          </div>
        </section>

        {/* Services Grid Section - Cards with background images like homepage */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            {/* Section Header - Minimal Apple style */}
            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight mb-6">
                Our Services
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
                Discover how we can help transform your business.
              </p>
            </div>

            {parentServices && parentServices.length > 0 ? (
              <div className="max-w-6xl mx-auto space-y-16">
                {groupServices(categorySlug, parentServices).map((group) => (
                  <div key={group.label || 'all'}>
                    {group.label && (
                      <div className="mb-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                          {group.label}
                        </h3>
                        <div className="mt-3 h-px w-full bg-border" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      {group.items.map((service, index) => (
                        <Link
                          key={service.id}
                          to={serviceLinks[service.id]}
                          className="group block animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div
                            className="relative rounded-3xl p-8 md:p-10 min-h-[280px] flex flex-col justify-between overflow-hidden"
                            style={{
                              backgroundImage: `url(${service.featured_image || backgroundImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/95 group-hover:via-black/75 transition-colors duration-300 rounded-3xl"></div>
                            <div className="relative z-10">
                              <h4 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
                                {service.title}
                              </h4>
                              <p className="text-white/80 text-base leading-relaxed line-clamp-3">
                                {service.short_description}
                              </p>
                            </div>
                            <div className="relative z-10 mt-4">
                              <div className="inline-flex items-center text-white font-medium group-hover:underline underline-offset-4">
                                {t('details', 'Details')}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Zap className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4 tracking-tight">
                  {t('noServicesFound')}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto font-light">
                  {t('noServicesDescription')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SEO Services Grid - Internal linking for SEO-only pages */}
        <SeoServicesGrid categorySlug={categorySlug!} currentLanguage={currentLanguage} />

        {/* FAQs Section */}
        {faqs && faqs.length > 0 && (
          <section className="py-24 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                    <HelpCircle className="w-4 h-4" />
                    {t('faqs.badge', { defaultValue: 'Got Questions?' })}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                    {t('faqs.title', { defaultValue: 'Frequently Asked Questions' })}
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {t('faqs.subtitle', { defaultValue: 'Everything you need to know about our services' })}
                  </p>
                </div>

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

                <div className="text-center mt-12">
                  <p className="text-muted-foreground mb-4">
                    {t('faqs.moreQuestions', { defaultValue: "Still have questions? We're here to help." })}
                  </p>
                  <Link
                    to={buildNavigationUrl(ctaPath, currentLanguage)}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t('faqs.contactUs', { defaultValue: 'Contact Us' })}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Schema for SEO */}
        {faqs && faqs.length > 0 && (
          <FAQSchema faqs={faqs.map(f => ({ question: f.question, answer: f.answer }))} />
        )}

        {/* CTA Section - Apple minimal style */}
        <section className="py-24 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto mb-12">
              Let's discuss how we can help you achieve your goals.
            </p>
            <Link
              to={buildNavigationUrl(ctaPath, currentLanguage)}
              className="apple-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      {categorySlug !== 'cyber-security' && <TrustedBySection currentLanguage={currentLanguage} />}
      {categorySlug === 'cyber-security' ? <CyberFooter /> : <Footer />}

    </SEOWrapper>
  );
};

export default ServiceCategory;
