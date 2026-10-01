// SEO configuration for all pages and routes
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  type?: 'website' | 'article' | 'product';
  generateTitle?: (params?: any) => string;
  generateDescription?: (params?: any) => string;
  image_url?: string;
}

export const seoConfig: Record<string, SEOConfig> = {
  // ====================================
  // HOMEPAGE - ALL LANGUAGES
  // ====================================
  '/': {
    title: 'Advisable | Rule the AI-first world.',
    description: 'Leading digital transformation consultancy providing innovative technology solutions, AI recommendations, e-commerce platforms, and market data analytics to drive business growth.',
    keywords: 'digital transformation, technology consulting, AI solutions, e-commerce development, market data, business analytics, software development',
    type: 'website'
  },
  '/en': {
    title: 'Advisable | Rule the AI-first world.',
    description: 'Leading digital transformation consultancy providing innovative technology solutions, AI recommendations, e-commerce platforms, and market data analytics to drive business growth.',
    keywords: 'digital transformation, technology consulting, AI solutions, e-commerce development, market data, business analytics, software development',
    type: 'website'
  },
  '/de': {
    title: 'Advisable | Rule the AI-first world.',
    description: 'Führende Beratung für digitale Transformation, die innovative Technologielösungen, KI-Empfehlungen, E-Commerce-Plattformen und Marktdatenanalysen bietet.',
    keywords: 'digitale Transformation, Technologieberatung, KI-Lösungen, E-Commerce-Entwicklung, Marktdaten, Business Analytics',
    type: 'website'
  },
  '/el': {
    title: 'Advisable | Rule the AI-first world.',
    description: 'Ηγέτης στην ψηφιακή μετασχηματισμό που παρέχει καινοτόμες τεχνολογικές λύσεις, συστάσεις AI, πλατφόρμες e-commerce και αναλύσεις δεδομένων αγοράς.',
    keywords: 'ψηφιακός μετασχηματισμός, συμβουλευτική τεχνολογίας, λύσεις AI, ανάπτυξη e-commerce, δεδομένα αγοράς',
    type: 'website'
  },
  '/es': {
    title: 'Advisable | Rule the AI-first world.',
    description: 'Consultoría líder en transformación digital que ofrece soluciones tecnológicas innovadoras, recomendaciones de IA, plataformas de comercio electrónico y análisis de datos de mercado.',
    keywords: 'transformación digital, consultoría tecnológica, soluciones de IA, desarrollo de e-commerce, datos de mercado',
    type: 'website'
  },
  '/fr': {
    title: 'Advisable | Rule the AI-first world.',
    description: 'Cabinet de conseil leader en transformation numérique proposant des solutions technologiques innovantes, des recommandations IA, des plateformes e-commerce et des analyses de données de marché.',
    keywords: 'transformation numérique, conseil technologique, solutions IA, développement e-commerce, données de marché',
    type: 'website'
  },

  // ====================================
  // SERVICE CATEGORY PAGES
  // ====================================
  
  // Digital Agency
  '/services/digital-agency': { title: 'Digital Agency Services - Advisable', description: 'Full-service digital agency solutions including web development, mobile apps, and performance marketing to transform your business.', keywords: 'digital agency, web development, mobile apps, performance marketing, digital services', type: 'website' },
  '/en/services/digital-agency': { title: 'Digital Agency Services - Advisable', description: 'Full-service digital agency solutions including web development, mobile apps, and performance marketing.', keywords: 'digital agency, web development, mobile apps', type: 'website' },
  '/de/services/digital-agency': { title: 'Digital Agency Dienstleistungen - Advisable', description: 'Full-Service-Digital-Agency-Lösungen einschließlich Webentwicklung, mobiler Apps und Performance-Marketing.', keywords: 'Digitalagentur, Webentwicklung', type: 'website' },
  '/el/services/digital-agency': { title: 'Υπηρεσίες Ψηφιακής Πρακτορείου - Advisable', description: 'Ολοκληρωμένες λύσεις ψηφιακού πρακτορείου που περιλαμβάνουν ανάπτυξη ιστού, εφαρμογές κινητών και μάρκετινγκ απόδοσης.', keywords: 'ψηφιακό πρακτορείο', type: 'website' },
  '/es/services/digital-agency': { title: 'Servicios de Agencia Digital - Advisable', description: 'Soluciones completas de agencia digital que incluyen desarrollo web, aplicaciones móviles y marketing de rendimiento.', keywords: 'agencia digital', type: 'website' },
  '/fr/services/digital-agency': { title: 'Services d\'Agence Numérique - Advisable', description: 'Solutions complètes d\'agence numérique comprenant le développement web, les applications mobiles et le marketing de performance.', keywords: 'agence numérique', type: 'website' },

  // Venture Studio
  '/services/venture-studio': { title: 'Venture Studio Services - Advisable', description: 'Venture studio and startup incubation services to launch and scale innovative businesses with expert guidance and resources.', keywords: 'venture studio, startup incubation, business launch, innovation, entrepreneurship', type: 'website' },
  '/en/services/venture-studio': { title: 'Venture Studio Services - Advisable', description: 'Venture studio and startup incubation services to launch and scale innovative businesses.', keywords: 'venture studio, startup incubation', type: 'website' },
  '/de/services/venture-studio': { title: 'Venture Studio Dienstleistungen - Advisable', description: 'Venture Studio und Startup-Inkubationsdienste zum Start und zur Skalierung innovativer Unternehmen.', keywords: 'Venture Studio', type: 'website' },
  '/el/services/venture-studio': { title: 'Υπηρεσίες Venture Studio - Advisable', description: 'Υπηρεσίες venture studio και επωαστήρα νεοφυών επιχειρήσεων για την εκκίνηση και επέκταση καινοτόμων επιχειρήσεων.', keywords: 'venture studio', type: 'website' },
  '/es/services/venture-studio': { title: 'Servicios de Venture Studio - Advisable', description: 'Servicios de venture studio e incubación de startups para lanzar y escalar negocios innovadores.', keywords: 'venture studio', type: 'website' },
  '/fr/services/venture-studio': { title: 'Services de Venture Studio - Advisable', description: 'Services de venture studio et d\'incubation de startups pour lancer et développer des entreprises innovantes.', keywords: 'venture studio', type: 'website' },

  // ====================================
  // DIGITAL AGENCY SERVICE DETAIL PAGES
  // ====================================
  
  // Brand Strategy
  '/services/digital-agency/brand-strategy': { title: 'Brand Strategy Services - Advisable', description: 'Professional brand strategy services tailored to your business needs.', keywords: 'brand strategy, branding, brand development, corporate identity', type: 'website' },
  '/en/services/digital-agency/brand-strategy': { title: 'Brand Strategy - Advisable', description: 'Professional brand strategy services tailored to your business needs.', keywords: 'brand strategy', type: 'website' },
  '/de/services/digital-agency/brand-strategy': { title: 'Markenstrategie - Advisable', description: 'Professionelle Markenstrategie-Dienstleistungen', keywords: 'Markenstrategie', type: 'website' },
  '/el/services/digital-agency/brand-strategy': { title: 'Στρατηγική Μάρκας - Advisable', description: 'Επαγγελματικές υπηρεσίες στρατηγικής μάρκας', keywords: 'στρατηγική μάρκας', type: 'website' },
  '/es/services/digital-agency/brand-strategy': { title: 'Estrategia de Marca - Advisable', description: 'Servicios profesionales de estrategia de marca', keywords: 'estrategia de marca', type: 'website' },
  '/fr/services/digital-agency/brand-strategy': { title: 'Stratégie de Marque - Advisable', description: 'Services professionnels de stratégie de marque', keywords: 'stratégie de marque', type: 'website' },
  
  // Content Creation
  '/services/digital-agency/content-creation': { title: 'Content Creation Services - Advisable', description: 'Professional content creation services tailored to your business needs.', keywords: 'content creation, content marketing, digital content', type: 'website' },
  '/en/services/digital-agency/content-creation': { title: 'Content Creation - Advisable', description: 'Professional content creation services.', keywords: 'content creation', type: 'website' },
  '/de/services/digital-agency/content-creation': { title: 'Content-Erstellung - Advisable', description: 'Professionelle Content-Erstellung', keywords: 'Content-Erstellung', type: 'website' },
  '/el/services/digital-agency/content-creation': { title: 'Δημιουργία Περιεχομένου - Advisable', description: 'Επαγγελματική δημιουργία περιεχομένου', keywords: 'δημιουργία περιεχομένου', type: 'website' },
  '/es/services/digital-agency/content-creation': { title: 'Creación de Contenido - Advisable', description: 'Creación profesional de contenido', keywords: 'creación de contenido', type: 'website' },
  '/fr/services/digital-agency/content-creation': { title: 'Création de Contenu - Advisable', description: 'Création professionnelle de contenu', keywords: 'création de contenu', type: 'website' },
  
  // Digital Marketing
  '/services/digital-agency/digital-marketing': { title: 'Digital Marketing Services - Advisable', description: 'Professional digital marketing services tailored to your business needs.', keywords: 'digital marketing, online marketing, internet marketing', type: 'website' },
  '/en/services/digital-agency/digital-marketing': { title: 'Digital Marketing - Advisable', description: 'Professional digital marketing services.', keywords: 'digital marketing', type: 'website' },
  '/de/services/digital-agency/digital-marketing': { title: 'Digitales Marketing - Advisable', description: 'Professionelles digitales Marketing', keywords: 'digitales Marketing', type: 'website' },
  '/el/services/digital-agency/digital-marketing': { title: 'Ψηφιακό Marketing - Advisable', description: 'Επαγγελματικές υπηρεσίες ψηφιακού marketing', keywords: 'ψηφιακό marketing', type: 'website' },
  '/es/services/digital-agency/digital-marketing': { title: 'Marketing Digital - Advisable', description: 'Servicios profesionales de marketing digital', keywords: 'marketing digital', type: 'website' },
  '/fr/services/digital-agency/digital-marketing': { title: 'Marketing Numérique - Advisable', description: 'Services professionnels de marketing numérique', keywords: 'marketing numérique', type: 'website' },
  
  // E-Commerce Solutions
  '/services/digital-agency/e-commerce-solutions': { title: 'E-Commerce Solutions - Advisable', description: 'Professional e-commerce solutions services tailored to your business needs.', keywords: 'ecommerce, online store, ecommerce platform', type: 'website' },
  '/en/services/digital-agency/e-commerce-solutions': { title: 'E-Commerce Solutions - Advisable', description: 'Professional e-commerce solutions.', keywords: 'ecommerce solutions', type: 'website' },
  '/de/services/digital-agency/e-commerce-solutions': { title: 'E-Commerce-Lösungen - Advisable', description: 'Professionelle E-Commerce-Lösungen', keywords: 'E-Commerce-Lösungen', type: 'website' },
  '/el/services/digital-agency/e-commerce-solutions': { title: 'Λύσεις E-Commerce - Advisable', description: 'Επαγγελματικές λύσεις e-commerce', keywords: 'λύσεις ecommerce', type: 'website' },
  '/es/services/digital-agency/e-commerce-solutions': { title: 'Soluciones E-Commerce - Advisable', description: 'Soluciones profesionales de comercio electrónico', keywords: 'soluciones ecommerce', type: 'website' },
  '/fr/services/digital-agency/e-commerce-solutions': { title: 'Solutions E-Commerce - Advisable', description: 'Solutions professionnelles e-commerce', keywords: 'solutions ecommerce', type: 'website' },
  
  // Email Marketing
  '/services/digital-agency/email-marketing': { title: 'Email Marketing Services - Advisable', description: 'Nurture leads and retain customers with personalized email marketing campaigns.', keywords: 'email marketing, email campaigns, newsletter marketing', type: 'website' },
  '/en/services/digital-agency/email-marketing': { title: 'Email Marketing - Advisable', description: 'Nurture leads and retain customers with personalized email campaigns.', keywords: 'email marketing', type: 'website' },
  '/de/services/digital-agency/email-marketing': { title: 'E-Mail-Marketing - Advisable', description: 'Professionelles E-Mail-Marketing', keywords: 'E-Mail-Marketing', type: 'website' },
  '/el/services/digital-agency/email-marketing': { title: 'Email Marketing - Advisable', description: 'Επαγγελματικό email marketing', keywords: 'email marketing', type: 'website' },
  '/es/services/digital-agency/email-marketing': { title: 'Marketing por Correo Electrónico - Advisable', description: 'Marketing profesional por correo electrónico', keywords: 'email marketing', type: 'website' },
  '/fr/services/digital-agency/email-marketing': { title: 'Marketing par E-mail - Advisable', description: 'Marketing professionnel par e-mail', keywords: 'email marketing', type: 'website' },
  
  // Google Ads Campaigns
  '/services/digital-agency/google-ads-campaigns': { title: 'Google Ads Campaigns - Advisable', description: 'Professional Google Ads campaign management services tailored to your business needs.', keywords: 'google ads, ppc, paid search, google advertising', type: 'website' },
  '/en/services/digital-agency/google-ads-campaigns': { title: 'Google Ads Campaigns - Advisable', description: 'Professional Google Ads campaign management.', keywords: 'google ads', type: 'website' },
  '/de/services/digital-agency/google-ads-campaigns': { title: 'Google Ads Kampagnen - Advisable', description: 'Professionelle Google Ads Kampagnen', keywords: 'Google Ads', type: 'website' },
  '/el/services/digital-agency/google-ads-campaigns': { title: 'Καμπάνιες Google Ads - Advisable', description: 'Επαγγελματικές καμπάνιες Google Ads', keywords: 'google ads', type: 'website' },
  '/es/services/digital-agency/google-ads-campaigns': { title: 'Campañas de Google Ads - Advisable', description: 'Campañas profesionales de Google Ads', keywords: 'google ads', type: 'website' },
  '/fr/services/digital-agency/google-ads-campaigns': { title: 'Campagnes Google Ads - Advisable', description: 'Campagnes professionnelles Google Ads', keywords: 'google ads', type: 'website' },
  
  // Marketing & Growth
  '/services/digital-agency/marketing-growth': { title: 'Marketing & Growth Services - Advisable', description: 'Comprehensive marketing strategies designed to scale your business and increase market share.', keywords: 'growth marketing, marketing strategy, business growth', type: 'website' },
  '/en/services/digital-agency/marketing-growth': { title: 'Marketing & Growth - Advisable', description: 'Comprehensive marketing strategies to scale your business.', keywords: 'marketing growth', type: 'website' },
  '/de/services/digital-agency/marketing-growth': { title: 'Marketing & Wachstum - Advisable', description: 'Umfassende Marketing-Strategien', keywords: 'Marketing Wachstum', type: 'website' },
  '/el/services/digital-agency/marketing-growth': { title: 'Marketing & Ανάπτυξη - Advisable', description: 'Ολοκληρωμένες στρατηγικές marketing', keywords: 'marketing ανάπτυξη', type: 'website' },
  '/es/services/digital-agency/marketing-growth': { title: 'Marketing y Crecimiento - Advisable', description: 'Estrategias integrales de marketing', keywords: 'marketing crecimiento', type: 'website' },
  '/fr/services/digital-agency/marketing-growth': { title: 'Marketing et Croissance - Advisable', description: 'Stratégies marketing complètes', keywords: 'marketing croissance', type: 'website' },
  
  // Meta Ads Campaigns
  '/services/digital-agency/meta-ads-campaigns': { title: 'Meta Ads Campaigns - Advisable', description: 'Professional Meta (Facebook & Instagram) advertising campaigns tailored to your business needs.', keywords: 'meta ads, facebook ads, instagram ads, social advertising', type: 'website' },
  '/en/services/digital-agency/meta-ads-campaigns': { title: 'Meta Ads Campaigns - Advisable', description: 'Professional Meta advertising campaigns.', keywords: 'meta ads', type: 'website' },
  '/de/services/digital-agency/meta-ads-campaigns': { title: 'Meta Ads Kampagnen - Advisable', description: 'Professionelle Meta Ads Kampagnen', keywords: 'Meta Ads', type: 'website' },
  '/el/services/digital-agency/meta-ads-campaigns': { title: 'Καμπάνιες Meta Ads - Advisable', description: 'Επαγγελματικές καμπάνιες Meta Ads', keywords: 'meta ads', type: 'website' },
  '/es/services/digital-agency/meta-ads-campaigns': { title: 'Campañas de Meta Ads - Advisable', description: 'Campañas profesionales de Meta Ads', keywords: 'meta ads', type: 'website' },
  '/fr/services/digital-agency/meta-ads-campaigns': { title: 'Campagnes Meta Ads - Advisable', description: 'Campagnes professionnelles Meta Ads', keywords: 'meta ads', type: 'website' },
  
  // Mobile App Development
  '/services/digital-agency/mobile-app-development': { title: 'Mobile App Development - Advisable', description: 'Develop native and cross-platform mobile applications for iOS and Android.', keywords: 'mobile app development, iOS, Android, native apps', type: 'website' },
  '/en/services/digital-agency/mobile-app-development': { title: 'Mobile App Development - Advisable', description: 'Develop native and cross-platform mobile applications for iOS and Android.', keywords: 'mobile app development', type: 'website' },
  '/de/services/digital-agency/mobile-app-development': { title: 'Mobile App Entwicklung - Advisable', description: 'Native und plattformübergreifende mobile Anwendungen', keywords: 'Mobile App Entwicklung', type: 'website' },
  '/el/services/digital-agency/mobile-app-development': { title: 'Ανάπτυξη Εφαρμογών Κινητών - Advisable', description: 'Εγγενείς και πολυ-πλατφόρμων εφαρμογές κινητών', keywords: 'ανάπτυξη εφαρμογών', type: 'website' },
  '/es/services/digital-agency/mobile-app-development': { title: 'Desarrollo de Aplicaciones Móviles - Advisable', description: 'Aplicaciones móviles nativas y multiplataforma', keywords: 'desarrollo móvil', type: 'website' },
  '/fr/services/digital-agency/mobile-app-development': { title: 'Développement d\'Applications Mobiles - Advisable', description: 'Applications mobiles natives et multiplateformes', keywords: 'développement mobile', type: 'website' },
  
  // Performance Marketing
  '/services/digital-agency/performance-marketing': { title: 'Performance Marketing - Advisable', description: 'Drive measurable results with data-driven marketing campaigns that maximize ROI and accelerate business growth.', keywords: 'performance marketing, ROI marketing, data-driven marketing', type: 'website' },
  '/en/services/digital-agency/performance-marketing': { title: 'Performance Marketing - Advisable', description: 'Drive measurable results with data-driven marketing campaigns.', keywords: 'performance marketing', type: 'website' },
  '/de/services/digital-agency/performance-marketing': { title: 'Performance Marketing - Advisable', description: 'Datengesteuerte Marketingkampagnen', keywords: 'Performance Marketing', type: 'website' },
  '/el/services/digital-agency/performance-marketing': { title: 'Performance Marketing - Advisable', description: 'Καμπάνιες marketing βασισμένες σε δεδομένα', keywords: 'performance marketing', type: 'website' },
  '/es/services/digital-agency/performance-marketing': { title: 'Marketing de Rendimiento - Advisable', description: 'Campañas de marketing basadas en datos', keywords: 'marketing de rendimiento', type: 'website' },
  '/fr/services/digital-agency/performance-marketing': { title: 'Marketing de Performance - Advisable', description: 'Campagnes marketing axées sur les données', keywords: 'marketing de performance', type: 'website' },
  
  // SEO Audit
  '/services/digital-agency/seo-audit': { title: 'SEO Audit Services - Advisable', description: 'Professional SEO audit services to identify and fix technical issues and improve search rankings.', keywords: 'seo audit, technical seo, seo analysis, search optimization', type: 'website' },
  '/en/services/digital-agency/seo-audit': { title: 'SEO Audit - Advisable', description: 'Professional SEO audit services.', keywords: 'seo audit', type: 'website' },
  '/de/services/digital-agency/seo-audit': { title: 'SEO-Audit - Advisable', description: 'Professionelle SEO-Audit-Dienstleistungen', keywords: 'SEO-Audit', type: 'website' },
  '/el/services/digital-agency/seo-audit': { title: 'Έλεγχος SEO - Advisable', description: 'Επαγγελματικός έλεγχος SEO', keywords: 'έλεγχος seo', type: 'website' },
  '/es/services/digital-agency/seo-audit': { title: 'Auditoría SEO - Advisable', description: 'Servicios profesionales de auditoría SEO', keywords: 'auditoría seo', type: 'website' },
  '/fr/services/digital-agency/seo-audit': { title: 'Audit SEO - Advisable', description: 'Services professionnels d\'audit SEO', keywords: 'audit seo', type: 'website' },
  
  // Social Media Management
  '/services/digital-agency/social-media-management': { title: 'Social Media Management - Advisable', description: 'Professional social media management services to build and engage your online community.', keywords: 'social media management, social media marketing, community management', type: 'website' },
  '/en/services/digital-agency/social-media-management': { title: 'Social Media Management - Advisable', description: 'Professional social media management services.', keywords: 'social media', type: 'website' },
  '/de/services/digital-agency/social-media-management': { title: 'Social Media Management - Advisable', description: 'Professionelles Social Media Management', keywords: 'Social Media Management', type: 'website' },
  '/el/services/digital-agency/social-media-management': { title: 'Διαχείριση Social Media - Advisable', description: 'Επαγγελματική διαχείριση social media', keywords: 'social media', type: 'website' },
  '/es/services/digital-agency/social-media-management': { title: 'Gestión de Redes Sociales - Advisable', description: 'Gestión profesional de redes sociales', keywords: 'redes sociales', type: 'website' },
  '/fr/services/digital-agency/social-media-management': { title: 'Gestion des Réseaux Sociaux - Advisable', description: 'Gestion professionnelle des réseaux sociaux', keywords: 'réseaux sociaux', type: 'website' },
  
  // TikTok Advertising
  '/services/digital-agency/tiktok-advertising': { title: 'TikTok Advertising - Advisable', description: 'Professional TikTok advertising services to reach and engage younger audiences.', keywords: 'tiktok ads, tiktok advertising, tiktok marketing, short-form video', type: 'website' },
  '/en/services/digital-agency/tiktok-advertising': { title: 'TikTok Advertising - Advisable', description: 'Professional TikTok advertising services.', keywords: 'tiktok advertising', type: 'website' },
  '/de/services/digital-agency/tiktok-advertising': { title: 'TikTok-Werbung - Advisable', description: 'Professionelle TikTok-Werbung', keywords: 'TikTok-Werbung', type: 'website' },
  '/el/services/digital-agency/tiktok-advertising': { title: 'Διαφήμιση TikTok - Advisable', description: 'Επαγγελματική διαφήμιση TikTok', keywords: 'διαφήμιση tiktok', type: 'website' },
  '/es/services/digital-agency/tiktok-advertising': { title: 'Publicidad en TikTok - Advisable', description: 'Publicidad profesional en TikTok', keywords: 'publicidad tiktok', type: 'website' },
  '/fr/services/digital-agency/tiktok-advertising': { title: 'Publicité TikTok - Advisable', description: 'Publicité professionnelle TikTok', keywords: 'publicité tiktok', type: 'website' },
  
  // UI/UX Design
  '/services/digital-agency/ui-ux-design': { title: 'UI/UX Design Services - Advisable', description: 'Design intuitive user interfaces and experiences that delight users and drive engagement.', keywords: 'ui design, ux design, user experience, user interface', type: 'website' },
  '/en/services/digital-agency/ui-ux-design': { title: 'UI/UX Design - Advisable', description: 'Design intuitive user interfaces and experiences.', keywords: 'ui ux design', type: 'website' },
  '/de/services/digital-agency/ui-ux-design': { title: 'UI/UX Design - Advisable', description: 'Intuitives UI/UX Design', keywords: 'UI UX Design', type: 'website' },
  '/el/services/digital-agency/ui-ux-design': { title: 'Σχεδιασμός UI/UX - Advisable', description: 'Σχεδιασμός διαισθητικών διεπαφών', keywords: 'σχεδιασμός ui ux', type: 'website' },
  '/es/services/digital-agency/ui-ux-design': { title: 'Diseño UI/UX - Advisable', description: 'Diseño de interfaces intuitivas', keywords: 'diseño ui ux', type: 'website' },
  '/fr/services/digital-agency/ui-ux-design': { title: 'Design UI/UX - Advisable', description: 'Conception d\'interfaces intuitives', keywords: 'design ui ux', type: 'website' },
  
  // Video Creation
  '/services/digital-agency/video-creation': { title: 'Video Creation Services - Advisable', description: 'Professional video creation services for marketing, branding, and storytelling.', keywords: 'video production, video marketing, video content, corporate video', type: 'website' },
  '/en/services/digital-agency/video-creation': { title: 'Video Creation - Advisable', description: 'Professional video creation services.', keywords: 'video creation', type: 'website' },
  '/de/services/digital-agency/video-creation': { title: 'Videoerstellung - Advisable', description: 'Professionelle Videoerstellung', keywords: 'Videoerstellung', type: 'website' },
  '/el/services/digital-agency/video-creation': { title: 'Δημιουργία Video - Advisable', description: 'Επαγγελματική δημιουργία video', keywords: 'δημιουργία video', type: 'website' },
  '/es/services/digital-agency/video-creation': { title: 'Creación de Video - Advisable', description: 'Creación profesional de videos', keywords: 'creación de video', type: 'website' },
  '/fr/services/digital-agency/video-creation': { title: 'Création Vidéo - Advisable', description: 'Création professionnelle de vidéos', keywords: 'création vidéo', type: 'website' },
  
  // Web Development
  '/services/digital-agency/web-development': { title: 'Web Development Services - Advisable', description: 'Build responsive, fast, and secure websites using modern technologies.', keywords: 'web development, website development, web design', type: 'website' },
  '/en/services/digital-agency/web-development': { title: 'Web Development - Advisable', description: 'Build responsive, fast, and secure websites.', keywords: 'web development', type: 'website' },
  '/de/services/digital-agency/web-development': { title: 'Webentwicklung - Advisable', description: 'Responsive, schnelle und sichere Websites', keywords: 'Webentwicklung', type: 'website' },
  '/el/services/digital-agency/web-development': { title: 'Ανάπτυξη Ιστοσελίδων - Advisable', description: 'Ανάπτυξη responsive, γρήγορων ιστοσελίδων', keywords: 'ανάπτυξη ιστοσελίδων', type: 'website' },
  '/es/services/digital-agency/web-development': { title: 'Desarrollo Web - Advisable', description: 'Sitios web responsivos, rápidos y seguros', keywords: 'desarrollo web', type: 'website' },
  '/fr/services/digital-agency/web-development': { title: 'Développement Web - Advisable', description: 'Sites web réactifs, rapides et sécurisés', keywords: 'développement web', type: 'website' },

  // ====================================
  // VENTURE STUDIO SERVICE DETAIL PAGES
  // ====================================
  
  // Business Consulting
  '/services/venture-studio/business-consulting': { title: 'Business Consulting - Advisable', description: 'Strategic business consulting services to drive growth and innovation.', keywords: 'business consulting, strategy consulting, management consulting', type: 'website' },
  '/en/services/venture-studio/business-consulting': { title: 'Business Consulting - Advisable', description: 'Strategic business consulting services.', keywords: 'business consulting', type: 'website' },
  '/de/services/venture-studio/business-consulting': { title: 'Unternehmensberatung - Advisable', description: 'Strategische Unternehmensberatung', keywords: 'Unternehmensberatung', type: 'website' },
  '/el/services/venture-studio/business-consulting': { title: 'Επιχειρηματική Συμβουλευτική - Advisable', description: 'Στρατηγική επιχειρηματική συμβουλευτική', keywords: 'επιχειρηματική συμβουλευτική', type: 'website' },
  '/es/services/venture-studio/business-consulting': { title: 'Consultoría Empresarial - Advisable', description: 'Servicios de consultoría empresarial', keywords: 'consultoría empresarial', type: 'website' },
  '/fr/services/venture-studio/business-consulting': { title: 'Conseil en Affaires - Advisable', description: 'Services de conseil stratégique', keywords: 'conseil en affaires', type: 'website' },
  
  // Fundraising Strategy
  '/services/venture-studio/fundraising-strategy': { title: 'Fundraising Strategy - Advisable', description: 'Expert fundraising strategy and investor relations support.', keywords: 'fundraising, investment strategy, venture capital, startup funding', type: 'website' },
  '/en/services/venture-studio/fundraising-strategy': { title: 'Fundraising Strategy - Advisable', description: 'Expert fundraising strategy services.', keywords: 'fundraising strategy', type: 'website' },
  '/de/services/venture-studio/fundraising-strategy': { title: 'Fundraising-Strategie - Advisable', description: 'Experten-Fundraising-Strategie', keywords: 'Fundraising-Strategie', type: 'website' },
  '/el/services/venture-studio/fundraising-strategy': { title: 'Στρατηγική Χρηματοδότησης - Advisable', description: 'Στρατηγική χρηματοδότησης', keywords: 'στρατηγική χρηματοδότησης', type: 'website' },
  '/es/services/venture-studio/fundraising-strategy': { title: 'Estrategia de Recaudación - Advisable', description: 'Estrategia de recaudación de fondos', keywords: 'estrategia de recaudación', type: 'website' },
  '/fr/services/venture-studio/fundraising-strategy': { title: 'Stratégie de Levée de Fonds - Advisable', description: 'Stratégie de levée de fonds', keywords: 'levée de fonds', type: 'website' },
  
  // Go-to-Market Strategy
  '/services/venture-studio/go-to-market-strategy': { title: 'Go-to-Market Strategy - Advisable', description: 'Comprehensive go-to-market strategies for successful product launches.', keywords: 'gtm strategy, market entry, product launch, market strategy', type: 'website' },
  '/en/services/venture-studio/go-to-market-strategy': { title: 'Go-to-Market Strategy - Advisable', description: 'Comprehensive go-to-market strategies.', keywords: 'go to market', type: 'website' },
  '/de/services/venture-studio/go-to-market-strategy': { title: 'Markteintrittsstrategie - Advisable', description: 'Umfassende Markteintrittsstrategien', keywords: 'Markteintrittsstrategie', type: 'website' },
  '/el/services/venture-studio/go-to-market-strategy': { title: 'Στρατηγική Εισόδου στην Αγορά - Advisable', description: 'Στρατηγική εισόδου στην αγορά', keywords: 'στρατηγική εισόδου', type: 'website' },
  '/es/services/venture-studio/go-to-market-strategy': { title: 'Estrategia de Lanzamiento - Advisable', description: 'Estrategia de entrada al mercado', keywords: 'estrategia de lanzamiento', type: 'website' },
  '/fr/services/venture-studio/go-to-market-strategy': { title: 'Stratégie de Mise sur le Marché - Advisable', description: 'Stratégie de mise sur le marché', keywords: 'stratégie de mise sur le marché', type: 'website' },
  
  // Idea Validation
  '/services/venture-studio/idea-validation': { title: 'Idea Validation Services - Advisable', description: 'Validate your business ideas with market research and prototype testing.', keywords: 'idea validation, market validation, concept testing, mvp testing', type: 'website' },
  '/en/services/venture-studio/idea-validation': { title: 'Idea Validation - Advisable', description: 'Validate your business ideas.', keywords: 'idea validation', type: 'website' },
  '/de/services/venture-studio/idea-validation': { title: 'Ideenvalidierung - Advisable', description: 'Validierung Ihrer Geschäftsideen', keywords: 'Ideenvalidierung', type: 'website' },
  '/el/services/venture-studio/idea-validation': { title: 'Επικύρωση Ιδέας - Advisable', description: 'Επικύρωση επιχειρηματικών ιδεών', keywords: 'επικύρωση ιδέας', type: 'website' },
  '/es/services/venture-studio/idea-validation': { title: 'Validación de Ideas - Advisable', description: 'Validación de ideas empresariales', keywords: 'validación de ideas', type: 'website' },
  '/fr/services/venture-studio/idea-validation': { title: 'Validation d\'Idée - Advisable', description: 'Validation d\'idées commerciales', keywords: 'validation d\'idée', type: 'website' },
  
  // MVP Development
  '/services/venture-studio/mvp-development': { title: 'MVP Development Services - Advisable', description: 'Rapid MVP development to test and validate your product concepts.', keywords: 'mvp development, minimum viable product, prototype development', type: 'website' },
  '/en/services/venture-studio/mvp-development': { title: 'MVP Development - Advisable', description: 'Rapid MVP development services.', keywords: 'mvp development', type: 'website' },
  '/de/services/venture-studio/mvp-development': { title: 'MVP-Entwicklung - Advisable', description: 'Schnelle MVP-Entwicklung', keywords: 'MVP-Entwicklung', type: 'website' },
  '/el/services/venture-studio/mvp-development': { title: 'Ανάπτυξη MVP - Advisable', description: 'Γρήγορη ανάπτυξη MVP', keywords: 'ανάπτυξη mvp', type: 'website' },
  '/es/services/venture-studio/mvp-development': { title: 'Desarrollo de MVP - Advisable', description: 'Desarrollo rápido de MVP', keywords: 'desarrollo mvp', type: 'website' },
  '/fr/services/venture-studio/mvp-development': { title: 'Développement MVP - Advisable', description: 'Développement rapide de MVP', keywords: 'développement mvp', type: 'website' },
  
  // Pitch Deck
  '/services/venture-studio/pitch-deck': { title: 'Pitch Deck Creation - Advisable', description: 'Create compelling pitch decks that win investors and secure funding.', keywords: 'pitch deck, investor presentation, startup pitch, fundraising deck', type: 'website' },
  '/en/services/venture-studio/pitch-deck': { title: 'Pitch Deck - Advisable', description: 'Create compelling pitch decks.', keywords: 'pitch deck', type: 'website' },
  '/de/services/venture-studio/pitch-deck': { title: 'Pitch Deck - Advisable', description: 'Überzeugende Pitch Decks erstellen', keywords: 'Pitch Deck', type: 'website' },
  '/el/services/venture-studio/pitch-deck': { title: 'Pitch Deck - Advisable', description: 'Δημιουργία pitch deck', keywords: 'pitch deck', type: 'website' },
  '/es/services/venture-studio/pitch-deck': { title: 'Pitch Deck - Advisable', description: 'Creación de pitch decks', keywords: 'pitch deck', type: 'website' },
  '/fr/services/venture-studio/pitch-deck': { title: 'Pitch Deck - Advisable', description: 'Création de pitch decks', keywords: 'pitch deck', type: 'website' },
  
  // Product-Market Fit
  '/services/venture-studio/product-market-fit': { title: 'Product-Market Fit - Advisable', description: 'Achieve product-market fit through iterative testing and customer feedback.', keywords: 'product market fit, pmf, product validation, market fit', type: 'website' },
  '/en/services/venture-studio/product-market-fit': { title: 'Product-Market Fit - Advisable', description: 'Achieve product-market fit.', keywords: 'product market fit', type: 'website' },
  '/de/services/venture-studio/product-market-fit': { title: 'Product-Market Fit - Advisable', description: 'Product-Market Fit erreichen', keywords: 'Product-Market Fit', type: 'website' },
  '/el/services/venture-studio/product-market-fit': { title: 'Product-Market Fit - Advisable', description: 'Επίτευξη product-market fit', keywords: 'product market fit', type: 'website' },
  '/es/services/venture-studio/product-market-fit': { title: 'Product-Market Fit - Advisable', description: 'Lograr product-market fit', keywords: 'product market fit', type: 'website' },
  '/fr/services/venture-studio/product-market-fit': { title: 'Product-Market Fit - Advisable', description: 'Atteindre le product-market fit', keywords: 'product market fit', type: 'website' },
  
  // Product Strategy
  '/services/venture-studio/product-strategy': { title: 'Product Strategy - Advisable', description: 'Develop comprehensive product strategies for market success.', keywords: 'product strategy, product roadmap, product planning', type: 'website' },
  '/en/services/venture-studio/product-strategy': { title: 'Product Strategy - Advisable', description: 'Develop comprehensive product strategies.', keywords: 'product strategy', type: 'website' },
  '/de/services/venture-studio/product-strategy': { title: 'Produktstrategie - Advisable', description: 'Umfassende Produktstrategien entwickeln', keywords: 'Produktstrategie', type: 'website' },
  '/el/services/venture-studio/product-strategy': { title: 'Στρατηγική Προϊόντος - Advisable', description: 'Ανάπτυξη στρατηγικής προϊόντος', keywords: 'στρατηγική προϊόντος', type: 'website' },
  '/es/services/venture-studio/product-strategy': { title: 'Estrategia de Producto - Advisable', description: 'Desarrollo de estrategia de producto', keywords: 'estrategia de producto', type: 'website' },
  '/fr/services/venture-studio/product-strategy': { title: 'Stratégie Produit - Advisable', description: 'Développement de stratégie produit', keywords: 'stratégie produit', type: 'website' },
  
  // Startup Incubation
  '/services/venture-studio/startup-incubation': { title: 'Startup Incubation - Advisable', description: 'Full-service startup incubation from ideation to market launch.', keywords: 'startup incubation, startup acceleration, business incubator', type: 'website' },
  '/en/services/venture-studio/startup-incubation': { title: 'Startup Incubation - Advisable', description: 'Full-service startup incubation.', keywords: 'startup incubation', type: 'website' },
  '/de/services/venture-studio/startup-incubation': { title: 'Startup-Inkubation - Advisable', description: 'Full-Service Startup-Inkubation', keywords: 'Startup-Inkubation', type: 'website' },
  '/el/services/venture-studio/startup-incubation': { title: 'Επώαση Startups - Advisable', description: 'Πλήρης επώαση startups', keywords: 'επώαση startups', type: 'website' },
  '/es/services/venture-studio/startup-incubation': { title: 'Incubación de Startups - Advisable', description: 'Incubación completa de startups', keywords: 'incubación startups', type: 'website' },
  '/fr/services/venture-studio/startup-incubation': { title: 'Incubation de Startups - Advisable', description: 'Incubation complète de startups', keywords: 'incubation startups', type: 'website' },
  
  // Team Building
  '/services/venture-studio/team-building': { title: 'Team Building & Recruitment - Advisable', description: 'Build high-performing teams with strategic recruitment and talent management.', keywords: 'team building, recruitment, talent acquisition, startup hiring', type: 'website' },
  '/en/services/venture-studio/team-building': { title: 'Team Building - Advisable', description: 'Build high-performing teams.', keywords: 'team building', type: 'website' },
  '/de/services/venture-studio/team-building': { title: 'Teambildung - Advisable', description: 'Aufbau leistungsstarker Teams', keywords: 'Teambildung', type: 'website' },
  '/el/services/venture-studio/team-building': { title: 'Οικοδόμηση Ομάδας - Advisable', description: 'Δημιουργία υψηλής απόδοσης ομάδων', keywords: 'οικοδόμηση ομάδας', type: 'website' },
  '/es/services/venture-studio/team-building': { title: 'Construcción de Equipos - Advisable', description: 'Construcción de equipos de alto rendimiento', keywords: 'construcción de equipos', type: 'website' },
  '/fr/services/venture-studio/team-building': { title: 'Construction d\'Équipe - Advisable', description: 'Construction d\'équipes performantes', keywords: 'construction d\'équipe', type: 'website' },

  // ====================================
  // PRODUCTS - ALL LANGUAGES
  // ====================================
  '/products': { title: 'Our Products - Advisable', description: 'Discover our comprehensive range of digital products including AI recommendation systems, e-prescription platforms, e-commerce solutions, and market data analytics tools.', keywords: 'digital products, AI recommendations, e-prescription, e-commerce platforms, market data analytics', type: 'website' },
  '/en/products': { title: 'Our Products - Advisable', description: 'Discover our comprehensive range of digital products including AI recommendation systems, e-prescription platforms, and market data analytics tools.', keywords: 'digital products, AI recommendations', type: 'website' },
  '/de/products': { title: 'Unsere Produkte - Advisable', description: 'Entdecken Sie unser umfassendes Sortiment an digitalen Produkten.', keywords: 'digitale Produkte', type: 'website' },
  '/el/products': { title: 'Τα Προϊόντα μας - Advisable', description: 'Ανακαλύψτε την ολοκληρωμένη γκάμα ψηφιακών προϊόντων μας.', keywords: 'ψηφιακά προϊόντα', type: 'website' },
  '/es/products': { title: 'Nuestros Productos - Advisable', description: 'Descubra nuestra amplia gama de productos digitales.', keywords: 'productos digitales', type: 'website' },
  '/fr/products': { title: 'Nos Produits - Advisable', description: 'Découvrez notre gamme complète de produits numériques.', keywords: 'produits numériques', type: 'website' },
  
  // Product Detail Pages
  '/product/sizethemarket': { title: 'SizeTheMarket - Market Data Analytics - Advisable', description: 'Professional market data analytics platform providing real-time insights, trend analysis, and business intelligence for informed decision making.', keywords: 'SizeTheMarket, market data, business analytics, data visualization, market intelligence', type: 'product' },
  '/product/:slug': { title: 'Advisable | {title}', description: '{description}', keywords: 'digital products, innovative solutions, technology platforms', type: 'product', generateTitle: (product) => `${product?.title || 'Product'} - Advisable`, generateDescription: (product) => product?.description || 'Discover our innovative digital product solutions.' },

  // ====================================
  // INVESTMENTS
  // ====================================
  '/investments': { title: 'Our Investments - Advisable', description: 'Explore our portfolio of innovative startups and technology ventures. Advisable invests in transformative businesses across healthcare, technology, and digital services.', keywords: 'venture capital, startup investments, portfolio companies, technology ventures', type: 'website' },
  '/investments/cardia-care': { title: 'Cardia Care - Advisable Investments', description: 'Innovative home care services - Cardia Care is revolutionizing home healthcare delivery.', keywords: 'home care, healthcare services, cardia care', type: 'website' },
  '/investments/fedra': { title: 'Fedra - Advisable Investments', description: 'Cut Google Shopping costs by 20% - Fedra optimizes e-commerce advertising performance.', keywords: 'google shopping, advertising optimization, fedra', type: 'website' },
  '/investments/vyne': { title: 'Vyne - Advisable Investments', description: 'Beauty, easier than ever - Vyne simplifies the beauty and wellness experience.', keywords: 'beauty tech, wellness, vyne', type: 'website' },

  // ====================================
  // INSIGHTS - ALL LANGUAGES
  // ====================================
  '/insights': { title: 'Insights & Articles - Advisable', description: 'Explore our latest insights, thought leadership articles, and industry analysis on digital transformation, technology trends, and business innovation.', keywords: 'insights, articles, thought leadership, digital transformation, technology trends, business innovation', type: 'website' },
  '/en/insights': { title: 'Insights & Articles - Advisable', description: 'Explore our latest insights, thought leadership articles, and industry analysis.', keywords: 'insights, articles', type: 'website' },
  '/de/insights': { title: 'Einblicke & Artikel - Advisable', description: 'Entdecken Sie unsere neuesten Einblicke, Thought-Leadership-Artikel und Branchenanalysen.', keywords: 'Einblicke, Artikel', type: 'website' },
  '/el/insights': { title: 'Ιδέες & Άρθρα - Advisable', description: 'Εξερευνήστε τις τελευταίες ιδέες, άρθρα και αναλύσεις του κλάδου.', keywords: 'ιδέες, άρθρα', type: 'website' },
  '/es/insights': { title: 'Perspectivas y Artículos - Advisable', description: 'Explore nuestras últimas perspectivas, artículos y análisis de la industria.', keywords: 'perspectivas, artículos', type: 'website' },
  '/fr/insights': { title: 'Perspectives et Articles - Advisable', description: 'Explorez nos dernières perspectives, articles et analyses de l\'industrie.', keywords: 'perspectives, articles', type: 'website' },
  '/insights/:slug': { title: 'Advisable | {title}', description: '{excerpt}', keywords: 'insights, articles, thought leadership', type: 'article', generateTitle: (insight) => `${insight?.title || 'Insight'} - Advisable`, generateDescription: (insight) => insight?.excerpt || 'Read our latest insights on digital transformation and technology trends.' },

  // ====================================
  // NEWS - ALL LANGUAGES
  // ====================================
  '/news': { title: 'Company News - Advisable', description: 'Latest news, company updates, and industry announcements from Advisable. Stay informed about our latest projects and technological advancements.', keywords: 'company news, technology updates, industry news, business announcements', type: 'website' },
  '/en/news': { title: 'Company News - Advisable', description: 'Latest news, company updates, and industry announcements from Advisable.', keywords: 'company news', type: 'website' },
  '/de/news': { title: 'Unternehmensnachrichten - Advisable', description: 'Neueste Nachrichten, Unternehmens-Updates und Branchenankündigungen von Advisable.', keywords: 'Unternehmensnachrichten', type: 'website' },
  '/el/news': { title: 'Εταιρικά Νέα - Advisable', description: 'Τελευταία νέα, ενημερώσεις εταιρείας και ανακοινώσεις του κλάδου από την Advisable.', keywords: 'εταιρικά νέα', type: 'website' },
  '/es/news': { title: 'Noticias de la Empresa - Advisable', description: 'Últimas noticias, actualizaciones de la empresa y anuncios de la industria de Advisable.', keywords: 'noticias de la empresa', type: 'website' },
  '/fr/news': { title: 'Actualités de l\'Entreprise - Advisable', description: 'Dernières nouvelles, mises à jour de l\'entreprise et annonces de l\'industrie d\'Advisable.', keywords: 'actualités de l\'entreprise', type: 'website' },
  '/news/:slug': { title: 'Advisable | {title}', description: '{excerpt}', keywords: 'company news, technology updates', type: 'article', generateTitle: (news) => `${news?.title || 'News'} - Advisable`, generateDescription: (news) => news?.excerpt || 'Read the latest news and updates from Advisable.' },

  // ====================================
  // PARTNERS & CLIENTS
  // ====================================
  '/partners-and-integrations': { title: 'Partners & Integrations - Advisable', description: 'Discover our strategic technology partnerships and integrations. We work with leading platforms to deliver comprehensive digital solutions.', keywords: 'technology partners, integrations, strategic partnerships, platform integrations', type: 'website' },
  '/our-clients': { title: 'Our Clients - Advisable', description: 'Explore our client success stories and case studies. See how we have helped businesses across industries achieve digital transformation.', keywords: 'client success stories, case studies, digital transformation projects, business results', type: 'website' },
  '/our-clients/:slug': { title: 'Advisable | {name}', description: 'Discover how {name} achieved digital transformation success through our innovative technology solutions and consulting expertise.', keywords: 'case study, client success, digital transformation', type: 'website', generateTitle: (client) => `${client?.name || 'Client'} Case Study - Advisable`, generateDescription: (client) => client?.description || `Discover how ${client?.name || 'this client'} achieved digital transformation success.` },

  // ====================================
  // DYNAMIC SERVICE ROUTES
  // ====================================
  '/services/:category': { title: 'Advisable | {category} Services', description: 'Professional {category} services to drive your digital transformation.', keywords: 'consulting services, digital transformation, technology services', type: 'website', generateTitle: (category) => `${category || 'Services'} - Advisable`, generateDescription: (category) => `Professional ${category || 'consulting'} services to drive your digital transformation.` },
  '/services/:category/:slug': { title: 'Advisable | {title}', description: '{description}', keywords: 'consulting services, digital transformation', type: 'website', generateTitle: (service) => `${service?.title || 'Service'} - Advisable`, generateDescription: (service) => service?.description || 'Professional consulting and technology services for digital transformation.' },

  // ====================================
  // CONTACT - ALL LANGUAGES
  // ====================================
  '/contact': { title: 'Contact Us - Advisable', description: 'Get in touch with our digital transformation experts. Contact Advisable for consulting, technology solutions, and partnership opportunities.', keywords: 'contact, digital transformation consulting, business inquiries', type: 'website' },
  '/en/contact': { title: 'Contact Us - Advisable', description: 'Get in touch with our digital transformation experts.', keywords: 'contact', type: 'website' },
  '/de/contact': { title: 'Kontakt - Advisable', description: 'Nehmen Sie Kontakt mit unseren Experten für digitale Transformation auf.', keywords: 'Kontakt', type: 'website' },
  '/el/contact': { title: 'Επικοινωνία - Advisable', description: 'Επικοινωνήστε με τους ειδικούς μας στον ψηφιακό μετασχηματισμό.', keywords: 'επικοινωνία', type: 'website' },
  '/es/contact': { title: 'Contacto - Advisable', description: 'Póngase en contacto con nuestros expertos en transformación digital.', keywords: 'contacto', type: 'website' },
  '/fr/contact': { title: 'Contact - Advisable', description: 'Contactez nos experts en transformation numérique.', keywords: 'contact', type: 'website' },

  // ====================================
  // ABOUT - ALL LANGUAGES
  // ====================================
  '/about-company': { title: 'About Company - Advisable', description: 'Learn about Advisable - a leading digital transformation consultancy dedicated to helping businesses innovate and grow through technology solutions.', keywords: 'about, company information, digital transformation consultancy', type: 'website' },
  '/en/about-company': { title: 'About Company - Advisable', description: 'Learn about Advisable - a leading digital transformation consultancy.', keywords: 'about', type: 'website' },
  '/de/about-company': { title: 'Über das Unternehmen - Advisable', description: 'Erfahren Sie mehr über Advisable - eine führende Beratungsgesellschaft für digitale Transformation.', keywords: 'über', type: 'website' },
  '/el/about-company': { title: 'Σχετικά με την Εταιρεία - Advisable', description: 'Μάθετε για την Advisable - μια κορυφαία συμβουλευτική εταιρεία ψηφιακού μετασχηματισμού.', keywords: 'σχετικά', type: 'website' },
  '/es/about-company': { title: 'Sobre la Empresa - Advisable', description: 'Conozca Advisable: una consultoría líder en transformación digital.', keywords: 'sobre', type: 'website' },
  '/fr/about-company': { title: 'À Propos de l\'Entreprise - Advisable', description: 'Découvrez Advisable - un cabinet de conseil leader en transformation numérique.', keywords: 'à propos', type: 'website' },

  // ====================================
  // TEAM & LEGAL PAGES
  // ====================================
  '/advisable-team': { title: 'Our Team - Advisable', description: 'Meet our expert team of digital transformation consultants, developers, and technology specialists committed to driving innovation.', keywords: 'team, digital transformation experts, technology consultants', type: 'website' },
  '/privacy-policy': { title: 'Privacy Policy - Advisable', description: 'Our privacy policy outlines how Advisable collects, uses, and protects your personal information and data.', keywords: 'privacy policy, data protection, GDPR compliance', type: 'website' },
  '/terms-of-service': { title: 'Terms of Service - Advisable', description: 'Terms of service and conditions for using Advisable services and digital platforms.', keywords: 'terms of service, terms and conditions', type: 'website' },
  '/cookie-policy': { title: 'Cookie Policy - Advisable', description: 'Information about how Advisable uses cookies and similar technologies on our website.', keywords: 'cookie policy, cookies, website tracking', type: 'website' },

  // ====================================
  // LANDING PAGES
  // ====================================
  '/sled-to-advisable': { title: 'Advisable — Sled into Success | Digital Agency Services', description: 'Discover why leading brands choose Advisable as their digital partner. Full-service agency, venture studio, and product development — one team, limitless possibilities.', keywords: 'digital agency, sled, AI services, SEO, sleed, web development, advisable, sled digital, digital transformation, sled into success, venture studio, sleed agency, e-commerce, marketing agency Greece', type: 'website' },
};

// Helper function to get SEO config for a route
export const getSEOConfig = (path: string, cleanPath: string): SEOConfig | null => {
  // Try exact match first
  if (seoConfig[path]) {
    return seoConfig[path];
  }
  
  if (seoConfig[cleanPath]) {
    return seoConfig[cleanPath];
  }

  // Try pattern matching for dynamic routes
  for (const [pattern, config] of Object.entries(seoConfig)) {
    if (pattern.includes(':')) {
      const patternRegex = new RegExp(
        '^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$'
      );
      if (patternRegex.test(path)) {
        return config;
      }
    }
  }

  return null;
};

// Helper function to get current page name from path
export const getPageName = (path: string): string => {
  // Remove language prefix and leading/trailing slashes
  const cleanPath = path.replace(/^\/[a-z]{2}\//, '/').replace(/^\/+|\/+$/g, '');
  
  if (!cleanPath) return 'Home';
  
  const segments = cleanPath.split('/');
  const lastSegment = segments[segments.length - 1];
  
  // Convert kebab-case to Title Case
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
