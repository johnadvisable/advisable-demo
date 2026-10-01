import { ArrowLeft, Stethoscope, BarChart, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import SEOWrapper from "@/components/SEO/SEOWrapper";

const EPrescriptionProduct = () => {
  return (
    <SEOWrapper
      title="Esyntagi - E-Prescription Platform - Advisable"
      description="Esyntagi is a comprehensive electronic prescription management system streamlining healthcare workflows with secure, compliant digital prescribing solutions."
      keywords="Esyntagi, e-prescription, electronic prescriptions, healthcare software, medical technology, prescription management"
      type="product"
    >
      <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-advisable-darkPurple">
        <div className="absolute inset-0 bg-gradient-to-br from-advisable-darkPurple to-green-600 opacity-90"></div>
        <div className="container relative mx-auto px-4 py-12 md:py-24 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <div className="flex items-center mb-4 space-x-2">
                <Link to="/products" className="text-white/80 hover:text-white flex items-center space-x-1 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>All Products</span>
                </Link>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">Esyntagi</h1>
              <p className="text-xl md:text-2xl font-light">Cloud ERP for Healthcare</p>
              <p className="text-lg">
                Esyntagi combines essential tools for efficient prescription processing, product management, 
                and invoicing with affiliated insurance funds.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  <a href="https://esyntagi.gr" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden h-80 w-full max-w-md">
                <img 
                  src="/eprescription-dashboard.jpg" 
                  alt="E Prescription Dashboard" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80";
                  }}
                />
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
              <div className="mb-6 bg-green-100 p-4 rounded-full inline-block">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Prescription Management</h3>
              <p className="text-gray-600">
                Streamlined prescription processing with automated verification and error checking.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-green-100 p-4 rounded-full inline-block">
                <BarChart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Inventory Control</h3>
              <p className="text-gray-600">
                Comprehensive pharmaceutical inventory management with expiration date tracking and auto-reordering.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-green-100 p-4 rounded-full inline-block">
                <Cloud className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-advisable-darkPurple">Cloud-Based ERP</h3>
              <p className="text-gray-600">
                Access your system from anywhere with secure, compliant cloud infrastructure built for healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-advisable-darkPurple">Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-advisable-darkPurple flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                For Pharmacies
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Reduce prescription processing time by up to 75%</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Minimize errors with automated verification systems</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Streamline insurance claims and reimbursements</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-advisable-darkPurple flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                For Healthcare Providers
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Secure, HIPAA-compliant prescription management</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Integrated with major electronic health record systems</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Real-time analytics on prescription patterns and patient care</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-advisable-darkPurple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Modernize Your Healthcare Process</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            Join hundreds of healthcare providers and pharmacies using Esyntagi to streamline their operations.
          </p>
          <Button asChild size="lg" className="bg-advisable-purple hover:bg-advisable-purple/90 text-primary-foreground">
            <a href="https://esyntagi.gr" target="_blank" rel="noopener noreferrer">
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

export default EPrescriptionProduct;
