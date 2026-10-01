import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Building, Users, MapPin, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getClientBySlug } from '../services/clients';
import { useLanguage } from "@/context/LanguageContext";
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";

const ClientDetail = () => {
  const { t } = useTranslation('clientdetail');
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const { data: client, isLoading, isError } = useQuery({
    queryKey: ['client', slug, currentLanguage],
    queryFn: () => {
      if (!slug) return null;
      return getClientBySlug(slug, currentLanguage);
    },
    enabled: !!slug
  });

  useEffect(() => {
    if (isError) {
      toast.error(t('errors.notFound'));
      navigate('/our-clients');
    }
  }, [isError, navigate, t]);

  if (isLoading || !client) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="light" />
        <div className="flex-grow flex items-center justify-center">{t('loading')}</div>
        <Footer />
      </div>
    );
  }

  const getPrimaryCategory = (): string => {
    if (client?.product_categories && client.product_categories.length > 0) {
      return client.product_categories[0];
    }
    return '';
  };

  const getProductColor = (category: string): string => {
    switch(category) {
      case 'Ecommercen': return 'from-blue-500 to-purple-600';
      case 'MarketData': return 'from-green-500 to-blue-500';
      case 'Recommendable': return 'from-purple-500 to-pink-500';
      case 'ePrescription Cloud ERP': return 'from-blue-400 to-cyan-500';
      case 'Digital Agency Services': return 'from-orange-500 to-red-500';
      case 'Venture Studio Services': return 'from-purple-400 to-blue-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const caseStudy = {
    challenge: client?.case_study_challenge || 'The client needed to modernize their digital infrastructure to meet growing customer demands while maintaining security and compliance standards.',
    solution: client?.case_study_solution || `We implemented our ${getPrimaryCategory()} solution with customizations specific to ${client?.industry} requirements, ensuring a seamless transition from their legacy systems.`,
    results: client?.case_study_results && Array.isArray(client.case_study_results) ? 
      client.case_study_results.map((result: any) => `${result.value}: ${result.description}`).slice(0, 4) : [
        'Increased customer satisfaction scores by 35%',
        'Reduced operational costs by 28%',
        'Improved system reliability with 99.9% uptime',
        'Enhanced data security with industry-leading protocols'
      ],
    timeline: client?.case_study_timeline || '6 months from initial consultation to full deployment',
    teamSize: client?.case_study_team_size || '4 dedicated specialists'
  };

  return (
    <SEOWrapper
      title={client ? `${client.name} - Our Clients - Advisable` : 'Client - Our Clients - Advisable'}
      description={client?.description || `Discover how ${client?.name || 'this client'} achieved digital transformation success through our innovative technology solutions and consulting expertise.`}
      keywords="case study, client success, digital transformation, business results"
      type="website"
    >
      <div className="min-h-screen flex flex-col">
      <Header variant="light" />
      
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/our-clients"
            className="inline-flex items-center text-gray-600 hover:text-advisable-blue transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('navigation.backToClients')}
          </Link>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Client header with background image or gradient */}
        <div className="relative rounded-lg mb-8 overflow-hidden">
          {client.background_image ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>
              <div 
                className="absolute inset-0 z-0" 
                style={{
                  backgroundImage: `url('${client.background_image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-r ${getProductColor(getPrimaryCategory())} z-0`}></div>
          )}
          
          <div className="relative z-20 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md w-32 h-32 flex items-center justify-center shrink-0">
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{client.name}</h1>
                <div className="flex flex-wrap gap-4 mb-4">
                  {client.industry && (
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{client.industry}</span>
                    </div>
                  )}
                  {client.country && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{client.country}</span>
                    </div>
                  )}
                  {getPrimaryCategory() && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{t('client.usingCategory', { category: getPrimaryCategory() })}</span>
                    </div>
                  )}
                </div>
                {client.description && (
                  <p className="text-white/90">{client.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Case study content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Challenge */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-advisable-darkPurple">{t('caseStudy.challenge')}</h2>
              </CardHeader>
              <CardContent>
                <p>{caseStudy.challenge}</p>
              </CardContent>
            </Card>
            
            {/* Solution */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-advisable-darkPurple">{t('caseStudy.solution')}</h2>
              </CardHeader>
              <CardContent>
                <p>{caseStudy.solution}</p>
              </CardContent>
            </Card>
            
            {/* Results */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-advisable-darkPurple">{t('caseStudy.results')}</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {caseStudy.results.map((result, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            
            {/* Project Details */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-advisable-darkPurple">{t('project.title')}</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('project.labels.timeline')}</h3>
                  <p>{caseStudy.timeline}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('project.labels.teamSize')}</h3>
                  <p>{caseStudy.teamSize}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('project.labels.product')}</h3>
                  <p>{getPrimaryCategory()}</p>
                </div>
                
                {/* External website if available */}
                {client.website && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t('project.labels.website')}</h3>
                      <a
                        href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-advisable-blue hover:text-advisable-purple flex items-center"
                      >
                        {t('project.visitWebsite')} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      </div>
    </SEOWrapper>
  );
};

export default ClientDetail;
