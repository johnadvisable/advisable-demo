import { NavItem } from '@/types/nav';
import { buildNavigationUrl } from '@/utils/multilanguageUtils';

export const getNavigationItems = (currentLanguage?: string): NavItem[] => {
  return [
    {
      titleKey: "nav.about",
      href: '#',
      submenu: [
        {
          titleKey: "nav.aboutCompany",
          descriptionKey: "nav.aboutCompanyDesc",
          href: currentLanguage ? buildNavigationUrl('/about-company', currentLanguage) : '/about-company'
        },
        {
          titleKey: "nav.team",
          descriptionKey: "nav.teamDesc",
          href: currentLanguage ? buildNavigationUrl('/advisable-team', currentLanguage) : '/advisable-team'
        },
        {
          titleKey: "nav.careers",
          descriptionKey: "nav.careersDesc",
          href: currentLanguage ? buildNavigationUrl('/careers', currentLanguage) : '/careers'
        }
      ]
    },
    {
      titleKey: "nav.services",
      href: '#',
      submenu: [
        {
          titleKey: "nav.digitalAgency",
          descriptionKey: "nav.digitalAgencyDesc",
          href: currentLanguage ? buildNavigationUrl('/digital-agency', currentLanguage) : '/digital-agency'
        },
        {
          titleKey: "nav.ventureStudio",
          descriptionKey: "nav.ventureStudioDesc",
          href: currentLanguage ? buildNavigationUrl('/venture-studio', currentLanguage) : '/venture-studio'
        },
        {
          titleKey: "nav.technology",
          descriptionKey: "nav.technologyDesc",
          href: currentLanguage ? buildNavigationUrl('/technology', currentLanguage) : '/technology'
        },
        {
          titleKey: "nav.aiAutomations",
          descriptionKey: "nav.aiAutomationsDesc",
          href: currentLanguage ? buildNavigationUrl('/technology/ai-automations-and-ai-integrations', currentLanguage) : '/technology/ai-automations-and-ai-integrations'
        },
        {
          titleKey: "nav.customAiSolutions",
          descriptionKey: "nav.customAiSolutionsDesc",
          href: currentLanguage ? buildNavigationUrl('/technology/custom-ai-solutions-for-enterprises', currentLanguage) : '/technology/custom-ai-solutions-for-enterprises'
        },
        {
          titleKey: "nav.fractionalCaio",
          descriptionKey: "nav.fractionalCaioDesc",
          href: currentLanguage ? buildNavigationUrl('/technology/fractional-chief-ai-officer', currentLanguage) : '/technology/fractional-chief-ai-officer'
        },
        {
          titleKey: "nav.cloudInfraK8s",
          descriptionKey: "nav.cloudInfraK8sDesc",
          href: currentLanguage ? buildNavigationUrl('/technology/cloud-infrastructure-k8s', currentLanguage) : '/technology/cloud-infrastructure-k8s'
        },
        {
          titleKey: "nav.cyberSecurity",
          descriptionKey: "nav.cyberSecurityDesc",
          href: currentLanguage ? buildNavigationUrl('/cyber-security', currentLanguage) : '/cyber-security'
        },
        ...[
          ['Penetration Testing', 'penetration-testing'],
          ['Red Teaming', 'red-teaming'],
          ['Vulnerability Assessment', 'vulnerability-assessment'],
          ['Digital Forensics & Incident Response', 'digital-forensics-and-incident-response'],
          ['Compromise Assessment', 'compromise-assessment'],
          ['Threat Intelligence', 'threat-intelligence'],
          ['Incident Response Retainer', 'incident-response-retainer'],
          ['Configuration Review', 'configuration-review'],
          ['Cybersecurity Consulting', 'cybersecurity-consulting'],
          ['GRC', 'grc'],
          ['vCISO', 'vciso'],
          ['Social Engineering', 'social-engineering'],
        ].map(([title, slug]) => ({
          titleKey: title,
          href: currentLanguage ? buildNavigationUrl(`/cyber-security/${slug}`, currentLanguage) : `/cyber-security/${slug}`
        }))
      ]
    },
    {
      titleKey: "nav.products",
      href: currentLanguage ? buildNavigationUrl('/products', currentLanguage) : '/products',
      submenu: [
        {
          titleKey: "nav.ecommercen",
          descriptionKey: "nav.ecommercenDesc",
          href: currentLanguage ? buildNavigationUrl('/products/ecommercen', currentLanguage) : '/products/ecommercen'
        },
        {
          titleKey: "nav.marketData",
          descriptionKey: "nav.marketDataDesc",
          href: currentLanguage ? buildNavigationUrl('/product/sizethemarket', currentLanguage) : '/product/sizethemarket'
        },
        {
          titleKey: "nav.aiRecommendations",
          descriptionKey: "nav.aiRecommendationsDesc",
          href: currentLanguage ? buildNavigationUrl('/product/ai-recommendations', currentLanguage) : '/product/ai-recommendations'
        },
        {
          titleKey: "nav.esyntagi",
          descriptionKey: "nav.esyntagiDesc",
          href: currentLanguage ? buildNavigationUrl('/products/e-prescription-cloud-erp', currentLanguage) : '/products/e-prescription-cloud-erp'
        },
        {
          titleKey: "nav.findloom",
          descriptionKey: "nav.findloomDesc",
          href: currentLanguage ? buildNavigationUrl('/product/findloom', currentLanguage) : '/product/findloom'
        }
      ]
    },
    {
      titleKey: "nav.academy",
      href: currentLanguage ? buildNavigationUrl('/academy', currentLanguage) : '/academy',
    },
    {
      titleKey: "nav.clients",
      href: currentLanguage ? buildNavigationUrl('/our-clients', currentLanguage) : '/our-clients',
    },
    {
      titleKey: "nav.partnersIntegrations",
      href: currentLanguage ? buildNavigationUrl('/partners-and-integrations', currentLanguage) : '/partners-and-integrations',
    },
    {
      titleKey: "nav.insights",
      href: currentLanguage ? buildNavigationUrl('/blog', currentLanguage) : '/blog',
    },
    {
      titleKey: "nav.contact",
      href: currentLanguage ? buildNavigationUrl('/contact', currentLanguage) : '/contact',
    },
  ];
};
