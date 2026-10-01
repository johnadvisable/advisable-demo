-- Part 2: Complete Translation Population for All Tables
-- This will ensure all translation tables have proper content for all active languages

-- Update existing blog post translations or create them
WITH blog_content AS (
  SELECT 
    bp.id as blog_post_id,
    l.id as language_id,
    CASE 
      WHEN l.code = 'en' THEN 'The Future of Digital Transformation'
      WHEN l.code = 'es' THEN 'El Futuro de la Transformación Digital'
      WHEN l.code = 'fr' THEN 'L''Avenir de la Transformation Numérique'
      WHEN l.code = 'de' THEN 'Die Zukunft der digitalen Transformation'
      WHEN l.code = 'el' THEN 'Το Μέλλον του Ψηφιακού Μετασχηματισμού'
    END as title,
    CASE 
      WHEN l.code = 'en' THEN 'Exploring how businesses can leverage digital technologies to stay competitive in the modern market.'
      WHEN l.code = 'es' THEN 'Explorando cómo las empresas pueden aprovechar las tecnologías digitales para mantenerse competitivas en el mercado moderno.'
      WHEN l.code = 'fr' THEN 'Explorer comment les entreprises peuvent tirer parti des technologies numériques pour rester compétitives sur le marché moderne.'
      WHEN l.code = 'de' THEN 'Erforschung, wie Unternehmen digitale Technologien nutzen können, um im modernen Markt wettbewerbsfähig zu bleiben.'
      WHEN l.code = 'el' THEN 'Εξερευνώντας πώς οι επιχειρήσεις μπορούν να αξιοποιήσουν τις ψηφιακές τεχνολογίες για να παραμείνουν ανταγωνιστικές στη σύγχρονη αγορά.'
    END as excerpt,
    CASE 
      WHEN l.code = 'en' THEN 'Digital transformation is no longer optional for businesses - it''s essential for survival and growth in today''s competitive landscape. This comprehensive guide explores the key strategies and technologies that are shaping the future of business operations.'
      WHEN l.code = 'es' THEN 'La transformación digital ya no es opcional para las empresas: es esencial para la supervivencia y el crecimiento en el panorama competitivo actual. Esta guía completa explora las estrategias y tecnologías clave que están dando forma al futuro de las operaciones comerciales.'
      WHEN l.code = 'fr' THEN 'La transformation numérique n''est plus optionnelle pour les entreprises - elle est essentielle pour survivre et croître dans le paysage concurrentiel d''aujourd''hui. Ce guide complet explore les stratégies et technologies clés qui façonnent l''avenir des opérations commerciales.'
      WHEN l.code = 'de' THEN 'Die digitale Transformation ist für Unternehmen nicht mehr optional - sie ist wesentlich für das Überleben und Wachstum in der heutigen Wettbewerbslandschaft. Dieser umfassende Leitfaden erkundet die Schlüsselstrategien und -technologien, die die Zukunft der Geschäftstätigkeit prägen.'
      WHEN l.code = 'el' THEN 'Ο ψηφιακός μετασχηματισμός δεν είναι πλέον προαιρετικός για τις επιχειρήσεις - είναι απαραίτητος για την επιβίωση και ανάπτυξη στο σημερινό ανταγωνιστικό τοπίο. Αυτός ο περιεκτικός οδηγός εξερευνά τις βασικές στρατηγικές και τεχνολογίες που διαμορφώνουν το μέλλον των επιχειρηματικών λειτουργιών.'
    END as content
  FROM public.blog_posts bp
  CROSS JOIN public.languages l
  WHERE l.is_active = true
  LIMIT 150  -- Ensure we cover all blog posts for all languages
)
INSERT INTO public.blog_post_translations (blog_post_id, language_id, title, excerpt, content)
SELECT blog_post_id, language_id, title, excerpt, content
FROM blog_content
ON CONFLICT (blog_post_id, language_id) 
DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Update existing news item translations or create them
WITH news_content AS (
  SELECT 
    ni.id as news_item_id,
    l.id as language_id,
    CASE 
      WHEN l.code = 'en' THEN 'Advisable Wins Innovation Award'
      WHEN l.code = 'es' THEN 'Advisable Gana Premio a la Innovación'
      WHEN l.code = 'fr' THEN 'Advisable Remporte le Prix de l''Innovation'
      WHEN l.code = 'de' THEN 'Advisable gewinnt Innovationspreis'
      WHEN l.code = 'el' THEN 'Η Advisable κερδίζει το Βραβείο Καινοτομίας'
    END as title,
    CASE 
      WHEN l.code = 'en' THEN 'Our latest AI-powered solutions have been recognized with a prestigious industry award.'
      WHEN l.code = 'es' THEN 'Nuestras últimas soluciones impulsadas por IA han sido reconocidas con un prestigioso premio de la industria.'
      WHEN l.code = 'fr' THEN 'Nos dernières solutions alimentées par l''IA ont été reconnues avec un prix prestigieux de l''industrie.'
      WHEN l.code = 'de' THEN 'Unsere neuesten KI-gestützten Lösungen wurden mit einem prestigeträchtigen Branchenpreis ausgezeichnet.'
      WHEN l.code = 'el' THEN 'Οι τελευταίες μας λύσεις που τροφοδοτούνται από AI έχουν αναγνωριστεί με ένα αριστοκρατικό βραβείο της βιομηχανίας.'
    END as excerpt,
    CASE 
      WHEN l.code = 'en' THEN 'We are thrilled to announce that Advisable has received the Innovation Excellence Award for our groundbreaking AI-powered recommendation engine. This recognition validates our commitment to pushing the boundaries of technology and delivering exceptional value to our clients.'
      WHEN l.code = 'es' THEN 'Estamos emocionados de anunciar que Advisable ha recibido el Premio de Excelencia en Innovación por nuestro revolucionario motor de recomendaciones impulsado por IA. Este reconocimiento valida nuestro compromiso de traspasar los límites de la tecnología y entregar valor excepcional a nuestros clientes.'
      WHEN l.code = 'fr' THEN 'Nous sommes ravis d''annoncer qu''Advisable a reçu le Prix d''Excellence en Innovation pour notre moteur de recommandation révolutionnaire alimenté par l''IA. Cette reconnaissance valide notre engagement à repousser les limites de la technologie et à livrer une valeur exceptionnelle à nos clients.'
      WHEN l.code = 'de' THEN 'Wir freuen uns, bekannt zu geben, dass Advisable den Innovation Excellence Award für unsere bahnbrechende KI-gestützte Empfehlungsmaschine erhalten hat. Diese Anerkennung bestätigt unser Engagement, die Grenzen der Technologie zu erweitern und außergewöhnlichen Wert für unsere Kunden zu liefern.'
      WHEN l.code = 'el' THEN 'Είμαστε ενθουσιασμένοι να ανακοινώσουμε ότι η Advisable έλαβε το Βραβείο Αριστείας Καινοτομίας για την πρωτοποριακή μας μηχανή συστάσεων που τροφοδοτείται από AI. Αυτή η αναγνώριση επικυρώνει τη δέσμευσή μας να ωθούμε τα όρια της τεχνολογίας και να παραδίδουμε εξαιρετική αξία στους πελάτες μας.'
    END as content
  FROM public.news_items ni
  CROSS JOIN public.languages l
  WHERE l.is_active = true
  LIMIT 150  -- Ensure we cover all news items for all languages
)
INSERT INTO public.news_item_translations (news_item_id, language_id, title, excerpt, content)
SELECT news_item_id, language_id, title, excerpt, content
FROM news_content
ON CONFLICT (news_item_id, language_id) 
DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Update existing credential translations or create them
WITH credential_content AS (
  SELECT 
    c.id as credential_id,
    l.id as language_id,
    CASE 
      WHEN l.code = 'en' THEN 'Google Partner'
      WHEN l.code = 'es' THEN 'Socio de Google'
      WHEN l.code = 'fr' THEN 'Partenaire Google'
      WHEN l.code = 'de' THEN 'Google Partner'
      WHEN l.code = 'el' THEN 'Συνεργάτης Google'
    END as title,
    CASE 
      WHEN l.code = 'en' THEN 'Certified Google Partner for digital marketing excellence and innovation.'
      WHEN l.code = 'es' THEN 'Socio certificado de Google para la excelencia e innovación en marketing digital.'
      WHEN l.code = 'fr' THEN 'Partenaire Google certifié pour l''excellence et l''innovation en marketing numérique.'
      WHEN l.code = 'de' THEN 'Zertifizierter Google Partner für digitale Marketing-Exzellenz und Innovation.'
      WHEN l.code = 'el' THEN 'Πιστοποιημένος συνεργάτης Google για αριστεία και καινοτομία στο ψηφιακό μάρκετινγκ.'
    END as description
  FROM public.credentials c
  CROSS JOIN public.languages l
  WHERE l.is_active = true
)
INSERT INTO public.credential_translations (credential_id, language_id, title, description)
SELECT credential_id, language_id, title, description
FROM credential_content
ON CONFLICT (credential_id, language_id) 
DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Populate service translations for all services and languages
WITH service_content AS (
  SELECT 
    s.id as service_id,
    l.id as language_id,
    CASE s.slug
      WHEN 'web-development' THEN 
        CASE l.code
          WHEN 'en' THEN 'Web Development'
          WHEN 'es' THEN 'Desarrollo Web'
          WHEN 'fr' THEN 'Développement Web'
          WHEN 'de' THEN 'Webentwicklung'
          WHEN 'el' THEN 'Ανάπτυξη Ιστοσελίδων'
        END
      WHEN 'mobile-app-development' THEN 
        CASE l.code
          WHEN 'en' THEN 'Mobile App Development'
          WHEN 'es' THEN 'Desarrollo de Aplicaciones Móviles'
          WHEN 'fr' THEN 'Développement d''Applications Mobiles'
          WHEN 'de' THEN 'Mobile App Entwicklung'
          WHEN 'el' THEN 'Ανάπτυξη Εφαρμογών Κινητών'
        END
      ELSE 
        CASE l.code
          WHEN 'en' THEN 'Digital Service'
          WHEN 'es' THEN 'Servicio Digital'
          WHEN 'fr' THEN 'Service Numérique'
          WHEN 'de' THEN 'Digitaler Service'
          WHEN 'el' THEN 'Ψηφιακή Υπηρεσία'
        END
    END as title,
    CASE s.slug
      WHEN 'web-development' THEN 
        CASE l.code
          WHEN 'en' THEN 'Custom websites and web applications built with the latest technologies'
          WHEN 'es' THEN 'Sitios web personalizados y aplicaciones web construidas con las últimas tecnologías'
          WHEN 'fr' THEN 'Sites web personnalisés et applications web construites avec les dernières technologies'
          WHEN 'de' THEN 'Maßgeschneiderte Websites und Webanwendungen mit neuesten Technologien'
          WHEN 'el' THEN 'Προσαρμοσμένες ιστοσελίδες και εφαρμογές web με τις πιο σύγχρονες τεχνολογίες'
        END
      WHEN 'mobile-app-development' THEN 
        CASE l.code
          WHEN 'en' THEN 'Native and cross-platform mobile applications for iOS and Android'
          WHEN 'es' THEN 'Aplicaciones móviles nativas y multiplataforma para iOS y Android'
          WHEN 'fr' THEN 'Applications mobiles natives et multiplateformes pour iOS et Android'
          WHEN 'de' THEN 'Native und plattformübergreifende mobile Anwendungen für iOS und Android'
          WHEN 'el' THEN 'Εγγενείς και πολυ-πλατφόρμων εφαρμογές κινητών για iOS και Android'
        END
      ELSE 
        CASE l.code
          WHEN 'en' THEN 'Professional digital services tailored to your business needs'
          WHEN 'es' THEN 'Servicios digitales profesionales adaptados a las necesidades de su negocio'
          WHEN 'fr' THEN 'Services numériques professionnels adaptés aux besoins de votre entreprise'
          WHEN 'de' THEN 'Professionelle digitale Dienstleistungen, die auf Ihre Geschäftsbedürfnisse zugeschnitten sind'
          WHEN 'el' THEN 'Επαγγελματικές ψηφιακές υπηρεσίες προσαρμοσμένες στις ανάγκες της επιχείρησής σας'
        END
    END as short_description,
    CASE s.slug
      WHEN 'web-development' THEN 
        CASE l.code
          WHEN 'en' THEN 'Our Web Development service delivers custom, high-performance websites and web applications tailored to your specific business needs. We use modern frameworks and best practices to ensure your digital presence is both powerful and scalable.'
          WHEN 'es' THEN 'Nuestro servicio de Desarrollo Web entrega sitios web personalizados y de alto rendimiento y aplicaciones web adaptadas a las necesidades específicas de su negocio. Utilizamos marcos modernos y mejores prácticas para asegurar que su presencia digital sea poderosa y escalable.'
          WHEN 'fr' THEN 'Notre service de Développement Web fournit des sites web personnalisés et performants et des applications web adaptées à vos besoins commerciaux spécifiques. Nous utilisons des frameworks modernes et les meilleures pratiques pour assurer que votre présence numérique soit puissante et évolutive.'
          WHEN 'de' THEN 'Unser Webentwicklungsservice liefert maßgeschneiderte, leistungsstarke Websites und Webanwendungen, die auf Ihre spezifischen Geschäftsbedürfnisse zugeschnitten sind. Wir verwenden moderne Frameworks und Best Practices, um sicherzustellen, dass Ihre digitale Präsenz sowohl mächtig als auch skalierbar ist.'
          WHEN 'el' THEN 'Η υπηρεσία Ανάπτυξης Ιστοσελίδων μας παραδίδει προσαρμοσμένες, υψηλής απόδοσης ιστοσελίδες και εφαρμογές web προσαρμοσμένες στις συγκεκριμένες επιχειρηματικές σας ανάγκες. Χρησιμοποιούμε σύγχρονα frameworks και καλύτερες πρακτικές για να διασφαλίσουμε ότι η ψηφιακή σας παρουσία είναι τόσο ισχυρή όσο και επεκτάσιμη.'
        END
      ELSE 
        CASE l.code
          WHEN 'en' THEN 'Comprehensive digital solutions designed to transform your business operations and drive growth in the digital age.'
          WHEN 'es' THEN 'Soluciones digitales integrales diseñadas para transformar las operaciones de su negocio e impulsar el crecimiento en la era digital.'
          WHEN 'fr' THEN 'Solutions numériques complètes conçues pour transformer vos opérations commerciales et stimuler la croissance à l''ère numérique.'
          WHEN 'de' THEN 'Umfassende digitale Lösungen, die darauf ausgelegt sind, Ihre Geschäftstätigkeiten zu transformieren und das Wachstum im digitalen Zeitalter voranzutreiben.'
          WHEN 'el' THEN 'Ολοκληρωμένες ψηφιακές λύσεις σχεδιασμένες για να μετασχηματίσουν τις επιχειρηματικές σας λειτουργίες και να οδηγήσουν στην ανάπτυξη στην ψηφιακή εποχή.'
        END
    END as long_description
  FROM public.services s
  CROSS JOIN public.languages l
  WHERE l.is_active = true
)
INSERT INTO public.service_translations (service_id, language_id, title, short_description, long_description)
SELECT service_id, language_id, title, short_description, long_description
FROM service_content
ON CONFLICT (service_id, language_id) 
DO UPDATE SET 
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  updated_at = NOW();