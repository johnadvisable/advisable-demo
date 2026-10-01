import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Menu, X, Shield } from 'lucide-react';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { useHierarchicalServices } from '@/hooks/useHierarchicalServices';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';
import { groupCyberServices } from '@/utils/serviceGroups';

/**
 * Minimal header for Cybersecurity landing pages.
 * Shows only a "Back to advisable.com" link and the Cybersecurity services menu.
 */
const CyberHeader = () => {
  const currentLanguage = useCurrentLanguage();
  const { data: hierarchical } = useHierarchicalServices('cyber-security', currentLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const services = Array.isArray(hierarchical) ? [] : (hierarchical?.parents ?? []);
  const categoryUrl = buildNavigationUrl('/cyber-security', currentLanguage);
  const homeUrl = buildNavigationUrl('/', currentLanguage);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link
            to={homeUrl}
            className="inline-flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors"
          >
            <img
              src="/files-uploads/advisableLogo.png"
              alt="Advisable"
              className="h-8 w-auto brightness-0 invert"
            />
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to advisable.com</span>
            </span>
          </Link>

          {/* Desktop menu */}
          <div
            className="hidden md:block relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <Link
              to={categoryUrl}
              className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors py-4"
            >
              <Shield className="w-4 h-4" />
              Cybersecurity
              <ChevronDown className="w-4 h-4" />
            </Link>

            {isOpen && services.length > 0 && (
              <div className="absolute right-0 top-full w-72 max-h-[70vh] overflow-y-auto rounded-xl border border-white/10 bg-black/95 backdrop-blur-md p-2 shadow-2xl">
                {groupCyberServices(services as any[]).map((group) => (
                  <div key={group.label || 'other'} className="mb-1">
                    {group.label && (
                      <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        {group.label}
                      </div>
                    )}
                    {group.items.map((service: any) => (
                      <Link
                        key={service.id}
                        to={buildNavigationUrl(`/cyber-security/${service.slug}`, currentLanguage)}
                        className="block px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Cybersecurity menu"
            onClick={() => setIsMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center gap-2 text-sm font-medium text-white"
          >
            <Shield className="w-4 h-4" />
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 max-h-[70vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link
              to={categoryUrl}
              onClick={() => setIsMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10"
            >
              Cybersecurity
            </Link>
            {groupCyberServices(services as any[]).map((group) => (
              <div key={group.label || 'other'}>
                {group.label && (
                  <div className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                    {group.label}
                  </div>
                )}
                {group.items.map((service: any) => (
                  <Link
                    key={service.id}
                    to={buildNavigationUrl(`/cyber-security/${service.slug}`, currentLanguage)}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default CyberHeader;
