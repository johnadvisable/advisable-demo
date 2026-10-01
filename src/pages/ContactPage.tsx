
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import SimpleContact from "../components/SimpleContact";

const ContactPage = () => {
  return (
    <SEOWrapper>
      <div className="min-h-screen bg-white flex flex-col">
      <Header variant="light" />
      
      <div className="py-24 flex-grow">
        {/* <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center text-advisable-darkPurple mb-2">Contact Us</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Have a question or interested in our services? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div> */}
        
        <SimpleContact />
      </div>
        
        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default ContactPage;
