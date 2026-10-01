# Auto-deploy του live site (advisable.com) σε κάθε αλλαγή

## Το πρόβλημα

Το `www.advisable.com` δεν σερβίρεται από το Lovable hosting αλλά από το δικό σου Coolify stack, που χτίζει το React bundle από το GitHub repo. Επιβεβαιώθηκε τώρα: το `advisable-universe.lovable.app/locales/front/termsofservice/en.json` περιέχει το "Venture Studio Submissions", ενώ το `www.advisable.com` όχι.

Γι' αυτό τα insights/άρθρα έβγαιναν πάντα αμέσως (είναι δεδομένα στη βάση, κοινή για preview και live), ενώ οι αλλαγές σε κώδικα και σε στατικά locale αρχεία χρειάζονται νέο build στο Coolify.

## Στόχος

Κάθε commit που φεύγει από το Lovable προς το GitHub να πυροδοτεί αυτόματα redeploy στο Coolify, χωρίς χειροκίνητο κλικ.

## Τι θα κάνω εγώ (στο repo)

1. Ενημέρωση του `COOLIFY_DEPLOYMENT.md` με:
   - Ενότητα "Auto-deploy on push": ακριβή βήματα ενεργοποίησης webhook στο Coolify.
   - Ενότητα "Τι απαιτεί rebuild vs τι είναι instant" (frontend/locales vs database/edge functions), ώστε να ξέρετε πότε να περιμένετε καθυστέρηση.
   - Ενότητα cache invalidation: Cloudflare purge και prerender cache, γιατί ακόμη και μετά το rebuild οι bots/CDN μπορεί να σερβίρουν παλιά έκδοση.
2. Προσθήκη προαιρετικού GitHub Actions workflow (`.github/workflows/coolify-deploy.yml`) που καλεί το deploy webhook του Coolify σε κάθε push στο default branch. Χρησιμοποιείται μόνο αν προτιμάς webhook από πλευράς GitHub αντί για το native GitHub App integration του Coolify.

## Τι πρέπει να κάνεις εσύ (στο Coolify, μία φορά)

Το ίδιο το Coolify δεν είναι προσβάσιμο από εδώ, οπότε αυτά τα βήματα γίνονται στο dashboard σου:

1. Coolify → η εφαρμογή `advisable` → **Source**: επιβεβαίωσε ότι δείχνει στο σωστό GitHub repo και branch (αυτό στο οποίο κάνει commit το Lovable, συνήθως `main`).
2. Ενεργοποίησε **Automatic Deployment** (ή "Auto deploy on push") στις ρυθμίσεις της εφαρμογής.
3. Αν χρησιμοποιείς το GitHub App integration, το webhook μπαίνει αυτόματα. Αν το repo είναι συνδεδεμένο με deploy key, αντέγραψε το **Deployment Webhook URL** από το Coolify και πρόσθεσέ το στο GitHub → repo → Settings → Webhooks (content type `application/json`, event: `push`).
4. Αν επιλέξεις τη λύση με GitHub Actions, αποθήκευσε το webhook URL ως GitHub secret `COOLIFY_DEPLOY_WEBHOOK` (και το token ως `COOLIFY_TOKEN` αν το Coolify το απαιτεί).

## Τεχνικές λεπτομέρειες

- Το GitHub Actions workflow θα κάνει απλά ένα authenticated `curl` στο deploy webhook, χωρίς build βήμα: το build γίνεται στο Coolify μέσω του υπάρχοντος `Dockerfile`.
- Δεν αλλάζει τίποτα στο `docker-compose.yaml`, στο nginx config ή στον κώδικα της εφαρμογής.
- Μετά από κάθε deploy, ο prerender cache (`CACHE_TTL`) και το Cloudflare cache μπορεί να χρειάζονται purge για να δουν οι bots τη νέα έκδοση - θα το τεκμηριώσω στο guide.

## Άμεση ενέργεια για τις τρέχουσες αλλαγές

Οι ήδη ολοκληρωμένες αλλαγές (Terms of Service ενότητα "Venture Studio Submissions" και το confidentiality κείμενο στη φόρμα "Let's Build Together") θα βγουν live με το πρώτο redeploy - είτε χειροκίνητο τώρα, είτε αυτόματα με το επόμενο push μόλις ενεργοποιηθεί το auto-deploy.
