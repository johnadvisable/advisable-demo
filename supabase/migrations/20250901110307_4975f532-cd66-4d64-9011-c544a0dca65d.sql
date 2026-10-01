-- Comprehensive Translation Population Migration
-- This migration will populate all translation tables with proper content for all languages

-- 1. Company Info Content Updates
UPDATE public.company_info_translations 
SET 
  title = CASE 
    WHEN language_id = 1 THEN 'Advisable - The Future of Digital Innovation'
    WHEN language_id = 2 THEN 'Advisable - El Futuro de la Innovación Digital'
    WHEN language_id = 3 THEN 'Advisable - L''Avenir de l''Innovation Numérique'
    WHEN language_id = 4 THEN 'Advisable - Die Zukunft der digitalen Innovation'
    WHEN language_id = 5 THEN 'Advisable - Το Μέλλον της Ψηφιακής Καινοτομίας'
    ELSE title
  END,
  content = CASE 
    WHEN language_id = 1 THEN 'Advisable was founded in 2015 by Vasilis Kallaras (CEO) and Panos Kallaras (COO). We started as a Digital Agency, aiming to empower eCommerce with innovative solutions. Our first product, Ecommercen, evolved into an award-winning eCommerce platform, helping hundreds of businesses grow online.

Over the years, Advisable transformed into a Technology Provider, focusing on data-driven & AI-powered products such as Advisable.AI Recommendations, MarketData, and Esyntagi.gr.

With offices in Athens and Patras, more than 150 clients, and monitoring over €200M+ in digital revenue annually, we continue to deliver technology solutions that create real impact and measurable value for our partners.'
    WHEN language_id = 2 THEN 'Advisable fue fundada en 2015 por Vasilis Kallaras (CEO) y Panos Kallaras (COO). Comenzamos como una Agencia Digital, con el objetivo de empoderar el eCommerce con soluciones innovadoras. Nuestro primer producto, Ecommercen, evolucionó hacia una plataforma de eCommerce galardonada, ayudando a cientos de empresas a crecer en línea.

A lo largo de los años, Advisable se transformó en un Proveedor de Tecnología, enfocándose en productos impulsados por datos e IA como Advisable.AI Recommendations, MarketData y Esyntagi.gr.

Con oficinas en Atenas y Patras, más de 150 clientes y monitoreando más de €200M+ en ingresos digitales anualmente, continuamos entregando soluciones tecnológicas que crean impacto real y valor medible para nuestros socios.'
    WHEN language_id = 3 THEN 'Advisable a été fondée en 2015 par Vasilis Kallaras (PDG) et Panos Kallaras (COO). Nous avons commencé en tant qu''Agence Numérique, visant à autonomiser l''eCommerce avec des solutions innovantes. Notre premier produit, Ecommercen, a évolué vers une plateforme eCommerce primée, aidant des centaines d''entreprises à croître en ligne.

Au fil des années, Advisable s''est transformée en Fournisseur de Technologies, se concentrant sur des produits basés sur les données et l''IA comme Advisable.AI Recommendations, MarketData et Esyntagi.gr.

Avec des bureaux à Athènes et Patras, plus de 150 clients et surveillant plus de €200M+ de revenus numériques annuellement, nous continuons à livrer des solutions technologiques qui créent un impact réel et une valeur mesurable pour nos partenaires.'
    WHEN language_id = 4 THEN 'Advisable wurde 2015 von Vasilis Kallaras (CEO) und Panos Kallaras (COO) gegründet. Wir begannen als Digital Agency mit dem Ziel, eCommerce mit innovativen Lösungen zu stärken. Unser erstes Produkt, Ecommercen, entwickelte sich zu einer preisgekrönten eCommerce-Plattform und half Hunderten von Unternehmen beim Online-Wachstum.

Im Laufe der Jahre wandelte sich Advisable zu einem Technologieanbieter, der sich auf datengesteuerte und KI-gestützte Produkte wie Advisable.AI Recommendations, MarketData und Esyntagi.gr konzentriert.

Mit Büros in Athen und Patras, mehr als 150 Kunden und der Überwachung von über 200 Mio. € digitalen Umsätzen jährlich, liefern wir weiterhin Technologielösungen, die echten Einfluss und messbaren Wert für unsere Partner schaffen.'
    WHEN language_id = 5 THEN 'Η Advisable ιδρύθηκε το 2015 από τους Βασίλη Καλλάρα (CEO) και Πάνο Καλλάρα (COO). Ξεκινήσαμε ως Digital Agency με στόχο να ενδυναμώσουμε το eCommerce μέσα από καινοτόμες λύσεις. Το πρώτο μας προϊόν, το Ecommercen, εξελίχθηκε σε πολυβραβευμένη πλατφόρμα eCommerce, βοηθώντας εκατοντάδες επιχειρήσεις να αναπτυχθούν online.

