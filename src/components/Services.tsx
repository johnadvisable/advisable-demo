import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getServicesByCategorySlug } from '@/services/serviceService';
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type ServicesProps = {
  className?: string;
};

type Service = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
};

type ServiceCardProps = {
  service: Service;
  categorySlug: string;
};

const ServiceCard = ({ service, categorySlug }: ServiceCardProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');
  const serviceUrl = buildNavigationUrl(`/${categorySlug}/${service.slug}`, currentLanguage);
  
  return (
    <Link 
      to={serviceUrl} 
      className="group block h-full"
    >
      {/* Electric 3D Card Container */}
      <div className="relative rounded-2xl p-[2px] h-full transition-all duration-500 
        group-hover:scale-[1.02] group-hover:shadow-[0_0_40px_rgba(120,119,198,0.4)]">
        
        {/* Animated gradient border */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-100"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #5ddcff 60%, #667eea 80%, #764ba2 100%)',
            backgroundSize: '400% 400%',
            animation: 'electric-border 3s ease infinite',
          }}
        />
        
        {/* Glow layer */}
        <div 
          className="absolute inset-0 rounded-2xl blur-sm opacity-40 
            group-hover:opacity-70 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #5ddcff 60%, #667eea 80%, #764ba2 100%)',
            backgroundSize: '400% 400%',
            animation: 'electric-border 3s ease infinite',
          }}
        />
        
        {/* Inner card content */}
        <div className="relative rounded-2xl p-8 h-full flex flex-col bg-background">
          <h4 className="text-xl font-semibold text-foreground mb-3 
            group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed flex-grow line-clamp-2">
            {service.short_description}
          </p>
          <div className="mt-auto pt-6">
            <span className="inline-flex items-center text-primary font-medium text-sm 
              group-hover:underline underline-offset-4 transition-all duration-300">
              {t('services.learnMore')}
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 
                group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

type CategorySlug = 'digital-agency' | 'venture-studio' | 'technology' | 'cyber-security';

const Services = ({ className = "" }: ServicesProps) => {
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('digital-agency');
  const { isMobile } = useIsMobile();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');

  const categories: { slug: CategorySlug; label: string }[] = [
    { slug: 'digital-agency', label: t('services.digitalAgency') },
    { slug: 'venture-studio', label: t('services.ventureStudio') },
    { slug: 'technology', label: t('company.technology.title') },
    { slug: 'cyber-security', label: t('company.cyberSecurity.title') },
  ];

  const { data: digitalAgencyServices = [] } = useQuery({
    queryKey: ['services', 'digital-agency', currentLanguage],
    queryFn: () => getServicesByCategorySlug('digital-agency', currentLanguage)
  });

  const { data: ventureStudioServices = [] } = useQuery({
    queryKey: ['services', 'venture-studio', currentLanguage],
    queryFn: () => getServicesByCategorySlug('venture-studio', currentLanguage)
  });

  const { data: technologyServices = [] } = useQuery({
    queryKey: ['services', 'technology', currentLanguage],
    queryFn: () => getServicesByCategorySlug('technology', currentLanguage)
  });

  const { data: cyberSecurityServices = [] } = useQuery({
    queryKey: ['services', 'cyber-security', currentLanguage],
    queryFn: () => getServicesByCategorySlug('cyber-security', currentLanguage)
  });

  const servicesByCategory: Record<CategorySlug, Service[]> = {
    'digital-agency': digitalAgencyServices,
    'venture-studio': ventureStudioServices,
    'technology': technologyServices,
    'cyber-security': cyberSecurityServices,
  };

  const currentServices = servicesByCategory[activeCategory] ?? [];
  const displayServices = currentServices.slice(0, 6);
  const activeLabel = categories.find(c => c.slug === activeCategory)?.label ?? '';

  return (
    <section id="services" className={`apple-section bg-background ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="apple-section-title text-foreground">
            {t('services.title')}
          </h2>
          <p className="apple-section-subtitle">
            {t('services.subtitle')}
          </p>
          
          {/* Category Toggle */}
          <div className="inline-flex flex-wrap justify-center gap-1 bg-secondary/80 rounded-full p-1.5 mt-8">
            {categories.map(category => (
              <button
                key={category.slug}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.slug
                    ? 'bg-card text-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground/80'
                }`}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {!currentServices.length ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('services.noServices')}
          </div>
        ) : isMobile ? (
          <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full max-w-sm mx-auto"
          >
            <CarouselContent>
              {displayServices.map(service => (
                <CarouselItem key={service.id} className="basis-full">
                  <ServiceCard service={service} categorySlug={activeCategory} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-secondary hover:bg-secondary/80" />
              <CarouselNext className="relative static right-0 left-auto translate-y-0 bg-secondary hover:bg-secondary/80" />
            </div>
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map(service => (
              <ServiceCard key={service.id} service={service} categorySlug={activeCategory} />
            ))}
          </div>
        )}
        
        {/* View All CTA */}
        {currentServices.length > 6 && (
          <div className="text-center mt-12">
            <Link
              to={buildNavigationUrl(`/${activeCategory}`, currentLanguage)}
              className="inline-flex items-center justify-center px-8 py-3.5 
                text-base font-medium rounded-full 
                bg-primary text-primary-foreground 
                hover:opacity-90
                transition-all duration-300 
                shadow-[0_4px_14px_hsl(var(--primary)/0.4)] 
                hover:shadow-[0_6px_20px_hsl(var(--primary)/0.5)]"
            >
              {t('services.viewAll', { serviceType: activeLabel })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
