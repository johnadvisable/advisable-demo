import { useQuery } from '@tanstack/react-query';
import { getAllCredentials } from '../services/credentialService';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';

interface Credential {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

export default function Credentials() {
  const { isMobile } = useIsMobile();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');

  const { data: credentials = [], isLoading } = useQuery({
    queryKey: ['credentials', currentLanguage],
    queryFn: () => getAllCredentials(currentLanguage),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!currentLanguage,
    retry: 2,
  });

  const fallbackCredentials: Credential[] = [
    {
      id: 'fallback-1',
      title: 'Google Partner',
      description: 'Certified Google Partner for digital marketing excellence',
      icon_name: 'google',
      display_order: 1,
      created_at: '',
      updated_at: '',
      image_url: '/src/assets/google-partner-badge.png',
    },
    {
      id: 'fallback-2',
      title: 'Awards Recognition',
      description: 'Industry recognition for outstanding service',
      icon_name: 'award',
      display_order: 2,
      created_at: '',
      updated_at: '',
      image_url: '/src/assets/awards-badge.png',
    },
  ];

  const items: Credential[] = credentials.length > 0 ? credentials : fallbackCredentials;

  return (
    <section data-credentials-section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <header className="text-center mb-14 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Certifications & Awards
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('credentials.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
            {t('credentials.subtitle')}
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-border bg-background animate-pulse"
              />
            ))}
          </div>
        ) : isMobile ? (
          <Carousel className="w-full max-w-sm mx-auto" opts={{ loop: true, align: 'center' }}>
            <CarouselContent>
              {items.map((credential) => (
                <CarouselItem key={credential.id} className="pl-4">
                  <CredentialTile credential={credential} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center gap-3 mt-8">
              <CarouselPrevious className="relative static translate-y-0 bg-background border-border" />
              <CarouselNext className="relative static translate-y-0 bg-background border-border" />
            </div>
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {items.map((credential) => (
              <CredentialTile key={credential.id} credential={credential} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CredentialTile({ credential }: { credential: Credential }) {
  return (
    <article
      data-credential-tile
      className="group flex items-center gap-5 rounded-2xl border border-border bg-background px-6 py-5 shadow-sm transition-all hover:shadow-md"
    >
      {/* Logo: NO wrapper background, NO forced aspect ratio, NO placeholders */}
      <figure data-credential-logo className="shrink-0">
      {credential.image_url ? (
          <img
            src={credential.image_url}
            alt={credential.title}
            width={80}
            height={80}
            loading="lazy"
            decoding="async"
            className="block w-20 h-20 object-contain rounded-none"
            style={{ backgroundColor: 'transparent', borderRadius: 0 }}
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center">
            <Award className="w-10 h-10 text-primary" />
          </div>
        )}
      </figure>

      <div className="min-w-0">
        <h3 className="text-base md:text-lg font-semibold text-foreground truncate">
          {credential.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {credential.description}
        </p>
      </div>
    </article>
  );
}
