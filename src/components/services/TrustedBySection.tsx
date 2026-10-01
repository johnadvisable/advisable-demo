import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { getHomeClients } from '@/services/clients';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import Image from '@/components/images';

type TrustedBySectionProps = {
  currentLanguage: string;
};

const TrustedBySection: React.FC<TrustedBySectionProps> = ({ currentLanguage }) => {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['trustedByClients', currentLanguage],
    queryFn: () => getHomeClients(currentLanguage, 15),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading || clients.length === 0) return null;

  // Duplicate for seamless loop
  const duplicated = [...clients, ...clients];

  return (
    <section className="py-16 lg:py-20 bg-secondary/30 border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-2">
            Trusted By
          </h2>
          <p className="text-muted-foreground text-sm">
            Leading brands trust Advisable services & solutions.
          </p>
        </div>

        {/* Auto-scrolling marquee */}
        <div className="overflow-hidden -mx-4 px-4">
          <div className="flex gap-6 animate-marquee">
            {duplicated.map((client, idx) => (
              <div
                key={`${client.id}-${idx}`}
                className="flex-shrink-0 w-[180px] h-[110px] bg-card rounded-lg flex items-center justify-center border border-border/50 overflow-hidden"
              >
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={240}
                  height={150}
                  className="w-[150%] h-[150%] object-contain"
                  loading="lazy"
                  fallbackText={client.name}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to={buildNavigationUrl('/our-clients', currentLanguage)}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all clients
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
