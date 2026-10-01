
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PartnerDetail as PartnerDetailType, getPartnerById } from "@/services/partnerService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";

const PartnerDetail = () => {
  const { t } = useTranslation('partnerdetail');
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<PartnerDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    if (id) {
      const fetchPartner = async () => {
        try {
          const partnerData = await getPartnerById(id, currentLanguage);
          if (partnerData) {
            setPartner(partnerData);
          }
        } catch (error) {
          console.error("Error fetching partner details:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPartner();
    }
  }, [id, currentLanguage]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header variant="light" />
        <div className="animate-pulse flex space-x-4 mt-20">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!partner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header variant="light" />
        <div className="mt-20 mb-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">{t('notFound.title')}</h1>
          <p className="text-gray-500 mb-6">{t('notFound.message')}</p>
          <Link to="/partners-and-integrations">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('notFound.backButton')}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <SEOWrapper
      title={partner ? `${partner.name} - Partners - Advisable` : 'Partner - Partners - Advisable'}
      description={partner?.description || `Learn about our partnership with ${partner?.name || 'this partner'} and how it enhances our solutions.`}
      keywords="technology partnership, integration, strategic alliance"
      type="website"
    >
      <div className="min-h-screen bg-white">
      <Header variant="light" />
      
      {/* Back Navigation */}
      <div className="bg-gray-50 border-b pt-20">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/partners-and-integrations"
            className="inline-flex items-center text-gray-600 hover:text-advisable-blue transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('navigation.backToPartners')}
          </Link>
        </div>
      </div>
      
      {/* Partner Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-center w-20 h-20">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  className="max-w-full max-h-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-advisable-darkPurple mb-1">{partner.name}</h1>
                <p className="text-gray-600">{partner.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Partner Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-advisable-darkPurple mb-4">{t('sections.aboutPartnership')}</h2>
                <p className="text-gray-700">{partner.longDescription}</p>
              </CardContent>
            </Card>
            
            {partner.useCase && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-advisable-darkPurple mb-4">{t('sections.useCase')}</h2>
                  <p className="text-gray-700">{partner.useCase}</p>
                </CardContent>
              </Card>
            )}
            
            {partner.benefits && partner.benefits.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-advisable-darkPurple mb-4">{t('sections.benefits')}</h2>
                  <ul className="space-y-2">
                    {partner.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link to="/partners-and-integrations">
            <Button variant="outline" className="border-advisable-blue text-advisable-blue hover:bg-advisable-blue hover:text-white">
              {t('viewAllPartners')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
      </div>
    </SEOWrapper>
  );
};

export default PartnerDetail;
