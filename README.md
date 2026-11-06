# MTANI TECH store setup

The GitHub Pages site now contains a storefront, customer sign-up/sign-in, product management, and an admin order dashboard. It needs a Supabase project before database-backed features work; GitHub Pages cannot host a private database itself.

## Connect Supabase
1. Create a Supabase project.
2. In **SQL Editor**, run all of `supabase/schema.sql`.
3. In `supabase-config.js`, replace the two placeholders with the project's **Project URL** and **publishable/anon key**. These public client values are intended for the browser. **Never add a service-role key or password to this repository.**
4. In Supabase Auth settings, configure the site URL and redirect URL for your GitHub Pages origin, such as `https://mtani-tech.github.io` and `https://mtani-tech.github.io/Mywebsite/`.
5. Create an owner account through `auth.html`. Then grant that account `app_metadata.role = admin` through a trusted Supabase admin workflow/dashboard. Do not grant roles via user-editable metadata. Admin pages and database changes are protected by RLS policies in the SQL.
6. Add real products in `admin.html`. Visitors can browse products; signed-in customers can submit order requests. Confirm stock and payment with customers manually; this is not a payment processor.

The order rows store a browser-submitted price snapshot for order-request convenience only. Verify prices and availability before accepting payment. For production sales, add server-side price verification and a trusted payment provider/backend before taking payments.

## Deployment
Changes pushed to the repository's `main` branch are published by GitHub Pages after its deployment finishes. Supabase setup and configuration are separate steps and are not completed by a GitHub Pages push.
