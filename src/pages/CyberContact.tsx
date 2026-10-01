import { Helmet } from 'react-helmet-async';
import CyberHeader from '@/components/cyber/CyberHeader';
import CyberFooter from '@/components/cyber/CyberFooter';
import CyberContactForm from '@/components/cyber/CyberContactForm';

const CyberContact = () => {
  return (
    <>
      <Helmet>
        <title>Contact our Cybersecurity team | Advisable</title>
        <meta
          name="description"
          content="Talk to Advisable about penetration testing, red teaming, incident response and cybersecurity consulting. Tell us what you need and we respond within 24 hours."
        />
      </Helmet>

      <CyberHeader />

      <main className="min-h-screen bg-black cyber-dark pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Talk to our Cybersecurity team
          </h1>
          <p className="text-white/70 mb-10 text-lg">
            Tell us which services you are interested in and we will get back to you within 24 hours.
          </p>

          <CyberContactForm />
        </div>
      </main>

      <CyberFooter />
    </>
  );
};

export default CyberContact;
