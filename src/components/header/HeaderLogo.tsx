
import { Link } from 'react-router-dom';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';

interface HeaderLogoProps {
  closeMobileMenu?: () => void;
  variant?: 'dark' | 'light';
  isScrolled?: boolean;
}

const HeaderLogo = ({ closeMobileMenu, variant = 'dark', isScrolled = false }: HeaderLogoProps) => {
  const currentLanguage = useCurrentLanguage();
  
  // Apply dark filter when light variant and not scrolled
  const isLightMode = variant === 'light' && !isScrolled;

  return (
    <div className="flex-shrink-0 z-50">
      <Link 
        to={buildNavigationUrl('/', currentLanguage)} 
        className="focus:outline-none focus:opacity-80 transition-opacity"
        onClick={closeMobileMenu}
        aria-label="Advisable - Home"
      >
        <img 
          src="/files-uploads/advisableLogo.png" 
          alt="Advisable" 
          className={`h-12 md:h-16 w-auto transition-all duration-300 ${isLightMode ? 'brightness-0' : ''}`}
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