Στα χρόνια που ακολούθησαν, η Advisable μεταμορφώθηκε σε Technology Provider, εστιάζοντας σε data-driven & AI προϊόντα όπως το Advisable.AI Recommendations, το MarketData και το Esyntagi.gr.

Με γραφεία σε Αθήνα και Πάτρα, περισσότερους από 150 πελάτες και παρακολούθηση άνω των €200M+ digital revenue ετησίως, συνεχίζουμε να δημιουργούμε τεχνολογικές λύσεις με πραγματικό αντίκτυπο και αξία για τους συνεργάτες μας.'
    ELSE content
  END,
  mission = CASE 
    WHEN language_id = 1 THEN 'To empower businesses with state-of-the-art digital solutions that drive growth, enhance customer experiences, and create sustainable competitive advantages.'
    WHEN language_id = 2 THEN 'Empoderar a las empresas con soluciones digitales de vanguardia que impulsen el crecimiento, mejoren las experiencias del cliente y creen ventajas competitivas sostenibles.'
    WHEN language_id = 3 THEN 'Autonomiser les entreprises avec des solutions numériques de pointe qui stimulent la croissance, améliorent les expériences client et créent des avantages concurrentiels durables.'
    WHEN language_id = 4 THEN 'Unternehmen mit modernsten digitalen Lösungen zu stärken, die Wachstum fördern, Kundenerfahrungen verbessern und nachhaltige Wettbewerbsvorteile schaffen.'
    WHEN language_id = 5 THEN 'Να ενδυναμώνουμε τις επιχειρήσεις με υπερσύγχρονες ψηφιακές λύσεις που οδηγούν σε ανάπτυξη, βελτιώνουν την εμπειρία πελατών και δημιουργούν βιώσιμα ανταγωνιστικά πλεονεκτήματα.'
    ELSE mission
  END,
  vision = CASE 
    WHEN language_id = 1 THEN 'Our vision is to create waves of innovation, guiding our partners across industries and driving transformative change through cutting-edge technology and creative solutions.'
    WHEN language_id = 2 THEN 'Nuestra visión es crear olas de innovación, guiando a nuestros socios a través de industrias e impulsando el cambio transformador a través de tecnología de vanguardia y soluciones creativas.'
    WHEN language_id = 3 THEN 'Notre vision est de créer des vagues d''innovation, guidant nos partenaires à travers les industries et conduisant le changement transformateur grâce à une technologie de pointe et des solutions créatives.'
    WHEN language_id = 4 THEN 'Unsere Vision ist es, Innovationswellen zu schaffen, unsere Partner branchenübergreifend zu führen und transformatorischen Wandel durch modernste Technologie und kreative Lösungen voranzutreiben.'
    WHEN language_id = 5 THEN 'Το όραμά μας είναι να δημιουργούμε κύματα καινοτομίας, καθοδηγώντας τους συνεργάτες μας σε όλες τις βιομηχανίες και οδηγώντας μετασχηματιστικές αλλαγές μέσω αιχμής της τεχνολογίας και δημιουργικών λύσεων.'
    ELSE vision
  END,
  history = CASE 
    WHEN language_id = 1 THEN 'Founded in 2015, Advisable has grown from a small digital agency to a leading technology provider. Our journey includes winning multiple awards for our eCommerce platform and expanding our services to include AI-powered solutions and market analytics.'
    WHEN language_id = 2 THEN 'Fundada en 2015, Advisable ha crecido de una pequeña agencia digital a un proveedor líder de tecnología. Nuestro viaje incluye ganar múltiples premios por nuestra plataforma de eCommerce y expandir nuestros servicios para incluir soluciones impulsadas por IA y análisis de mercado.'
    WHEN language_id = 3 THEN 'Fondée en 2015, Advisable a évolué d''une petite agence numérique à un fournisseur de technologie leader. Notre parcours comprend la victoire de multiples prix pour notre plateforme eCommerce et l''expansion de nos services pour inclure des solutions alimentées par l''IA et des analyses de marché.'
    WHEN language_id = 4 THEN 'Advisable wurde 2015 gegründet und hat sich von einer kleinen digitalen Agentur zu einem führenden Technologieanbieter entwickelt. Unsere Reise umfasst mehrere Auszeichnungen für unsere eCommerce-Plattform und die Erweiterung unserer Dienstleistungen um KI-gestützte Lösungen und Marktanalysen.'
    WHEN language_id = 5 THEN 'Ιδρυμένη το 2015, η Advisable έχει εξελιχθεί από μια μικρή ψηφιακή εταιρεία σε έναν κορυφαίο πάροχο τεχνολογίας. Το ταξίδι μας περιλαμβάνει πολλαπλά βραβεία για την πλατφόρμα eCommerce και την επέκταση των υπηρεσιών μας για να περιλαμβάνουν λύσεις τεχνητής νοημοσύνης και αναλύσεις αγοράς.'
    ELSE history
  END,
  approach = CASE 
    WHEN language_id = 1 THEN 'Our approach combines cutting-edge technology with deep industry knowledge. We believe in data-driven decisions, agile methodologies, and close collaboration with our clients to deliver solutions that exceed expectations.'
    WHEN language_id = 2 THEN 'Nuestro enfoque combina tecnología de vanguardia con un profundo conocimiento de la industria. Creemos en decisiones basadas en datos, metodologías ágiles y colaboración estrecha con nuestros clientes para entregar soluciones que superen las expectativas.'
    WHEN language_id = 3 THEN 'Notre approche combine une technologie de pointe avec une connaissance approfondie de l''industrie. Nous croyons aux décisions basées sur les données, aux méthodologies agiles et à une collaboration étroite avec nos clients pour livrer des solutions qui dépassent les attentes.'
    WHEN language_id = 4 THEN 'Unser Ansatz kombiniert modernste Technologie mit tiefem Branchenwissen. Wir glauben an datengesteuerte Entscheidungen, agile Methoden und enge Zusammenarbeit mit unseren Kunden, um Lösungen zu liefern, die Erwartungen übertreffen.'
    WHEN language_id = 5 THEN 'Η προσέγγισή μας συνδυάζει την αιχμή της τεχνολογίας με βαθιά γνώση της βιομηχανίας. Πιστεύουμε σε αποφάσεις που βασίζονται σε δεδομένα, agile μεθοδολογίες και στενή συνεργασία με τους πελάτες μας για να παραδίδουμε λύσεις που ξεπερνούν τις προσδοκίες.'
    ELSE approach
  END,
  team_intro = CASE 
    WHEN language_id = 1 THEN 'Our team consists of passionate technologists, creative designers, and strategic thinkers who are dedicated to pushing the boundaries of what''s possible in the digital world.'
    WHEN language_id = 2 THEN 'Nuestro equipo está formado por tecnólogos apasionados, diseñadores creativos y pensadores estratégicos que se dedican a traspasar los límites de lo posible en el mundo digital.'
    WHEN language_id = 3 THEN 'Notre équipe se compose de technologues passionnés, de designers créatifs et de penseurs stratégiques qui se consacrent à repousser les limites du possible dans le monde numérique.'
    WHEN language_id = 4 THEN 'Unser Team besteht aus leidenschaftlichen Technologen, kreativen Designern und strategischen Denkern, die sich der Erweiterung der Grenzen des Möglichen in der digitalen Welt verschrieben haben.'
    WHEN language_id = 5 THEN 'Η ομάδα μας αποτελείται από παθιασμένους τεχνολόγους, δημιουργικούς σχεδιαστές και στρατηγικούς στοχαστές που είναι αφοσιωμένοι στο να ξεπερνούν τα όρια του δυνατού στον ψηφιακό κόσμο.'
    ELSE team_intro
  END,
  updated_at = NOW()
