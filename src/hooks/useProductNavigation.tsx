
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type Product = {
  id: string;
  slug: string;
};

export const useProductNavigation = (products: Product[] | undefined) => {
  const location = useLocation();
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigate to product function
  const navigateToProduct = (index: number) => {
    if (!products || index < 0 || index >= products.length) return;
    setActiveProductIndex(index);
    const element = document.getElementById(products[index].id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        navigateToProduct(activeProductIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        navigateToProduct(activeProductIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProductIndex, products]);

  // Update active product on scroll
  useEffect(() => {
    if (!products || products.length === 0) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const index = products.findIndex(p => p.id === id);
          if (index !== -1) {
            setActiveProductIndex(index);
          }
        }
      });
    }, {
      threshold: 0.6,
      rootMargin: "0px"
    });
    document.querySelectorAll(".product-section").forEach(section => {
      observer.observe(section);
    });
    return () => {
      observer.disconnect();
    };
  }, [products]);

  // Handle direct navigation to product via URL hash
  useEffect(() => {
    if (products && products.length > 0 && location.hash) {
      const productId = location.hash.substring(1);
      let productIndex = products.findIndex(p => p.id === productId);
      
      // Try alternative formats if exact match not found
      if (productIndex === -1) {
        // Try lowercase
        productIndex = products.findIndex(p => p.id.toLowerCase() === productId.toLowerCase());
      }
      
      // Try with dashes (e.g., ai-recommendations)
      if (productIndex === -1) {
        const dashedId = productId.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        productIndex = products.findIndex(p => p.id.toLowerCase() === dashedId);
      }
      
      // Try simplified version
      if (productIndex === -1) {
        const simplifiedId = productId.replace(/\s+/g, '-').toLowerCase();
        productIndex = products.findIndex(p => p.id.toLowerCase() === simplifiedId);
      }
      
      if (productIndex !== -1) {
        setTimeout(() => {
          navigateToProduct(productIndex);
        }, 300); // Give a bit more time for the page to load properly
      }
    }
  }, [products, location.hash]);

  return { activeProductIndex, isScrolled, navigateToProduct };
};
