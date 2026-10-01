import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getInvestments } from "@/services/investments";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { buildNavigationUrl } from "@/utils/multilanguageUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvestmentCardProps {
  investment: {
    id: string;
    slug: string;
    title: string;
    short_description: string;
    website_url: string;
    cta_primary_text: string;
    cta_secondary_text: string;
  };
  currentLanguage: string;
}

const InvestmentCard = ({ investment, currentLanguage }: InvestmentCardProps) => {
  const { isMobile } = useIsMobile();
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 h-full border border-white/20">
      <div className="p-6">
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-advisable-blue">{investment.title}</h3>
        {isMobile ? (
          <p className="text-gray-600 mb-4 text-sm line-clamp-3">{investment.short_description}</p>
        ) : (
          <p className="text-gray-600 mb-4 line-clamp-4">{investment.short_description}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <a 
            href={investment.website_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-sm text-advisable-blue hover:text-advisable-purple transition-colors"
          >
            {investment.cta_primary_text} <ArrowRight className="ml-1 h-3 w-3" />
          </a>
          
          <Link 
            to={buildNavigationUrl(`/investments/${investment.slug}`, currentLanguage)} 
            className="inline-flex items-center text-sm text-advisable-purple hover:text-advisable-blue transition-colors"
          >
            {investment.cta_secondary_text} <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

interface InvestmentsProps {
  className?: string;
}

const Investments = ({ className = "" }: InvestmentsProps) => {
  const currentLanguage = useCurrentLanguage();
  const { isMobile } = useIsMobile();
  
  const { data: investments, isLoading } = useQuery({
    queryKey: ["home-investments", currentLanguage],
    queryFn: () => getInvestments(currentLanguage),
    staleTime: 1000 * 60 * 5,
  });

  if (!investments?.length && !isLoading) {
    return null;
  }

  return (
    <section className={`full-screen-section relative overflow-hidden bg-gradient-to-b from-white to-advisable-lightGray ${className}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-advisable-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-advisable-blue/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 py-4 md:py-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-advisable-darkPurple mb-4 md:mb-0">
            {currentLanguage === 'el' ? 'Οι Επενδύσεις μας' : 'Our Investments'}
          </h2>
          {isMobile ? (
            <Link 
              to={buildNavigationUrl("/investments", currentLanguage)} 
              className="mt-2 text-advisable-blue hover:text-advisable-purple transition-colors flex items-center"
            >
              <span className="text-sm">
                {currentLanguage === 'el' ? 'Δείτε Όλες' : 'View All'}
              </span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <Link 
              to={buildNavigationUrl("/investments", currentLanguage)} 
              className="text-advisable-blue hover:text-advisable-purple transition-colors flex items-center text-lg"
            >
              <span>{currentLanguage === 'el' ? 'Δείτε Όλες' : 'View All'}</span>
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 md:py-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-60 bg-white/50 rounded-xl shadow animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 md:py-8">
            {investments?.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                currentLanguage={currentLanguage}
              />
            ))}
          </div>
        )}
        
        <div className="mt-8 md:mt-12 flex justify-center">
          <Link 
            to={buildNavigationUrl("/investments", currentLanguage)} 
            className="bg-advisable-blue hover:bg-advisable-purple text-white px-6 py-3 rounded-lg text-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            {currentLanguage === 'el' ? 'Εξερευνήστε Όλες' : 'Explore All'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Investments;