
-- 1. UPDATE English (language_id=1)
UPDATE service_translations
SET title = 'UI/UX Design',
    short_description = 'User experiences that blend aesthetics, functionality, and performance',
    long_description = '<p>At Advisable, UI/UX design isn''t just about how something looks - it''s about how it works. We create digital experiences that guide users naturally, build trust, and drive conversions. Every element is designed strategically, aligned with your brand identity and business objectives.</p>

<h2>Our approach</h2>

<h3>1. User Research & Insights</h3>
<p>We analyze your audience, their behaviors, and pain points to design experiences that solve real problems and deliver measurable value.</p>

<h3>2. Information Architecture</h3>
<p>We structure the navigation flow and content hierarchy to make every interaction intuitive, clear, and efficient.</p>

<h3>3. Wireframes & Prototyping</h3>
<p>We develop quick prototypes to validate functionality and refine designs based on real user feedback.</p>

<h3>4. UI Design</h3>
<p>We craft interfaces that combine modern aesthetics, brand consistency, and a seamless user experience across all devices.</p>

<h3>5. Testing & Optimization</h3>
<p>We test every experience with real users, optimizing for usability, engagement, and performance.</p>

<h2>The benefits for you</h2>
<ul>
<li>User experiences built on real data and insights</li>
<li>Design that boosts engagement and conversion rates</li>
<li>Cohesive brand presence across all digital touchpoints</li>
<li>UX strategies that support business goals</li>
<li>Continuous improvement driven by testing and analytics</li>
</ul>

<h2>Why Advisable</h2>
<p>At Advisable, design isn''t decoration, it''s strategy. By combining creativity, data analysis, and digital expertise, we craft experiences that turn visitors into loyal users and customers.</p>

<h2>Next step</h2>
<p>Looking for a UI/UX design that makes your product truly stand out? Let''s design the experience your users will love.</p>',
    seo_title = 'UI/UX Design | Advisable',
    meta_description = 'At Advisable, UI/UX design isn''t just about how something looks - it''s about how it works. We create digital experiences that guide users naturally, build trust, and drive conversions.'
WHERE service_id = '6219764d-15fd-4c4d-8e03-d9a25666d391' AND language_id = 1;

-- 2. INSERT Greek (language_id=5)
INSERT INTO service_translations (service_id, language_id, title, short_description, long_description, seo_title, meta_description)
VALUES ('6219764d-15fd-4c4d-8e03-d9a25666d391', 5,
'UI/UX Design',
'Εμπειρίες χρήστη που συνδυάζουν αισθητική, λειτουργικότητα και απόδοση',
'<p>Στην Advisable, το UI/UX Design δεν αφορά μόνο την εμφάνιση, αφορά το πώς λειτουργεί κάθε ψηφιακή εμπειρία. Δημιουργούμε διεπαφές που καθοδηγούν τον χρήστη φυσικά, ενισχύουν την εμπιστοσύνη και αυξάνουν τις μετατροπές. Κάθε στοιχείο σχεδιάζεται με γνώμονα τη στρατηγική, το brand και τους επιχειρηματικούς στόχους.</p>

<h2>Η προσέγγισή μας</h2>

<h3>1. Έρευνα & Κατανόηση Χρηστών</h3>
<p>Αναλύουμε το κοινό, τις συμπεριφορές και τα pain points, για να δημιουργήσουμε εμπειρίες που πραγματικά λύνουν προβλήματα και προσθέτουν αξία.</p>

<h3>2. Σχεδιασμός Πληροφορικής Αρχιτεκτονικής (Information Architecture)</h3>
<p>Δομούμε τη ροή της πλοήγησης και την ιεραρχία περιεχομένου ώστε η εμπειρία να είναι καθαρή, απλή και αποδοτική.</p>

<h3>3. Wireframes & Prototyping</h3>
<p>Αναπτύσσουμε γρήγορα πρωτότυπα (prototypes) για να δοκιμάζουμε τη λειτουργικότητα και να προσαρμόζουμε τον σχεδιασμό βάσει πραγματικού feedback.</p>

<h3>4. UI Design</h3>
<p>Δημιουργούμε διεπαφές που συνδυάζουν μοντέρνα αισθητική, συνέπεια με την ταυτότητα του brand και υψηλή ευχρηστία.</p>

<h3>5. Testing & Optimization</h3>
<p>Δοκιμάζουμε κάθε εμπειρία με πραγματικούς χρήστες, με στόχο τη βελτίωση της απόδοσης και τη μέγιστη ικανοποίηση.</p>

<h2>Τα οφέλη για εσάς</h2>
<ul>
<li>Εμπειρίες που βασίζονται σε πραγματικά δεδομένα χρηστών</li>
<li>Ελκυστικό design που αυξάνει το engagement και τα conversions</li>
<li>Ενιαία οπτική ταυτότητα σε όλα τα digital σημεία επαφής</li>
<li>UX στρατηγική που εξυπηρετεί επιχειρηματικούς στόχους</li>
<li>Συνεχής βελτίωση βάσει testing και analytics</li>
</ul>

<h2>Γιατί Advisable</h2>
<p>Στην Advisable, το design δεν είναι διακόσμηση, είναι στρατηγική. Με συνδυασμό δημιουργικότητας, ανάλυσης δεδομένων και digital expertise, σχεδιάζουμε εμπειρίες που μετατρέπουν επισκέπτες σε πιστούς χρήστες και πελάτες.</p>

<h2>Επόμενο βήμα</h2>
<p>Θέλετε ένα UI/UX design που θα κάνει το προϊόν σας πραγματικά ξεχωριστό; Ας σχεδιάσουμε μαζί την εμπειρία που θα αγαπήσουν οι χρήστες σας.</p>',
'UI/UX Design | Advisable',
'Στην Advisable, το UI/UX Design δεν αφορά μόνο την εμφάνιση, αφορά το πώς λειτουργεί κάθε ψηφιακή εμπειρία. Δημιουργούμε διεπαφές που καθοδηγούν τον χρήστη φυσικά.');

