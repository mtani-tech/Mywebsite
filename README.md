# MTANI TECH marketplace

This GitHub Pages storefront provides technology discovery, indicative Tanzania product-price bands, category search, saved items, WhatsApp product enquiries, and links to free developer tools from official publishers.

## Tanzania prices and product listings
The displayed price bands are rough, non-binding market guidance, not seller quotes, confirmed stock, or MTANI TECH inventory. They vary by brand, model, capacity/specification, new/used condition, seller, location, warranty and exchange rates. Verify live pricing directly with the seller before purchase. References include [Jiji Tanzania computer listings](https://jiji.co.tz/dar-es-salaam/computers-and-laptops), [Price in Tanzania](https://www.priceintanzania.com/) and the [official Arduino store](https://store.arduino.cc/products/arduino-starter-kit-multi-language). Products shown as examples are not verified offers.

## Developer software
The developer downloads section links to official publisher websites for VS Code, Python, Git, Arduino IDE, Node.js, Android Studio, GitHub Desktop, Docker Desktop, Blender and Postman. MTANI TECH does not host or redistribute these files. Each publisher controls availability, licensing, system requirements, and whether a paid plan is required.

## Can the website collect payments?
Yes, a business can accept online payments after merchant onboarding with a supported payment provider, but it is **not configured on this static site yet**. Providers operating in Tanzania may offer mobile money/card collection; for example, review [ClickPesa](https://clickpesa.com/), [DPO Pay](https://dpogroup.com/online-payments/tanzania/) and [Pesapal](https://www.pesapal.com/). Confirm current Tanzania availability, fees, settlement terms, KYC/business documents and integration requirements directly with each provider. Do not collect card details or payment credentials in this website.

A secure payment implementation needs a merchant account and a trusted server/backend to create payment requests and verify provider webhooks. Never put secret API credentials in GitHub Pages JavaScript. Paid downloadable products must be stored privately and released only after the backend confirms payment; never place paid file links in a public listing. Physical goods also need seller verification, stock validation, shipping/delivery handling, refunds and customer support. Current WhatsApp/cart flow is an enquiry only and does not take payment.

## Connect database and seller listings
1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. Add the project URL and public anon/publishable key in `supabase-config.js`. Never add a service-role key or password to the repository.
3. Set Supabase Auth site/redirect URLs for `https://mtani-tech.github.io` and `https://mtani-tech.github.io/Mywebsite/`.
4. Create an owner account and assign `app_metadata.role=admin` securely from Supabase; never grant roles via user-editable metadata.
5. Add verified seller listings with accurate TZS prices, inventory, authorized photos and warranty terms in `admin.html`.

WhatsApp enquiries use **+255 639 784 923** (`https://wa.me/255639784923`). Verify seller identity, product authenticity, availability, total price and delivery terms before paying.

## Publish
Changes pushed to `main` deploy through GitHub Pages. Supabase setup, verified product listings and payment-provider/backend setup are separate requirements. Public page access does not mean payment collection or digital fulfillment has been activated.
