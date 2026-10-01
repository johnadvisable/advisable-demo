import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getLanguageRedirectUrl,
  getCleanPathForRouting,
  isLocalDevelopment
} from '@/utils/multilanguageUtils';

// Import flag images
import usFlag from '@/assets/flags/us.png';
import grFlag from '@/assets/flags/gr.png';
import frFlag from '@/assets/flags/fr.png';
import itFlag from '@/assets/flags/it.png';
import esFlag from '@/assets/flags/es.png';

interface LanguageSelectorProps {
  variant?: 'dark' | 'light';
  isScrolled?: boolean;
}

const LanguageSelector = ({ variant = 'dark', isScrolled = false }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Conditional text color based on variant and scroll state
  const isLightMode = variant === 'light' && !isScrolled;
  const textColorClass = isLightMode 
    ? 'text-advisable-darkPurple hover:text-primary' 
    : 'text-white hover:text-advisable-purple';

  // Countries with their corresponding domains and flag images
  const countries = [
    { code: 'en', country: 'USA', flag: usFlag, domain: 'advisable.com' },
    { code: 'el', country: 'Greece', flag: grFlag, domain: 'advisable.gr' },
    { code: 'fr', country: 'France', flag: frFlag, domain: 'advisable.fr' },
    { code: 'it', country: 'Italy', flag: itFlag, domain: 'advisable.it' },
    { code: 'es', country: 'Spain', flag: esFlag, domain: 'advisable.es' }
  ];

  const currentCountry = countries.find(c => c.code === i18n.language);

  const handleLanguageChange = async (languageCode: string) => {
    const cleanPath = getCleanPathForRouting(location.pathname, i18n.language);

    if (isLocalDevelopment()) {
      await i18n.changeLanguage(languageCode);
      const newPath = languageCode === 'en' ? cleanPath : `/${languageCode}${cleanPath === '/' ? '' : cleanPath}`;
      navigate(newPath || '/');
      return;
    }

    const redirectUrl = getLanguageRedirectUrl(languageCode, location.pathname);

    if (redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }

    await i18n.changeLanguage(languageCode);
    navigate(cleanPath || '/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`flex items-center gap-2 ${textColorClass}`}>
          <img 
            src={currentCountry?.flag || usFlag} 
            alt={currentCountry?.country || 'USA'} 
            className="w-5 h-[14px] object-cover"
          />
          <span className="hidden sm:inline">{currentCountry?.country || 'USA'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 z-50 min-w-[160px]">
        {countries.map(country => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleLanguageChange(country.code)}
            className={`flex items-center gap-3 py-2 ${country.code === i18n.language ? "bg-gray-100 dark:bg-gray-700 font-medium" : ""}`}
          >
            <img 
              src={country.flag} 
              alt={country.country} 
              className="w-5 h-[14px] object-cover"
            />
            <div className="flex flex-col">
              <span>{country.country}</span>
              <span className="text-xs text-muted-foreground">{country.domain}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