-- 3. INSERT Spanish (language_id=2)
INSERT INTO service_translations (service_id, language_id, title, short_description, long_description, seo_title, meta_description)
VALUES ('6219764d-15fd-4c4d-8e03-d9a25666d391', 2,
'UI/UX Design',
'Experiencias de usuario que combinan estética, funcionalidad y rendimiento',
'<p>En Advisable, el diseño UI/UX no se trata solo de cómo se ve algo - sino de cómo funciona. Creamos experiencias digitales que guían al usuario de forma natural, generan confianza y aumentan las conversiones. Cada elemento está diseñado estratégicamente, alineado con la identidad de tu marca y tus objetivos comerciales.</p>

<h2>Nuestro enfoque</h2>

<h3>1. Investigación y comprensión del usuario</h3>
<p>Analizamos a tu audiencia, sus comportamientos y puntos de dolor para diseñar experiencias que resuelvan problemas reales y generen valor medible.</p>

<h3>2. Arquitectura de la información</h3>
<p>Estructuramos la navegación y la jerarquía del contenido para que cada interacción sea intuitiva, clara y eficiente.</p>

<h3>3. Wireframes y Prototipado</h3>
<p>Desarrollamos prototipos rápidos para validar la funcionalidad y ajustar el diseño según el feedback real de los usuarios.</p>

<h3>4. Diseño UI</h3>
<p>Creamos interfaces que combinan estética moderna, coherencia de marca y una experiencia fluida en todos los dispositivos.</p>

<h3>5. Pruebas y Optimización</h3>
<p>Probamos cada experiencia con usuarios reales, optimizando la usabilidad, el engagement y el rendimiento.</p>

<h2>Los beneficios para ti</h2>
<ul>
<li>Experiencias basadas en datos reales y conocimientos del usuario</li>
<li>Diseño que impulsa el engagement y las conversiones</li>
<li>Presencia de marca coherente en todos los canales digitales</li>
<li>Estrategias UX alineadas con los objetivos de negocio</li>
<li>Mejora continua basada en pruebas y análisis</li>
</ul>

<h2>Por qué Advisable</h2>
<p>En Advisable, el diseño no es decoración, es estrategia. Combinamos creatividad, análisis de datos y experiencia digital para crear experiencias que convierten visitantes en usuarios y clientes fieles.</p>

<h2>Próximo paso</h2>
<p>¿Buscas un diseño UI/UX que haga que tu producto destaque de verdad? Diseñémoslo juntos, la experiencia que tus usuarios amarán.</p>',
'UI/UX Design | Advisable',
'En Advisable, el diseño UI/UX no se trata solo de cómo se ve algo - sino de cómo funciona. Creamos experiencias digitales que guían al usuario de forma natural.');

