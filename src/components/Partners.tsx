
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getFeaturedPartners, PartnerIntegration } from '@/services/partnerService';

const Partners = () => {
  const [, setCurrentSlide] = useState(0);
  const [partners, setPartners] = useState<PartnerIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get featured partners from the service
    const loadPartners = async () => {
      setLoading(true);
      try {
        const featuredPartners = await getFeaturedPartners({ queryKey: ['featured-partners', 'en'] });
        setPartners(featuredPartners);
      } catch (error) {
        console.error("Error loading partners:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPartners();
  }, []);
  
  const slidesPerView = {
    mobile: 2,
    tablet: 4,
    desktop: 6,
  };
  
  const nextSlide = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideWidth = container.scrollWidth / Math.ceil(partners.length / slidesPerView.desktop);
      container.scrollBy({ left: slideWidth, behavior: 'smooth' });
      
      // Calculate current slide based on scroll position
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const newSlide = Math.round(scrollContainerRef.current.scrollLeft / slideWidth);
          setCurrentSlide(newSlide);
        }
      }, 300);
    }
  };
  
  const prevSlide = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideWidth = container.scrollWidth / Math.ceil(partners.length / slidesPerView.desktop);
      container.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      
      // Calculate current slide based on scroll position
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const newSlide = Math.round(scrollContainerRef.current.scrollLeft / slideWidth);
          setCurrentSlide(newSlide);
        }
      }, 300);
    }
  };
  
  return (
    <section id="partners" className="section-padding bg-advisable-lightGray py-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-advisable-darkPurple">Partners & Integrations</h2>
          {/* "View All" button only visible on non-mobile screens */}
          <div className="hidden md:block">
            <Link to="/partners-and-integrations">
              <Button variant="outline" className="border-advisable-blue text-advisable-blue hover:bg-advisable-blue hover:text-white">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          {loading ? (
            <div className="flex gap-6 pb-4">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index}
                  className="min-w-[200px] aspect-square bg-white/80 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x"
              >
                {partners.map((partner) => (
                  <div 
                    key={partner.id} 
                    className="min-w-[200px] aspect-square bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-6 snap-center"
                  >
                    <div className="h-40 flex items-center justify-center mb-4">
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="text-center text-gray-700 font-medium">{partner.name}</p>
                    {partner.hasDetailPage ? (
                      <Link 
                        to={`/partners-and-integrations/${partner.id}`}
                        className="mt-3 text-sm text-advisable-blue hover:text-advisable-purple flex items-center"
                      >
                        Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
              
              {partners.length > 0 && (
                <>
                  <button 
                    className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                  >
                    <ArrowLeft className="h-5 w-5 text-advisable-darkPurple" />
                  </button>
                  
                  <button 
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    onClick={nextSlide}
                    aria-label="Next slide"
                  >
                    <ArrowRight className="h-5 w-5 text-advisable-darkPurple" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
        
        <div className="flex flex-row justify-center items-center gap-4 mt-8">
          <Link to="/partners-and-integrations">
            <Button variant="outline" className="border-advisable-blue text-advisable-blue hover:bg-advisable-blue hover:text-white">
              Become a Partner
            </Button>
          </Link>
          
          {/* "View All" button visible only on mobile screens, now placed on the same line as "Become a Partner" */}
          <div className="md:hidden">
            <Link to="/partners-and-integrations">
              <Button variant="outline" className="border-advisable-blue text-advisable-blue hover:bg-advisable-blue hover:text-white">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
