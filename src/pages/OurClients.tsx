import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Users, Award, ChevronDown } from 'lucide-react';
import { getAllClients, getClientCategories, Client } from '@/services/clients';
import { Button } from '@/components/ui/button';
import ClientCaseStudiesCarousel from '@/components/clients/ClientCaseStudiesCarousel';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import Image from '@/components/images';

const OurClients = () => {
  const { t } = useTranslation('ourclients');
  const [currentTab, setCurrentTab] = useState<string>("");
  const { isMobile } = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const clientsListRef = useRef<HTMLDivElement>(null);
  
  const {
    data: clients = [],
    isLoading: isLoadingClients
  } = useQuery({
    queryKey: ["clients", currentLanguage],
    queryFn: () => getAllClients(currentLanguage)
  });
  
  const {
    data: categories = [],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['clientCategories'],
    queryFn: getClientCategories
  });
  
  useEffect(() => {
    if (categories.length > 0 && currentTab === "") {
      setCurrentTab("All");
    }
  }, [categories, currentTab]);

  // Custom ordered categories
  const orderedCategories = ['All', 'Digital Agency Services', 'Recommendable', 'Ecommercen', 'SizeTheMarket'];
  
  // Filter to only include categories that exist in the database + All
  const allCategories = orderedCategories.filter(cat => 
    cat === 'All' || categories.includes(cat)
  );

  const filteredClients = currentTab === 'All' 
    ? clients
    : clients.filter(client => {
        if (client.product_categories && Array.isArray(client.product_categories)) {
          return client.product_categories.includes(currentTab);
        }
        return client.product_category === currentTab;
      });

  const handleTabChange = (newTab: string) => {
    setCurrentTab(newTab);
    setTimeout(() => {
      clientsListRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const getProductInfo = (category: string) => {
    switch (category) {
      case 'All':
        return {
          title: t('categories.all.title'),
          description: t('categories.all.description'),
          icon: <Users className="h-5 w-5" />,
        };
      case 'Venture Studio Services':
        return {
          title: t('categories.ventureStudio.title'),
          description: t('categories.ventureStudio.description'),
          icon: <Award className="h-5 w-5" />,
        };
      case 'Digital Agency Services':
        return {
          title: t('categories.digitalAgency.title'),
          description: t('categories.digitalAgency.description'),
          icon: <Users className="h-5 w-5" />,
        };
      case 'Ecommercen':
        return {
          title: t('categories.ecommerce.title'),
          description: t('categories.ecommerce.description'),
          icon: <ExternalLink className="h-5 w-5" />,
        };
      case 'SizeTheMarket':
        return {
          title: t('categories.sizeTheMarket.title'),
          description: t('categories.sizeTheMarket.description'),
          icon: <Users className="h-5 w-5" />,
        };
      case 'ePrescription Cloud ERP':
        return {
          title: t('categories.ePrescription.title'),
          description: t('categories.ePrescription.description'),
          icon: <Award className="h-5 w-5" />,
        };
      case 'Recommendable':
        return {
          title: t('categories.aiRecommendations.title'),
          description: t('categories.aiRecommendations.description'),
          icon: <Award className="h-5 w-5" />,
        };
      default:
        return {
          title: category,
          description: t('categories.default.description'),
          icon: <Users className="h-5 w-5" />,
        };
    }
  };

  const hasClientCaseStudy = (client: Client) => {
    return (client.case_study_challenge && client.case_study_challenge.trim() !== '') || 
           (client.case_study_solution && client.case_study_solution.trim() !== '') || 
           (client.case_study_results && Array.isArray(client.case_study_results) && client.case_study_results.length > 0) ||
           ['Dioptra', 'E Dructer', 'Optika Liolios'].includes(client.name);
  };

  const currentCategoryInfo = getProductInfo(currentTab);
  
  return (
    <SEOWrapper 
      title="Our Clients - Advisable"
      description="Explore our client success stories and case studies. See how we have helped businesses across industries achieve digital transformation."
      keywords="client success stories, case studies, digital transformation projects, business results, client testimonials"
      type="website"
    >
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-white/60 mb-4">Success Stories</p>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
                Client Success Stories
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto">
                Discover how our innovative solutions have helped businesses transform their operations and achieve remarkable results.
              </p>
            </div>
            <ClientCaseStudiesCarousel />
          </div>
        </section>
        
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-12">
            {isLoadingCategories || isLoadingClients ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-white">{t('loading')}</div>
              </div>
            ) : (
              <Tabs value={currentTab} onValueChange={handleTabChange} className="mb-12">
                
                {isMobile ? (
                  <div className="mb-8">
                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {currentCategoryInfo.icon}
                            <span>{currentTab}</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full min-w-[200px]">
                        {allCategories.map(category => {
                          const productInfo = getProductInfo(category);
                          return (
                            <DropdownMenuItem 
                              key={category} 
                              className="cursor-pointer flex items-center gap-2 py-2.5"
                              onClick={() => {
                                handleTabChange(category);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {productInfo.icon}
                              <span>{category}</span>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="overflow-x-auto pb-2 mb-12">
                    <TabsList className="inline-flex flex-nowrap w-full justify-center bg-transparent p-0 gap-2">
                      {allCategories.map(category => {
                        return (
                          <TabsTrigger 
                            key={category} 
                            value={category} 
                            className="px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 
                              bg-transparent text-foreground/60 hover:text-foreground
                              data-[state=active]:bg-foreground data-[state=active]:text-background"
                          >
                            {category}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>
                )}
                
                <div ref={clientsListRef} className="scroll-mt-40"></div>
                
                {allCategories.map(category => {
                  const productInfo = getProductInfo(category);
                  return (
                    <TabsContent key={category} value={category} className="mt-0">
                      {/* Category Header */}
                      <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                          {productInfo.title}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                          {productInfo.description}
                        </p>
                      </div>
                      
                      {/* Clients Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {filteredClients.map((client: Client) => (
                          <div 
                            key={client.id} 
                            className="group aspect-[3/2] bg-card rounded-xl overflow-hidden flex items-center justify-center hover:shadow-lg transition-all duration-300 border border-border/50 relative"
                          >
                            <Image
                              src={client.logo}
                              alt={`${client.name} logo`}
                              width={1092}
                              height={702}
                              className="w-[90%] h-[90%] object-contain transition-all duration-500 group-hover:scale-110"
                              loading="lazy"
                              fallbackText={client.name}
                            />
                            {/* Hover overlay with info */}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                              <h3 className="font-medium text-sm text-white truncate">{client.name}</h3>
                              {client.industry && (
                                <p className="text-xs text-white/80 truncate">{client.industry}</p>
                              )}
                              {client.product_categories && client.product_categories.length > 0 && (
                                <p className="text-xs text-white/70 truncate">
                                  {client.product_categories.slice(0, 2).join(', ')}
                                </p>
                              )}
                              {hasClientCaseStudy(client) && (
                                <Link
                                  to={`/our-clients/${client.slug}`}
                                  className="inline-block text-xs font-medium text-primary hover:underline transition-colors mt-2"
                                >
                                  {t('viewCaseStudy')}
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </SEOWrapper>
  );
};

export default OurClients;