-- Fix English: remove duplicates, merge DB scope items, remove Claude Code from full_description (it's in benefits)
UPDATE public.job_listing_translations 
SET full_description = '<h2>About the Role</h2>

<p>We are looking for a <strong>Senior Frontend Developer</strong> who thrives in an AI-first development environment. You will lead the development of production-grade web applications, mobile apps, and API integrations using a diverse technology stack.</p>

<br/>

<h2>Core Tech Stack</h2>

<ul>
<li><strong>NUXT / Vue.js</strong> — Server-side rendered &amp; static applications</li>
<li><strong>NEXT.js / React</strong> — Dynamic web applications &amp; dashboards</li>
<li><strong>Rust</strong> — High-performance systems &amp; backend services</li>
<li><strong>PHP</strong> — Legacy system maintenance &amp; integrations</li>
<li>Any additional technology as required — <strong>rapid adaptation is essential</strong></li>
</ul>

<br/>

<h2>Scope of Work</h2>

<ul>
<li><strong>Web Development</strong> — Full-stack web applications from concept to deployment</li>
<li><strong>Mobile Applications</strong> — Cross-platform mobile app development</li>
<li><strong>API Connections</strong> — RESTful &amp; GraphQL API design, integration with third-party services</li>
<li><strong>Backend &amp; Database</strong> — Server-side logic, microservices, SQL/NoSQL database design and optimization</li>
<li><strong>DevOps</strong> — CI/CD pipelines, containerization, cloud infrastructure</li>
</ul>

<br/>

<h2>AI-First Development</h2>

<p>At Advisable, <strong>AI-assisted development is not optional — it is mandatory</strong>. Every developer is expected to integrate AI tools into their daily workflow to accelerate development, debugging, and code review.</p>',
requirements = '<ul>
<li>5+ years of professional frontend/full-stack development experience</li>
<li>Strong proficiency in <strong>NUXT/Vue.js</strong> and <strong>NEXT.js/React</strong></li>
<li>Working knowledge of <strong>Rust</strong> and <strong>PHP</strong></li>
<li>Ability to <strong>rapidly learn and adapt</strong> to any new technology stack as required</li>
<li>Experience with mobile application development (React Native, Flutter, or native)</li>
<li>Strong API design skills (REST, GraphQL)</li>
<li>Experience with cloud platforms (AWS, GCP, or Azure)</li>
<li><strong>Mandatory:</strong> Proven experience with AI development tools (Claude Code, Cursor, Copilot)</li>
<li><strong>Mandatory:</strong> Experience setting up and managing AI Agents for task automation</li>
<li>Excellent problem-solving skills and attention to detail</li>
<li>Strong communication skills in English (Greek is a plus)</li>
</ul>',
updated_at = now()
WHERE id = 'babaec68-86f6-457d-8666-a966a9942489';

-- Greek (language_id=5)
INSERT INTO public.job_listing_translations (job_listing_id, language_id, title, short_description, full_description, requirements, benefits)
VALUES ('a1000001-0000-0000-0000-000000000002', 5,
'Senior Frontend Developer',
'AI-first full-stack developer που αναπτύσσει web εφαρμογές, mobile applications & API integrations σε NUXT/Vue, NEXT/React, Rust, PHP και οποιαδήποτε τεχνολογία απαιτηθεί.',
'<h2>Σχετικά με τη Θέση</h2>

<p>Αναζητούμε έναν <strong>Senior Frontend Developer</strong> που ευδοκιμεί σε ένα AI-first περιβάλλον ανάπτυξης. Θα ηγηθείτε της ανάπτυξης production-grade web εφαρμογών, mobile apps και API integrations χρησιμοποιώντας ένα ευρύ technology stack.</p>

<br/>

<h2>Core Tech Stack</h2>

<ul>
<li><strong>NUXT / Vue.js</strong> — Server-side rendered &amp; static εφαρμογές</li>
<li><strong>NEXT.js / React</strong> — Dynamic web εφαρμογές &amp; dashboards</li>
<li><strong>Rust</strong> — High-performance συστήματα &amp; backend υπηρεσίες</li>
<li><strong>PHP</strong> — Συντήρηση legacy συστημάτων &amp; integrations</li>
<li>Οποιαδήποτε επιπλέον τεχνολογία απαιτηθεί — <strong>η ταχεία προσαρμογή είναι απαραίτητη</strong></li>
</ul>

<br/>

<h2>Αντικείμενο Εργασίας</h2>

<ul>
<li><strong>Web Development</strong> — Full-stack web εφαρμογές από τη σύλληψη ιδέας έως το deployment</li>
<li><strong>Mobile Applications</strong> — Cross-platform ανάπτυξη mobile εφαρμογών</li>
<li><strong>API Connections</strong> — Σχεδιασμός RESTful &amp; GraphQL API, integration με third-party υπηρεσίες</li>
<li><strong>Backend &amp; Database</strong> — Server-side λογική, microservices, σχεδιασμός και βελτιστοποίηση SQL/NoSQL βάσεων δεδομένων</li>
<li><strong>DevOps</strong> — CI/CD pipelines, containerization, cloud υποδομή</li>
</ul>

<br/>

<h2>AI-First Development</h2>

<p>Στην Advisable, <strong>η ανάπτυξη με AI δεν είναι προαιρετική — είναι υποχρεωτική</strong>. Κάθε developer αναμένεται να ενσωματώνει AI εργαλεία στην καθημερινή του ροή εργασίας για επιτάχυνση ανάπτυξης, debugging και code review.</p>',
'<ul>
<li>5+ χρόνια επαγγελματικής εμπειρίας σε frontend/full-stack development</li>
<li>Ισχυρή γνώση σε <strong>NUXT/Vue.js</strong> και <strong>NEXT.js/React</strong></li>
<li>Γνώση <strong>Rust</strong> και <strong>PHP</strong></li>
<li>Ικανότητα <strong>ταχείας εκμάθησης και προσαρμογής</strong> σε οποιοδήποτε νέο technology stack</li>
<li>Εμπειρία σε mobile application development (React Native, Flutter ή native)</li>
<li>Ισχυρές δεξιότητες API design (REST, GraphQL)</li>
<li>Εμπειρία με cloud platforms (AWS, GCP ή Azure)</li>
<li><strong>Υποχρεωτικό:</strong> Αποδεδειγμένη εμπειρία με AI development tools (Claude Code, Cursor, Copilot)</li>
<li><strong>Υποχρεωτικό:</strong> Εμπειρία στη δημιουργία και διαχείριση AI Agents για αυτοματοποίηση εργασιών</li>
<li>Εξαιρετικές ικανότητες επίλυσης προβλημάτων και προσοχή στη λεπτομέρεια</li>
<li>Ισχυρές επικοινωνιακές δεξιότητες στα Αγγλικά (τα Ελληνικά αποτελούν πλεονέκτημα)</li>
</ul>',
'<ul>
<li><strong>Claude Code Premium Seat</strong> — Πλήρης πρόσβαση σε AI-powered development tools</li>
<li>Ανταγωνιστικό πακέτο αποδοχών</li>
<li>Remote-first κουλτούρα εργασίας</li>
<li>Τελευταίας γενιάς MacBook Pro και περιφερειακά</li>
<li>Budget για παρακολούθηση συνεδρίων</li>
<li>Ασφάλεια υγείας και οδοντιατρική κάλυψη</li>
<li>Stock options για senior θέσεις</li>
</ul>');

-- Spanish (language_id=2)
INSERT INTO public.job_listing_translations (job_listing_id, language_id, title, short_description, full_description, requirements, benefits)
VALUES ('a1000001-0000-0000-0000-000000000002', 2,
'Senior Frontend Developer',
'Desarrollador full-stack AI-first que crea aplicaciones web, aplicaciones móviles e integraciones API con NUXT/Vue, NEXT/React, Rust, PHP y cualquier tecnología requerida.',
'<h2>Sobre el Puesto</h2>

<p>Buscamos un <strong>Senior Frontend Developer</strong> que prospere en un entorno de desarrollo AI-first. Liderarás el desarrollo de aplicaciones web de producción, apps móviles e integraciones API utilizando un stack tecnológico diverso.</p>

<br/>

<h2>Core Tech Stack</h2>

<ul>
<li><strong>NUXT / Vue.js</strong> — Aplicaciones server-side rendered y estáticas</li>
<li><strong>NEXT.js / React</strong> — Aplicaciones web dinámicas y dashboards</li>
<li><strong>Rust</strong> — Sistemas de alto rendimiento y servicios backend</li>
<li><strong>PHP</strong> — Mantenimiento de sistemas legacy e integraciones</li>
<li>Cualquier tecnología adicional requerida — <strong>la adaptación rápida es esencial</strong></li>
</ul>

<br/>

<h2>Alcance del Trabajo</h2>

<ul>
<li><strong>Desarrollo Web</strong> — Aplicaciones web full-stack desde el concepto hasta el despliegue</li>
<li><strong>Aplicaciones Móviles</strong> — Desarrollo de aplicaciones móviles multiplataforma</li>
<li><strong>Conexiones API</strong> — Diseño de API RESTful y GraphQL, integración con servicios de terceros</li>
<li><strong>Backend y Base de Datos</strong> — Lógica del servidor, microservicios, diseño y optimización de bases de datos SQL/NoSQL</li>
<li><strong>DevOps</strong> — Pipelines CI/CD, containerización, infraestructura en la nube</li>
</ul>

<br/>

<h2>Desarrollo AI-First</h2>

<p>En Advisable, <strong>el desarrollo asistido por IA no es opcional — es obligatorio</strong>. Se espera que cada desarrollador integre herramientas de IA en su flujo de trabajo diario para acelerar el desarrollo, la depuración y la revisión de código.</p>',
'<ul>
<li>5+ años de experiencia profesional en desarrollo frontend/full-stack</li>
<li>Dominio sólido de <strong>NUXT/Vue.js</strong> y <strong>NEXT.js/React</strong></li>
<li>Conocimiento práctico de <strong>Rust</strong> y <strong>PHP</strong></li>
<li>Capacidad de <strong>aprender y adaptarse rápidamente</strong> a cualquier nuevo stack tecnológico</li>
<li>Experiencia en desarrollo de aplicaciones móviles (React Native, Flutter o nativo)</li>
<li>Fuertes habilidades en diseño de API (REST, GraphQL)</li>
<li>Experiencia con plataformas cloud (AWS, GCP o Azure)</li>
<li><strong>Obligatorio:</strong> Experiencia demostrada con herramientas de desarrollo AI (Claude Code, Cursor, Copilot)</li>
<li><strong>Obligatorio:</strong> Experiencia configurando y gestionando AI Agents para automatización</li>
<li>Excelentes habilidades de resolución de problemas y atención al detalle</li>
<li>Fuertes habilidades de comunicación en inglés (griego es un plus)</li>
</ul>',
'<ul>
<li><strong>Claude Code Premium Seat</strong> — Acceso completo a herramientas de desarrollo AI</li>
<li>Paquete salarial competitivo</li>
<li>Cultura de trabajo remote-first</li>
<li>MacBook Pro de última generación y periféricos</li>
<li>Presupuesto para asistencia a conferencias</li>
<li>Seguro médico y dental</li>
<li>Stock options para puestos senior</li>
</ul>');

-- French (language_id=3)
INSERT INTO public.job_listing_translations (job_listing_id, language_id, title, short_description, full_description, requirements, benefits)
VALUES ('a1000001-0000-0000-0000-000000000002', 3,
'Senior Frontend Developer',
'Développeur full-stack AI-first créant des applications web, des applications mobiles et des intégrations API avec NUXT/Vue, NEXT/React, Rust, PHP et toute technologie requise.',
'<h2>À propos du Poste</h2>

<p>Nous recherchons un <strong>Senior Frontend Developer</strong> qui s''épanouit dans un environnement de développement AI-first. Vous dirigerez le développement d''applications web de production, d''apps mobiles et d''intégrations API en utilisant un stack technologique diversifié.</p>

<br/>

<h2>Core Tech Stack</h2>

<ul>
<li><strong>NUXT / Vue.js</strong> — Applications server-side rendered et statiques</li>
<li><strong>NEXT.js / React</strong> — Applications web dynamiques et dashboards</li>
<li><strong>Rust</strong> — Systèmes haute performance et services backend</li>
<li><strong>PHP</strong> — Maintenance de systèmes legacy et intégrations</li>
<li>Toute technologie supplémentaire requise — <strong>l''adaptation rapide est essentielle</strong></li>
</ul>

<br/>

<h2>Périmètre de Travail</h2>

<ul>
<li><strong>Développement Web</strong> — Applications web full-stack du concept au déploiement</li>
<li><strong>Applications Mobiles</strong> — Développement d''applications mobiles multiplateformes</li>
<li><strong>Connexions API</strong> — Conception d''API RESTful et GraphQL, intégration avec des services tiers</li>
<li><strong>Backend et Base de Données</strong> — Logique serveur, microservices, conception et optimisation de bases de données SQL/NoSQL</li>
<li><strong>DevOps</strong> — Pipelines CI/CD, conteneurisation, infrastructure cloud</li>
</ul>

<br/>

<h2>Développement AI-First</h2>

<p>Chez Advisable, <strong>le développement assisté par IA n''est pas optionnel — il est obligatoire</strong>. Chaque développeur est tenu d''intégrer les outils IA dans son flux de travail quotidien pour accélérer le développement, le débogage et la revue de code.</p>',
'<ul>
<li>5+ ans d''expérience professionnelle en développement frontend/full-stack</li>
<li>Maîtrise solide de <strong>NUXT/Vue.js</strong> et <strong>NEXT.js/React</strong></li>
<li>Connaissance pratique de <strong>Rust</strong> et <strong>PHP</strong></li>
<li>Capacité à <strong>apprendre et s''adapter rapidement</strong> à tout nouveau stack technologique</li>
<li>Expérience en développement d''applications mobiles (React Native, Flutter ou natif)</li>
<li>Solides compétences en conception d''API (REST, GraphQL)</li>
<li>Expérience avec les plateformes cloud (AWS, GCP ou Azure)</li>
<li><strong>Obligatoire :</strong> Expérience avérée avec les outils de développement AI (Claude Code, Cursor, Copilot)</li>
<li><strong>Obligatoire :</strong> Expérience dans la mise en place et la gestion d''AI Agents pour l''automatisation</li>
<li>Excellentes capacités de résolution de problèmes et souci du détail</li>
<li>Solides compétences en communication en anglais (le grec est un plus)</li>
</ul>',
'<ul>
<li><strong>Claude Code Premium Seat</strong> — Accès complet aux outils de développement AI</li>
<li>Package salarial compétitif</li>
<li>Culture de travail remote-first</li>
<li>MacBook Pro dernière génération et périphériques</li>
<li>Budget pour participation aux conférences</li>
<li>Assurance santé et dentaire</li>
<li>Stock options pour les postes senior</li>
</ul>');

-- German (language_id=4)
INSERT INTO public.job_listing_translations (job_listing_id, language_id, title, short_description, full_description, requirements, benefits)
VALUES ('a1000001-0000-0000-0000-000000000002', 4,
'Senior Frontend Developer',
'AI-first Full-Stack-Entwickler für Web-Apps, Mobile Applications und API-Integrationen mit NUXT/Vue, NEXT/React, Rust, PHP und jeder erforderlichen Technologie.',
'<h2>Über die Stelle</h2>

<p>Wir suchen einen <strong>Senior Frontend Developer</strong>, der in einer AI-first Entwicklungsumgebung aufblüht. Sie leiten die Entwicklung von produktionsreifen Webanwendungen, mobilen Apps und API-Integrationen mit einem vielfältigen Technology Stack.</p>

<br/>

<h2>Core Tech Stack</h2>

<ul>
<li><strong>NUXT / Vue.js</strong> — Server-side gerenderte und statische Anwendungen</li>
<li><strong>NEXT.js / React</strong> — Dynamische Webanwendungen und Dashboards</li>
<li><strong>Rust</strong> — Hochleistungssysteme und Backend-Services</li>
<li><strong>PHP</strong> — Wartung von Legacy-Systemen und Integrationen</li>
<li>Jede zusätzlich erforderliche Technologie — <strong>schnelle Anpassung ist unerlässlich</strong></li>
</ul>

<br/>

<h2>Aufgabenbereich</h2>

<ul>
<li><strong>Webentwicklung</strong> — Full-Stack-Webanwendungen vom Konzept bis zum Deployment</li>
<li><strong>Mobile Anwendungen</strong> — Plattformübergreifende Mobile-App-Entwicklung</li>
<li><strong>API-Verbindungen</strong> — RESTful- und GraphQL-API-Design, Integration mit Drittanbieterdiensten</li>
<li><strong>Backend und Datenbank</strong> — Serverseitige Logik, Microservices, SQL/NoSQL-Datenbankdesign und -optimierung</li>
<li><strong>DevOps</strong> — CI/CD-Pipelines, Containerisierung, Cloud-Infrastruktur</li>
</ul>

<br/>

<h2>AI-First Development</h2>

<p>Bei Advisable ist <strong>KI-gestützte Entwicklung keine Option — sie ist Pflicht</strong>. Jeder Entwickler wird erwartet, KI-Tools in seinen täglichen Arbeitsablauf zu integrieren, um Entwicklung, Debugging und Code-Review zu beschleunigen.</p>',
'<ul>
<li>5+ Jahre Berufserfahrung in Frontend/Full-Stack-Entwicklung</li>
<li>Fundierte Kenntnisse in <strong>NUXT/Vue.js</strong> und <strong>NEXT.js/React</strong></li>
<li>Praktische Erfahrung mit <strong>Rust</strong> und <strong>PHP</strong></li>
<li>Fähigkeit, sich <strong>schnell einzuarbeiten und anzupassen</strong> an jeden neuen Technology Stack</li>
<li>Erfahrung in der Entwicklung mobiler Anwendungen (React Native, Flutter oder nativ)</li>
<li>Starke API-Design-Fähigkeiten (REST, GraphQL)</li>
<li>Erfahrung mit Cloud-Plattformen (AWS, GCP oder Azure)</li>
<li><strong>Pflicht:</strong> Nachgewiesene Erfahrung mit AI-Entwicklungstools (Claude Code, Cursor, Copilot)</li>
<li><strong>Pflicht:</strong> Erfahrung im Einrichten und Verwalten von AI Agents zur Aufgabenautomatisierung</li>
<li>Hervorragende Problemlösungsfähigkeiten und Liebe zum Detail</li>
<li>Starke Kommunikationsfähigkeiten in Englisch (Griechisch ist ein Plus)</li>
</ul>',
'<ul>
<li><strong>Claude Code Premium Seat</strong> — Voller Zugang zu KI-gestützten Entwicklungstools</li>
<li>Wettbewerbsfähiges Gehaltspaket</li>
<li>Remote-first Arbeitskultur</li>
<li>Neuestes MacBook Pro und Peripheriegeräte</li>
<li>Budget für Konferenzbesuche</li>
<li>Kranken- und Zahnversicherung</li>
<li>Stock Options für Senior-Positionen</li>
</ul>');

-- Italian (language_id=10)
INSERT INTO public.job_listing_translations (job_listing_id, language_id, title, short_description, full_description, requirements, benefits)
VALUES ('a1000001-0000-0000-0000-000000000002', 10,
'Senior Frontend Developer',
'Sviluppatore full-stack AI-first che crea applicazioni web, app mobili e integrazioni API con NUXT/Vue, NEXT/React, Rust, PHP e qualsiasi tecnologia richiesta.',
'<h2>Il Ruolo</h2>

<p>Cerchiamo un <strong>Senior Frontend Developer</strong> che prosperi in un ambiente di sviluppo AI-first. Guiderai lo sviluppo di applicazioni web production-grade, app mobili e integrazioni API utilizzando un technology stack diversificato.</p>

<br/>

<h2>Core Tech Stack</h2>

<ul>
<li><strong>NUXT / Vue.js</strong> — Applicazioni server-side rendered e statiche</li>
<li><strong>NEXT.js / React</strong> — Applicazioni web dinamiche e dashboard</li>
<li><strong>Rust</strong> — Sistemi ad alte prestazioni e servizi backend</li>
<li><strong>PHP</strong> — Manutenzione sistemi legacy e integrazioni</li>
<li>Qualsiasi tecnologia aggiuntiva richiesta — <strong>l''adattamento rapido è essenziale</strong></li>
</ul>

<br/>

<h2>Ambito di Lavoro</h2>

<ul>
<li><strong>Sviluppo Web</strong> — Applicazioni web full-stack dal concept al deployment</li>
<li><strong>Applicazioni Mobili</strong> — Sviluppo di app mobili multipiattaforma</li>
<li><strong>Connessioni API</strong> — Design di API RESTful e GraphQL, integrazione con servizi di terze parti</li>
<li><strong>Backend e Database</strong> — Logica server-side, microservizi, progettazione e ottimizzazione di database SQL/NoSQL</li>
<li><strong>DevOps</strong> — Pipeline CI/CD, containerizzazione, infrastruttura cloud</li>
</ul>

<br/>

<h2>Sviluppo AI-First</h2>

<p>In Advisable, <strong>lo sviluppo assistito dall''IA non è opzionale — è obbligatorio</strong>. Ogni sviluppatore è tenuto a integrare gli strumenti AI nel proprio flusso di lavoro quotidiano per accelerare sviluppo, debugging e code review.</p>',
'<ul>
<li>5+ anni di esperienza professionale nello sviluppo frontend/full-stack</li>
<li>Solida competenza in <strong>NUXT/Vue.js</strong> e <strong>NEXT.js/React</strong></li>
<li>Conoscenza pratica di <strong>Rust</strong> e <strong>PHP</strong></li>
<li>Capacità di <strong>apprendere e adattarsi rapidamente</strong> a qualsiasi nuovo technology stack</li>
<li>Esperienza nello sviluppo di applicazioni mobili (React Native, Flutter o nativo)</li>
<li>Forti competenze nel design di API (REST, GraphQL)</li>
<li>Esperienza con piattaforme cloud (AWS, GCP o Azure)</li>
<li><strong>Obbligatorio:</strong> Esperienza comprovata con strumenti di sviluppo AI (Claude Code, Cursor, Copilot)</li>
<li><strong>Obbligatorio:</strong> Esperienza nella configurazione e gestione di AI Agents per l''automazione</li>
<li>Eccellenti capacità di problem-solving e attenzione ai dettagli</li>
<li>Forti competenze comunicative in inglese (il greco è un plus)</li>
</ul>',
'<ul>
<li><strong>Claude Code Premium Seat</strong> — Accesso completo agli strumenti di sviluppo AI</li>
<li>Pacchetto retributivo competitivo</li>
<li>Cultura lavorativa remote-first</li>
<li>MacBook Pro di ultima generazione e periferiche</li>
<li>Budget per partecipazione a conferenze</li>
<li>Assicurazione sanitaria e dentale</li>
<li>Stock options per posizioni senior</li>
</ul>');