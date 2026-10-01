
-- FAQs for services batch 3: linkedin through creative-agency (16 services)
DO $$
DECLARE
  faq_id uuid;
  sid uuid;
BEGIN
  -- linkedin-marketing-agency
  sid := '2e67a00b-f6b4-44de-a079-5e6e11ccbf41';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Why is LinkedIn important for B2B marketing?', 'LinkedIn is the #1 platform for B2B lead generation, with 80% of B2B leads from social media coming from LinkedIn. It offers precise targeting by job title, industry, and company size.'),
    (faq_id, 5, 'Γιατί είναι σημαντικό το LinkedIn για B2B marketing;', 'Το LinkedIn είναι η #1 πλατφόρμα για B2B lead generation. Το 80% των B2B leads από social media προέρχεται από το LinkedIn, με ακριβή στόχευση ανά θέση, κλάδο και μέγεθος εταιρείας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What LinkedIn advertising formats do you manage?', 'We manage Sponsored Content, Message Ads, Dynamic Ads, Text Ads, and Lead Gen Forms to maximize your LinkedIn ROI.'),
    (faq_id, 5, 'Ποιες μορφές LinkedIn advertising διαχειρίζεστε;', 'Διαχειριζόμαστε Sponsored Content, Message Ads, Dynamic Ads, Text Ads και Lead Gen Forms για μεγιστοποίηση του LinkedIn ROI σας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you help with LinkedIn content strategy?', 'Yes. We develop thought leadership content, company page optimization, employee advocacy programs, and organic posting strategies.'),
    (faq_id, 5, 'Βοηθάτε με LinkedIn content strategy;', 'Ναι. Αναπτύσσουμε thought leadership content, βελτιστοποίηση company page, employee advocacy programs και στρατηγικές organic posting.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is the minimum budget for LinkedIn Ads?', 'LinkedIn Ads typically require higher budgets than other platforms due to premium targeting. We recommend starting with at least €1,500-2,000/month for meaningful results.'),
    (faq_id, 5, 'Ποιο είναι το ελάχιστο budget για LinkedIn Ads;', 'Τα LinkedIn Ads απαιτούν υψηλότερα budgets λόγω premium targeting. Συνιστούμε τουλάχιστον €1.500-2.000/μήνα για ουσιαστικά αποτελέσματα.');

  -- tiktok-marketing-agency
  sid := '1b9c02c0-63ec-4442-9142-9319767a7da1';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Is TikTok marketing effective for businesses?', 'Absolutely. TikTok has over 1 billion monthly active users and offers unmatched organic reach. It is effective for both B2C and increasingly B2B brands.'),
    (faq_id, 5, 'Είναι αποτελεσματικό το TikTok marketing για επιχειρήσεις;', 'Απολύτως. Το TikTok έχει πάνω από 1 δισ. μηνιαίους χρήστες και προσφέρει ασυναγώνιστο organic reach. Είναι αποτελεσματικό για B2C και ολοένα περισσότερο B2B brands.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you create TikTok content?', 'Yes. We handle full TikTok content production including concept development, filming, editing, and trend-driven creative strategies.'),
    (faq_id, 5, 'Δημιουργείτε TikTok content;', 'Ναι. Αναλαμβάνουμε πλήρη παραγωγή TikTok content συμπεριλαμβανομένου concept development, filming, editing και trend-driven creative strategies.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What TikTok ad formats do you manage?', 'We manage In-Feed Ads, TopView, Branded Hashtag Challenges, Branded Effects, and Spark Ads for maximum engagement and conversions.'),
    (faq_id, 5, 'Ποιες μορφές TikTok ads διαχειρίζεστε;', 'Διαχειριζόμαστε In-Feed Ads, TopView, Branded Hashtag Challenges, Branded Effects και Spark Ads για μέγιστο engagement και conversions.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can TikTok work for my industry?', 'TikTok works across industries including fashion, food, tech, education, finance, and healthcare. We tailor content strategies to your specific audience.'),
    (faq_id, 5, 'Μπορεί το TikTok να λειτουργήσει για τον κλάδο μου;', 'Το TikTok λειτουργεί σε κλάδους όπως fashion, food, tech, education, finance και healthcare. Προσαρμόζουμε τη στρατηγική στο κοινό σας.');

  -- youtube-marketing-agency
  sid := '669d1e06-4775-4841-ad3e-2dc691c1d920';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Why should I invest in YouTube marketing?', 'YouTube is the second largest search engine. Video content drives higher engagement, builds trust, and provides long-term organic visibility for your brand.'),
    (faq_id, 5, 'Γιατί να επενδύσω σε YouTube marketing;', 'Το YouTube είναι η δεύτερη μεγαλύτερη μηχανή αναζήτησης. Το video content αυξάνει engagement, χτίζει εμπιστοσύνη και παρέχει μακροπρόθεσμη organic ορατότητα.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you handle YouTube channel management?', 'Yes. We manage channel optimization, content calendars, video SEO, thumbnail design, community engagement, and analytics reporting.'),
    (faq_id, 5, 'Αναλαμβάνετε YouTube channel management;', 'Ναι. Διαχειριζόμαστε channel optimization, content calendars, video SEO, σχεδιασμό thumbnails, community engagement και analytics reporting.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What types of YouTube ads do you manage?', 'We manage TrueView In-Stream, Bumper Ads, Discovery Ads, and YouTube Shorts ads with targeting optimization for maximum ROAS.'),
    (faq_id, 5, 'Τι τύπους YouTube ads διαχειρίζεστε;', 'Διαχειριζόμαστε TrueView In-Stream, Bumper Ads, Discovery Ads και YouTube Shorts ads με βελτιστοποίηση στόχευσης για μέγιστο ROAS.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you produce video content for YouTube?', 'Yes. We offer end-to-end video production including scripting, filming, editing, motion graphics, and post-production optimization.'),
    (faq_id, 5, 'Παράγετε video content για YouTube;', 'Ναι. Προσφέρουμε end-to-end video production: scripting, filming, editing, motion graphics και post-production optimization.');

  -- facebook-ads-agency
  sid := '21ae3aae-08c1-420a-8004-f8b26591a995';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Are Facebook Ads still effective in 2026?', 'Yes. Facebook remains one of the most powerful advertising platforms with advanced AI-powered targeting, extensive reach, and proven ROI across industries.'),
    (faq_id, 5, 'Είναι αποτελεσματικά τα Facebook Ads το 2026;', 'Ναι. Το Facebook παραμένει μία από τις πιο ισχυρές διαφημιστικές πλατφόρμες με AI-powered targeting, εκτεταμένο reach και αποδεδειγμένο ROI.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is the minimum budget for Facebook Ads?', 'We recommend a minimum of €500-1,000/month for testing. Optimal results typically come with budgets of €2,000+ per month depending on your goals.'),
    (faq_id, 5, 'Ποιο είναι το ελάχιστο budget για Facebook Ads;', 'Συνιστούμε τουλάχιστον €500-1.000/μήνα για testing. Βέλτιστα αποτελέσματα με budgets €2.000+ ανά μήνα ανάλογα τους στόχους σας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How do you handle Facebook Ads after iOS privacy changes?', 'We use Conversions API (CAPI), server-side tracking, broad targeting strategies, and first-party data to maintain performance despite privacy restrictions.'),
    (faq_id, 5, 'Πώς διαχειρίζεστε τα Facebook Ads μετά τις αλλαγές iOS privacy;', 'Χρησιμοποιούμε Conversions API (CAPI), server-side tracking, broad targeting strategies και first-party data για διατήρηση αποτελεσμάτων.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you manage both Facebook and Instagram Ads?', 'Yes. We manage campaigns across both platforms through Meta Ads Manager, optimizing placement and creative for each platform.'),
    (faq_id, 5, 'Διαχειρίζεστε Facebook και Instagram Ads;', 'Ναι. Διαχειριζόμαστε campaigns και στις δύο πλατφόρμες μέσω Meta Ads Manager, βελτιστοποιώντας placement και creative για κάθε πλατφόρμα.');

  -- google-ads-agency
  sid := '3f3337e7-3b57-4cbe-b6e4-c304273f02e4';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What types of Google Ads campaigns do you manage?', 'We manage Search, Display, Shopping, YouTube, Performance Max, and Demand Gen campaigns, selecting the right mix based on your business goals.'),
    (faq_id, 5, 'Τι τύπους Google Ads campaigns διαχειρίζεστε;', 'Διαχειριζόμαστε Search, Display, Shopping, YouTube, Performance Max και Demand Gen campaigns, επιλέγοντας τον σωστό συνδυασμό για τους στόχους σας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How much should I spend on Google Ads?', 'Budget depends on your industry, competition, and goals. We help you determine the optimal budget and ensure every euro is spent efficiently.'),
    (faq_id, 5, 'Πόσο πρέπει να ξοδέψω σε Google Ads;', 'Το budget εξαρτάται από τον κλάδο, τον ανταγωνισμό και τους στόχους σας. Σας βοηθάμε να καθορίσετε το βέλτιστο budget.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Are you a Google Partner agency?', 'Yes. Advisable is a certified Google Premier Partner, demonstrating our expertise in Google Ads management and proven results for our clients.'),
    (faq_id, 5, 'Είστε Google Partner agency;', 'Ναι. Η Advisable είναι πιστοποιημένος Google Premier Partner, αποδεικνύοντας την εξειδίκευσή μας στη διαχείριση Google Ads.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How do you optimize Google Ads performance?', 'Through keyword refinement, ad copy testing, bid strategy optimization, audience segmentation, landing page optimization, and continuous A/B testing.'),
    (faq_id, 5, 'Πώς βελτιστοποιείτε την απόδοση Google Ads;', 'Μέσω keyword refinement, ad copy testing, bid strategy optimization, audience segmentation, landing page optimization και συνεχούς A/B testing.');

  -- link-building-agency
  sid := '1e0892a8-c5a7-435c-835d-af063cc845d0';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is link building and why does it matter?', 'Link building is the process of acquiring hyperlinks from other websites to yours. It is one of the most important ranking factors in Google search algorithm.'),
    (faq_id, 5, 'Τι είναι το link building και γιατί είναι σημαντικό;', 'Το link building είναι η διαδικασία απόκτησης hyperlinks από άλλους ιστότοπους. Είναι ένας από τους πιο σημαντικούς παράγοντες κατάταξης στο Google.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What link building strategies do you use?', 'We use digital PR, guest posting, broken link building, resource page outreach, HARO/Connectively, and content-driven link acquisition.'),
    (faq_id, 5, 'Ποιες στρατηγικές link building χρησιμοποιείτε;', 'Χρησιμοποιούμε digital PR, guest posting, broken link building, resource page outreach, HARO/Connectively και content-driven link acquisition.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you build white-hat links only?', 'Yes. We exclusively use ethical, white-hat link building techniques that comply with Google guidelines and provide long-term SEO value.'),
    (faq_id, 5, 'Χτίζετε μόνο white-hat links;', 'Ναι. Χρησιμοποιούμε αποκλειστικά ηθικές, white-hat τεχνικές link building που συμμορφώνονται με τις οδηγίες Google.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How many links do I need per month?', 'Quality matters more than quantity. We focus on acquiring high-authority, relevant links. Even 5-10 quality links per month can significantly impact rankings.'),
    (faq_id, 5, 'Πόσα links χρειάζομαι ανά μήνα;', 'Η ποιότητα μετράει περισσότερο. Εστιάζουμε σε high-authority, σχετικά links. Ακόμα 5-10 ποιοτικά links/μήνα μπορούν να επηρεάσουν σημαντικά τα rankings.');

  -- technical-seo-agency
  sid := 'a4b129d8-cdad-4d94-907a-8ec31b7f484f';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is technical SEO?', 'Technical SEO covers the backend optimization of your website including site speed, crawlability, indexation, structured data, Core Web Vitals, and mobile-friendliness.'),
    (faq_id, 5, 'Τι είναι το technical SEO;', 'Το technical SEO καλύπτει τη βελτιστοποίηση backend του website σας: ταχύτητα, crawlability, indexation, structured data, Core Web Vitals και mobile-friendliness.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Why is technical SEO important?', 'Without a solid technical foundation, even the best content will not rank well. Technical SEO ensures search engines can crawl, index, and understand your site.'),
    (faq_id, 5, 'Γιατί είναι σημαντικό το technical SEO;', 'Χωρίς σωστή τεχνική βάση, ακόμα και το καλύτερο content δεν θα κατατάσσεται καλά. Το technical SEO εξασφαλίζει ότι οι μηχανές αναζήτησης μπορούν να κατανοήσουν τον ιστότοπό σας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What does a technical SEO audit include?', 'Our audits cover site architecture, crawl budget, indexation issues, page speed, Core Web Vitals, schema markup, internal linking, and security (HTTPS).'),
    (faq_id, 5, 'Τι περιλαμβάνει ένα technical SEO audit;', 'Τα audits μας καλύπτουν site architecture, crawl budget, θέματα indexation, page speed, Core Web Vitals, schema markup, internal linking και ασφάλεια (HTTPS).');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How often should technical SEO be reviewed?', 'We recommend quarterly technical audits, with continuous monitoring for critical issues like site speed, broken pages, and indexation problems.'),
    (faq_id, 5, 'Πόσο συχνά πρέπει να ελέγχεται το technical SEO;', 'Συνιστούμε τριμηνιαία technical audits, με συνεχή παρακολούθηση για κρίσιμα θέματα όπως ταχύτητα, broken pages και προβλήματα indexation.');

  -- ecommerce-seo-agency
  sid := '3e5f3558-9143-428a-8eca-81ccad35603e';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is eCommerce SEO?', 'eCommerce SEO optimizes online stores for search engines, focusing on product pages, category pages, technical optimization, and content strategy to drive organic traffic and sales.'),
    (faq_id, 5, 'Τι είναι το eCommerce SEO;', 'Το eCommerce SEO βελτιστοποιεί online stores για μηχανές αναζήτησης, εστιάζοντας σε product pages, category pages, τεχνική βελτιστοποίηση και content strategy.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How do you optimize product pages for SEO?', 'We optimize product titles, descriptions, images, schema markup, URL structure, internal linking, and user-generated content like reviews.'),
    (faq_id, 5, 'Πώς βελτιστοποιείτε τα product pages για SEO;', 'Βελτιστοποιούμε τίτλους, περιγραφές, εικόνες, schema markup, URL structure, internal linking και user-generated content όπως reviews.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Which eCommerce platforms do you optimize?', 'We optimize Shopify, WooCommerce, Magento, BigCommerce, and custom eCommerce platforms for maximum search visibility.'),
    (faq_id, 5, 'Ποιες eCommerce πλατφόρμες βελτιστοποιείτε;', 'Βελτιστοποιούμε Shopify, WooCommerce, Magento, BigCommerce και custom eCommerce πλατφόρμες για μέγιστη αναζητησιμότητα.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can SEO reduce my dependence on paid ads?', 'Yes. A strong eCommerce SEO strategy builds sustainable organic traffic that reduces your reliance on paid advertising over time.'),
    (faq_id, 5, 'Μπορεί το SEO να μειώσει την εξάρτησή μου από paid ads;', 'Ναι. Μια ισχυρή eCommerce SEO στρατηγική χτίζει βιώσιμο organic traffic που μειώνει σταδιακά την εξάρτηση από paid διαφήμιση.');

  -- b2c-marketing-agency
  sid := 'e99f9e30-47ea-43ef-ac06-17e9990fef2d';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What is B2C marketing?', 'B2C marketing targets individual consumers through emotional messaging, social media, influencer partnerships, and direct-response campaigns to drive purchases.'),
    (faq_id, 5, 'Τι είναι το B2C marketing;', 'Το B2C marketing στοχεύει μεμονωμένους καταναλωτές μέσω συναισθηματικών μηνυμάτων, social media, influencer partnerships και direct-response campaigns.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How is B2C marketing different from B2B?', 'B2C focuses on emotional decision-making, shorter sales cycles, and reaching consumers where they spend time—social media, search, and entertainment platforms.'),
    (faq_id, 5, 'Πώς διαφέρει το B2C από το B2B marketing;', 'Το B2C εστιάζει σε συναισθηματικές αποφάσεις, μικρότερους κύκλους πωλήσεων και προσέγγιση καταναλωτών σε social media, search και ψυχαγωγικές πλατφόρμες.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Which channels work best for B2C marketing?', 'Social media (Instagram, TikTok, Facebook), Google Ads, email marketing, influencer partnerships, and content marketing are the most effective B2C channels.'),
    (faq_id, 5, 'Ποια κανάλια λειτουργούν καλύτερα για B2C marketing;', 'Social media (Instagram, TikTok, Facebook), Google Ads, email marketing, influencer partnerships και content marketing είναι τα πιο αποτελεσματικά B2C κανάλια.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you help with customer retention for B2C brands?', 'Yes. We implement loyalty programs, email automation, retargeting, and personalization strategies to maximize customer lifetime value.'),
    (faq_id, 5, 'Βοηθάτε με customer retention για B2C brands;', 'Ναι. Υλοποιούμε loyalty programs, email automation, retargeting και στρατηγικές personalization για μεγιστοποίηση customer lifetime value.');

  -- fintech-marketing-agency
  sid := '8f9868c8-bc5e-4ab0-9542-50e1ac26b351';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Why do fintech companies need specialized marketing?', 'Fintech marketing requires understanding of regulatory compliance, trust building, complex product messaging, and reaching both retail and institutional audiences.'),
    (faq_id, 5, 'Γιατί οι fintech εταιρείες χρειάζονται εξειδικευμένο marketing;', 'Το fintech marketing απαιτεί κατανόηση κανονιστικής συμμόρφωσης, χτισίματος εμπιστοσύνης, σύνθετου product messaging και προσέγγισης retail και institutional κοινών.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you understand fintech regulatory requirements?', 'Yes. We are experienced in marketing financial products while maintaining compliance with regulations like PSD2, GDPR, and local financial advertising rules.'),
    (faq_id, 5, 'Κατανοείτε τις κανονιστικές απαιτήσεις fintech;', 'Ναι. Έχουμε εμπειρία στο marketing χρηματοοικονομικών προϊόντων με συμμόρφωση σε PSD2, GDPR και τοπικούς κανονισμούς.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What marketing channels work for fintech?', 'Content marketing, SEO, LinkedIn advertising, thought leadership, performance marketing, and partnership development are most effective for fintech companies.'),
    (faq_id, 5, 'Ποια κανάλια marketing λειτουργούν για fintech;', 'Content marketing, SEO, LinkedIn advertising, thought leadership, performance marketing και partnership development είναι πιο αποτελεσματικά.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you help with fintech product launches?', 'Yes. We specialize in go-to-market strategies for fintech products including pre-launch buzz, beta programs, PR campaigns, and user acquisition.'),
    (faq_id, 5, 'Μπορείτε να βοηθήσετε με fintech product launches;', 'Ναι. Εξειδικευόμαστε σε go-to-market strategies: pre-launch buzz, beta programs, PR campaigns και user acquisition.');

  -- healthcare-marketing-agency
  sid := '5744f3a7-c8e1-4515-b239-c7d1b520a9b6';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What makes healthcare marketing different?', 'Healthcare marketing requires HIPAA-aware messaging, medical accuracy, trust building, and compliance with advertising regulations specific to health services.'),
    (faq_id, 5, 'Τι κάνει το healthcare marketing διαφορετικό;', 'Το healthcare marketing απαιτεί HIPAA-aware μηνύματα, ιατρική ακρίβεια, χτίσιμο εμπιστοσύνης και συμμόρφωση με κανονισμούς διαφήμισης υγείας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you work with hospitals and clinics?', 'Yes. We work with hospitals, clinics, healthtech startups, pharmaceutical companies, and wellness brands to grow their patient base and brand awareness.'),
    (faq_id, 5, 'Συνεργάζεστε με νοσοκομεία και κλινικές;', 'Ναι. Συνεργαζόμαστε με νοσοκομεία, κλινικές, healthtech startups, φαρμακευτικές εταιρείες και wellness brands.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What digital marketing strategies work for healthcare?', 'SEO for medical queries, Google Ads for patient acquisition, content marketing for authority building, and social media for community engagement are highly effective.'),
    (faq_id, 5, 'Ποιες στρατηγικές digital marketing λειτουργούν στην υγεία;', 'SEO για ιατρικά queries, Google Ads για απόκτηση ασθενών, content marketing για authority building και social media για community engagement.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you help with patient review management?', 'Yes. We implement review generation strategies, reputation monitoring, and response management to build trust and attract new patients.'),
    (faq_id, 5, 'Μπορείτε να βοηθήσετε με τη διαχείριση κριτικών ασθενών;', 'Ναι. Υλοποιούμε στρατηγικές δημιουργίας κριτικών, παρακολούθηση φήμης και διαχείριση απαντήσεων για εμπιστοσύνη και προσέλκυση νέων ασθενών.');

  -- real-estate-marketing-agency
  sid := '395b9305-656d-4925-b0ae-0c651fa3a867';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How can digital marketing help my real estate business?', 'Digital marketing generates qualified leads through targeted ads, SEO for local searches, virtual tours, social media showcasing, and email nurture campaigns.'),
    (faq_id, 5, 'Πώς μπορεί το digital marketing να βοηθήσει την κτηματομεσιτική μου;', 'Το digital marketing δημιουργεί qualified leads μέσω στοχευμένων ads, SEO για τοπικές αναζητήσεις, virtual tours, social media και email campaigns.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you specialize in real estate lead generation?', 'Yes. We create targeted campaigns on Google, Facebook, and Instagram specifically designed to generate buyer and seller leads for real estate professionals.'),
    (faq_id, 5, 'Εξειδικεύεστε σε real estate lead generation;', 'Ναι. Δημιουργούμε στοχευμένες καμπάνιες σε Google, Facebook και Instagram σχεδιασμένες για leads αγοραστών και πωλητών ακινήτων.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you help market luxury properties?', 'Absolutely. We create premium marketing campaigns including high-quality visuals, targeted advertising to high-net-worth individuals, and exclusive property showcasing.'),
    (faq_id, 5, 'Μπορείτε να βοηθήσετε στο marketing πολυτελών ακινήτων;', 'Απολύτως. Δημιουργούμε premium marketing campaigns με υψηλής ποιότητας visuals, στοχευμένη διαφήμιση σε υψηλού εισοδήματος άτομα.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What ROI can I expect from real estate marketing?', 'ROI varies by market, but our clients typically see 3-8x return on ad spend with well-optimized campaigns and proper lead follow-up systems.'),
    (faq_id, 5, 'Τι ROI μπορώ να περιμένω;', 'Το ROI ποικίλλει ανά αγορά, αλλά οι πελάτες μας βλέπουν συνήθως 3-8x απόδοση στο ad spend με βελτιστοποιημένες καμπάνιες.');

  -- startup-marketing-agency
  sid := '7473ead8-c5b9-44e9-b4c1-2d96b833048d';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Why do startups need a marketing agency?', 'Startups need to move fast with limited resources. A specialized agency provides expertise, established processes, and scalable strategies without the cost of building an in-house team.'),
    (faq_id, 5, 'Γιατί τα startups χρειάζονται marketing agency;', 'Τα startups πρέπει να κινηθούν γρήγορα με περιορισμένους πόρους. Ένα εξειδικευμένο agency παρέχει τεχνογνωσία και κλιμακούμενες στρατηγικές χωρίς κόστος in-house ομάδας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What marketing strategies work best for startups?', 'Product-led growth, content marketing, community building, PR, performance marketing, and strategic partnerships are the most effective for startups.'),
    (faq_id, 5, 'Ποιες στρατηγικές marketing λειτουργούν καλύτερα για startups;', 'Product-led growth, content marketing, community building, PR, performance marketing και strategic partnerships είναι πιο αποτελεσματικά.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Do you work with pre-revenue startups?', 'Yes. We work with startups at all stages—from pre-seed validation to Series A growth—with strategies and pricing adapted to each stage.'),
    (faq_id, 5, 'Συνεργάζεστε με pre-revenue startups;', 'Ναι. Συνεργαζόμαστε με startups σε όλα τα στάδια—από pre-seed validation έως Series A growth—με στρατηγικές προσαρμοσμένες σε κάθε στάδιο.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you help with startup fundraising marketing?', 'Yes. We create investor-facing materials, pitch deck support, PR campaigns, and thought leadership content that supports fundraising efforts.'),
    (faq_id, 5, 'Μπορείτε να βοηθήσετε με startup fundraising marketing;', 'Ναι. Δημιουργούμε investor-facing υλικό, pitch deck support, PR campaigns και thought leadership content που υποστηρίζει fundraising.');

  -- full-service-agency
  sid := 'a8460e3b-0a41-4bad-afc8-3b7958610092';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What does a full service agency offer?', 'A full service agency provides end-to-end marketing solutions including strategy, branding, web development, SEO, paid media, content creation, social media, and analytics under one roof.'),
    (faq_id, 5, 'Τι προσφέρει ένα full service agency;', 'Ένα full service agency παρέχει end-to-end marketing solutions: strategy, branding, web development, SEO, paid media, content creation, social media και analytics κάτω από μία στέγη.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Why choose a full service agency over specialists?', 'A full service agency ensures consistent messaging, integrated strategy, and seamless execution across all channels—eliminating coordination overhead between multiple vendors.'),
    (faq_id, 5, 'Γιατί να επιλέξω full service agency αντί specialists;', 'Ένα full service agency εξασφαλίζει συνεπή μηνύματα, ολοκληρωμένη στρατηγική και απρόσκοπτη εκτέλεση σε όλα τα κανάλια.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How much does a full service agency cost?', 'Costs depend on scope and services. We offer flexible engagement models—from project-based to monthly retainers—tailored to your budget and needs.'),
    (faq_id, 5, 'Πόσο κοστίζει ένα full service agency;', 'Το κόστος εξαρτάται από εύρος και υπηρεσίες. Προσφέρουμε ευέλικτα μοντέλα—από project-based έως monthly retainers—προσαρμοσμένα στον προϋπολογισμό σας.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can I start with one service and expand later?', 'Absolutely. Many clients start with a specific need and gradually expand as they see results. Our modular approach makes scaling easy.'),
    (faq_id, 5, 'Μπορώ να ξεκινήσω με μία υπηρεσία και να επεκταθώ;', 'Απολύτως. Πολλοί πελάτες ξεκινούν με μία ανάγκη και επεκτείνονται σταδιακά. Η modular προσέγγισή μας κάνει το scaling εύκολο.');

  -- creative-agency
  sid := 'bdc986bd-8474-4b68-a841-5dc88deef410';
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 1, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'What services does a creative agency provide?', 'A creative agency provides brand identity, visual design, advertising campaigns, video production, copywriting, and creative strategy that makes your brand stand out.'),
    (faq_id, 5, 'Τι υπηρεσίες παρέχει ένα creative agency;', 'Ένα creative agency παρέχει brand identity, visual design, διαφημιστικές καμπάνιες, video production, copywriting και creative strategy.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 2, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How do you develop creative concepts?', 'We start with deep audience research and brand understanding, then develop concepts through collaborative brainstorming, mood boards, and iterative design sprints.'),
    (faq_id, 5, 'Πώς αναπτύσσετε creative concepts;', 'Ξεκινάμε με βαθιά έρευνα κοινού και κατανόηση brand, στη συνέχεια αναπτύσσουμε concepts μέσω brainstorming, mood boards και iterative design sprints.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 3, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'Can you handle both digital and print creative?', 'Yes. We create assets for all channels—digital ads, social media, websites, print materials, packaging, and out-of-home advertising.'),
    (faq_id, 5, 'Μπορείτε να δημιουργήσετε digital και print creative;', 'Ναι. Δημιουργούμε assets για όλα τα κανάλια—digital ads, social media, websites, print υλικά, packaging και out-of-home διαφήμιση.');
  INSERT INTO service_faqs (service_id, display_order, is_active) VALUES (sid, 4, true) RETURNING id INTO faq_id;
  INSERT INTO service_faq_translations (faq_id, language_id, question, answer) VALUES
    (faq_id, 1, 'How do you measure creative effectiveness?', 'We track engagement metrics, brand recall, conversion rates, and A/B test creative variations to continuously optimize performance.'),
    (faq_id, 5, 'Πώς μετράτε την αποτελεσματικότητα του creative;', 'Παρακολουθούμε engagement metrics, brand recall, conversion rates και A/B test creative variations για συνεχή βελτιστοποίηση.');
END $$;
