
import { Link } from 'react-router-dom';
import { ChevronDown, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavItem } from '@/types/nav';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useHierarchicalServices } from '@/hooks/useHierarchicalServices';
import { groupServices } from '@/utils/serviceGroups';

interface DesktopNavigationProps {
  navItems: NavItem[];
  variant?: 'dark' | 'light';
  isScrolled?: boolean;
  onMegaMenuChange?: (isOpen: boolean) => void;
}


const useLatestNews = (languageCode: string, limit: number = 3) => {
  return useQuery({
    queryKey: ['latestNews', languageCode, limit],
    queryFn: async () => {
      const { data: language } = await supabase
        .from('languages')
        .select('id')
        .eq('code', languageCode)
        .single();
      
      const languageId = language?.id || 1;

      const { data: news } = await supabase
        .from('news')
        .select('id, slug')
        .order('published_date', { ascending: false })
        .limit(limit);

      if (!news || news.length === 0) return [];

      const newsWithTranslations = await Promise.all(
        news.map(async (item) => {
          const { data: translation } = await supabase
            .from('news_translations')
            .select('title')
            .eq('news_id', item.id)
            .eq('language_id', languageId)
            .maybeSingle();

          return { ...item, translation };
        })
      );

      return newsWithTranslations;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const ServicesMegaMenu = ({ currentLanguage, textColorClass, onMegaMenuChange }: { currentLanguage: string; textColorClass: string; onMegaMenuChange?: (isOpen: boolean) => void }) => {
  const { t } = useTranslation('shared');
  const { data: digitalAgencyData, isLoading: isLoadingDA } = useHierarchicalServices('digital-agency', currentLanguage);
  const { data: cyberSecurityData, isLoading: isLoadingCyber } = useHierarchicalServices('cyber-security', currentLanguage);
  const { data: ventureStudioData, isLoading: isLoadingVS } = useHierarchicalServices('venture-studio', currentLanguage);
  const { data: technologyData, isLoading: isLoadingTech } = useHierarchicalServices('technology', currentLanguage);
  
  return (
    <div 
      className="dropdown relative group static"
      onMouseEnter={() => onMegaMenuChange?.(true)}
      onMouseLeave={() => onMegaMenuChange?.(false)}
    >
      <a href="#" className={`${textColorClass} transition-colors flex items-center text-lg font-medium tracking-wide`}>
        {t('nav.services')} <ChevronDown className="ml-1 h-5 w-5" />
      </a>
      <div className="dropdown-menu fixed left-0 right-0 top-[56px] w-screen bg-black shadow-2xl overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-0 py-12 px-8">
          {/* Venture Studio Column */}
          <div className="pr-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <Link 
              to={buildNavigationUrl('/venture-studio', currentLanguage)}
              className="block mb-6 group/title"
            >
              <span className="text-2xl font-bold text-white hover:text-advisable-purple transition-colors font-display">{t('nav.ventureStudio')}</span>
            </Link>
            {isLoadingVS ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {groupServices('venture-studio', ventureStudioData?.parents).map((group) => (
                  <div key={group.label || 'other'}>
                    {group.label && (
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                        {group.label}
                      </div>
                    )}
                    <div className="space-y-2">
                      {group.items.map((parent) => (
                        <Link
                          key={parent.id}
                          to={buildNavigationUrl(`/venture-studio/${parent.slug}`, currentLanguage)}
                          className="block text-white hover:underline underline-offset-4 transition-all"
                        >
                          {parent.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Digital Agency Column */}
          <div className="pr-8">
            <Link 
              to={buildNavigationUrl('/digital-agency', currentLanguage)}
              className="block mb-6 group/title"
            >
              <span className="text-2xl font-bold text-white hover:text-advisable-purple transition-colors font-display">{t('nav.digitalAgency')}</span>
            </Link>
            
            {isLoadingDA ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {groupServices('digital-agency', digitalAgencyData?.parents).map((group) => (
                  <div key={group.label || 'other'}>
                    {group.label && (
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                        {group.label}
                      </div>
                    )}
                    <div className="space-y-2">
                      {group.items.map((parent) => (
                        <Link
                          key={parent.id}
                          to={buildNavigationUrl(`/digital-agency/${parent.slug}`, currentLanguage)}
                          className="block text-white hover:underline underline-offset-4 transition-all"
                        >
                          {parent.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technology Column */}
          <div className="pr-8">
            <Link
              to={buildNavigationUrl('/technology', currentLanguage)}
              className="block mb-6 group/title"
            >
              <span className="text-2xl font-bold text-white hover:text-advisable-purple transition-colors font-display">{t('nav.technology')}</span>
            </Link>
            {isLoadingTech ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                ))}
              </div>
            ) : technologyData?.parents && technologyData.parents.length > 0 ? (
              <div className="space-y-5">
                {groupServices('technology', technologyData.parents).map((group) => (
                  <div key={group.label || 'other'}>
                    {group.label && (
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                        {group.label}
                      </div>
                    )}
                    <div className="space-y-2">
                      {group.items.map((parent) => (
                        <Link
                          key={parent.id}
                          to={buildNavigationUrl(`/technology/${parent.slug}`, currentLanguage)}
                          className="block text-white hover:underline underline-offset-4 transition-all"
                        >
                          {parent.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to={buildNavigationUrl('/technology/cloud-infrastructure-k8s', currentLanguage)}
                  className="block text-white hover:underline underline-offset-4 transition-all"
                >
                  {t('nav.cloudInfraK8s')}
                </Link>
                <Link
                  to={buildNavigationUrl('/technology/ai-integrations', currentLanguage)}
                  className="block text-white hover:underline underline-offset-4 transition-all"
                >
                  {t('nav.aiIntegrations')}
                </Link>
              </div>
            )}
          </div>

          {/* Cybersecurity Column */}
          <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <Link
              to={buildNavigationUrl('/cyber-security', currentLanguage)}
              className="block mb-6 group/title"
            >
              <span className="text-2xl font-bold text-white hover:text-advisable-purple transition-colors font-display">{t('nav.cyberSecurity')}</span>
            </Link>
            {isLoadingCyber ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {groupServices('cyber-security', cyberSecurityData?.parents).map((group) => (
                  <div key={group.label || 'other'}>
                    {group.label && (
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                        {group.label}
                      </div>
                    )}
                    <div className="space-y-2">
                      {group.items.map((parent) => (
                        <Link
                          key={parent.id}
                          to={buildNavigationUrl(`/cyber-security/${parent.slug}`, currentLanguage)}
                          className="block text-white hover:underline underline-offset-4 transition-all"
                        >
                          {parent.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsMegaMenu = ({ currentLanguage, textColorClass, onMegaMenuChange }: { currentLanguage: string; textColorClass: string; onMegaMenuChange?: (isOpen: boolean) => void }) => {
  const { t } = useTranslation('shared');
  const { data: latestNews } = useLatestNews(currentLanguage, 3);

  // Products with translation keys
  const products = [
    { titleKey: 'nav.ecommercen', slug: 'ecommercen', descriptionKey: 'nav.ecommercenDesc' },
    { titleKey: 'nav.marketData', slug: 'sizethemarket', descriptionKey: 'nav.marketDataDesc' },
    { titleKey: 'nav.aiRecommendations', slug: 'ai-recommendations', descriptionKey: 'nav.aiRecommendationsDesc' },
    { titleKey: 'nav.esyntagi', slug: 'e-prescription-cloud-erp', descriptionKey: 'nav.esyntagiDesc' },
    { titleKey: 'nav.findloom', slug: 'findloom', descriptionKey: 'nav.findloomDesc' },
  ];

  return (
    <div 
      className="dropdown relative group static"
      onMouseEnter={() => onMegaMenuChange?.(true)}
      onMouseLeave={() => onMegaMenuChange?.(false)}
    >
      <a href="#" className={`${textColorClass} transition-colors flex items-center text-lg font-medium tracking-wide`}>
        {t('nav.products')} <ChevronDown className="ml-1 h-5 w-5" />
      </a>
      <div className="dropdown-menu fixed left-0 right-0 top-[56px] w-screen bg-black shadow-2xl overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-0 py-12 px-8">
          {/* Products Column */}
          <div className="pr-12 col-span-2">
            <Link 
              to={buildNavigationUrl('/products', currentLanguage)}
              className="block mb-8 group/title"
            >
              <span className="text-2xl font-bold text-white hover:text-advisable-purple transition-colors font-display">{t('nav.ourProducts')}</span>
            </Link>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  to={buildNavigationUrl(`/products/${product.slug}`, currentLanguage)}
                  className="block group/item"
                >
                  <span className="block text-lg text-gray-400 group-hover/item:text-white transition-colors">{t(product.titleKey)}</span>
                  <span className="block text-sm text-gray-600">{t(product.descriptionKey)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Spotlight Column - Latest News */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-4 w-4 text-advisable-purple" />
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('nav.latestNews')}</span>
            </div>
            
            <div className="space-y-4">
              {latestNews?.map((item) => (
                <Link 
                  key={item.id}
                  to={buildNavigationUrl(`/news/${item.slug}`, currentLanguage)}
                  className="block group/spotlight"
                >
                  <h4 className="text-base text-gray-400 group-hover/spotlight:text-white transition-colors line-clamp-2">
                    {item.translation?.title || 'Untitled'}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutMegaMenu = ({ currentLanguage, textColorClass, onMegaMenuChange }: { currentLanguage: string; textColorClass: string; onMegaMenuChange?: (isOpen: boolean) => void }) => {
  const { t } = useTranslation('shared');
  
  return (
    <div 
      className="dropdown relative group static"
      onMouseEnter={() => onMegaMenuChange?.(true)}
      onMouseLeave={() => onMegaMenuChange?.(false)}
    >
      <a href="#" className={`${textColorClass} transition-colors flex items-center text-lg font-medium tracking-wide`}>
        {t('nav.about')} <ChevronDown className="ml-1 h-5 w-5" />
      </a>
      <div className="dropdown-menu fixed left-0 right-0 top-[56px] w-screen bg-black shadow-2xl overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-0 py-12 px-8">
          {/* About Column */}
          <div className="pr-12">
            <span className="block mb-8 text-2xl font-bold text-white font-display">{t('nav.aboutUs')}</span>
            <div className="space-y-4">
              <Link
                to={buildNavigationUrl('/about-company', currentLanguage)}
                className="block group/item"
              >
                <span className="block text-lg text-gray-400 group-hover/item:text-white transition-colors">{t('nav.aboutCompany')}</span>
                <span className="block text-sm text-gray-600">{t('nav.aboutCompanyDesc')}</span>
              </Link>
              <Link
                to={buildNavigationUrl('/advisable-team', currentLanguage)}
                className="block group/item"
              >
                <span className="block text-lg text-gray-400 group-hover/item:text-white transition-colors">{t('nav.ourTeam')}</span>
                <span className="block text-sm text-gray-600">{t('nav.teamDesc')}</span>
              </Link>
              <Link
                to={buildNavigationUrl('/careers', currentLanguage)}
                className="block group/item"
              >
                <span className="block text-lg text-gray-400 group-hover/item:text-white transition-colors">{t('nav.careers')}</span>
                <span className="block text-sm text-gray-600">{t('nav.careersDesc')}</span>
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="pr-12">
            <span className="block mb-8 text-2xl font-bold text-white font-display">{t('nav.quickLinks')}</span>
            <div className="space-y-4">
              <Link
                to={buildNavigationUrl('/our-clients', currentLanguage)}
                className="block group/item"
              >
                <span className="block text-lg text-gray-400 group-hover/item:text-white transition-colors">{t('nav.ourClients')}</span>
                <span className="block text-sm text-gray-600">{t('nav.ourClientsDesc')}</span>
              </Link>
              <Link
                to={buildNavigationUrl('/partners-and-integrations', currentLanguage)}
                className="block group/item"
              >
                <span className="block text-lg text-gray-400 group-hover/item:text-white transition-colors">{t('nav.partnersIntegrations')}</span>
                <span className="block text-sm text-gray-600">{t('nav.partnersIntegrationsDesc')}</span>
              </Link>
              <Link
                to={buildNavigationUrl('/contact', currentLanguage)}
                className="block group/item"
              >
                <span className="block text-lg text-gray-400 group-hover/item:text-white transition-colors">{t('nav.contactUs')}</span>
                <span className="block text-sm text-gray-600">{t('nav.contactUsDesc')}</span>
              </Link>
            </div>
          </div>

          {/* CTA Column */}
          <div className="flex flex-col justify-center">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-advisable-purple/20 to-transparent border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-3">{t('nav.readyToStart')}</h4>
              <p className="text-sm text-gray-400 mb-6">{t('nav.readyToStartDesc')}</p>
              <Link
                to={buildNavigationUrl('/contact', currentLanguage)}
                className="inline-block px-6 py-3 bg-advisable-purple text-white rounded-full hover:bg-advisable-purple/90 transition-colors text-sm font-medium"
              >
                {t('nav.getInTouch')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopNavigation = ({ navItems, variant = 'dark', isScrolled = false, onMegaMenuChange }: DesktopNavigationProps) => {
  const { t } = useTranslation('shared');
  const currentLanguage = useCurrentLanguage();
  
  // Use dark text when light variant AND not scrolled, otherwise white
  const textColorClass = variant === 'light' && !isScrolled 
    ? 'text-advisable-darkPurple hover:text-primary' 
    : 'text-white hover:text-advisable-purple';

  return (
    <nav className="hidden lg:flex items-center space-x-8 mx-auto">
      {navItems.map((item, index) => {
        // Special mega menu for About
        if (item.titleKey === 'nav.about') {
          return <AboutMegaMenu key={index} currentLanguage={currentLanguage} textColorClass={textColorClass} onMegaMenuChange={onMegaMenuChange} />;
        }
        
        // Special mega menu for Services
        if (item.titleKey === 'nav.services') {
          return <ServicesMegaMenu key={index} currentLanguage={currentLanguage} textColorClass={textColorClass} onMegaMenuChange={onMegaMenuChange} />;
        }
        
        // Special mega menu for Products
        if (item.titleKey === 'nav.products') {
          return <ProductsMegaMenu key={index} currentLanguage={currentLanguage} textColorClass={textColorClass} onMegaMenuChange={onMegaMenuChange} />;
        }
        
        return item.submenu ? (
          <div key={index} className="dropdown relative group">
            <a href={buildNavigationUrl(item.href, currentLanguage)} className={`${textColorClass} transition-colors flex items-center text-lg font-medium tracking-wide`}>
              {t(item.titleKey)} <ChevronDown className="ml-1 h-5 w-5" />
            </a>
            <div className="dropdown-menu absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="py-2">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={buildNavigationUrl(subItem.href, currentLanguage)}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-advisable-purple hover:text-white"
                  >
                    {t(subItem.titleKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Link
            key={index}
            to={buildNavigationUrl(item.href, currentLanguage)}
            className={`${textColorClass} transition-colors text-lg font-medium tracking-wide`}
          >
            {t(item.titleKey)}
          </Link>
        );
      })}
    </nav>
  );
};

export default DesktopNavigation;
