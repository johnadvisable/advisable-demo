import { ArrowLeft, ShoppingCart, Package, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import SEOWrapper from "@/components/SEO/SEOWrapper";
const EcommercenProduct = () => {
  return (
    <SEOWrapper
      title="ECOMMERCEN – Award-Winning eCommerce Platform by Advisable"
      description="ECOMMERCEN is a state-of-the-art eCommerce platform, twice awarded for innovation and performance. Designed for extreme business scenarios, it offers advanced shopping carts, inventory management, and multi-channel sales tools to boost revenue and conversions."
      keywords="eCommerce platform, eCommerce software, ECOMMERCEN, Advisable, shopping cart, inventory management, digital commerce, multi-channel sales"
      type="product"
      ogDescription="A high-end, twice awarded eCommerce solution delivering advanced cart, inventory, and sales management capabilities."
      ogUrl="https://advisable.com/products/ecommercen"
      twitterDescription="Boost revenue and conversions with ECOMMERCEN, a powerful, award-winning eCommerce platform built by Advisable."
    >
      <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-advisable-darkPurple">
        <div className="absolute inset-0 bg-gradient-to-br from-advisable-darkPurple to-advisable-purple opacity-90"></div>
        <div className="container relative mx-auto px-4 py-12 md:py-24 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <div className="flex items-center mb-4 space-x-2">
                <Link to="/products" className="text-white/80 hover:text-white flex items-center space-x-1 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>All Products</span>
                </Link>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">ECOMMERCEN</h1>
              <p className="text-xl md:text-2xl font-light">Awarded Advanced Platform for Sellers</p>
              <p className="text-lg">
                A high-end, twice awarded e-commerce specialized software, tested and delivered to the most extreme business scenarios.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button asChild size="lg" className="bg-advisable-purple hover:bg-advisable-purple/90 text-primary-foreground">
                  <a href="https://ecommercen.com" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden h-80 w-full max-w-md">
                <img src="/ecommercen-dashboard.jpg" alt="Ecommercen Dashboard" className="w-full h-full object-cover" onError={e => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80";
              }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-advisable-darkPurple">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-advisable-purple/10 p-4 rounded-full inline-block">
                <ShoppingCart className="h-8 w-8 text-advisable-purple" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Advanced Shopping Cart</h3>
              <p className="text-gray-600">
                State-of-the-art shopping cart with multiple payment options, tax calculations, and shipping integrations.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-advisable-purple/10 p-4 rounded-full inline-block">
                <Package className="h-8 w-8 text-advisable-purple" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Inventory Management</h3>
              <p className="text-gray-600">
                Real-time inventory tracking, automatic restocking notifications, and comprehensive reporting.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-advisable-purple/10 p-4 rounded-full inline-block">
                <Store className="h-8 w-8 text-advisable-purple" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Multi-Channel Sales</h3>
              <p className="text-gray-600">
                Seamlessly sell across multiple platforms with centralized inventory, orders, and customer data.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      
      
      {/* CTA Section */}
      <section className="py-16 bg-advisable-darkPurple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Ready to Transform Your E-commerce Business?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied businesses using Ecommercen to scale their online presence.
          </p>
          <Button asChild size="lg" className="bg-advisable-purple hover:bg-advisable-purple/90 text-primary-foreground">
            <a href="https://ecommercen.com" target="_blank" rel="noopener noreferrer">
              Get Started Today
            </a>
          </Button>
        </div>
      </section>
      
      <Footer />
      </div>
    </SEOWrapper>
  );
};
export default EcommercenProduct;