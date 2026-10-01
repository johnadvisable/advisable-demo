import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOWrapper from '@/components/SEO/SEOWrapper';
import StartupApplicationForm from '@/components/venture/StartupApplicationForm';

const LetsBuildTogether = () => {
  return (
    <SEOWrapper>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header variant="light" />
        <main className="flex-grow py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-advisable-purple font-semibold mb-3">
                Venture Studio
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-advisable-darkPurple mb-4">
                Let's Build Together
              </h1>
              <p className="text-lg text-gray-600">
                Tell us about your startup. Share your vision, your market, and where you are today. Our Venture Studio team will review your application and reach out.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <StartupApplicationForm />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default LetsBuildTogether;
