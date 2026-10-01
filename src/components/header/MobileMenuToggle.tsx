
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MobileMenuToggleProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  variant?: 'dark' | 'light';
  isScrolled?: boolean;
}

const MobileMenuToggle = ({ isMenuOpen, toggleMenu, variant = 'dark', isScrolled = false }: MobileMenuToggleProps) => {
  // Use dark styling when light variant AND not scrolled
  const isLightMode = variant === 'light' && !isScrolled;
  
  // Hide this toggle when menu is open (MobileNavigation has its own close button)
  if (isMenuOpen) {
    return null;
  }

  return (
    <Button 
      variant="ghost"
      size="icon"
      className={`lg:hidden relative z-[12002] p-2 rounded-full focus:ring-2 focus:ring-advisable-purple focus:outline-none ml-4 ${
        isLightMode 
          ? 'text-advisable-darkPurple bg-advisable-darkPurple/10' 
          : 'text-white bg-advisable-purple/20'
      }`} 
      onClick={toggleMenu} 
      aria-label="Open menu"
      aria-controls="mobile-navigation"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
};

export default MobileMenuToggle;
