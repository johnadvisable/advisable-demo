import { Facebook, Instagram, Linkedin, MapPin, Twitter } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('shared');

  return (
    <footer className="bg-secondary/50 border-t border-border/50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company info */}
          <div>
            <img 
              src="/files-uploads/advisableLogo.png" 
              alt="Advisable" 
              className="h-8 w-auto mb-6 invert"
            />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t('footer.companyDescription')}
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/company/advisablecom" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" 
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://www.facebook.com/advisablecom" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" 
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://www.instagram.com/advisable_com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" 
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@advisable.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" 
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a 
                href="https://x.com/advisablecom" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" 
                aria-label="X"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Offices */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">{t('footer.ourOffices')}</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground text-sm flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-primary" /> {t('footer.headquarters')}
                </p>
                <p className="text-muted-foreground text-sm pl-6">{t('footer.address.headquarters.line1')}</p>
                <p className="text-muted-foreground text-sm pl-6">{t('footer.address.headquarters.line2')}</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-primary" /> {t('footer.subdepartment')}
                </p>
                <p className="text-muted-foreground text-sm pl-6">{t('footer.address.subdepartment.line1')}</p>
                <p className="text-muted-foreground text-sm pl-6">{t('footer.address.subdepartment.line2')}</p>
              </div>
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                {t('footer.phone')} 
                <a href="tel:+302103000217" className="text-foreground hover:text-primary transition-colors ml-1">
                  +30 210 3000 217
                </a>
              </p>
              <p className="text-muted-foreground text-sm">
                {t('footer.email')} 
                <a href="mailto:info@advisable.com" className="text-foreground hover:text-primary transition-colors ml-1">
                  info@advisable.com
                </a>
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">{t('footer.navigation')}</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{t('footer.aboutUs')}</a></li>
              <li><a href="#services" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{t('footer.services')}</a></li>
              <li><a href="#products" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{t('footer.products')}</a></li>
              <li><a href="#clients" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{t('footer.clientsProjects')}</a></li>
              <li><Link to="/insights" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{t('nav.insights')}</Link></li>
              <li><Link to="/careers" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{t('nav.careers')}</Link></li>
              <li><a href="#contact" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">{t('footer.copyright')}</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy-policy" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                {t('footer.termsOfService')}
              </Link>
              <Link to="/cookie-policy" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                {t('footer.cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
