# Video Lessons: user accounts, catalog and admin

## What the visitor sees
- **/academy/video-lessons** (landing): lists courses that are live now, each with its language of delivery (flag + label) and price. Three "coming soon" cards: Claude, ChatGPT (AI for Business) and On Demand lessons.
- **Sign up / Sign in** (/academy/account/login): email + password (with email confirmation, forgot/reset password) or Google.
- **My account** (/academy/account): the user edits name, phone, company, job title and invoicing details (company name, VAT number (ΑΦΜ), tax office (ΔΟΥ), address). Shows "My courses".
- **Buy button** on each live course: visible to everyone, but asks non-signed-in visitors to sign in first. Payment (Viva Payments) comes later: for now the button records a "pending" purchase request so nothing is lost, and shows a "payments coming soon" message.

## Admin (/academy/admin)
- Only users with the admin role can open it.
- Add / edit / hide courses: title, description, language of delivery, price, status (live / coming soon / hidden), cover image, order.
- See registered users and their purchase requests.

## Future user types
Roles live in the existing separate roles table. A new role `video_learner` is added now; later types (e.g. instructor, corporate client) are just new roles, no restructure needed.

## Technical details
- DB (migration): extend `app_role` enum with `video_learner`; new tables with GRANTs + RLS:
  - `learner_profiles` (user_id PK, full_name, phone, company, job_title, billing_company, vat_number, tax_office, billing_address, billing_city, billing_postcode) — owner read/update, admin read. Trigger on signup creates the profile and grants `video_learner`.
  - `video_courses` (slug, title, description, language_code, price_eur, status enum live/coming_soon/hidden, cover_image, display_order) — public read of non-hidden, admin write.
  - `video_course_purchases` (user_id, course_id, status pending/paid/cancelled, amount_eur, provider, provider_ref) — owner read/insert pending, admin all. `provider` ready for Viva.
- Seed 3 coming-soon rows (Claude, ChatGPT, On Demand).
- Auth: external Supabase project, so email auth and Google are configured in your Supabase dashboard (Google needs a Google Cloud OAuth client; I'll guide you).
- Admin checks via existing `has_role(auth.uid(),'admin')`, never client-side.
- Frontend: `useAuth` hook (onAuthStateChange + getUser), pages under `src/pages/academy/video/`, routes in LanguageRouter (+ `/:lang` variants), Greek copy following Greek typography rules.
- Viva Payments: separate later step (edge function + webhook marking purchases paid).

## Open items
- Real course titles, prices, languages and videos: you add them from the admin page.
- Which account(s) should be admin: tell me the email.
