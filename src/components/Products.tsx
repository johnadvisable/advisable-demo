import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import { useLanguage } from '@/context/LanguageContext';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

type ProductsProps = {
  className?: string;
};

const ProductCard = ({
  title,
  description,
  slug,
  imageUrl
}: {
  title: string;
  description: string;
  slug: string;
  imageUrl: string | null;
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');
  
  return (
    <Link 
      to={buildNavigationUrl(`/product/${slug}`, currentLanguage)}
      className="group block"
    >
      <div className="apple-card overflow-hidden h-full flex flex-col bg-card hover:shadow-xl transition-all duration-500">
        {/* Product Image - Full width, no padding */}
        <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-white">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-6xl font-bold text-primary/20">{title.charAt(0)}</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>
          
          {/* Link */}
          <div className="flex items-center mt-4 pt-4 border-t border-border/50">
            <span className="apple-button-link text-sm">
              {t('products.details')} 
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Products = ({
  className = ""
}: ProductsProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('index');
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps'
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const {
    data: products,
    isLoading
  } = useQuery({
    queryKey: ["home-products", currentLanguage],
    queryFn: () => getProducts(currentLanguage)
  });

  return (
    <section id="products" className={`apple-section bg-secondary/30 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {t('products.badge', 'Our Products')}
            </span>
            <h2 className="apple-section-title text-foreground">
              {t('products.title')}
            </h2>
            <p className="apple-section-subtitle max-w-2xl mx-auto">
              {t('products.subtitle', 'Innovative digital solutions built for modern businesses')}
            </p>
          </div>
          
          {/* Carousel Navigation */}
          <div className="hidden md:flex justify-end gap-2 mt-6">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="p-2.5 rounded-full border border-border bg-background hover:bg-accent transition-colors disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="p-2.5 rounded-full border border-border bg-background hover:bg-accent transition-colors disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
        
        {/* Products Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="apple-card overflow-hidden">
                <div className="aspect-square bg-secondary animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-secondary rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-secondary rounded animate-pulse" />
                  <div className="h-4 bg-secondary rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {products?.map(product => (
                <div 
                  key={product.id} 
                  className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_25%] min-w-0 pl-4"
                >
                  <ProductCard 
                    title={product.title} 
                    description={product.description} 
                    slug={product.slug}
                    imageUrl={product.image_url}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* CTA */}
        <div className="mt-16 text-center">
          <Link 
            to={buildNavigationUrl("/products", currentLanguage)} 
            className="apple-button"
          >
            {t('products.exploreAll')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
