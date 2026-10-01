import { useState, useEffect } from 'react';
import HeaderLogo from './header/HeaderLogo';
import DesktopNavigation from './header/DesktopNavigation';
import MobileMenuSheet from './header/MobileMenuSheet';
import HeaderActions from './header/HeaderActions';
import MobileMenuToggle from './header/MobileMenuToggle';
import { getNavigationItems } from './header/navigationConfig';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';

export interface HeaderProps {
  variant?: 'dark' | 'light';
  forceScrolled?: boolean;
}

const Header = ({ variant = 'dark', forceScrolled = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const currentLanguage = useCurrentLanguage();
  const navItems = getNavigationItems(currentLanguage === 'en' ? undefined : currentLanguage);
  const isLightVariant = variant === 'light';

  // Treat header as scrolled when mega menu is open or when forced (e.g., video loading)
  const effectiveIsScrolled = isScrolled || isMegaMenuOpen || forceScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full transition-all duration-500 z-50 ${
          effectiveIsScrolled 
            ? 'bg-black shadow-sm' 
            : isLightVariant
              ? 'bg-white/95 backdrop-blur-sm'
              : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex-shrink-0">
              <HeaderLogo closeMobileMenu={() => setIsMenuOpen(false)} variant={variant} isScrolled={effectiveIsScrolled} />
            </div>
            
            <DesktopNavigation 
              navItems={navItems} 
              variant={variant} 
              isScrolled={effectiveIsScrolled}
              onMegaMenuChange={setIsMegaMenuOpen}
            />
            
            <div className="flex items-center">
              <HeaderActions variant={variant} isScrolled={effectiveIsScrolled} />
              <MobileMenuToggle 
                isMenuOpen={isMenuOpen}
                toggleMenu={() => setIsMenuOpen(true)} 
                variant={variant} 
                isScrolled={effectiveIsScrolled} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu as Sheet (portal-based, outside header stacking context) */}
      <MobileMenuSheet 
        isOpen={isMenuOpen} 
        onOpenChange={setIsMenuOpen} 
        navItems={navItems} 
      />
    </>
  );
};

export default Header;
