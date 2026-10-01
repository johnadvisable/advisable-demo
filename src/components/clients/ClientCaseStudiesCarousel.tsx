import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getFeaturedClients } from '@/services/clients';
import { useLanguage } from "@/context/LanguageContext";
import Image from '@/components/images';

const ClientCaseStudiesCarousel = () => {
  const { currentLanguage } = useLanguage();
  const {
    data: clients = [],
    isLoading
  } = useQuery({
    queryKey: ['featuredClients', currentLanguage],
    queryFn: () => getFeaturedClients(currentLanguage)
  });

  const sortedClients = [...clients].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return (a.display_order || 999) - (b.display_order || 999);
    }
    return a.name.localeCompare(b.name);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-primary">Loading success stories...</div>
      </div>
    );
  }

  if (sortedClients.length === 0) {
    return null;
  }

  return (
    <div className="py-8 md:py-16">
      {/* Carousel */}
      <Carousel 
        className="mx-auto"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {sortedClients.map((client) => {
            const primaryCategory = client.product_categories && client.product_categories.length > 0 
              ? client.product_categories[0] 
              : client.product_category;
            
            return (
              <CarouselItem key={client.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="group h-full">
                  <div className="relative h-full bg-card rounded-3xl border border-border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1">
                    {/* Background Image or Gradient */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      {client.background_image ? (
                        <Image
                          src={client.background_image}
                          alt={`${client.name} background`}
                          width={400}
                          height={224}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      
                      {/* Logo overlay - Larger format */}
                      <div className="absolute bottom-4 left-6 bg-white p-5 rounded-xl shadow-md">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          width={200}
                          height={200}
                          className="h-24 w-auto max-w-[200px] object-contain"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                        {client.name}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {client.industry} {client.country && `• ${client.country}`}
                      </p>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {client.product_categories && client.product_categories.length > 0 ? (
                          client.product_categories.slice(0, 2).map((category, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                              {category}
                            </span>
                          ))
                        ) : primaryCategory ? (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {primaryCategory}
                          </span>
                        ) : null}
                        {client.product_categories && client.product_categories.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{client.product_categories.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Link to={`/our-clients/${client.slug}`} className="block">
                        <Button 
                          className="w-full group/btn"
                          variant="outline"
                        >
                          <span>View Case Study</span>
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        {/* Navigation */}
        <div className="flex justify-center mt-8 gap-4">
          <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full border-2" />
          <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full border-2" />
        </div>
      </Carousel>
    </div>
  );
};

export default ClientCaseStudiesCarousel;
