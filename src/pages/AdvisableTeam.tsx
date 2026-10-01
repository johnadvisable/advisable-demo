import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/context/LanguageContext';
import { getAllTeamMembers } from '@/services/teamMemberService';
import { useTranslation } from "react-i18next";
import SEOWrapper from "@/components/SEO/SEOWrapper";

const AdvisableTeam = () => {
  const { t } = useTranslation('advisableteam');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    currentLanguage
  } = useLanguage();
  const {
    data: teamMembers,
    isLoading
  } = useQuery({
    queryKey: ["team-members", currentLanguage],
    queryFn: () => getAllTeamMembers(currentLanguage),
    staleTime: 5 * 60 * 1000,
    // Cache for 5 minutes
    gcTime: 10 * 60 * 1000 // Keep in memory for 10 minutes
  });
  const leadershipTeam = teamMembers?.filter(member => member.is_leadership) || [];
  const otherTeamMembers = teamMembers?.filter(member => !member.is_leadership) || [];
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-advisable-darkPurple text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>;
  }
  return (
    <SEOWrapper
      title="Advisable Team - Advisable"
      description="Meet our expert team of digital transformation consultants, developers, and technology specialists committed to driving innovation."
      keywords="advisable team, digital transformation experts, technology consultants, innovation team"
      type="website"
    >
      <div className="min-h-screen">
      <Header variant="light" />
      
      <main className="pt-20">
        
        {/* Leadership Team */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4 text-center text-advisable-darkPurple">{t('leadership.title')}</h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              {t('leadership.description')}
            </p>
            
            <div className={`grid grid-cols-1 gap-10 ${leadershipTeam.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
              {leadershipTeam.map(member => <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                  <div className="aspect-square overflow-hidden">
                    <img src={member.image_url || "https://via.placeholder.com/400x500?text=Team+Member"} alt={member.name} className="w-full h-full object-cover object-center" />
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-1 text-advisable-darkPurple">{member.name}</h3>
                    <p className="text-advisable-blue font-medium mb-3">{member.job_position}</p>
                    
                    
                    
                    <p className="text-gray-700 mb-6">{member.bio}</p>
                    
                    {member.specializations && member.specializations.length > 0 && <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-500 mb-2">{t('member.specializations')}</p>
                        <div className="flex flex-wrap gap-2">
                          {member.specializations.map((specialization, index) => <Badge key={index} variant="outline" className="bg-advisable-lightGray">
                              {specialization}
                            </Badge>)}
                        </div>
                      </div>}
                    
                    {/* SECURITY: All personal social media removed for maximum employee privacy protection */}
                    {/* No employee contact information displayed to prevent phishing and targeted attacks */}
                  </div>
                </div>)}
            </div>
          </div>
        </section>
        
        {/* Other Team Members */}
        <section className="py-20 bg-advisable-lightGray">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4 text-center text-advisable-darkPurple">{t('experts.title')}</h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              {t('experts.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherTeamMembers.map(member => <div key={member.id} className="bg-white rounded-lg shadow p-6 flex items-start gap-4 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <img src={member.image_url || "https://via.placeholder.com/80x80?text=TM"} alt={member.name} className="w-full h-full object-cover object-center" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-advisable-darkPurple">{member.name}</h3>
                    <p className="text-advisable-blue font-medium mb-2">{member.job_position}</p>
                    
                    {member.specializations && member.specializations.length > 0 && <div className="mb-3">
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.specializations.slice(0, 2).map((specialization, index) => <Badge key={index} variant="outline" className="text-xs bg-advisable-lightGray">
                              {specialization}
                            </Badge>)}
                          {member.specializations.length > 2 && <Badge variant="outline" className="text-xs">+{member.specializations.length - 2}</Badge>}
                        </div>
                      </div>}
                    
                    {/* SECURITY: All personal social media removed for maximum employee privacy protection */}
                    {/* No employee contact information displayed to prevent phishing and targeted attacks */}
                  </div>
                </div>)}
            </div>
          </div>
        </section>
        
        {/* Achievements and Culture Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-advisable-darkPurple">{t('culture.title')}</h2>
                <p className="text-gray-700 mb-6">
                  {t('culture.description1')}
                </p>
                <p className="text-gray-700">
                  {t('culture.description2')}
                </p>
              </div>
              
              <div className="bg-advisable-lightGray p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-advisable-darkPurple">{t('achievements.title')}</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-advisable-blue flex items-center justify-center mr-3 mt-1">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700">{t('achievements.items.0')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-advisable-blue flex items-center justify-center mr-3 mt-1">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700">{t('achievements.items.1')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-advisable-blue flex items-center justify-center mr-3 mt-1">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700">{t('achievements.items.2')}</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-advisable-blue flex items-center justify-center mr-3 mt-1">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700">{t('achievements.items.3')}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Our Team CTA */}
        <section className="py-16 bg-advisable-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('joinTeam.title')}</h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t('joinTeam.description')}
            </p>
            <Button variant="secondary" size="lg" onClick={() => window.open("https://www.linkedin.com/company/advisablecom/jobs/", "_blank")} className="bg-white text-advisable-blue hover:bg-gray-100">
              {t('joinTeam.button')}
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      </div>
    </SEOWrapper>
  );
};
export default AdvisableTeam;