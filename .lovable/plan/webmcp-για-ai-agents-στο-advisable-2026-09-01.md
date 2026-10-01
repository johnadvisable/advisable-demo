# WebMCP για AI agents στο advisable.*

Στόχος: όταν ένας AI browser agent (ChatGPT Atlas, Perplexity Comet, Copilot Mode, Claude in Chrome) ανοίγει οποιοδήποτε advisable domain, να βρίσκει έτοιμα tools μέσα στη σελίδα, και όταν ένα AI crawler διαβάζει το site, να βρίσκει που είναι το MCP endpoint. Η γλώσσα προκύπτει αυτόματα από το TLD (.com -> EN, .gr -> EL, .es/.fr/.it/.de αντίστοιχα) με προαιρετικό override.

## Τι θα φτιαχτεί

### 1. In-page WebMCP runtime
- Προσθήκη `@mcp-b/global` (WebMCP polyfill/runtime για `document.modelContext`).
- Νέο `src/lib/webmcp/` με έναν provider (`WebMcpProvider`) που μπαίνει μία φορά μέσα στο App, κάτω από το LanguageContext, ώστε κάθε tool να ξέρει ήδη τη γλώσσα του domain.
- Κάθε tool δηλώνεται με `registerTool` και `AbortController`, ώστε να αφαιρείται σωστά σε unmount/route change.
- Τα tools δεν παρακάμπτουν την εφαρμογή: καλούν τα ίδια services/hooks που ήδη χρησιμοποιεί το UI (Supabase anon reads, edge functions για writes), οπότε ισχύουν τα ίδια RLS και validation.

### 2. Tools που θα εκτεθούν

Read-only περιεχόμενο (γλώσσα auto από domain, override με `language`):
- `list_services` - υπηρεσίες ανά κατηγορία με slug, τίτλο, URL.
- `list_products` - προϊόντα (Ecommercen, SizeTheMarket, Recommendable κ.λπ.).
- `list_clients` - πελάτες / case studies.
- `search_insights` - αναζήτηση σε insights και news με keyword.
- `get_article` - πλήρες άρθρο (τίτλος, excerpt, καθαρό κείμενο, URL).

Academy:
- `list_seminars` - επόμενα σεμινάρια από τον πίνακα `seminars` (τίτλος, ημερομηνία, ώρα, τοποθεσία, σελίδα).
- `join_seminar_waitlist` - εγγραφή σε waitlist μέσω της υπάρχουσας ροής (όνομα, email, track, ρητό GDPR consent flag υποχρεωτικό).

Contact / lead:
- `submit_contact_request` - υποβολή φόρμας επικοινωνίας μέσω `send-contact-email`, με τα ίδια πεδία και το ίδιο interest dropdown.
- Επειδή η φόρμα προστατεύεται από Cloudflare Turnstile, το tool δεν στέλνει σιωπηλά: συμπληρώνει τη φόρμα στη σελίδα και επιστρέφει στον agent οδηγία ότι χρειάζεται ανθρώπινη επιβεβαίωση υποβολής. Ετσι δεν ανοίγει κερκόπορτα για spam leads.

Navigation helpers:
- `navigate_to` - πλοήγηση σε σελίδα του site με σωστό localized path.
- `open_contact_form` - άνοιγμα και προσυμπλήρωση της φόρμας.
- `get_page_context` - τι σελίδα βλέπει τώρα ο agent (τύπος, slug, γλώσσα).

### 3. Discovery για crawlers
- `public/.well-known/mcp.json` με το public MCP endpoint και σύντομη περιγραφή των tools.
- `public/llms.txt` (και `llms-full.txt` περίληψη) με δομημένο χάρτη: υπηρεσίες, προϊόντα, Academy, insights, contact - ανά domain/γλώσσα.
- Ενημέρωση `robots.txt` ώστε GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended να έχουν ρητό Allow και reference στο llms.txt.
- Ενα μικρό `<link rel="mcp">`/meta hint στο `index.html` για clients που το ψάχνουν στο HTML.

### 4. Coolify / nginx
- Νέα nginx locations για `/.well-known/mcp.json`, `/llms.txt`, `/llms-full.txt`: σερβίρονται ως στατικά αρχεία με σωστό content-type, χωρίς να περνούν από το prerender ή το SPA fallback.
- Το υπάρχον `sub_filter 'advisable.com' -> '$target_domain'` καλύπτει τα HTML URLs, οπότε τα llms/discovery αρχεία θα γράφονται με σχετικά paths όπου γίνεται και με absolute URL μόνο εκεί που πρέπει.
- Τα αρχεία μπαίνουν στο `public/`, άρα ανεβαίνουν αυτόματα με το υπάρχον Docker build - δεν αλλάζει το deployment pipeline.

## Τεχνικές σημειώσεις

- Το WebMCP είναι in-page: δουλεύει μόνο όταν ένας agent-capable browser ανοίγει πραγματικά τη σελίδα. Δεν αντικαθιστά το ήδη υπάρχον remote MCP (`supabase/functions/mcp`), το οποίο μένει ως έχει με OAuth για admin publishing.
- Ολα τα in-page tools είναι read-only ή "prepare, ο χρήστης επιβεβαιώνει". Καμία γραφή στη βάση χωρίς ανθρώπινη ενέργεια, καμία χρήση service role στο browser.
- Γλώσσα: επαναχρησιμοποιείται το `getDomainLanguageConfig` / LanguageContext, με το ίδιο mapping ids (EN=1, ES=2, FR=3, DE=4, EL=5, IT=10).
- Ελληνικά strings σε περιγραφές/απαντήσεις tools ακολουθούν τους κανόνες τυπογραφίας (χωρίς τόνο σε κεφαλαία, χωρίς em dash).
- Bundle: το runtime φορτώνεται lazily ώστε να μην επιβαρύνει το initial load και το Core Web Vitals.

## Επαλήθευση
- Ελεγχος στο preview ότι `await document.modelContext.getTools()` επιστρέφει τη λίστα tools και ότι ένα read tool γυρίζει σωστά δεδομένα.
- Ελεγχος ότι `/llms.txt` και `/.well-known/mcp.json` απαντούν 200 με σωστό content-type.
- Ελεγχος ότι δεν σπάει το prerender για τα SEO bots.
