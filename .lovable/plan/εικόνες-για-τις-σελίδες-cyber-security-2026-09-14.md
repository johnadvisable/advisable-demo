# Εικόνες για τις σελίδες Cyber Security

Οι νέες σελίδες ασφάλειας δεν έχουν δικές τους εικόνες: η σελίδα κατηγορίας δανείζεται τη φωτογραφία του Digital Agency και οι 12 υπηρεσίες εμφανίζονται χωρίς εικόνα. Θα φτιάξουμε ένα δικό τους οπτικό σετ.

## Τι θα φτιαχτεί

1. Μία μεγάλη εικόνα φόντου για τη σελίδα `/cyber-security` (σκούρο, τεχνολογικό ύφος, ίδια αισθητική με τις υπόλοιπες κατηγορίες, χωρίς κείμενο μέσα στην εικόνα).
2. Έξι εικόνες που θα μοιραστούν στις 12 υπηρεσίες κατά θεματική ομάδα, όπως γίνεται ήδη στο Digital Agency:
   - Offensive testing: Penetration Testing, Red Teaming, Social Engineering
   - Vulnerability & configuration: Vulnerability Assessment, Configuration Review
   - Incident response: Digital Forensics & Incident Response, Incident Response Retainer
   - Investigation: Compromise Assessment
   - Intelligence: Threat Intelligence
   - Advisory & compliance: Cybersecurity Consulting, GRC, vCISO
3. Οι εικόνες θα μπουν στις σελίδες: η κατηγορία θα δείχνει τη δική της εικόνα φόντου και κάθε σελίδα υπηρεσίας τη δική της εικόνα στην κορυφή. Οι κάρτες στη λίστα κατηγορίας θα πάρουν αυτόματα την ίδια εικόνα.

## Τεχνικά

- Δημιουργία 7 εικόνων με το imagegen (1920x1080 για το hero, 1600x900 για τις υπηρεσίες), αποθήκευση ως `public/images/services/cyber-*.jpg` ώστε να ακολουθούν το ίδιο μοτίβο με τα υπάρχοντα `/images/services/*.jpg`.
- `src/pages/ServiceCategory.tsx`: στο `backgroundImage` memo προστίθεται case για `cyber-security` που δείχνει στη νέα εικόνα.
- Ενημέρωση του `featured_image` στα 12 records του πίνακα `services` με μία εντολή δεδομένων (καμία αλλαγή δομής βάσης).
- Οπτικός έλεγχος με Playwright στη σελίδα κατηγορίας και σε δύο σελίδες υπηρεσιών.
