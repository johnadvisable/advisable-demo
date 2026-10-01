
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHomeClients } from '@/services/clients';
import { useLanguage } from '@/context/LanguageContext';
import Image from '@/components/images';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const ClientsSection = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['homeClients', currentLanguage],
    queryFn: () => getHomeClients(currentLanguage, 36)
  });

  return (
    <section id="clients" className="apple-section bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="apple-section-title text-foreground">
            {t('clients.title')}
          </h2>
          <p className="apple-section-subtitle">
            {t('clients.subtitle')}
          </p>
        </div>
        
        {/* Clients Logo Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(24)].map((_, index) => (
              <div 
                key={index} 
                className="aspect-[3/2] bg-card rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {clients.map((client) => (
              <div 
                key={client.id}
                className="group aspect-[3/2] bg-card rounded-xl overflow-hidden flex items-center justify-center hover:shadow-lg transition-all duration-300 border border-border/50"
              >
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={280}
                  height={180}
                  className="w-[90%] h-[90%] object-contain transition-all duration-500 scale-150"
                  loading="lazy"
                  fallbackText={client.name}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* CTA */}
        <div className="mt-16 text-center">
          <Link to="/our-clients" className="apple-button">
            {t('clients.explorePortfolio')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
