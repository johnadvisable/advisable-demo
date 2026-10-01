
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedClients } from '../services/clients';
import { useLanguage } from '@/context/LanguageContext';

const Clients = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentLanguage } = useLanguage();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['featuredClients', currentLanguage],
    queryFn: () => getFeaturedClients(currentLanguage)
  });

  const slidesPerView = {
    mobile: 2,
    tablet: 4,
    desktop: 6
  };
  
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % Math.ceil(clients.length / slidesPerView.desktop));
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + Math.ceil(clients.length / slidesPerView.desktop)) % Math.ceil(clients.length / slidesPerView.desktop));
  };

  return (
    <section id="clients" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-12 text-center text-advisable-darkPurple">Our Clients</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-advisable-purple">Loading clients...</div>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{
              transform: `translateX(-${currentSlide * 100}%)`
            }}>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 w-full flex-shrink-0">
                {clients.slice(0, slidesPerView.desktop).map(client => (
                  <div key={client.id} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-32 md:h-40 lg:h-48">
                    <img 
                      src={client.logo} 
                      alt={`${client.name} logo`} 
                      className="max-h-[80%] max-w-[80%] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallbackElement = document.createElement('p');
                        fallbackElement.className = 'text-gray-500 font-medium';
                        fallbackElement.textContent = client.name;
                        e.currentTarget.parentElement?.appendChild(fallbackElement);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <button className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100" onClick={prevSlide} aria-label="Previous slide">
              <ArrowLeft className="h-5 w-5 text-advisable-darkPurple" />
            </button>
            
            <button className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100" onClick={nextSlide} aria-label="Next slide">
              <ArrowRight className="h-5 w-5 text-advisable-darkPurple" />
            </button>
          </div>
        )}
        
        <div className="flex justify-center mt-8">
          <Link to="/our-clients">
            <Button className="bg-advisable-blue text-white hover:bg-advisable-purple">
              Explore Client Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Clients;
