import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Filter } from "lucide-react";
import { PartnerIntegration, getAllPartners, getPartnerCategories } from "@/services/partnerService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";
import partnersHeroBg from "@/assets/partners-hero-bg.jpg";

const Partners = () => {
  const { t } = useTranslation('partners');
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query for optimized caching and loading with longer stale times
  const { data: partners = [], isLoading: partnersLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: getAllPartners,
    staleTime: 15 * 60 * 1000, // 15 minutes - longer for better performance
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["partner-categories"],
    queryFn: getPartnerCategories,
    staleTime: 15 * 60 * 1000, // 15 minutes - longer for better performance
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const loading = partnersLoading || categoriesLoading;

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.description && partner.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || 
      partner.categories.includes(selectedCategory) || 
      partner.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <SEOWrapper
      title="Partners & Integrations - Advisable"
      description="Discover our strategic technology partnerships and integrations. We work with leading platforms to deliver comprehensive digital solutions."
      keywords="technology partners, integrations, strategic partnerships, platform integrations, technology ecosystem"
      type="website"
    >
      <div className="min-h-screen bg-white">
      <Header />
      
      <div 
        className="relative pt-20 bg-cover bg-center bg-no-repeat bg-top"
        style={{ backgroundImage: `url(${partnersHeroBg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  {t('becomePartner')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:max-w-xs">
              <input
                type="search"
                placeholder={t('search.placeholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-advisable-blue"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedCategory === "all" ? t('filter.allCategories') : selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                  <DropdownMenuRadioItem value="all">{t('filter.allCategories')}</DropdownMenuRadioItem>
                  {categories.map(category => (
                    <DropdownMenuRadioItem key={category} value={category}>
                      {category}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map(partner => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600 mb-2">{t('noPartnersFound.title')}</h3>
            <p className="text-gray-500">{t('noPartnersFound.message')}</p>
          </div>
        )}
      </div>

      <Footer />
      </div>
    </SEOWrapper>
  );
};

const PartnerCard = ({ partner }: { partner: PartnerIntegration }) => {
  const { t } = useTranslation('partners');
  const cardContent = (
    <>
      <CardHeader className="bg-white border-b p-6">
        <div className="flex justify-center items-center h-40">
          <img
            src={partner.logo}
            alt={`${partner.name} logo`}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-bold text-advisable-darkPurple">
            {partner.name}
          </CardTitle>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {partner.categories.length > 0 ? partner.categories.join(", ") : partner.category}
          </Badge>
        </div>
        {partner.description && (
          <p className="text-gray-600 mb-4">{partner.description}</p>
        )}
        {partner.hasDetailPage && (
          <Link
            to={`/partners-and-integrations/${partner.id}`}
            className="inline-flex items-center text-advisable-blue hover:text-advisable-purple transition-colors"
          >
            {t('showMore')} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        )}
      </CardContent>
    </>
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      {partner.hasDetailPage ? (
        <Link to={`/partners-and-integrations/${partner.id}`} className="block">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </Card>
  );
};

export default Partners;
