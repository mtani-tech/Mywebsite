# MTANI TECH store setup

The GitHub Pages site contains a simple Tanzania-focused technology storefront and buyer guide, customer sign-up/sign-in, product management, and an admin order dashboard. The Supabase project is required for database-backed products, accounts, and order requests; GitHub Pages cannot host a private database itself.

## Connect Supabase
1. Create a Supabase project.
2. In **SQL Editor**, run all of `supabase/schema.sql`.
3. In `supabase-config.js`, replace the two placeholders with the project's **Project URL** and **publishable/anon key**. These public client values are intended for the browser. **Never add a service-role key or a password to this repository.**
4. In Supabase Auth settings, configure the site URL and redirect URL for the GitHub Pages origin, such as `https://mtani-tech.github.io` and `https://mtani-tech.github.io/Mywebsite/`.
5. Create an owner account through `auth.html`. Then grant that account `app_metadata.role = admin` through a trusted Supabase admin workflow/dashboard. Do not grant roles via user-editable metadata. Admin pages and database changes are protected by RLS policies in the SQL.
6. Add verified products, current TZS prices, and seller-owned product images through `admin.html`. Visitors can browse products; signed-in customers can submit order requests. Confirm stock, pickup/delivery and payment with customers manually; this is not a payment processor.

## Tanzania shop partners and images
The homepage includes a WhatsApp enquiry for physical technology shops that want to discuss a listing. It does not claim that any shop has already joined or been verified. Confirm shop identity, location, permission to list, products and prices before publishing partner details. The buyer-guide photos are illustrative stock photography; upload seller-owned photos for actual product listings.

## Deployment
Changes pushed to the repository's `main` branch are published by GitHub Pages after its deployment finishes. Supabase setup and configuration are separate steps and are not completed by a GitHub Pages push. Until Supabase is configured and real product listings are added, the catalogue/order features remain unconnected.
