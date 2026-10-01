INSERT INTO service_translations (service_id, language_id, title, short_description, long_description, seo_title, meta_description)
VALUES (
  '20ec9f32-9817-4ffd-aef4-b48230111d66',
  5,
  'Digital Marketing Agency',
  'Digital marketing agency πλήρους φάσματος υπηρεσιών που παρέχει στρατηγικές βασισμένες σε δεδομένα σε SEO, paid media, social media και περιεχόμενο για να επιταχύνει την online ανάπτυξή σας.',
  '<h2>Γιατί να επιλέξετε την Advisable ως το Digital Marketing Agency σας</h2><p>Στην <strong>Advisable</strong>, συνδυάζουμε τη βαθιά τεχνογνωσία του κλάδου με τεχνολογία αιχμής για να παρέχουμε υπηρεσίες digital marketing agency που οδηγούν σε μετρήσιμα επιχειρηματικά αποτελέσματα. Η ομάδα των ειδικών μας λειτουργεί ως προέκταση του οργανισμού σας, δημιουργώντας στρατηγικές βασισμένες σε δεδομένα, προσαρμοσμένες στους μοναδικούς σας στόχους και τη θέση σας στην αγορά.</p><h3>Οι Υπηρεσίες του Digital Marketing Agency μας</h3><ul><li><strong>Στρατηγικός Σχεδιασμός & Έλεγχος</strong> — Ολοκληρωμένη ανάλυση της τρέχουσας ψηφιακής σας παρουσίας, του ανταγωνιστικού τοπίου και των ευκαιριών ανάπτυξης.</li><li><strong>Εκτέλεση & Διαχείριση Καμπανιών</strong> — Εξειδικευμένη υλοποίηση και συνεχής βελτιστοποίηση σε όλα τα κανάλια.</li><li><strong>Παρακολούθηση Απόδοσης & Analytics</strong> — Dashboards σε πραγματικό χρόνο, μοντελοποίηση απόδοσης (attribution modeling) και πρακτικές πληροφορίες (actionable insights).</li><li><strong>Παραγωγή Δημιουργικού & Περιεχομένου</strong> — Υψηλής ποιότητας υλικό σχεδιασμένο για να προσελκύει και να μετατρέπει το κοινό.</li><li><strong>Τεχνολογία & Αυτοματισμός</strong> — Χρήση AI και αυτοματισμών marketing για αποτελεσματική κλιμάκωση.</li></ul><h3>Τι κάνει το Digital Marketing Agency μας να ξεχωρίζει</h3><p>Είμαστε <strong>Google Premier Partner</strong> και <strong>Meta Business Partner</strong>, παρέχοντάς σας πρόσβαση σε beta λειτουργίες και προηγμένα εργαλεία.</p><h3>Εξερευνήστε τις Σχετικές Υπηρεσίες μας</h3><ul><li><a href="/digital-agency/marketing-growth">Υπηρεσίες Marketing & Ανάπτυξης →</a></li><li><a href="/digital-agency/performance-marketing">Marketing Απόδοσης →</a></li><li><a href="/contact">Λάβετε μια δωρεάν συμβουλευτική στρατηγικής →</a></li></ul>',
  'Digital Marketing Agency | Advisable',
  'Εξειδικευμένο digital marketing agency στην Ελλάδα. Στρατηγικές SEO, PPC, social media & περιεχομένου που οδηγούν σε μετρήσιμη ανάπτυξη. Λάβετε μια δωρεάν συμβουλευτική σήμερα.'
) ON CONFLICT (service_id, language_id) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  seo_title = EXCLUDED.seo_title,
  meta_description = EXCLUDED.meta_description;