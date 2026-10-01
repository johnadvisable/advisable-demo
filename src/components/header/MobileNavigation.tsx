
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavItem } from '@/types/nav';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';

interface MobileNavigationProps {
  isMenuOpen: boolean;
  navItems: NavItem[];
  closeMobileMenu: () => void;
}

const MobileNavigation = ({ isMenuOpen, navItems, closeMobileMenu }: MobileNavigationProps) => {
  const { t } = useTranslation('shared');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const currentLanguage = useCurrentLanguage();
  
  // Reset navigation state when menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setActiveSubmenu(null);
      setIsSubmenuOpen(false);
    }
  }, [isMenuOpen]);

  const handleSubmenuOpen = (titleKey: string) => {
    setActiveSubmenu(titleKey);
    setIsSubmenuOpen(true);
  };

  const handleSubmenuClose = () => {
    setIsSubmenuOpen(false);
    // Use setTimeout to ensure smooth animation
    setTimeout(() => {
      setActiveSubmenu(null);
    }, 300);
  };

  // Ensure navItems is an array
  const safeNavItems = Array.isArray(navItems) ? navItems : [];

  if (!isMenuOpen) {
    return null;
  }

  return (
    <div 
      id="mobile-navigation"
      className="lg:hidden fixed inset-0 z-[30000] overflow-hidden"
      aria-hidden={!isMenuOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1A1F2C]"
        onClick={closeMobileMenu}
      />
      
      {/* Fixed top bar (shows close button) */}
      <div className="fixed top-0 left-0 right-0 z-[30001] h-20 flex items-center justify-end px-6 bg-[#1A1F2C]">
        <button
          type="button"
          onClick={closeMobileMenu}
          className="inline-flex items-center justify-center h-10 w-10 rounded-md text-white hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Menu Content Container */}
      <div className="relative h-full overflow-y-auto pt-20 pb-8 px-6 bg-[#1A1F2C]">
        {/* Main menu */}
        <div 
          className={`absolute inset-0 pt-20 pb-8 px-6 bg-[#1A1F2C] transition-transform duration-300 ease-in-out ${
            isSubmenuOpen ? 'translate-x-[-100%]' : 'translate-x-0'
          }`}
          aria-hidden={isSubmenuOpen}
        >
          <nav className="space-y-4">
            {safeNavItems.map((item, index) => (
              <div key={index} className="border-b border-white/20 pb-4">
                {item.submenu ? (
                  <button 
                    onClick={() => handleSubmenuOpen(item.titleKey)}
                    className="flex w-full justify-between items-center text-white text-lg font-medium py-3 focus:outline-none focus:text-white/80"
                    aria-expanded={activeSubmenu === item.titleKey}
                    aria-controls={`submenu-${item.titleKey.replace(/\./g, '-')}`}
                  >
                    <span>{t(item.titleKey)}</span>
                    <ChevronRight className="h-5 w-5 transition-transform" />
                  </button>
                ) : (
                  <Link 
                    to={buildNavigationUrl(item.href, currentLanguage)} 
                    className="block py-3 text-white text-lg hover:text-white/80 transition-colors w-full text-left focus:outline-none focus:text-white/80"
                    onClick={closeMobileMenu}
                  >
                    {t(item.titleKey)}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Submenu panel */}
        {safeNavItems.filter(item => item.submenu).map((item) => (
          <div 
            key={`submenu-${item.titleKey}`}
            id={`submenu-${item.titleKey.replace(/\./g, '-')}`}
            className={`absolute inset-0 pt-20 pb-8 px-6 bg-[#1A1F2C] transition-transform duration-300 ease-in-out ${
              isSubmenuOpen && activeSubmenu === item.titleKey ? 'translate-x-0' : 'translate-x-[100%]'
            }`}
            aria-hidden={!(isSubmenuOpen && activeSubmenu === item.titleKey)}
          >
            <div className="mb-6">
              <button 
                onClick={handleSubmenuClose}
                className="flex items-center text-white text-lg font-medium py-2 focus:outline-none focus:text-white/80"
                aria-label={`Back to main menu from ${t(item.titleKey)}`}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                <span>Back</span>
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-4">{t(item.titleKey)}</h2>
            
            <nav className="space-y-4">
              {Array.isArray(item.submenu) && item.submenu.map((subItem, subIndex) => (
                <div key={subIndex} className="border-b border-white/20 pb-3">
                  <Link 
                    to={buildNavigationUrl(subItem.href, currentLanguage)} 
                    className="block py-2 text-white hover:text-white/80 transition-colors focus:outline-none focus:text-white/80"
                    onClick={closeMobileMenu}
                  >
                    {t(subItem.titleKey)}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
