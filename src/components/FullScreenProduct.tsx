
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/fileUtils";
import { Card, CardContent } from "./ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { useTranslation } from "react-i18next";

type Product = {
  id: string;
  title: string;
  description: string;
  website_url: string;
  hero_image: string | null;
  image_url: string | null;
  slug: string;
};

interface FullScreenProductProps {
  product: Product;
  isActive?: boolean;
}

const FullScreenProduct = ({ product, isActive = false }: FullScreenProductProps) => {
  const { t } = useTranslation('products');
  const { currentLanguage } = useLanguage();
  return (
    <section
      id={product.id}
      className={`product-section h-screen w-full snap-start flex items-center relative overflow-hidden transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-95"
      }`}
    >
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{ 
          backgroundImage: `url(${getImageUrl(product.hero_image)})`,
          transform: isActive ? "scale(1)" : "scale(1.05)"
        }}
      >
        {/* overlay removed */}
      </div>
      
      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Product Image */}
          <div className="flex justify-center order-2 md:order-1">
            <Card 
              className={`overflow-hidden shadow-2xl transform transition-all duration-500 bg-white/10 backdrop-blur-md border-0 ${
                isActive ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
              }`}
            >
              <CardContent className="p-0">
                <img 
                  src={getImageUrl(product.image_url)} 
                  alt={product.title} 
                  className="w-full h-auto object-cover"
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Product Information */}
          <div 
            className={`text-white space-y-6 order-1 md:order-2 transition-all duration-500 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-80 translate-y-4"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold">{product.title}</h2>
            <p className="text-lg">{product.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="group bg-advisable-blue hover:bg-advisable-purple text-white"
                asChild
              >
                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  {t('visitWebsite')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white text-black hover:bg-white/10"
                asChild
              >
                <Link to={buildNavigationUrl(`/product/${product.slug}`, currentLanguage)} className="text-black">
                  {t('viewDetails')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullScreenProduct;
