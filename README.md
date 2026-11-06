# MTANI TECH marketplace

This GitHub Pages storefront is a public, mobile-friendly product discovery site for technology goods in Tanzania. It includes category browsing, search, sorting, saved items, enquiry list, WhatsApp seller enquiries, and links to free software downloads from official publishers.

## Important limits
- The site is not Alibaba and is not yet a complete multi-vendor transaction platform. Seller verification, payment processing, shipping, refunds/disputes, and automatic order fulfillment require trusted backend services and operational setup.
- When the database is not configured, the catalogue shows clearly labelled example product ideas. They are not live offers; sellers, stock, condition, warranty and prices must be checked directly.
- Free software cards link to the respective official publishers. MTANI TECH does not host or redistribute those downloads.
- In the admin catalog, a public download URL is permitted only for free resources. Do not place paid/private goods in a public URL field. Paid downloads need a backend to confirm payment and issue short-lived private links.

## Connect the database
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor. It creates/migrates the product categories, seller details, stock fields and order enquiry tables with row-level security.
3. Set the project URL and public anon/publishable key in `supabase-config.js`. Never add a service-role key or password to the public repository.
4. Configure Supabase Auth site and redirect URLs for `https://mtani-tech.github.io` and `https://mtani-tech.github.io/Mywebsite/`.
5. Create your owner account and assign `app_metadata.role=admin` securely from Supabase. Never assign roles from browser-editable metadata.
6. Add verified seller listings, accurate photos with permission, current TZS price/quote, stock and warranty details in `admin.html`.

WhatsApp enquiries use **+255 639 784 923** (international link `https://wa.me/255639784923`). Verify seller identity, product authenticity, availability, delivery and final price before making payments.

## Publish
Changes pushed to `main` deploy through GitHub Pages. Database-backed functions require Supabase setup separately. To make this a fully functional marketplace with paid digital delivery or online payments, add a secure server/backend and a payment provider; do not collect payment credentials on a static page.