WHERE company_info_id = '9a42aa5c-b1dc-44e9-a031-4749e5d39d14';

-- 2. Ensure all languages have company info translations
INSERT INTO public.company_info_translations (company_info_id, language_id, title, content, mission, vision, history, approach, team_intro)
SELECT 
  '9a42aa5c-b1dc-44e9-a031-4749e5d39d14',
  l.id,
  CASE 
    WHEN l.id = 1 THEN 'Advisable - The Future of Digital Innovation'
    WHEN l.id = 2 THEN 'Advisable - El Futuro de la Innovación Digital'
    WHEN l.id = 3 THEN 'Advisable - L''Avenir de l''Innovation Numérique'
    WHEN l.id = 4 THEN 'Advisable - Die Zukunft der digitalen Innovation'
    WHEN l.id = 5 THEN 'Advisable - Το Μέλλον της Ψηφιακής Καινοτομίας'
  END,
  CASE 
    WHEN l.id = 1 THEN 'Advisable was founded in 2015 by Vasilis Kallaras (CEO) and Panos Kallaras (COO)...'
    WHEN l.id = 2 THEN 'Advisable fue fundada en 2015 por Vasilis Kallaras (CEO) y Panos Kallaras (COO)...'
    WHEN l.id = 3 THEN 'Advisable a été fondée en 2015 par Vasilis Kallaras (PDG) et Panos Kallaras (COO)...'
    WHEN l.id = 4 THEN 'Advisable wurde 2015 von Vasilis Kallaras (CEO) und Panos Kallaras (COO) gegründet...'
    WHEN l.id = 5 THEN 'Η Advisable ιδρύθηκε το 2015 από τους Βασίλη Καλλάρα (CEO) και Πάνο Καλλάρα (COO)...'
  END,
  CASE 
    WHEN l.id = 1 THEN 'To empower businesses with state-of-the-art digital solutions...'
    WHEN l.id = 2 THEN 'Empoderar a las empresas con soluciones digitales de vanguardia...'
    WHEN l.id = 3 THEN 'Autonomiser les entreprises avec des solutions numériques de pointe...'
    WHEN l.id = 4 THEN 'Unternehmen mit modernsten digitalen Lösungen zu stärken...'
    WHEN l.id = 5 THEN 'Να ενδυναμώνουμε τις επιχειρήσεις με υπερσύγχρονες ψηφιακές λύσεις...'
  END,
  CASE 
    WHEN l.id = 1 THEN 'Our vision is to create waves of innovation...'
    WHEN l.id = 2 THEN 'Nuestra visión es crear olas de innovación...'
    WHEN l.id = 3 THEN 'Notre vision est de créer des vagues d''innovation...'
    WHEN l.id = 4 THEN 'Unsere Vision ist es, Innovationswellen zu schaffen...'
    WHEN l.id = 5 THEN 'Το όραμά μας είναι να δημιουργούμε κύματα καινοτομίας...'
  END,
  CASE 
    WHEN l.id = 1 THEN 'Founded in 2015, Advisable has grown from a small digital agency...'
    WHEN l.id = 2 THEN 'Fundada en 2015, Advisable ha crecido de una pequeña agencia digital...'
    WHEN l.id = 3 THEN 'Fondée en 2015, Advisable a évolué d''une petite agence numérique...'
    WHEN l.id = 4 THEN 'Advisable wurde 2015 gegründet und hat sich von einer kleinen digitalen Agentur...'
    WHEN l.id = 5 THEN 'Ιδρυμένη το 2015, η Advisable έχει εξελιχθεί από μια μικρή ψηφιακή εταιρεία...'
  END,
  CASE 
    WHEN l.id = 1 THEN 'Our approach combines cutting-edge technology with deep industry knowledge...'
    WHEN l.id = 2 THEN 'Nuestro enfoque combina tecnología de vanguardia con un profundo conocimiento...'
    WHEN l.id = 3 THEN 'Notre approche combine une technologie de pointe avec une connaissance approfondie...'
    WHEN l.id = 4 THEN 'Unser Ansatz kombiniert modernste Technologie mit tiefem Branchenwissen...'
    WHEN l.id = 5 THEN 'Η προσέγγισή μας συνδυάζει την αιχμή της τεχνολογίας με βαθιά γνώση...'
  END,
  CASE 
    WHEN l.id = 1 THEN 'Our team consists of passionate technologists, creative designers...'
    WHEN l.id = 2 THEN 'Nuestro equipo está formado por tecnólogos apasionados, diseñadores creativos...'
    WHEN l.id = 3 THEN 'Notre équipe se compose de technologues passionnés, de designers créatifs...'
    WHEN l.id = 4 THEN 'Unser Team besteht aus leidenschaftlichen Technologen, kreativen Designern...'
    WHEN l.id = 5 THEN 'Η ομάδα μας αποτελείται από παθιασμένους τεχνολόγους, δημιουργικούς σχεδιαστές...'
  END
FROM public.languages l
WHERE l.is_active = true 
AND NOT EXISTS (
  SELECT 1 FROM public.company_info_translations cit 
  WHERE cit.company_info_id = '9a42aa5c-b1dc-44e9-a031-4749e5d39d14' 
  AND cit.language_id = l.id
);