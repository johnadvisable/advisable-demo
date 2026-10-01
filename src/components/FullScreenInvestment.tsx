import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';

type Investment = {
  id: string;
  title: string;
  short_description: string;
  tagline: string;
  website_url: string;
  featured_image?: string;
  logo?: string;
  slug: string;
  cta_primary_text: string;
  cta_secondary_text: string;
};

interface FullScreenInvestmentProps {
  investment: Investment;
  isActive?: boolean;
}

// Thematic background images per investment
const getBackgroundImage = (title: string, featuredImage?: string): string => {
  if (featuredImage) return featuredImage;
  const t = title.toLowerCase();
  if (t.includes('fedra'))
    return 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80';
  if (t.includes('vyne'))
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80';
  if (t.includes('cardia'))
    return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80';
  return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80';
};

const FullScreenInvestment = ({ investment, isActive = false }: FullScreenInvestmentProps) => {
  const currentLanguage = useCurrentLanguage();
  const backgroundImage = getBackgroundImage(investment.title, investment.featured_image);

  return (
    <section
      id={investment.id}
      className={`investment-section h-screen w-full snap-start flex items-center relative overflow-hidden transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-95"
      }`}
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-700`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: isActive ? "scale(1)" : "scale(1.05)",
        }}
      >
        {/* Darkened overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12 flex items-center justify-center h-full">
        <div
          className={`text-white space-y-6 text-center max-w-3xl mx-auto transition-all duration-500 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-80 translate-y-4"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold">{investment.title}</h2>
          <p className="text-xl font-semibold text-white/90">{investment.short_description}</p>
          <p className="text-lg text-white/70">{investment.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="group bg-primary hover:bg-primary/80 text-primary-foreground"
              asChild
            >
              <Link
                to={buildNavigationUrl('/lets-build-together', currentLanguage)}
                className="inline-flex items-center"
              >
                {investment.cta_primary_text}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="border-white text-white bg-white/20 hover:bg-white/30 hover:text-white"
              asChild
            >
              <Link to={buildNavigationUrl('/lets-build-together', currentLanguage)}>
                {investment.cta_secondary_text} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullScreenInvestment;
