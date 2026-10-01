import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';

/** Minimal footer for Cybersecurity landing pages. */
const CyberFooter = () => {
  const currentLanguage = useCurrentLanguage();

  return (
    <footer className="bg-black border-t border-white/10 py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          to={buildNavigationUrl('/', currentLanguage)}
          className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to advisable.com
        </Link>

        <div className="flex items-center gap-6 text-sm text-white/70">
          <Link to={buildNavigationUrl('/cyber-security', currentLanguage)} className="hover:text-white transition-colors">
            Cybersecurity
          </Link>
          <Link to={buildNavigationUrl('/cyber-security/contact', currentLanguage)} className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Advisable
        </p>
      </div>
    </footer>
  );
};

export default CyberFooter;