-- 4. INSERT French (language_id=3)
INSERT INTO service_translations (service_id, language_id, title, short_description, long_description, seo_title, meta_description)
VALUES ('6219764d-15fd-4c4d-8e03-d9a25666d391', 3,
'UI/UX Design',
'Des expériences utilisateur alliant esthétique, fonctionnalité et performance',
'<p>Chez Advisable, le design UI/UX ne concerne pas seulement l''apparence, il s''agit avant tout de la manière dont les choses fonctionnent. Nous créons des expériences digitales qui guident naturellement l''utilisateur, renforcent la confiance et stimulent les conversions. Chaque élément est conçu de manière stratégique, en accord avec l''identité de votre marque et vos objectifs commerciaux.</p>

<h2>Notre approche</h2>

<h3>1. Recherche et compréhension des utilisateurs</h3>
<p>Nous analysons votre audience, ses comportements et ses points de friction afin de concevoir des expériences qui résolvent de vrais problèmes et créent de la valeur mesurable.</p>

<h3>2. Architecture de l''information</h3>
<p>Nous structurons la navigation et la hiérarchie du contenu pour rendre chaque interaction intuitive, claire et efficace.</p>

<h3>3. Wireframes et prototypage</h3>
<p>Nous développons des prototypes rapides pour valider la fonctionnalité et ajuster le design en fonction des retours utilisateurs.</p>

<h3>4. Design UI</h3>
<p>Nous concevons des interfaces modernes, cohérentes avec votre marque et offrant une expérience fluide sur tous les appareils.</p>

<h3>5. Tests et optimisation</h3>
<p>Nous testons chaque expérience avec de vrais utilisateurs pour optimiser l''ergonomie, l''engagement et la performance.</p>

<h2>Les bénéfices pour vous</h2>
<ul>
<li>Des expériences fondées sur des données réelles et des insights utilisateurs</li>
<li>Un design qui améliore l''engagement et les conversions</li>
<li>Une identité de marque cohérente sur tous les points de contact digitaux</li>
<li>Des stratégies UX alignées sur vos objectifs commerciaux</li>
<li>Une amélioration continue grâce aux tests et à l''analyse des données</li>
</ul>

<h2>Pourquoi Advisable</h2>
<p>Chez Advisable, le design n''est pas une simple question d''esthétique, c''est une stratégie. En combinant créativité, analyse de données et expertise digitale, nous concevons des expériences qui transforment les visiteurs en utilisateurs fidèles et en clients.</p>

<h2>Prochaine étape</h2>
<p>Vous souhaitez un design UI/UX qui fasse réellement la différence ? Créons ensemble l''expérience que vos utilisateurs vont adorer.</p>',
'UI/UX Design | Advisable',
'Chez Advisable, le design UI/UX ne concerne pas seulement l''apparence, il s''agit avant tout de la manière dont les choses fonctionnent.');

-- 5. INSERT Italian (language_id=10)
INSERT INTO service_translations (service_id, language_id, title, short_description, long_description, seo_title, meta_description)
VALUES ('6219764d-15fd-4c4d-8e03-d9a25666d391', 10,
'Design UI/UX',
'Esperienze utente che fondono estetica, funzionalità e prestazioni',
'<p>In Advisable, il design UI/UX non riguarda solo l''aspetto visivo, ma il funzionamento stesso del prodotto. Creiamo esperienze digitali che guidano gli utenti in modo naturale, costruiscono fiducia e aumentano le conversioni. Ogni elemento è progettato strategicamente, in linea con l''identità del vostro marchio e i vostri obiettivi di business.</p>

<h2>Il nostro approccio</h2>

<h3>Ricerca Utenti e Insight</h3>
<p>Analizziamo il vostro pubblico, i loro comportamenti e le loro criticità per progettare esperienze che risolvano problemi reali e offrano un valore misurabile.</p>

<h3>Architettura dell''Informazione</h3>
<p>Strutturiamo il flusso di navigazione e la gerarchia dei contenuti per rendere ogni interazione intuitiva, chiara ed efficiente.</p>

<h3>Wireframe e Prototipazione</h3>
<p>Sviluppiamo prototipi rapidi per validare le funzionalità e perfezionare il design sulla base di feedback reali degli utenti.</p>

<h3>Design dell''Interfaccia (UI)</h3>
<p>Creiamo interfacce che combinano estetica moderna, coerenza del brand e un''esperienza utente fluida su tutti i dispositivi.</p>

<h3>Test e Ottimizzazione</h3>
<p>Testiamo ogni esperienza con utenti reali, ottimizzando l''usabilità, il coinvolgimento e le prestazioni.</p>

<h2>I vantaggi per voi</h2>
<ul>
<li>Esperienze utente basate su dati e approfondimenti reali</li>
<li>Design che aumenta il coinvolgimento e i tassi di conversione</li>
<li>Presenza del brand coesa su tutti i punti di contatto digitali</li>
<li>Strategie UX che supportano gli obiettivi aziendali</li>
<li>Miglioramento continuo guidato da test e analisi</li>
</ul>

<h2>Perché Advisable</h2>
<p>In Advisable, il design non è decorazione, è strategia. Combinando creatività, analisi dei dati e competenza digitale, realizziamo esperienze che trasformano i visitatori in utenti e clienti fedeli.</p>

<h2>Prossimo passo</h2>
<p>Cercate un design UI/UX che faccia davvero risaltare il vostro prodotto? Progettiamo insieme l''esperienza che i vostri utenti ameranno.</p>',
'Design UI/UX | Advisable',
'In Advisable, il design UI/UX non riguarda solo l''aspetto visivo, ma il funzionamento stesso del prodotto. Creiamo esperienze digitali che guidano gli utenti in modo naturale.');
