import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

type CompanyFact = {
  id: string;
  key: string;
  value: string;
  icon_name: string;
  display_order: number;
  label: string;
  description: string;
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Calendar':
      return Calendar;
    case 'Users':
      return Users;
    case 'Award':
      return Award;
    default:
      return Award;
  }
};

const CompanyFactsSection = () => {
  const { currentLanguage } = useLanguage();
  
  const { data: companyFacts, isLoading } = useQuery({
    queryKey: ["company-facts", currentLanguage],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_company_facts_with_translation', {
        p_language_code: currentLanguage
      });

      if (error) {
        console.error("Error fetching company facts:", error);
        throw new Error(error.message);
      }

      return data as CompanyFact[];
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-advisable-darkPurple text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Company Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-600 animate-pulse mb-4"></div>
                <div className="h-6 bg-gray-600 animate-pulse mb-2 rounded"></div>
                <div className="h-8 bg-gray-600 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-advisable-darkPurple text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Company Facts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companyFacts?.map((fact, index) => {
            const IconComponent = getIconComponent(fact.icon_name);
            const bgColor = index % 2 === 0 ? 'bg-advisable-blue' : 'bg-advisable-purple';
            const textColor = index % 2 === 0 ? 'text-advisable-purple' : 'text-advisable-blue';
            
            return (
              <div key={fact.id} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${bgColor} flex items-center justify-center mb-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{fact.label}</h3>
                <p className={`text-3xl font-bold ${textColor}`}>{fact.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompanyFactsSection;