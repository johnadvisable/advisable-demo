
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import digitalAgencyBg from "@/assets/digital-agency-bg.jpg";

// Use public path for venture studio
const ventureStudioBg = "/images/services/venture-studio.jpg";
const technologyBg = "/images/services/technology.jpg";
const cyberSecurityBg = "/images/services/cyber-security.jpg";
import { fetchCompanyInfo } from "@/services/companyInfoService";
import { getAllTeamMembers } from "@/services/teamMemberService";
import { getAllCredentials } from "@/services/credentialService";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";


const CompanyPresentation = () => {
  const { t } = useTranslation('index');
  const { currentLanguage } = useLanguage();
  
  const { data: companyInfo } = useQuery({
    queryKey: ["company-info", currentLanguage],
    queryFn: () => fetchCompanyInfo(currentLanguage)
  });
  
  const { data: credentials = [] } = useQuery({
    queryKey: ["credentials-preview", currentLanguage],
    queryFn: () => getAllCredentials(currentLanguage)
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members-preview", "en"],
    queryFn: () => getAllTeamMembers("en")
  });

  // Get first 5 leadership members + first 3 experts (non-leadership)
  const leaders = teamMembers?.filter(m => m.is_leadership).slice(0, 5) || [];
  const experts = teamMembers?.filter(m => !m.is_leadership).slice(0, 3) || [];
  const displayMembers = [...leaders, ...experts];

  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');
  
  return (
    <section id="about-us" className="apple-section bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="apple-section-title text-foreground">
            {t('company.title').split('.').map((part, index, arr) => (
              <span key={index}>
                {part}{index < arr.length - 1 && '.'}{index === 0 && <br />}
              </span>
            ))}
          </h2>
          <p className="apple-section-subtitle">
            {t('company.ventureStudio.description')}
          </p>
        </div>
        
        {/* Two Column Layout - Mission/Vision with Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-w-5xl mx-auto">
          {/* Left Column - Mission/Vision Content */}
          <div className="space-y-8">
            {/* Mission/Vision Tabs */}
            <div className="space-y-4">
              <div className="inline-flex bg-secondary rounded-full p-1">
                <button 
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === 'mission' 
                      ? 'bg-foreground text-background' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`} 
                  onClick={() => setActiveTab('mission')}
                >
                  {t('company.missionTab')}
                </button>
                <button 
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === 'vision' 
                      ? 'bg-foreground text-background' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`} 
                  onClick={() => setActiveTab('vision')}
                >
                  {t('company.visionTab')}
                </button>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {activeTab === 'mission' 
                  ? (companyInfo?.mission || t('company.mission'))
                  : (companyInfo?.vision || t('company.vision'))
                }
              </p>
            </div>
            
            {/* CTA */}
            <Link 
              to="/about-company"
              className="apple-button-link text-lg group"
            >
              {t('companyPresentation.learnMore')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            {/* Team Members Preview */}
            {displayMembers.length > 0 && (
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {displayMembers.map((member, index) => (
                    <div 
                      key={member.id}
                      className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-secondary"
                      style={{ zIndex: displayMembers.length - index }}
                    >
                      {member.image_url ? (
                        <img 
                          src={member.image_url} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                          {member.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Link 
                  to="/advisable-team"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {t('companyPresentation.viewTeam', 'View Team')}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
          
          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-secondary to-secondary/50 rounded-3xl p-12 overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              
              <div className="relative text-center py-12">
                <div className="flex items-center justify-center mb-8">
                  <img 
                    src="/images/advisable-vertical.png" 
                    alt={t('companyPresentation.logoAlt')} 
                    className="h-56 w-auto object-contain"
                  />
                </div>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                  {t('companyPresentation.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Cards Row - Below Mission/Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16 lg:mt-24">
          <Link 
            to="/venture-studio"
            className="relative rounded-3xl p-8 md:p-10 min-h-[280px] flex flex-col justify-between overflow-hidden group block"
            style={{ backgroundImage: `url(${ventureStudioBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 rounded-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">{t('company.ventureStudio.title')}</h3>
              <p className="text-white/80 text-base leading-relaxed">
                {t('company.ventureStudio.description')}
              </p>
            </div>
            <div className="relative z-10 mt-4">
              <span className="inline-flex items-center text-white font-medium group-hover:underline">
                {t('companyPresentation.details', 'Details')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
          
          <Link 
            to="/digital-agency"
            className="relative rounded-3xl p-8 md:p-10 min-h-[280px] flex flex-col justify-between overflow-hidden group block"
            style={{ backgroundImage: `url(${digitalAgencyBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 rounded-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">{t('company.digitalAgency.title')}</h3>
              <p className="text-white/80 text-base leading-relaxed">
                {t('company.digitalAgency.description')}
              </p>
            </div>
            <div className="relative z-10 mt-4">
              <span className="inline-flex items-center text-white font-medium group-hover:underline">
                {t('companyPresentation.details', 'Details')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link 
            to="/technology"
            className="relative rounded-3xl p-8 md:p-10 min-h-[280px] flex flex-col justify-between overflow-hidden group block"
            style={{ backgroundImage: `url(${technologyBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 rounded-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">{t('company.technology.title')}</h3>
              <p className="text-white/80 text-base leading-relaxed">
                {t('company.technology.description')}
              </p>
            </div>
            <div className="relative z-10 mt-4">
              <span className="inline-flex items-center text-white font-medium group-hover:underline">
                {t('companyPresentation.details', 'Details')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link 
            to="/cyber-security"
            className="relative rounded-3xl p-8 md:p-10 min-h-[280px] flex flex-col justify-between overflow-hidden group block"
            style={{ backgroundImage: `url(${cyberSecurityBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 rounded-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">{t('company.cyberSecurity.title')}</h3>
              <p className="text-white/80 text-base leading-relaxed">
                {t('company.cyberSecurity.description')}
              </p>
            </div>
            <div className="relative z-10 mt-4">
              <span className="inline-flex items-center text-white font-medium group-hover:underline">
                {t('companyPresentation.details', 'Details')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
        
        
        {/* Certifications & Awards Section */}
        {credentials.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16 lg:mt-24">
            {/* Section Header */}
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Certifications & Awards
              </span>
              <h3 className="apple-section-title text-foreground">
                {t('credentials.title', 'Credentials, not claims!')}
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
                {t('credentials.subtitle', 'External recognition that reflects our standards in paid media, strategy, and execution.')}
              </p>
            </div>
            
            {/* Credentials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {credentials.slice(0, 4).map((credential) => (
                <div 
                  key={credential.id} 
                  className="group apple-card bg-card border border-border/50 flex flex-row items-center gap-6"
                >
                  {/* Logo - NO background */}
                  <div className="flex-shrink-0 w-[120px] h-[120px] flex items-center justify-center">
                    {credential.image_url ? (
                      <img
                        src={credential.image_url}
                        alt={credential.title}
                        width={120}
                        height={120}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        style={{ backgroundColor: 'transparent' }}
                      />
                    ) : (
                      <Award className="w-14 h-14 text-primary" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {credential.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {credential.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyPresentation;
