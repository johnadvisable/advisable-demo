
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import { Loader2 } from "lucide-react";
import ProductNavigation from "../components/products/ProductNavigation";
import ProductsDisplay from "../components/products/ProductsDisplay";

import ProductsStyles from "../components/products/ProductsStyles";
import { useProductNavigation } from "../hooks/useProductNavigation";
import { useLanguage } from "@/context/LanguageContext";
import { getProducts } from "@/services/productService";
import { fetchHeroContentByPage } from "@/services/heroContentService";

// Hero content type removed (unused)

const Products = () => {
  const { currentLanguage } = useLanguage();
  
  // Fetch hero content for the products page
  const { data: heroContent } = useQuery({
    queryKey: ["hero-content", "products", currentLanguage],
    queryFn: () => fetchHeroContentByPage('products', currentLanguage)
  });

  const {
    data: products,
    isLoading
  } = useQuery({
    queryKey: ["products", currentLanguage],
    queryFn: () => getProducts(currentLanguage)
  });

  // Use the custom hook for product navigation
  const { activeProductIndex, navigateToProduct } = useProductNavigation(products);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-advisable-darkPurple text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <SEOWrapper {...products} {...heroContent }>
      <div className="min-h-screen overflow-hidden">
        <Header forceScrolled />

        <main className="pt-16 relative">

          <ProductNavigation 
            products={products || []} 
            activeProductIndex={activeProductIndex} 
            navigateToProduct={navigateToProduct} 
          />
          
          <ProductsDisplay 
            products={products || []} 
            activeProductIndex={activeProductIndex} 
          />
        </main>

        <Footer />
        <ProductsStyles />
      </div>
    </SEOWrapper>
  );
};

export default Products;
