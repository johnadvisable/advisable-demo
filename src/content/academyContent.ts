// @ts-nocheck
/**
 * Localized copy for the Academy hub (/academy) and the
 * AI training for business landing page (/academy/ai-training-for-business).
 * The seminar landing pages stay in Greek by design.
 */

export function pickLang<T>(dict: Record<string, T>, language?: string): T {
  return dict[language || 'en'] || dict.en;
}

/* ------------------------------ Academy hub ----------------------------- */

export const ACADEMY_HUB = {
  el: {
    seo: {
      title: 'Advisable Academy - Εκπαίδευση AI για επιχειρήσεις και σεμινάρια',
      description:
        'Δύο τρόποι να μάθετε AI: εκπαίδευση μέσα στην επιχείρησή σας σε Claude, ChatGPT και Microsoft Copilot, ή συμμετοχή στο επόμενο ανοιχτό σεμινάριο.',
    },
    hero: {
      title: 'Πρακτική εκπαίδευση AI, με τρεις τρόπους',
      subtitle: 'Διαλέξτε εκπαίδευση μέσα στην επιχείρησή σας, συμμετοχή στο επόμενο ανοιχτό σεμινάριο ή μαθήματα σε βίντεο όποτε θέλετε.',
      businessTitle: 'Εκπαίδευση για επιχειρήσεις',
      businessText: 'Εκπαίδευση της ομάδας σας σε Claude, ChatGPT ή Microsoft Copilot, προσαρμοσμένη στη δουλειά σας.',
      businessCta: 'Δείτε πώς γίνεται',
      seminarTitle: 'Σεμινάριο',
      seminarText: 'Ανοιχτά σεμινάρια σε μικρά group. Δείτε το επόμενο διαθέσιμο και κρατήστε τη θέση σας.',
      seminarCta: 'Επόμενο σεμινάριο',
    },
    business: {
      title: 'Εκπαίδευση για επιχειρήσεις',
      intro:
        'Ερχόμαστε στην επιχείρησή σας και εκπαιδεύουμε την ομάδα να δουλεύει με AI στην πράξη. Επιλέγετε εργαλείο, εμείς φτιάχνουμε την ύλη πάνω στις δικές σας διαδικασίες.',
      tracks: [
        'Καθημερινή χρήση, Cowork, Skills και MCP connectors, πάνω στα δικά σας δεδομένα και εργαλεία.',
        'Prompting, custom GPTs και ροές εργασίας για marketing, πωλήσεις, εξυπηρέτηση και operations.',
        'Copilot μέσα σε Microsoft 365: Word, Excel, Outlook, Teams, με πολιτικές και ασφάλεια.',
      ],
      points: [
        'Στους χώρους σας, στο Advisable Academy ή online',
        'Υλη προσαρμοσμένη στα τμήματα και στα use cases σας',
        'Πρακτικά εργαστήρια με πραγματικά αρχεία και διαδικασίες',
        'Οδηγός χρήσης και πολιτική AI για την ομάδα σας',
      ],
      ctaProposal: 'Ζητήστε πρόταση εκπαίδευσης',
      ctaMore: 'Μάθετε περισσότερα',
    },
    seminars: {
      title: 'Σεμινάριο',
      intro:
        'Ανοιχτά σεμινάρια με θεματική, σε μικρά group. Κάθε σεμινάριο έχει τη δική του σελίδα με αναλυτική ύλη, κράτηση θέσης και πληρωμή.',
      empty: 'Δεν υπάρχει προγραμματισμένο σεμινάριο αυτή τη στιγμή.',
      view: 'Δείτε το σεμινάριο',
      th: { seminar: 'Σεμινάριο', date: 'Ημερομηνία', time: 'Ωρες', mode: 'Τρόπος', seats: 'Θέσεις', price: 'Τιμή' },
    },
  },
  en: {
    seo: {
      title: 'Advisable Academy - AI training for companies and seminars',
      description:
        'Two ways to learn AI: in-company training on Claude, ChatGPT and Microsoft Copilot, or a seat at the next open seminar.',
    },
    hero: {
      title: 'Practical AI training, in three ways',
      subtitle: 'Choose training inside your own company, a seat at the next open seminar, or video lessons on demand.',
      businessTitle: 'Training for companies',
      businessText: 'Train your team on Claude, ChatGPT or Microsoft Copilot, tailored to the way you actually work.',
      businessCta: 'See how it works',
      seminarTitle: 'Seminar',
      seminarText: 'Open seminars in small groups. See the next available date and reserve your seat.',
      seminarCta: 'Next seminar',
    },
    business: {
      title: 'Training for companies',
      intro:
        'We come to your company and train your team to work with AI in practice. You pick the tool, we build the curriculum around your own processes.',
      tracks: [
        'Everyday use, Cowork, Skills and MCP connectors, on your own data and tools.',
        'Prompting, custom GPTs and workflows for marketing, sales, support and operations.',
        'Copilot inside Microsoft 365: Word, Excel, Outlook, Teams, with policies and security.',
      ],
      points: [
        'At your offices, at Advisable Academy or online',
        'Curriculum adapted to your departments and use cases',
        'Hands-on workshops with real files and processes',
        'Usage guide and AI policy for your team',
      ],
      ctaProposal: 'Request a training proposal',
      ctaMore: 'Learn more',
    },
    seminars: {
      title: 'Seminar',
      intro:
        'Themed open seminars in small groups. Every seminar has its own page with the full curriculum, seat booking and payment.',
      empty: 'There is no scheduled seminar at the moment.',
      view: 'View the seminar',
      th: { seminar: 'Seminar', date: 'Date', time: 'Time', mode: 'Mode', seats: 'Seats', price: 'Price' },
    },
  },
  es: {
    seo: {
      title: 'Advisable Academy - Formación en IA para empresas y seminarios',
      description:
        'Dos formas de aprender IA: formación dentro de su empresa en Claude, ChatGPT y Microsoft Copilot, o una plaza en el próximo seminario abierto.',
    },
    hero: {
      title: 'Formación práctica en IA, de tres formas',
      subtitle: 'Elija formación dentro de su propia empresa o una plaza en el próximo seminario abierto.',
      businessTitle: 'Formación para empresas',
      businessText: 'Formamos a su equipo en Claude, ChatGPT o Microsoft Copilot, adaptado a su forma real de trabajar.',
      businessCta: 'Vea cómo funciona',
      seminarTitle: 'Seminario',
      seminarText: 'Seminarios abiertos en grupos reducidos. Vea la próxima fecha disponible y reserve su plaza.',
      seminarCta: 'Próximo seminario',
    },
    business: {
      title: 'Formación para empresas',
      intro:
        'Vamos a su empresa y formamos a su equipo para trabajar con IA en la práctica. Usted elige la herramienta y nosotros construimos el temario sobre sus propios procesos.',
      tracks: [
        'Uso diario, Cowork, Skills y MCP connectors, sobre sus propios datos y herramientas.',
        'Prompting, custom GPTs y flujos de trabajo para marketing, ventas, atención al cliente y operaciones.',
        'Copilot dentro de Microsoft 365: Word, Excel, Outlook, Teams, con políticas y seguridad.',
      ],
      points: [
        'En sus oficinas, en Advisable Academy u online',
        'Temario adaptado a sus departamentos y casos de uso',
        'Talleres prácticos con archivos y procesos reales',
        'Guía de uso y política de IA para su equipo',
      ],
      ctaProposal: 'Solicite una propuesta de formación',
      ctaMore: 'Más información',
    },
    seminars: {
      title: 'Seminario',
      intro:
        'Seminarios abiertos temáticos en grupos reducidos. Cada seminario tiene su propia página con el temario completo, la reserva de plaza y el pago.',
      empty: 'No hay ningún seminario programado en este momento.',
      view: 'Ver el seminario',
      th: { seminar: 'Seminario', date: 'Fecha', time: 'Horario', mode: 'Modalidad', seats: 'Plazas', price: 'Precio' },
    },
  },
  fr: {
    seo: {
      title: 'Advisable Academy - Formation IA pour les entreprises et séminaires',
      description:
        "Deux façons d'apprendre l'IA : une formation au sein de votre entreprise sur Claude, ChatGPT et Microsoft Copilot, ou une place au prochain séminaire ouvert.",
    },
    hero: {
      title: "Formation IA pratique, de trois façons",
      subtitle: 'Choisissez une formation au sein de votre entreprise ou une place au prochain séminaire ouvert.',
      businessTitle: 'Formation pour les entreprises',
      businessText: 'Nous formons votre équipe sur Claude, ChatGPT ou Microsoft Copilot, adapté à votre façon de travailler.',
      businessCta: 'Voir comment ça marche',
      seminarTitle: 'Séminaire',
      seminarText: 'Séminaires ouverts en petits groupes. Découvrez la prochaine date et réservez votre place.',
      seminarCta: 'Prochain séminaire',
    },
    business: {
      title: 'Formation pour les entreprises',
      intro:
        "Nous venons dans votre entreprise et formons votre équipe à travailler avec l'IA en pratique. Vous choisissez l'outil, nous construisons le programme autour de vos propres processus.",
      tracks: [
        'Usage quotidien, Cowork, Skills et MCP connectors, sur vos propres données et outils.',
        'Prompting, custom GPTs et workflows pour le marketing, les ventes, le support et les opérations.',
        'Copilot dans Microsoft 365 : Word, Excel, Outlook, Teams, avec politiques et sécurité.',
      ],
      points: [
        'Dans vos bureaux, à Advisable Academy ou en ligne',
        'Programme adapté à vos départements et à vos cas d\'usage',
        'Ateliers pratiques avec vos fichiers et processus réels',
        "Guide d'utilisation et politique IA pour votre équipe",
      ],
      ctaProposal: 'Demandez une proposition de formation',
      ctaMore: 'En savoir plus',
    },
    seminars: {
      title: 'Séminaire',
      intro:
        'Séminaires ouverts thématiques en petits groupes. Chaque séminaire a sa propre page avec le programme détaillé, la réservation de place et le paiement.',
      empty: "Aucun séminaire n'est programmé pour le moment.",
      view: 'Voir le séminaire',
      th: { seminar: 'Séminaire', date: 'Date', time: 'Horaires', mode: 'Format', seats: 'Places', price: 'Prix' },
    },
  },
  it: {
    seo: {
      title: 'Advisable Academy - Formazione AI per aziende e seminari',
      description:
        'Due modi per imparare l\'AI: formazione all\'interno della vostra azienda su Claude, ChatGPT e Microsoft Copilot, oppure un posto al prossimo seminario aperto.',
    },
    hero: {
      title: 'Formazione AI pratica, in tre modi',
      subtitle: 'Scegliete la formazione dentro la vostra azienda oppure un posto al prossimo seminario aperto.',
      businessTitle: 'Formazione per aziende',
      businessText: 'Formiamo il vostro team su Claude, ChatGPT o Microsoft Copilot, su misura per il vostro modo di lavorare.',
      businessCta: 'Scoprite come funziona',
      seminarTitle: 'Seminario',
      seminarText: 'Seminari aperti in piccoli gruppi. Guardate la prossima data disponibile e prenotate il vostro posto.',
      seminarCta: 'Prossimo seminario',
    },
    business: {
      title: 'Formazione per aziende',
      intro:
        "Veniamo nella vostra azienda e formiamo il team a lavorare con l'AI nella pratica. Voi scegliete lo strumento, noi costruiamo il programma sui vostri processi.",
      tracks: [
        'Uso quotidiano, Cowork, Skills e MCP connectors, sui vostri dati e strumenti.',
        'Prompting, custom GPTs e workflow per marketing, vendite, assistenza e operations.',
        'Copilot dentro Microsoft 365: Word, Excel, Outlook, Teams, con policy e sicurezza.',
      ],
      points: [
        'Nei vostri uffici, presso Advisable Academy o online',
        'Programma adattato ai vostri reparti e casi d\'uso',
        'Workshop pratici con file e processi reali',
        "Guida all'uso e policy AI per il vostro team",
      ],
      ctaProposal: 'Richiedete una proposta di formazione',
      ctaMore: 'Scoprite di più',
    },
    seminars: {
      title: 'Seminario',
      intro:
        'Seminari aperti tematici in piccoli gruppi. Ogni seminario ha la sua pagina con il programma completo, la prenotazione del posto e il pagamento.',
      empty: 'Al momento non ci sono seminari in programma.',
      view: 'Vedi il seminario',
      th: { seminar: 'Seminario', date: 'Data', time: 'Orario', mode: 'Modalità', seats: 'Posti', price: 'Prezzo' },
    },
  },
};

