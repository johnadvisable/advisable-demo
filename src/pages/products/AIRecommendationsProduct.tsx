import { ArrowLeft, Brain, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import SEOWrapper from "@/components/SEO/SEOWrapper";

const AIRecommendationsProduct = () => {
  return (
    <SEOWrapper
      title="Recommendable Product - Advisable"
      description="Recommendable is an advanced AI-powered recommendation system that delivers personalized content and product suggestions to enhance user experience and drive conversions."
      keywords="Recommendable, machine learning, personalization, recommendation engine, artificial intelligence"
      type="product"
    >
      <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-advisable-darkPurple">
        <div className="absolute inset-0 bg-gradient-to-br from-advisable-darkPurple to-purple-600 opacity-90"></div>
        <div className="container relative mx-auto px-4 py-12 md:py-24 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <div className="flex items-center mb-4 space-x-2">
                <Link to="/products" className="text-white/80 hover:text-white flex items-center space-x-1 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>All Products</span>
                </Link>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">Recommendable</h1>
              <p className="text-xl md:text-2xl font-light">Real Personalized Suggestions</p>
              <p className="text-lg">
                Create an engaging environment with the use of Real Personalized Suggestions based on 1:1 customer data.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <a href="https://recommendable.gr" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden h-80 w-full max-w-md">
                <img 
                  src="/ai-dashboard.jpg" 
                  alt="Recommendable Dashboard" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-advisable-darkPurple">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            <div className="relative">
              <div className="absolute top-0 left-0 -mt-2 -ml-2 bg-purple-100 rounded-full h-12 w-12 flex items-center justify-center text-purple-600 font-bold text-xl z-10">
                1
              </div>
              <div className="bg-gray-50 p-8 pt-12 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Data Collection</h3>
                <p className="text-gray-600">
                  Our system collects user behavior data, including browsing history, purchase history, 
                  and engagement patterns.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-0 -mt-2 -ml-2 bg-purple-100 rounded-full h-12 w-12 flex items-center justify-center text-purple-600 font-bold text-xl z-10">
                2
              </div>
              <div className="bg-gray-50 p-8 pt-12 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">AI Processing</h3>
                <p className="text-gray-600">
                  Our advanced AI algorithms analyze the data to identify patterns and preferences unique 
                  to each individual user.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-0 -mt-2 -ml-2 bg-purple-100 rounded-full h-12 w-12 flex items-center justify-center text-purple-600 font-bold text-xl z-10">
                3
              </div>
              <div className="bg-gray-50 p-8 pt-12 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Personalized Recommendations</h3>
                <p className="text-gray-600">
                  The system delivers highly personalized recommendations that adapt in real-time to user behavior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-advisable-darkPurple">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-purple-100 p-4 rounded-full inline-block">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Machine Learning</h3>
              <p className="text-gray-600">
                Our algorithms continuously learn and adapt to user preferences, improving recommendations over time.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-purple-100 p-4 rounded-full inline-block">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Intelligent Suggestions</h3>
              <p className="text-gray-600">
                Go beyond traditional recommendation systems with contextual understanding of user intent.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-purple-100 p-4 rounded-full inline-block">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Customer Segmentation</h3>
              <p className="text-gray-600">
                Automatically group users by behavior patterns for targeted marketing and personalization.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">35%</p>
              <p className="text-white/80">Average Revenue Increase</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">42%</p>
              <p className="text-white/80">Higher Conversion Rate</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">87%</p>
              <p className="text-white/80">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-advisable-darkPurple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Transform Your Customer Experience</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            Join leading businesses already leveraging our AI-powered recommendation engine.
          </p>
          <Button asChild size="lg" className="bg-advisable-purple hover:bg-advisable-purple/90 text-primary-foreground">
            <a href="https://recommendable.gr" target="_blank" rel="noopener noreferrer">
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

export default AIRecommendationsProduct;
