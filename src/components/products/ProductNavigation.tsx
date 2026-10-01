
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { useTranslation } from "react-i18next";

type Product = {
  id: string;
  title: string;
  slug: string;
};

interface ProductNavigationProps {
  products: Product[];
  activeProductIndex: number;
  navigateToProduct: (index: number) => void;
}

const ProductNavigation = ({
  products,
  activeProductIndex,
  navigateToProduct
}: ProductNavigationProps) => {
  const { t } = useTranslation('products');
  const { currentLanguage } = useLanguage();
  
  if (!products || products.length === 0) return null;
  
  return (
    <div className="fixed right-8 bottom-8 z-40">
      <div className="bg-white rounded-full shadow-lg p-2 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigateToProduct(activeProductIndex - 1)}
          disabled={activeProductIndex === 0}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="px-2 flex items-center space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === activeProductIndex ? "bg-advisable-purple w-6" : "bg-gray-300"
              }`}
              onClick={() => navigateToProduct(index)}
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigateToProduct(activeProductIndex + 1)}
          disabled={activeProductIndex === products.length - 1}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        
        <div className="ml-2 pl-2 border-l border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full flex items-center"
            asChild
          >
            <Link to={buildNavigationUrl(`/product/${products[activeProductIndex].slug}`, currentLanguage)}>
              {t('viewDetails')} <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductNavigation;