ACADEMY_HUB.de = ACADEMY_HUB.en;

/* ------------------------- AI training for business ---------------------- */

export const ACADEMY_TRAINING = {
  el: {
    seo: {
      title: 'AI Training για επιχειρήσεις - Advisable Academy',
      description:
        'Εταιρική εκπαίδευση AI: gap analysis, custom πλάνο ανά τμήμα και ειδικότητα, workshops σε Claude, ChatGPT και Microsoft Copilot, στους χώρους σας, στο Advisable Academy ή online.',
      breadcrumb: 'AI Training για επιχειρήσεις',
      courseName: 'AI Training για επιχειρήσεις',
      courseDescription:
        'Εταιρική εκπαίδευση AI με gap analysis, custom πλάνο ανά ειδικότητα και hands on workshops σε Claude, ChatGPT και Microsoft Copilot.',
    },
    hero: {
      imageAlt: 'AI training για επιχειρήσεις από την Advisable Academy',
      title: 'AI training για επιχειρήσεις, φτιαγμένο πάνω στη δική σας δουλειά',
      subtitle:
        'Ξεκινάμε με gap analysis, φτιάχνουμε custom πλάνο για κάθε τμήμα και ειδικότητα και στη συνέχεια εκτελούμε την εκπαίδευση και τα workshops, δια ζώσης ή online.',
      ctaProposal: 'Ζητήστε πρόταση εκπαίδευσης',
      ctaSeminars: 'Δείτε τα σεμινάρια',
      badges: [
        'Στους χώρους σας, στο Advisable Academy ή online',
        'Υλη ανά τμήμα και ειδικότητα',
        'Πολιτική χρήσης και ασφάλεια',
      ],
    },
    method: {
      title: 'Πώς δουλεύουμε',
      intro:
        'Τέσσερα βήματα, από την ανάλυση μέχρι την πραγματική υιοθέτηση. Κάθε βήμα παραδίδει κάτι συγκεκριμένο στην ομάδα σας.',
    },
    phases: [
      {
        title: 'AI Gap Analysis',
        text: 'Χαρτογραφούμε πώς δουλεύει σήμερα η ομάδα σας. Συνεντεύξεις με τους υπευθύνους των τμημάτων, καταγραφή των εργασιών που τρώνε τον περισσότερο χρόνο και αξιολόγηση του επιπέδου AI ωριμότητας ανά ειδικότητα.',
        bullets: [
          'Ερωτηματολόγιο αυτοαξιολόγησης ανά εργαζόμενο',
          'Καταγραφή εργαλείων, δεδομένων και περιορισμών',
          'Εντοπισμός των use cases με τη μεγαλύτερη αξία',
        ],
      },
      {
        title: 'Custom Training Plan',
        text: 'Φτιάχνουμε πρόγραμμα εκπαίδευσης προσαρμοσμένο στα τμήματα και στις ειδικότητες. Δεν παίρνετε γενική παρουσίαση, αλλά ύλη γραμμένη πάνω στα δικά σας αρχεία, στις δικές σας διαδικασίες και στο δικό σας λεξιλόγιο.',
        bullets: [
          'Διαφορετικά μονοπάτια για marketing, πωλήσεις, οικονομικά, operations, IT',
          'Επίπεδα: εισαγωγικό, προχωρημένο, power user',
          'Επιλογή εργαλείου: Claude, ChatGPT ή Microsoft Copilot',
        ],
      },
      {
        title: 'Εκπαίδευση και Workshops',
        text: 'Εκτελούμε την εκπαίδευση δια ζώσης στους χώρους σας, στο Advisable Academy ή online. Κάθε ενότητα κλείνει με hands on workshop όπου η ομάδα δουλεύει σε πραγματικά δικά της παραδοτέα, όχι σε παραδείγματα βιτρίνας.',
        bullets: [
          'Live demos και άσκηση με πραγματικά αρχεία',
          'Workshops ανά τμήμα σε μικρά group',
          'Δημιουργία βιβλιοθήκης prompts και templates',
        ],
      },
      {
        title: 'Υιοθέτηση και Follow up',
        text: 'Μετά την εκπαίδευση μένουμε κοντά στην ομάδα. Παραδίδουμε οδηγό χρήσης και πολιτική AI, μετράμε τι πραγματικά χρησιμοποιείται και κάνουμε επαναληπτικές συνεδρίες εκεί που χρειάζεται.',
        bullets: [
          'Εσωτερικός οδηγός χρήσης και πολιτική AI',
          'Follow up session μετά από 30 ημέρες',
          'Προαιρετικό office hours support για την ομάδα',
        ],
      },
    ],
    tools: {
      title: 'Εργαλεία που καλύπτουμε',
      intro: 'Επιλέγετε εργαλείο ή σας προτείνουμε εμείς, με βάση το stack και τις ανάγκες σας.',
      items: [
        'Καθημερινή χρήση, Cowork, Skills και MCP connectors πάνω στα δικά σας δεδομένα και εργαλεία.',
        'Prompting, custom GPTs και ροές εργασίας για marketing, πωλήσεις, εξυπηρέτηση και operations.',
        'Copilot μέσα σε Microsoft 365: Word, Excel, Outlook, Teams, με πολιτικές και ασφάλεια.',
      ],
    },
    departments: {
      title: 'Εκπαίδευση ανά τμήμα και ειδικότητα',
      intro: 'Κάθε ειδικότητα έχει διαφορετικές ανάγκες. Η ύλη γράφεται ξεχωριστά για κάθε ομάδα.',
      items: [
        { title: 'Marketing και Πωλήσεις', text: 'Παραγωγή περιεχομένου, έρευνα αγοράς, proposals, follow up emails, ανάλυση καμπανιών.' },
        { title: 'Οικονομικά και Διοίκηση', text: 'Ανάλυση αρχείων Excel, reporting, σύνοψη συμβάσεων, προετοιμασία παρουσιάσεων.' },
        { title: 'Εξυπηρέτηση Πελατών', text: 'Απαντήσεις με βάση τη γνώση σας, κατηγοριοποίηση αιτημάτων, ποιοτικός έλεγχος.' },
        { title: 'Operations', text: 'Τεκμηρίωση διαδικασιών, checklists, αυτοματισμοί σε επαναλαμβανόμενες εργασίες.' },
        { title: 'IT και Τεχνικές Ομάδες', text: 'Ανάλυση κώδικα, documentation, integrations και ασφαλής χρήση AI εργαλείων.' },
        { title: 'Ηγεσία', text: 'Στρατηγική AI, προτεραιοποίηση use cases, πολιτική χρήσης και διαχείριση ρίσκου.' },
      ],
    },
    formats: {
      title: 'Μορφές προγράμματος',
      note: 'Η τελική δομή και το κόστος προκύπτουν μετά το gap analysis.',
      items: [
        { title: 'Kickstart', text: 'Μισή ημέρα εισαγωγικής εκπαίδευσης για μία ομάδα, με demo και πρακτική άσκηση.', points: ['Έως 15 άτομα', 'Στους χώρους σας, στο Advisable Academy ή online', 'Βασικά use cases'] },
        { title: 'Department Program', text: 'Πρόγραμμα πολλαπλών συνεδριών ανά τμήμα, με gap analysis και workshops πάνω στα δικά σας παραδοτέα.', points: ['Gap analysis', 'Custom ύλη ανά ειδικότητα', 'Hands on workshops'] },
        { title: 'Company Wide', text: 'Ολοκληρωμένο πρόγραμμα για όλη την εταιρεία, με πολιτική AI, champions και follow up.', points: ['Πολλαπλά τμήματα', 'Πολιτική και governance', 'Follow up και support'] },
      ],
    },
    outcomes: {
      title: 'Τι παίρνει η ομάδα σας',
      items: [
        'Λιγότερος χρόνος σε επαναλαμβανόμενη γραφειοκρατική εργασία',
        'Κοινός τρόπος δουλειάς με AI σε όλη την εταιρεία',
        'Βιβλιοθήκη prompts και templates που μένει στην ομάδα σας',
        'Ξεκάθαρη πολιτική για δεδομένα, εμπιστευτικότητα και ασφάλεια',
        'Μετρήσιμη υιοθέτηση, όχι εργαλεία που μένουν αχρησιμοποίητα',
        'Εσωτερικοί champions που συνεχίζουν την εκπαίδευση',
      ],
    },
    faqTitle: 'Συχνές ερωτήσεις',
    faq: [
      { q: 'Χρειάζεται η ομάδα προηγούμενη εμπειρία με AI;', a: 'Οχι. Το gap analysis δείχνει το επίπεδο κάθε ομάδας και φτιάχνουμε ξεχωριστά μονοπάτια, από εντελώς εισαγωγικό μέχρι προχωρημένο.' },
      { q: 'Η εκπαίδευση γίνεται στα γραφεία μας;', a: 'Ναι. Ερχόμαστε στους χώρους σας, φιλοξενούμε την ομάδα σας στο Advisable Academy ή κάνουμε την εκπαίδευση online, ανάλογα με το τι βολεύει.' },
      { q: 'Πόσο διαρκεί ένα πρόγραμμα;', a: 'Από μισή ημέρα για ένα kickstart, μέχρι πρόγραμμα εβδομάδων για πολλαπλά τμήματα. Το τελικό πλάνο προκύπτει από το gap analysis.' },
      { q: 'Τι γίνεται με τα εμπιστευτικά μας δεδομένα;', a: 'Δουλεύουμε με τα δικά σας εργαλεία και λογαριασμούς και παραδίδουμε πολιτική χρήσης που ορίζει τι επιτρέπεται και τι όχι. Οπου χρειάζεται υπογράφουμε NDA.' },
      { q: 'Ποιο εργαλείο πρέπει να διαλέξουμε;', a: 'Εξαρτάται από το υπάρχον stack σας. Αν είστε ήδη σε Microsoft 365, το Copilot είναι φυσική επιλογή. Για βαθιά δουλειά με έγγραφα και connectors προτείνουμε Claude. Το προτείνουμε στο gap analysis.' },
      { q: 'Υπάρχει υποστήριξη μετά την εκπαίδευση;', a: 'Ναι. Κάνουμε follow up session και μπορούμε να προσθέσουμε office hours για την ομάδα σας.' },
    ],
    cta: {
      title: 'Ξεκινήστε με ένα gap analysis',
      text: 'Πείτε μας για την ομάδα σας και ετοιμάζουμε πρόταση εκπαίδευσης με συγκεκριμένη ύλη, διάρκεια και παραδοτέα.',
      proposal: 'Ζητήστε πρόταση εκπαίδευσης',
      back: 'Επιστροφή στο Academy',
    },
  },
  en: {
    seo: {
      title: 'AI training for companies - Advisable Academy',
      description:
        'Corporate AI training: gap analysis, a custom plan per department and role, workshops on Claude, ChatGPT and Microsoft Copilot, at your offices, at Advisable Academy or online.',
      breadcrumb: 'AI training for companies',
      courseName: 'AI training for companies',
      courseDescription:
        'Corporate AI training with a gap analysis, a custom plan per role and hands-on workshops on Claude, ChatGPT and Microsoft Copilot.',
    },
    hero: {
      imageAlt: 'AI training for companies by Advisable Academy',
      title: 'AI training for companies, built around your own work',
      subtitle:
        'We start with a gap analysis, build a custom plan for every department and role, and then run the training and the workshops, in person or online.',
      ctaProposal: 'Request a training proposal',
      ctaSeminars: 'See the seminars',
      badges: [
        'At your offices, at Advisable Academy or online',
        'Curriculum per department and role',
        'Usage policy and security',
      ],
    },
    method: {
      title: 'How we work',
      intro: 'Four steps, from analysis to real adoption. Every step delivers something concrete to your team.',
    },
    phases: [
      {
        title: 'AI Gap Analysis',
        text: 'We map how your team works today. Interviews with department leads, a record of the tasks that eat the most time and an assessment of AI maturity per role.',
        bullets: [
          'Self-assessment questionnaire per employee',
          'Inventory of tools, data and constraints',
          'Identification of the highest-value use cases',
        ],
      },
      {
        title: 'Custom Training Plan',
        text: 'We build a training programme adapted to your departments and roles. You do not get a generic deck, you get material written around your own files, processes and vocabulary.',
        bullets: [
          'Separate paths for marketing, sales, finance, operations, IT',
          'Levels: introductory, advanced, power user',
          'Tool of choice: Claude, ChatGPT or Microsoft Copilot',
        ],
      },
      {
        title: 'Training and workshops',
        text: 'We deliver the training in person at your offices, at Advisable Academy or online. Every module ends with a hands-on workshop where the team works on its own real deliverables, not on showcase examples.',
        bullets: [
          'Live demos and practice on real files',
          'Workshops per department in small groups',
          'Building a prompt and template library',
        ],
      },
      {
        title: 'Adoption and follow-up',
        text: 'After the training we stay close to the team. We deliver a usage guide and an AI policy, we measure what is actually being used and we run refresher sessions where needed.',
        bullets: [
          'Internal usage guide and AI policy',
          'Follow-up session after 30 days',
          'Optional office hours support for the team',
        ],
      },
    ],
    tools: {
      title: 'Tools we cover',
      intro: 'You pick the tool, or we recommend one based on your stack and your needs.',
      items: [
        'Everyday use, Cowork, Skills and MCP connectors on your own data and tools.',
        'Prompting, custom GPTs and workflows for marketing, sales, support and operations.',
        'Copilot inside Microsoft 365: Word, Excel, Outlook, Teams, with policies and security.',
      ],
    },
    departments: {
      title: 'Training per department and role',
      intro: 'Every role has different needs. The curriculum is written separately for each team.',
      items: [
        { title: 'Marketing and Sales', text: 'Content production, market research, proposals, follow-up emails, campaign analysis.' },
        { title: 'Finance and Administration', text: 'Excel analysis, reporting, contract summaries, preparing presentations.' },
        { title: 'Customer Support', text: 'Answers grounded in your knowledge base, ticket triage, quality control.' },
        { title: 'Operations', text: 'Process documentation, checklists, automation of repetitive tasks.' },
        { title: 'IT and technical teams', text: 'Code analysis, documentation, integrations and safe use of AI tools.' },
        { title: 'Leadership', text: 'AI strategy, use-case prioritisation, usage policy and risk management.' },
      ],
    },
    formats: {
      title: 'Programme formats',
      note: 'The final structure and cost come out of the gap analysis.',
      items: [
        { title: 'Kickstart', text: 'Half a day of introductory training for one team, with a demo and hands-on practice.', points: ['Up to 15 people', 'At your offices, at Advisable Academy or online', 'Core use cases'] },
        { title: 'Department Program', text: 'A multi-session programme per department, with a gap analysis and workshops on your own deliverables.', points: ['Gap analysis', 'Custom curriculum per role', 'Hands-on workshops'] },
        { title: 'Company Wide', text: 'A complete programme for the whole company, with an AI policy, champions and follow-up.', points: ['Multiple departments', 'Policy and governance', 'Follow-up and support'] },
      ],
    },
    outcomes: {
      title: 'What your team walks away with',
      items: [
        'Less time spent on repetitive administrative work',
        'A shared way of working with AI across the company',
        'A prompt and template library that stays with your team',
        'A clear policy for data, confidentiality and security',
        'Measurable adoption, not tools that stay unused',
        'Internal champions who keep the training going',
      ],
    },
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Does the team need previous AI experience?', a: 'No. The gap analysis shows the level of each team and we build separate paths, from fully introductory to advanced.' },
      { q: 'Is the training held at our offices?', a: 'Yes. We come to your offices, host your team at Advisable Academy or run the training online, whichever suits you.' },
      { q: 'How long does a programme last?', a: 'From half a day for a kickstart, up to a programme of several weeks for multiple departments. The final plan comes out of the gap analysis.' },
      { q: 'What happens with our confidential data?', a: 'We work with your own tools and accounts and deliver a usage policy that defines what is allowed and what is not. Where needed, we sign an NDA.' },
      { q: 'Which tool should we choose?', a: 'It depends on your existing stack. If you are already on Microsoft 365, Copilot is the natural choice. For deep document work and connectors we recommend Claude. We advise on this in the gap analysis.' },
      { q: 'Is there support after the training?', a: 'Yes. We run a follow-up session and can add office hours for your team.' },
    ],
    cta: {
      title: 'Start with a gap analysis',
      text: 'Tell us about your team and we will prepare a training proposal with a concrete curriculum, duration and deliverables.',
      proposal: 'Request a training proposal',
      back: 'Back to Academy',
    },
  },
  es: {
    seo: {
      title: 'Formación en IA para empresas - Advisable Academy',
      description:
        'Formación corporativa en IA: gap analysis, plan a medida por departamento y perfil, workshops en Claude, ChatGPT y Microsoft Copilot, en sus oficinas, en Advisable Academy u online.',
      breadcrumb: 'Formación en IA para empresas',
      courseName: 'Formación en IA para empresas',
      courseDescription:
        'Formación corporativa en IA con gap analysis, plan a medida por perfil y workshops prácticos en Claude, ChatGPT y Microsoft Copilot.',
    },
    hero: {
      imageAlt: 'Formación en IA para empresas de Advisable Academy',
      title: 'Formación en IA para empresas, construida sobre su propio trabajo',
      subtitle:
        'Empezamos con un gap analysis, creamos un plan a medida para cada departamento y perfil y después ejecutamos la formación y los workshops, presenciales u online.',
      ctaProposal: 'Solicite una propuesta de formación',
      ctaSeminars: 'Vea los seminarios',
      badges: [
        'En sus oficinas, en Advisable Academy u online',
        'Temario por departamento y perfil',
        'Política de uso y seguridad',
      ],
    },
    method: {
      title: 'Cómo trabajamos',
      intro: 'Cuatro pasos, del análisis a la adopción real. Cada paso entrega algo concreto a su equipo.',
    },
    phases: [
      {
        title: 'AI Gap Analysis',
        text: 'Mapeamos cómo trabaja hoy su equipo. Entrevistas con los responsables de cada departamento, registro de las tareas que consumen más tiempo y evaluación del nivel de madurez en IA por perfil.',
        bullets: [
          'Cuestionario de autoevaluación por empleado',
          'Inventario de herramientas, datos y limitaciones',
          'Identificación de los casos de uso de mayor valor',
        ],
      },
      {
        title: 'Custom Training Plan',
        text: 'Creamos un programa de formación adaptado a sus departamentos y perfiles. No recibe una presentación genérica, sino material escrito sobre sus propios archivos, procesos y vocabulario.',
        bullets: [
          'Itinerarios distintos para marketing, ventas, finanzas, operaciones, IT',
          'Niveles: introductorio, avanzado, power user',
          'Herramienta a elegir: Claude, ChatGPT o Microsoft Copilot',
        ],
      },
      {
        title: 'Formación y workshops',
        text: 'Ejecutamos la formación presencialmente en sus oficinas, en Advisable Academy u online. Cada módulo termina con un workshop práctico en el que el equipo trabaja sobre sus propios entregables reales, no sobre ejemplos de escaparate.',
        bullets: [
          'Demos en vivo y práctica con archivos reales',
          'Workshops por departamento en grupos reducidos',
          'Creación de una biblioteca de prompts y plantillas',
        ],
      },
      {
        title: 'Adopción y seguimiento',
        text: 'Después de la formación seguimos cerca del equipo. Entregamos una guía de uso y una política de IA, medimos qué se usa realmente y hacemos sesiones de refuerzo donde hace falta.',
        bullets: [
          'Guía de uso interna y política de IA',
          'Sesión de seguimiento a los 30 días',
          'Soporte opcional de office hours para el equipo',
        ],
      },
    ],
    tools: {
      title: 'Herramientas que cubrimos',
      intro: 'Usted elige la herramienta o se la recomendamos nosotros, según su stack y sus necesidades.',
      items: [
        'Uso diario, Cowork, Skills y MCP connectors sobre sus propios datos y herramientas.',
        'Prompting, custom GPTs y flujos de trabajo para marketing, ventas, atención al cliente y operaciones.',
        'Copilot dentro de Microsoft 365: Word, Excel, Outlook, Teams, con políticas y seguridad.',
      ],
    },
    departments: {
      title: 'Formación por departamento y perfil',
      intro: 'Cada perfil tiene necesidades distintas. El temario se escribe por separado para cada equipo.',
      items: [
        { title: 'Marketing y Ventas', text: 'Producción de contenido, investigación de mercado, propuestas, emails de seguimiento, análisis de campañas.' },
        { title: 'Finanzas y Administración', text: 'Análisis de archivos Excel, reporting, resumen de contratos, preparación de presentaciones.' },
        { title: 'Atención al Cliente', text: 'Respuestas basadas en su conocimiento, clasificación de solicitudes, control de calidad.' },
        { title: 'Operaciones', text: 'Documentación de procesos, checklists, automatización de tareas repetitivas.' },
        { title: 'IT y equipos técnicos', text: 'Análisis de código, documentación, integraciones y uso seguro de herramientas de IA.' },
        { title: 'Dirección', text: 'Estrategia de IA, priorización de casos de uso, política de uso y gestión del riesgo.' },
      ],
    },
    formats: {
      title: 'Formatos de programa',
      note: 'La estructura final y el coste resultan del gap analysis.',
      items: [
        { title: 'Kickstart', text: 'Media jornada de formación introductoria para un equipo, con demo y práctica.', points: ['Hasta 15 personas', 'En sus oficinas, en Advisable Academy u online', 'Casos de uso básicos'] },
        { title: 'Department Program', text: 'Programa de varias sesiones por departamento, con gap analysis y workshops sobre sus propios entregables.', points: ['Gap analysis', 'Temario a medida por perfil', 'Workshops prácticos'] },
        { title: 'Company Wide', text: 'Programa completo para toda la empresa, con política de IA, champions y seguimiento.', points: ['Varios departamentos', 'Política y governance', 'Seguimiento y soporte'] },
      ],
    },
    outcomes: {
      title: 'Qué se lleva su equipo',
      items: [
        'Menos tiempo en trabajo administrativo repetitivo',
        'Una forma común de trabajar con IA en toda la empresa',
        'Una biblioteca de prompts y plantillas que se queda en su equipo',
        'Una política clara sobre datos, confidencialidad y seguridad',
        'Adopción medible, no herramientas que quedan sin usar',
        'Champions internos que mantienen viva la formación',
      ],
    },
    faqTitle: 'Preguntas frecuentes',
    faq: [
      { q: '¿Necesita el equipo experiencia previa con IA?', a: 'No. El gap analysis muestra el nivel de cada equipo y creamos itinerarios separados, desde totalmente introductorio hasta avanzado.' },
      { q: '¿La formación se hace en nuestras oficinas?', a: 'Sí. Vamos a sus oficinas, recibimos a su equipo en Advisable Academy o hacemos la formación online, según le convenga.' },
      { q: '¿Cuánto dura un programa?', a: 'Desde media jornada para un kickstart hasta un programa de varias semanas para varios departamentos. El plan final resulta del gap analysis.' },
      { q: '¿Qué pasa con nuestros datos confidenciales?', a: 'Trabajamos con sus propias herramientas y cuentas y entregamos una política de uso que define qué se permite y qué no. Donde hace falta, firmamos un NDA.' },
      { q: '¿Qué herramienta deberíamos elegir?', a: 'Depende de su stack actual. Si ya está en Microsoft 365, Copilot es la opción natural. Para trabajo profundo con documentos y connectors recomendamos Claude. Lo aconsejamos en el gap analysis.' },
      { q: '¿Hay soporte después de la formación?', a: 'Sí. Hacemos una sesión de seguimiento y podemos añadir office hours para su equipo.' },
    ],
    cta: {
      title: 'Empiece con un gap analysis',
      text: 'Cuéntenos cómo es su equipo y preparamos una propuesta de formación con temario, duración y entregables concretos.',
      proposal: 'Solicite una propuesta de formación',
      back: 'Volver a Academy',
    },
  },
  fr: {
    seo: {
      title: "Formation IA pour les entreprises - Advisable Academy",
      description:
        "Formation IA en entreprise : gap analysis, plan sur mesure par service et par métier, ateliers sur Claude, ChatGPT et Microsoft Copilot, dans vos bureaux, à Advisable Academy ou en ligne.",
      breadcrumb: 'Formation IA pour les entreprises',
      courseName: 'Formation IA pour les entreprises',
      courseDescription:
        "Formation IA en entreprise avec gap analysis, plan sur mesure par métier et ateliers pratiques sur Claude, ChatGPT et Microsoft Copilot.",
    },
    hero: {
      imageAlt: "Formation IA pour les entreprises par Advisable Academy",
      title: 'Formation IA pour les entreprises, construite sur votre propre travail',
      subtitle:
        "Nous commençons par un gap analysis, nous construisons un plan sur mesure pour chaque service et chaque métier, puis nous menons la formation et les ateliers, en présentiel ou en ligne.",
      ctaProposal: 'Demandez une proposition de formation',
      ctaSeminars: 'Voir les séminaires',
      badges: [
        'Dans vos bureaux, à Advisable Academy ou en ligne',
        'Programme par service et par métier',
        "Politique d'utilisation et sécurité",
      ],
    },
    method: {
      title: 'Comment nous travaillons',
      intro: "Quatre étapes, de l'analyse à l'adoption réelle. Chaque étape livre quelque chose de concret à votre équipe.",
    },
    phases: [
      {
        title: 'AI Gap Analysis',
        text: "Nous cartographions la façon dont votre équipe travaille aujourd'hui. Entretiens avec les responsables de service, recensement des tâches qui consomment le plus de temps et évaluation de la maturité IA par métier.",
        bullets: [
          "Questionnaire d'auto-évaluation par collaborateur",
          'Inventaire des outils, des données et des contraintes',
          "Identification des cas d'usage à plus forte valeur",
        ],
      },
      {
        title: 'Custom Training Plan',
        text: "Nous construisons un programme de formation adapté à vos services et à vos métiers. Vous ne recevez pas une présentation générique, mais un contenu écrit à partir de vos fichiers, de vos processus et de votre vocabulaire.",
        bullets: [
          'Parcours distincts pour le marketing, les ventes, la finance, les opérations, l\'IT',
          'Niveaux : découverte, avancé, power user',
          'Outil au choix : Claude, ChatGPT ou Microsoft Copilot',
        ],
      },
      {
        title: 'Formation et ateliers',
        text: "Nous animons la formation en présentiel dans vos bureaux, à Advisable Academy ou en ligne. Chaque module se termine par un atelier pratique où l'équipe travaille sur ses propres livrables réels, pas sur des exemples de vitrine.",
        bullets: [
          'Démonstrations en direct et pratique sur des fichiers réels',
          'Ateliers par service en petits groupes',
          'Création d\'une bibliothèque de prompts et de modèles',
        ],
      },
      {
        title: 'Adoption et suivi',
        text: "Après la formation, nous restons proches de l'équipe. Nous livrons un guide d'utilisation et une politique IA, nous mesurons ce qui est réellement utilisé et nous organisons des sessions de rappel là où c'est nécessaire.",
        bullets: [
          "Guide d'utilisation interne et politique IA",
          'Session de suivi après 30 jours',
          'Support office hours en option pour l\'équipe',
        ],
      },
    ],
    tools: {
      title: 'Les outils que nous couvrons',
      intro: 'Vous choisissez l\'outil, ou nous vous en recommandons un selon votre stack et vos besoins.',
      items: [
        'Usage quotidien, Cowork, Skills et MCP connectors sur vos propres données et outils.',
        'Prompting, custom GPTs et workflows pour le marketing, les ventes, le support et les opérations.',
        'Copilot dans Microsoft 365 : Word, Excel, Outlook, Teams, avec politiques et sécurité.',
      ],
    },
    departments: {
      title: 'Formation par service et par métier',
      intro: 'Chaque métier a des besoins différents. Le programme est écrit séparément pour chaque équipe.',
      items: [
        { title: 'Marketing et Ventes', text: 'Production de contenu, étude de marché, propositions, emails de relance, analyse de campagnes.' },
        { title: 'Finance et Administration', text: 'Analyse de fichiers Excel, reporting, synthèse de contrats, préparation de présentations.' },
        { title: 'Service Client', text: 'Réponses fondées sur vos connaissances, tri des demandes, contrôle qualité.' },
        { title: 'Opérations', text: 'Documentation des processus, checklists, automatisation des tâches répétitives.' },
        { title: 'IT et équipes techniques', text: 'Analyse de code, documentation, intégrations et usage sécurisé des outils IA.' },
        { title: 'Direction', text: "Stratégie IA, priorisation des cas d'usage, politique d'utilisation et gestion du risque." },
      ],
    },
    formats: {
      title: 'Formats de programme',
      note: 'La structure finale et le coût découlent du gap analysis.',
      items: [
        { title: 'Kickstart', text: "Une demi-journée de formation d'introduction pour une équipe, avec démonstration et pratique.", points: ["Jusqu'à 15 personnes", 'Dans vos bureaux, à Advisable Academy ou en ligne', "Cas d'usage essentiels"] },
        { title: 'Department Program', text: 'Programme en plusieurs sessions par service, avec gap analysis et ateliers sur vos propres livrables.', points: ['Gap analysis', 'Programme sur mesure par métier', 'Ateliers pratiques'] },
        { title: 'Company Wide', text: "Programme complet pour toute l'entreprise, avec politique IA, champions et suivi.", points: ['Plusieurs services', 'Politique et gouvernance', 'Suivi et support'] },
      ],
    },
    outcomes: {
      title: 'Ce que votre équipe en retire',
      items: [
        'Moins de temps passé sur les tâches administratives répétitives',
        "Une façon commune de travailler avec l'IA dans toute l'entreprise",
        'Une bibliothèque de prompts et de modèles qui reste dans votre équipe',
        'Une politique claire sur les données, la confidentialité et la sécurité',
        'Une adoption mesurable, pas des outils qui restent inutilisés',
        'Des champions internes qui font vivre la formation',
      ],
    },
    faqTitle: 'Questions fréquentes',
    faq: [
      { q: "L'équipe doit-elle avoir une expérience préalable de l'IA ?", a: "Non. Le gap analysis révèle le niveau de chaque équipe et nous construisons des parcours distincts, du niveau découverte au niveau avancé." },
      { q: 'La formation se déroule-t-elle dans nos bureaux ?', a: 'Oui. Nous venons dans vos bureaux, nous accueillons votre équipe à Advisable Academy ou nous animons la formation en ligne, selon ce qui vous convient.' },
      { q: 'Combien de temps dure un programme ?', a: "D'une demi-journée pour un kickstart à un programme de plusieurs semaines pour plusieurs services. Le plan final découle du gap analysis." },
      { q: 'Que deviennent nos données confidentielles ?', a: "Nous travaillons avec vos propres outils et comptes et nous livrons une politique d'utilisation qui définit ce qui est autorisé et ce qui ne l'est pas. Si nécessaire, nous signons un NDA." },
      { q: 'Quel outil devons-nous choisir ?', a: "Cela dépend de votre stack actuel. Si vous êtes déjà sur Microsoft 365, Copilot est le choix naturel. Pour un travail approfondi sur les documents et les connectors, nous recommandons Claude. Nous vous conseillons lors du gap analysis." },
      { q: 'Y a-t-il un accompagnement après la formation ?', a: "Oui. Nous organisons une session de suivi et nous pouvons ajouter des office hours pour votre équipe." },
    ],
    cta: {
      title: 'Commencez par un gap analysis',
      text: 'Parlez-nous de votre équipe et nous préparons une proposition de formation avec un programme, une durée et des livrables précis.',
      proposal: 'Demandez une proposition de formation',
      back: 'Retour à Academy',
    },
  },
  it: {
    seo: {
      title: 'Formazione AI per aziende - Advisable Academy',
      description:
        "Formazione AI aziendale: gap analysis, piano su misura per reparto e ruolo, workshop su Claude, ChatGPT e Microsoft Copilot, nei vostri uffici, presso Advisable Academy o online.",
      breadcrumb: 'Formazione AI per aziende',
      courseName: 'Formazione AI per aziende',
      courseDescription:
        'Formazione AI aziendale con gap analysis, piano su misura per ruolo e workshop pratici su Claude, ChatGPT e Microsoft Copilot.',
    },
    hero: {
      imageAlt: 'Formazione AI per aziende di Advisable Academy',
      title: 'Formazione AI per aziende, costruita sul vostro lavoro',
      subtitle:
        'Partiamo da una gap analysis, costruiamo un piano su misura per ogni reparto e ruolo e poi eseguiamo la formazione e i workshop, in presenza o online.',
      ctaProposal: 'Richiedete una proposta di formazione',
      ctaSeminars: 'Guardate i seminari',
      badges: [
        'Nei vostri uffici, presso Advisable Academy o online',
        'Programma per reparto e ruolo',
        "Policy d'uso e sicurezza",
      ],
    },
    method: {
      title: 'Come lavoriamo',
      intro: "Quattro passi, dall'analisi all'adozione reale. Ogni passo consegna qualcosa di concreto al vostro team.",
    },
    phases: [
      {
        title: 'AI Gap Analysis',
        text: 'Mappiamo come lavora oggi il vostro team. Interviste con i responsabili di reparto, rilevazione delle attività che consumano più tempo e valutazione del livello di maturità AI per ruolo.',
        bullets: [
          'Questionario di autovalutazione per ogni collaboratore',
          'Inventario di strumenti, dati e vincoli',
          "Individuazione dei casi d'uso a maggior valore",
        ],
      },
      {
        title: 'Custom Training Plan',
        text: 'Costruiamo un programma di formazione adattato ai vostri reparti e ruoli. Non ricevete una presentazione generica, ma materiale scritto sui vostri file, sui vostri processi e sul vostro vocabolario.',
        bullets: [
          'Percorsi distinti per marketing, vendite, finance, operations, IT',
          'Livelli: introduttivo, avanzato, power user',
          'Strumento a scelta: Claude, ChatGPT o Microsoft Copilot',
        ],
      },
      {
        title: 'Formazione e workshop',
        text: 'Eroghiamo la formazione in presenza nei vostri uffici, presso Advisable Academy o online. Ogni modulo si chiude con un workshop pratico in cui il team lavora sui propri deliverable reali, non su esempi da vetrina.',
        bullets: [
          'Demo dal vivo ed esercitazioni su file reali',
          'Workshop per reparto in piccoli gruppi',
          'Creazione di una libreria di prompt e template',
        ],
      },
      {
        title: 'Adozione e follow up',
        text: 'Dopo la formazione restiamo vicini al team. Consegniamo una guida all\'uso e una policy AI, misuriamo cosa viene realmente utilizzato e facciamo sessioni di richiamo dove serve.',
        bullets: [
          "Guida all'uso interna e policy AI",
          'Sessione di follow up dopo 30 giorni',
          'Supporto office hours opzionale per il team',
        ],
      },
    ],
    tools: {
      title: 'Gli strumenti che copriamo',
      intro: 'Scegliete voi lo strumento oppure ve lo consigliamo noi, in base al vostro stack e alle vostre esigenze.',
      items: [
        'Uso quotidiano, Cowork, Skills e MCP connectors sui vostri dati e strumenti.',
        'Prompting, custom GPTs e workflow per marketing, vendite, assistenza e operations.',
        'Copilot dentro Microsoft 365: Word, Excel, Outlook, Teams, con policy e sicurezza.',
      ],
    },
    departments: {
      title: 'Formazione per reparto e ruolo',
      intro: 'Ogni ruolo ha esigenze diverse. Il programma viene scritto separatamente per ogni team.',
      items: [
        { title: 'Marketing e Vendite', text: 'Produzione di contenuti, ricerca di mercato, proposte, email di follow up, analisi delle campagne.' },
        { title: 'Finance e Amministrazione', text: 'Analisi di file Excel, reporting, sintesi di contratti, preparazione di presentazioni.' },
        { title: 'Customer Service', text: 'Risposte basate sulla vostra conoscenza, smistamento delle richieste, controllo qualità.' },
        { title: 'Operations', text: 'Documentazione dei processi, checklist, automazione di attività ripetitive.' },
        { title: 'IT e team tecnici', text: 'Analisi del codice, documentazione, integrazioni e uso sicuro degli strumenti AI.' },
        { title: 'Direzione', text: "Strategia AI, prioritizzazione dei casi d'uso, policy d'uso e gestione del rischio." },
      ],
    },
    formats: {
      title: 'Formati di programma',
      note: 'La struttura finale e il costo derivano dalla gap analysis.',
      items: [
        { title: 'Kickstart', text: 'Mezza giornata di formazione introduttiva per un team, con demo ed esercitazione pratica.', points: ['Fino a 15 persone', 'Nei vostri uffici, presso Advisable Academy o online', "Casi d'uso di base"] },
        { title: 'Department Program', text: 'Programma con più sessioni per reparto, con gap analysis e workshop sui vostri deliverable.', points: ['Gap analysis', 'Programma su misura per ruolo', 'Workshop pratici'] },
        { title: 'Company Wide', text: "Programma completo per tutta l'azienda, con policy AI, champion e follow up.", points: ['Più reparti', 'Policy e governance', 'Follow up e supporto'] },
      ],
    },
    outcomes: {
      title: 'Cosa porta a casa il vostro team',
      items: [
        'Meno tempo su lavoro amministrativo ripetitivo',
        "Un modo comune di lavorare con l'AI in tutta l'azienda",
        'Una libreria di prompt e template che resta al vostro team',
        'Una policy chiara su dati, riservatezza e sicurezza',
        'Adozione misurabile, non strumenti che restano inutilizzati',
        'Champion interni che portano avanti la formazione',
      ],
    },
    faqTitle: 'Domande frequenti',
    faq: [
      { q: "Il team deve avere esperienza precedente con l'AI?", a: 'No. La gap analysis mostra il livello di ogni team e costruiamo percorsi separati, da completamente introduttivo ad avanzato.' },
      { q: 'La formazione si svolge nei nostri uffici?', a: 'Sì. Veniamo nei vostri uffici, ospitiamo il team presso Advisable Academy oppure facciamo la formazione online, come preferite.' },
      { q: 'Quanto dura un programma?', a: 'Da mezza giornata per un kickstart fino a un programma di settimane per più reparti. Il piano finale deriva dalla gap analysis.' },
      { q: 'Cosa succede ai nostri dati riservati?', a: "Lavoriamo con i vostri strumenti e account e consegniamo una policy d'uso che definisce cosa è permesso e cosa no. Dove serve firmiamo un NDA." },
      { q: 'Quale strumento dovremmo scegliere?', a: 'Dipende dal vostro stack attuale. Se siete già su Microsoft 365, Copilot è la scelta naturale. Per un lavoro approfondito su documenti e connectors consigliamo Claude. Ve lo indichiamo nella gap analysis.' },
      { q: 'C\'è supporto dopo la formazione?', a: 'Sì. Facciamo una sessione di follow up e possiamo aggiungere office hours per il vostro team.' },
    ],
    cta: {
      title: 'Iniziate con una gap analysis',
      text: 'Raccontateci del vostro team e prepariamo una proposta di formazione con programma, durata e deliverable concreti.',
      proposal: 'Richiedete una proposta di formazione',
      back: 'Torna ad Academy',
    },
  },
};

ACADEMY_TRAINING.de = ACADEMY_TRAINING.en;
