
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllInsights } from '@/services/insightsService';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import SecureContentRenderer from '@/components/security/SecureContentRenderer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

const Insights = () => {
  const { currentLanguage } = useLanguage();
  const { isMobile } = useIsMobile();

  const {
    data: insights,
    isLoading
  } = useQuery({
    queryKey: ['insights', currentLanguage],
    queryFn: ({ queryKey }) => getAllInsights({ queryKey }),
    enabled: !!currentLanguage
  });

  if (isLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-advisable-darkPurple">Latest Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const limitedInsights = insights?.slice(0, 6) || [];

  const InsightCard = ({ insight }: { insight: typeof limitedInsights[0] }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
      <Link to={`/insights/${insight.slug}`} className="block">
        {insight.featured_image && (
          <div 
            className="aspect-video bg-cover bg-center bg-gray-100"
            style={{ 
              backgroundImage: `url(${insight.featured_image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}
      </Link>
      <CardContent className="p-6">
        <Link to={`/insights/${insight.slug}`}>
          <h3 className="text-xl font-bold mb-2 text-advisable-darkPurple hover:text-advisable-purple transition-colors">
            {insight.title}
          </h3>
        </Link>
        {insight.excerpt && (
          <SecureContentRenderer 
            content={insight.excerpt} 
            className="text-gray-600 mb-4"
          />
        )}
        <Link 
          to={`/insights/${insight.slug}`} 
          className="inline-flex items-center text-advisable-blue hover:text-advisable-purple transition-colors"
        >
          Read more <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <section id="insights" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-advisable-darkPurple">Latest Insights</h2>
        
        {isMobile ? (
          <Carousel 
            className="w-full" 
            opts={{ loop: true, align: 'start' }}
          >
            <CarouselContent>
              {limitedInsights.map(insight => (
                <CarouselItem key={insight.id} className="basis-4/5">
                  <InsightCard insight={insight} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-card border-border" />
              <CarouselNext className="relative static right-0 left-auto translate-y-0 bg-card border-border" />
            </div>
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {limitedInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}

        {limitedInsights.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/insights">
              <button className="bg-advisable-purple hover:bg-advisable-darkPurple text-white px-8 py-3 rounded-lg font-medium transition-colors">
                View All Insights <ArrowRight className="ml-2 h-4 w-4 inline" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Insights;
