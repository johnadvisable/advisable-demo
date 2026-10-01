
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/fileUtils";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { lazy, Suspense } from "react";
import { getProductBySlug } from "@/services/productService";
import { useTranslation } from "react-i18next";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import SEOWrapper from "@/components/SEO/SEOWrapper";
import ProductSchema from "@/components/SEO/ProductSchema";
import PageBreadcrumb from "@/components/SEO/PageBreadcrumb";

type ProductType = {
  id: string;
  title: string;
  description: string;
  page_title: string | null;
  page_subtitle: string | null;
  page_description: string | null;
  image_url: string | null;
  hero_image: string | null;
  website_url: string;
  page_background_color: string | null;
  highlight_color: string | null;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }> | null;
  stats: Array<{
    value: string;
    label: string;
  }> | null;
  testimonials: Array<{
    name: string;
    role: string;
    text: string;
  }> | null;
  cta_section_title: string | null;
  cta_section_description: string | null;
  cta_button_text: string | null;
  slug: string;
};

const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/(\d)/g, '-$1')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

const DynamicIcon = ({ name, ...props }: { name: string, [key: string]: any }) => {
  const kebabName = toKebabCase(name);
  if (!name || !dynamicIconImports[kebabName as keyof typeof dynamicIconImports]) {
    return null;
  }
  
  const LucideIcon = lazy(dynamicIconImports[kebabName as keyof typeof dynamicIconImports]);
  
  return (
    <Suspense fallback={<div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('productdetail');
  const currentLanguage = useCurrentLanguage();
  
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug, currentLanguage],
    queryFn: async () => {
      if (!slug) {
        throw new Error("No product slug provided");
      }
      
      const productData = await getProductBySlug(slug, currentLanguage);
      
      if (!productData) {
        throw new Error(`Product with slug '${slug}' not found`);
      }
      
      return productData as ProductType;
    },
    enabled: !!slug,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-advisable-darkPurple text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-advisable-darkPurple">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">{t('notFound.title')}</h1>
            <p className="text-white/80 mb-2">{t('notFound.message')}</p>
            {slug && (
              <p className="text-sm text-white/60 mb-8">{t('notFound.slugLabel')} "{slug}"</p>
            )}
            <div className="space-y-4">
              <Link
                to={buildNavigationUrl("/products", currentLanguage)}
                className="inline-block bg-advisable-blue hover:bg-advisable-purple text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                {t('navigation.viewAllProducts')}
              </Link>
              <br />
              <Link
                to={buildNavigationUrl("/", currentLanguage)}
                className="text-advisable-blue hover:text-advisable-purple transition-colors duration-300"
              >
                {t('navigation.backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const colorMap: Record<string, string> = {
    'advisable-darkPurple': '#1A1F2C',
    'advisable-purple': '#32bcad',
    'advisable-blue': '#0F2D52',
  };
  const resolveColor = (val: string | null, fallback: string) =>
    colorMap[val || ''] || val || fallback;

  const bgColor = resolveColor(product.page_background_color, '#1A1F2C');
  const highlightColor = resolveColor(product.highlight_color, '#32bcad');
  
  return (
    <SEOWrapper
      title={product ? `${product.page_title || product.title} - Products - Advisable` : 'Product - Products - Advisable'}
      description={product?.page_description || product?.description || 'Discover our comprehensive range of digital products and innovative technology solutions.'}
      keywords="digital products, AI recommendations, e-prescription, e-commerce platforms, market data analytics, software solutions"
      type="product"
    >
      <ProductSchema
        name={product.page_title || product.title}
        description={product.page_description || product.description}
        slug={product.slug}
        imageUrl={product.image_url}
        websiteUrl={product.website_url}
      />
      <PageBreadcrumb items={[
        { name: 'Products', path: '/products' },
        { name: product.page_title || product.title, path: `/products/${product.slug}` }
      ]} />
      <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:py-32 relative overflow-hidden" style={{ backgroundColor: bgColor }}>
        
        {product.hero_image && (
          <div
            className="absolute inset-0 bg-cover bg-center z-[-1]"
            style={{ backgroundImage: `url(${getImageUrl(product.hero_image)})` }}
          />
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to={buildNavigationUrl("/products", currentLanguage)}
            className="inline-flex items-center text-white hover:text-advisable-blue mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('navigation.backToProducts')}
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {product.page_title || product.title}
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-white/80">
                {product.page_subtitle || t('hero.fallbackSubtitle')}
              </p>
              <p className="text-lg mb-8">
                {product.page_description || product.description}
              </p>
              <Button 
                style={{ backgroundColor: highlightColor }}
                className="hover:opacity-90 text-white"
                size="lg"
                asChild
              >
                <a href={product.website_url} target="_blank" rel="noopener noreferrer">
                  {product.cta_button_text || t('hero.fallbackCtaButton')} <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
            
            <div className="flex justify-center">
              {product.image_url && (
                <img 
                  src={getImageUrl(product.image_url)} 
                  alt={product.title} 
                  className="w-full max-w-md rounded-lg shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('features.title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.features.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${highlightColor}1a` }}>
                    <DynamicIcon name={feature.icon} className="h-6 w-6" style={{ color: highlightColor }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Stats Section */}
      {product.stats && product.stats.length > 0 && (
        <section className="py-16 text-white" style={{ backgroundColor: bgColor }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: highlightColor }}>
                    {stat.value}
                  </p>
                  <p className="text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Testimonials Section */}
      {product.testimonials && product.testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('testimonials.title')}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {product.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <p className="text-lg italic mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: highlightColor }}>
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 text-white" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {product.cta_section_title || t('cta.fallbackTitle')}
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            {product.cta_section_description || t('cta.fallbackDescription')}
          </p>
          <Button
            style={{ backgroundColor: highlightColor }}
            className="hover:opacity-90 text-white"
            size="lg"
            asChild
          >
            <a href={product.website_url} target="_blank" rel="noopener noreferrer">
              {product.cta_button_text || t('cta.fallbackButton')} <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
      
      </div>
      <Footer />
    </SEOWrapper>
  );
};

export default ProductDetail;
