import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetOverlay, SheetPortal } from '@/components/ui/sheet';
import { NavItem } from '@/types/nav';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { useHierarchicalServices } from '@/hooks/useHierarchicalServices';
import { groupServices } from '@/utils/serviceGroups';

interface MobileMenuSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: NavItem[];
}

// Build URL with language prefix
const buildNavigationUrl = (href: string, language: string): string => {
  if (!href) return '#';
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  
  const cleanHref = href.startsWith('/') ? href : `/${href}`;
  
  if (language === 'en') return cleanHref;
  return `/${language}${cleanHref}`;
};

const SERVICE_GROUPS: { slug: string; titleKey: string }[] = [
  { slug: 'digital-agency', titleKey: 'nav.digitalAgency' },
  { slug: 'venture-studio', titleKey: 'nav.ventureStudio' },
  { slug: 'technology', titleKey: 'nav.technology' },
  { slug: 'cyber-security', titleKey: 'nav.cyberSecurity' },
];

const ServicesGroup = ({
  slug,
  titleKey,
  currentLanguage,
  onLinkClick,
}: {
  slug: string;
  titleKey: string;
  currentLanguage: string;
  onLinkClick: () => void;
}) => {
  const { t } = useTranslation('shared');
  const [expanded, setExpanded] = useState(false);
  const { data } = useHierarchicalServices(slug, currentLanguage);
  const parents = data?.parents ?? [];

  return (
    <li className="border-b border-white/10">
      <div className="flex items-center">
        <Link
          to={buildNavigationUrl(`/${slug}`, currentLanguage)}
          onClick={onLinkClick}
          className="flex-1 px-6 py-4 text-white/90 hover:text-white transition-colors text-lg"
        >
          {t(titleKey)}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={t(titleKey)}
          className="px-6 py-4 text-white/50 hover:text-white transition-colors"
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {expanded && parents.length > 0 && (
        <ul className="pb-2">
          {groupServices(slug, parents).map((group) => (
            <li key={group.label || 'other'}>
              {group.label && (
                <div className="pl-10 pr-6 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                  {group.label}
                </div>
              )}
              <ul>
                {group.items.map((parent) => (
                  <li key={parent.id}>
                    <Link
                      to={buildNavigationUrl(`/${slug}/${parent.slug}`, currentLanguage)}
                      onClick={onLinkClick}
                      className="block pl-10 pr-6 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {parent.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const MobileMenuSheet = ({ isOpen, onOpenChange, navItems }: MobileMenuSheetProps) => {
  const { t } = useTranslation('shared');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const currentLanguage = useCurrentLanguage();

  // Reset submenu when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setActiveSubmenu(null);
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  const handleSubmenuOpen = (titleKey: string) => {
    setActiveSubmenu(titleKey);
  };

  const handleSubmenuClose = () => {
    setActiveSubmenu(null);
  };

  // Find submenu items for active submenu
  const getSubmenuItems = () => {
    if (!activeSubmenu) return [];
    const parentItem = navItems.find(item => item.titleKey === activeSubmenu);
    return parentItem?.submenu || [];
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="bg-black/80 z-[99998]" />
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-md p-0 bg-[#1A1F2C] border-none z-[99999] flex flex-col"
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <span className="text-white font-medium text-lg">Menu</span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white transition-colors p-2 -mr-2"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content area with scroll */}
          <div className="flex-1 overflow-y-auto">
            {/* Main menu view */}
            <nav 
              className={`transition-all duration-300 ${
                activeSubmenu ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'
              }`}
              aria-hidden={!!activeSubmenu}
            >
              <ul className="py-4">
                {navItems.map((item) => (
                  <li key={item.titleKey}>
                    {item.submenu && item.submenu.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleSubmenuOpen(item.titleKey)}
                        className="flex items-center justify-between w-full px-6 py-4 text-white/90 hover:text-white hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="text-lg">{t(item.titleKey)}</span>
                        <ChevronRight className="h-5 w-5 text-white/50" />
                      </button>
                    ) : (
                      <Link
                        to={buildNavigationUrl(item.href || '#', currentLanguage)}
                        onClick={handleLinkClick}
                        className="flex items-center w-full px-6 py-4 text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="text-lg">{t(item.titleKey)}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Submenu view */}
            <nav 
              className={`transition-all duration-300 ${
                activeSubmenu ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
              }`}
              aria-hidden={!activeSubmenu}
            >
              {/* Back button */}
              <button
                type="button"
                onClick={handleSubmenuClose}
                className="flex items-center gap-2 w-full px-6 py-4 text-white/70 hover:text-white hover:bg-white/5 transition-colors border-b border-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>

              {/* Submenu title */}
              <div className="px-6 py-3 text-white/50 text-sm uppercase tracking-wider">
                {activeSubmenu ? t(activeSubmenu) : ''}
              </div>

              {/* Submenu items */}
              {activeSubmenu === 'nav.services' ? (
                <ul>
                  {SERVICE_GROUPS.map((group) => (
                    <ServicesGroup
                      key={group.slug}
                      slug={group.slug}
                      titleKey={group.titleKey}
                      currentLanguage={currentLanguage}
                      onLinkClick={handleLinkClick}
                    />
                  ))}
                </ul>
              ) : (
              <ul>
                {getSubmenuItems().map((subItem) => (
                  <li key={subItem.titleKey}>
                    <Link
                      to={buildNavigationUrl(subItem.href || '#', currentLanguage)}
                      onClick={handleLinkClick}
                      className="block px-6 py-4 text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <span className="text-lg">{t(subItem.titleKey)}</span>
                      {subItem.descriptionKey && (
                        <p className="text-white/50 text-sm mt-1">{t(subItem.descriptionKey)}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              )}
            </nav>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
};

export default MobileMenuSheet;
