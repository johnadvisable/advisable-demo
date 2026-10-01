import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { getFeaturedPartners } from '@/services/partnerService';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from "@/context/LanguageContext";
import Image from '@/components/images';
import { useTranslation } from 'react-i18next';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

const PartnersSection = () => {
  const { isMobile } = useIsMobile();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');
  
  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['homeFeaturedPartners', currentLanguage],
    queryFn: () => {
      return getFeaturedPartners({ queryKey: ['homeFeaturedPartners', currentLanguage] });
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!currentLanguage
  });

  const PartnerCard = ({ partner }: { partner: typeof partners[0] }) => (
    <div 
      className="group apple-card bg-card border border-border/50 flex flex-col items-center justify-center aspect-[4/3]"
    >
      <div className="w-full h-32 flex items-center justify-center mb-4 overflow-hidden">
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={280}
          height={140}
          className="w-full h-full object-contain transition-all duration-500 scale-[1.8]"
          loading="lazy"
          fallbackText={partner.name}
        />
      </div>
      <h3 className="text-lg font-semibold text-foreground text-center">
        {partner.name}
      </h3>
    </div>
  );
  
  return (
    <section id="partners" className="apple-section bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="apple-section-title text-foreground">
            {t('partners.title')}
          </h2>
          <p className="apple-section-subtitle">
            {t('partners.subtitle')}
          </p>
        </div>
        
        {/* Partners Carousel/Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="aspect-[4/3] bg-secondary rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : isMobile ? (
          <Carousel 
            className="w-full" 
            opts={{ loop: true, align: 'start' }}
          >
            <CarouselContent>
              {partners.map(partner => (
                <CarouselItem key={partner.id} className="basis-4/5">
                  <PartnerCard partner={partner} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-card border-border" />
              <CarouselNext className="relative static right-0 left-auto translate-y-0 bg-card border-border" />
            </div>
          </Carousel>
        ) : (
          <Carousel 
            className="w-full" 
            opts={{ loop: true, align: 'start' }}
          >
            <CarouselContent>
              {partners.map(partner => (
                <CarouselItem key={partner.id} className="md:basis-1/2 lg:basis-1/4">
                  <PartnerCard partner={partner} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-card border-border" />
              <CarouselNext className="relative static right-0 left-auto translate-y-0 bg-card border-border" />
            </div>
          </Carousel>
        )}
        
        {/* CTAs */}
        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/partners-and-integrations#become-partner" className="apple-button">
            {t('partners.becomePartner')}
          </Link>

          <Link to="/partners-and-integrations" className="apple-button-outline">
            {t('partners.exploreOptions')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
