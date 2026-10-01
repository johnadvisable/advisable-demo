import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { useSeoOnlyServices } from '@/hooks/useSeoOnlyServices';

type SeoServicesGridProps = {
  categorySlug: string;
  currentLanguage: string;
};

const SeoServicesGrid: React.FC<SeoServicesGridProps> = ({ categorySlug, currentLanguage }) => {
  const { t } = useTranslation('front/servicecategory');
  const { data: seoServices, isLoading } = useSeoOnlyServices(categorySlug, currentLanguage);

  if (isLoading || !seoServices || seoServices.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight mb-4">
            {t('lookingForTitle', 'What Are You Looking For?')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            {t('lookingForSubtitle', 'Explore our specialized services tailored to your needs.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3 max-w-6xl mx-auto">
          {seoServices.map((service) => (
            <Link
              key={service.slug}
              to={buildNavigationUrl(`/${categorySlug}/${service.slug}`, currentLanguage)}
              className="group flex items-center py-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200 border-b border-border/40 hover:border-primary/40"
            >
              <span className="text-sm font-medium">{service.title}</span>
              <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeoServicesGrid;
