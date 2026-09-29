RINA COLLECTION
Product Requirements Document (PRD) + Technical Requirements Document (TRD)
E-commerce ordering platform • Hetauda Bus Park, Nepal • v5 — Production Build: QR-Only Payment (Manual Verification) + Cart + Order Tracking + Full Admin Control
1. Product Overview
Rina Collection is a mobile-first e-commerce website for a clothing store based in Hetauda Bus Park, Nepal. The core model removes the need for customers to contact the store by message. Customers browse products, add items to a cart, submit their delivery details, pay the NPR 110 delivery/order-confirmation charge (net of any discount) using the store's QR code, and upload a payment screenshot. The admin confirms every payment manually — by reviewing the uploaded screenshot together with the matching entry on the store's own bank/wallet statement — before confirming the order. This is the full production build: it is not an MVP. Payment is QR-only, by deliberate decision; there is no payment gateway. Every feature in this document — products, promo/referral codes, ad tracking, the product photo gallery, the cart, payment verification, and order tracking — is fully and exclusively controlled by the admin, with zero developer or code involvement needed for any day-to-day decision. There is no customer login anywhere in the system.
2. Product Goals
•	Allow customers to place orders without WhatsApp, Messenger, Instagram DM, or phone calls.
•	Make product browsing, cart management, and ordering fast and simple on mobile.
•	Collect complete customer/order information in one admin dashboard.
•	Accept payment through the store's own QR code only, confirmed manually by the admin against the store's bank/wallet statement — no third-party payment gateway.
•	Give the store a reliable, low-risk workflow to verify payment and update order status without depending on any external payment provider.
•	Allow the owner to manage products, stock, QR image, delivery charge, and orders without code.
•	Let the owner create and manage referral/promo codes without any code changes, and without customers or referrers needing an account.
•	Make the storefront measurable and ready for paid social ads from day one.
•	Give the admin total, exclusive control over every product, promo code, referral code, ad-tracking setting, and payment-verification decision — creation, editing, activation, and expiry — with zero developer or code involvement at any point.
•	Present products the way a modern fashion app does: multiple high-quality photos per product, a clean swipeable gallery, and a clear description — fully managed by the admin.
•	Let customers add multiple products to a cart before checking out, the way any modern e-commerce site works.
•	Let a guest customer check their order status at any time without creating an account or contacting the store.
3. User Roles
Role	Access	Purpose
Customer / User	Public storefront + cart + order form + order tracking	Browse products, manage a cart, apply an optional promo/referral code, pay via QR, place orders, and check order status
Admin	Protected admin dashboard	Manage products, manually verify every QR payment against the bank/wallet statement, manage orders, stock, promo/referral codes, store settings, and marketing metrics

4. Customer Journey
#	Stage	Requirement
1	Arrive (direct or via ad/referral link)	Customer lands on the storefront directly, or via a paid ad / referral link such as rinacollection.com/?ref=CODE, which auto-fills the promo/referral code at checkout.
2	Browse	Customer views product images, price, sizes/colors, availability and details.
3	Add to cart	Customer selects a variant/quantity and adds the product to a cart; can keep browsing and add more products before checking out.
4	Review cart	Customer opens the cart to review items, adjust quantities, remove items, and see the running subtotal before proceeding.
5	Enter details	Customer provides name, phone, address and delivery area at checkout.
6	Apply code (optional)	Customer enters or confirms an auto-filled promo/referral code; the site shows the discount and updated total instantly.
7	Payment	Website shows the final amount due (delivery charge, minus any discount) and the current admin-configured Rina Collection QR.
8	Pay	Customer scans the QR and pays the exact amount shown.
9	Upload proof	Customer uploads a payment screenshot and submits the order.
10	Confirmation	Website generates a unique order ID and tracking link, and shows a 'Pending Verification' status immediately.
11	Admin verification	Admin opens the order, views the payment screenshot, and cross-checks it against the store's own bank/wallet statement before manually accepting or rejecting the payment. No status ever changes automatically.
12	Track order	Customer can return anytime and check status using the tracking link or Order Number + Phone Number, with no login.
13	Fulfillment	Admin processes, ships and marks the order delivered.

5. Functional Requirements — Customer
ID	Feature	Requirement
FR-C01	Homepage	Show Rina Collection branding, featured products, categories and clear Order Now CTA.
FR-C02	Product listing	Show product image, name, price, sale price if applicable, and availability.
FR-C03	Product details	Show multiple images, description, sizes, colors/variants, price and stock status.
FR-C04	Variant selection	Customer must select required size/color before adding to cart when applicable.
FR-C05	Quantity	Customer can select quantity subject to available stock.
FR-C06	Checkout details form	Collect full name, phone number, delivery address and city/area at checkout.
FR-C07	Delivery charge	Default configurable delivery charge is NPR 110.
FR-C08	QR payment	Display the current admin-configured QR image and exact amount to pay.
FR-C09	Payment proof	Customer can upload a payment screenshot/image.
FR-C10	Validation	Require mandatory details, valid phone number, supported image type and reasonable image size.
FR-C11	Order creation	Create order only after required details and payment proof are submitted.
FR-C12	Order ID	Generate unique human-readable order ID, e.g. RC-20260927-001.
FR-C13	Confirmation	Show successful submission screen with order ID, tracking link, and 'Pending Verification' status.
FR-C14	No account required	Guest checkout throughout; customer does not need to create/login to an account.
FR-C15	Promo/referral code field	Optional code field on checkout, auto-filled from a ?ref= link when present but always editable. No account or login required to enter a code.
FR-C16	Live discount feedback	On a valid code, instantly show the discount amount and updated total before submission. On an invalid, expired, exhausted, or below-minimum-order code, show a clear inline error and keep the order at full price.
FR-C17	Single code per order	Only one promo/referral code may be applied per order; entering a new code replaces the previous one.
FR-C18	Remove code	Customer can clear an applied code and revert to full price without restarting the order.
FR-C19	Cart	Customer can add multiple products/variants to a cart, adjust quantity, and remove items before checkout.
FR-C20	Cart persistence	Cart persists in the browser across page loads/visits without login, and is cleared automatically after a successful order.
FR-C21	Order tracking	Guest customer can look up any order's status at any time via a tracking link or Order Number + Phone Number, with no login required.
FR-C22	Status visibility	The tracking page shows the current status (Pending Verification / Confirmed / Processing / Shipped / Delivered / Rejected / Cancelled) and the admin's reason if rejected or cancelled.

6. Functional Requirements — Admin
ID	Feature	Requirement
FR-A01	Admin authentication	Protected admin login; customer must never access admin functions.
FR-A02	Dashboard	Show total orders, pending payments, confirmed, shipped and delivered counts.
FR-A03	Product CRUD	Create, view, edit, hide/delete products.
FR-A04	Product media	Upload multiple product images.
FR-A05	Variants	Manage size, color and variant-specific stock when required.
FR-A06	Inventory	Track available stock and prevent ordering unavailable variants.
FR-A07	Orders	View all orders with search/filter by status/date/order ID/promo code.
FR-A08	Payment proof	Open/view uploaded payment screenshot at full size.
FR-A09	Payment verification	Mark payment as Verified or Rejected only after the admin has manually cross-checked the screenshot against the corresponding entry on the store's bank/wallet statement; rejection requires a reason. No payment is ever marked verified automatically.
FR-A10	Order status	Update order: Pending Verification → Confirmed → Processing → Shipped → Delivered; Cancelled/Rejected as needed.
FR-A11	Customer details	View name, phone and delivery address for fulfillment.
FR-A12	QR settings	Replace/update the store payment QR image.
FR-A13	Delivery charge	Change default delivery charge from admin settings.
FR-A14	Store settings	Edit basic store information and contact details.
FR-A15	Promo/referral code management	Create a code with: code text, discount type (flat NPR or percentage), discount value, minimum order amount (optional), usage limit, per-customer/phone limit (optional), expiry date, and active/inactive toggle.
FR-A16	Referral attribution	Tag a code with a referrer/influencer name so orders using it are attributed to that source, with no login needed by the referrer.
FR-A17	Code usage tracking	See, per code: times used, total discount given, linked orders, and remaining uses.
FR-A18	Instant deactivation	Deactivate or delete a code at any time; the next validation attempt is rejected immediately.
FR-A19	Marketing metrics	See orders broken down by traffic source/UTM and by promo/referral code, to judge ad spend against real orders.
FR-A20	Ad tracking settings	Enter and update the Meta Pixel ID and TikTok Pixel ID, and turn tracking on/off entirely, from Store Settings — no developer or code deployment required.
FR-A21	Product photo gallery	Upload multiple photos per product (recommended 4–8), drag to reorder, and mark one photo as the cover/thumbnail used in listings.
FR-A22	Variant-specific photos	Attach a separate set of photos to a specific color/variant, so the gallery shown matches the color the customer selects.
FR-A23	Photo captions & alt text	Add a short caption/alt-text per photo (e.g. 'Front', 'Back', 'Fabric close-up', 'On model').
FR-A24	Rich product description	Write a full product description plus optional fields for material/fabric, size & fit notes, and care instructions — all editable without code.
FR-A25	Multi-item order management	View and manage orders containing multiple line items from a cart the same way as single-item orders.
FR-A26	Order tracking link	View and copy the tracking link/URL for any order to share with the customer if needed.
FR-A27	Statement cross-check note	Record a short internal note per order (e.g. the matching statement line/reference) when verifying payment, for the admin's own audit trail.

7. Order & Payment States
Recommended order lifecycle:
PENDING_VERIFICATION → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
Alternative terminal states: PAYMENT_REJECTED, CANCELLED, OUT_OF_STOCK.
Important: uploading a screenshot must NOT automatically mark payment as verified. The screenshot represents submitted proof; the admin manually verifies it — by checking it against the store's own bank/wallet statement — before confirming the order. No payment status on this platform is ever set automatically; every verification is a deliberate admin action.
8. Non-Functional Requirements
•	Mobile-first responsive design; primary use case is Android/iPhone customers.
•	Fast storefront loading, compressed/responsive product images and lazy loading.
•	Secure HTTPS in production.
•	Admin routes protected by authentication and authorization.
•	Customer-uploaded files validated by MIME type, extension and size.
•	Never expose private admin credentials or service-role database keys to the browser.
•	Database backups and basic audit timestamps for orders/status changes and promo-code changes.
•	Clear error states for failed uploads, network errors, incomplete forms, and invalid promo codes.
•	Accessible buttons, labels and readable text.
•	Use Nepal timezone (Asia/Kathmandu) for displayed order timestamps.
9. TRD — Recommended Architecture
Recommended production stack: Next.js/React frontend, Supabase for PostgreSQL database + authentication + storage, and Vercel (or equivalent) for deployment. Payment stays intentionally simple and fully admin-controlled: no third-party payment gateway or API integration.
Layer	Technology	Purpose
Frontend	Next.js + React + Tailwind CSS	Storefront, cart, checkout and admin UI
Backend	Next.js server actions/API routes or Supabase	Server-side business logic, including promo-code validation and cart→order conversion
Database	Supabase PostgreSQL	Products, variants, orders, promo codes, settings
Authentication	Supabase Auth	Admin authentication only
File storage	Supabase Storage	Product images, QR image, payment screenshots
Deployment	Vercel + Supabase	Production hosting
Payments	Store QR image + manual verification against the admin's own bank/wallet statement	The only payment method — no gateway, no automated confirmation
Analytics/Ads	Meta Pixel, TikTok Pixel, UTM capture	Ad conversion tracking and attribution

10. Database Schema
Table	Main fields	Purpose
admins / auth.users	id, email, created_at	Admin authentication. Prefer Supabase Auth; profile table optional.
products	id, name, slug, description, material, size_fit_notes, care_instructions, price, sale_price, active, created_at, updated_at	Core product catalog.
product_images	id, product_id, image_url, alt_text, is_cover, variant_id (nullable FK), sort_order	Multiple images per product, with cover flag and optional per-variant assignment.
product_variants	id, product_id, size, color, sku, stock, active	Optional size/color inventory.
promo_codes	id, code (unique), type (FLAT/PERCENT), value, min_order_amount, max_uses, used_count, per_customer_limit, applies_to_delivery, referrer_name, active, expires_at, created_at, updated_at	Admin-managed discount and referral codes.
orders	id, order_number, tracking_token (unique), customer_name, phone, address, city, subtotal, delivery_charge, promo_code_id, discount_amount, total, status, payment_status, payment_screenshot_url, verified_by_note, rejection_reason, utm_source, utm_medium, utm_campaign, created_at, updated_at	Customer order, fulfillment, payment verification and attribution data.
order_items	id, order_id, product_id, variant_id, product_name_snapshot, size_snapshot, color_snapshot, unit_price, quantity, line_total	Immutable order snapshot; one order can hold multiple items from the cart, so later product edits do not change old orders.
store_settings	key, value, updated_at	QR URL, delivery charge, store name, contact info, and pixel IDs, all admin-editable.
Cart data lives client-side (browser storage) while the customer is shopping, since there is no customer account to attach a server-side cart to. It only becomes durable data — as rows in order_items — at the moment an order is created, when stock and price are re-validated server-side per item exactly as promo codes are (Section 16.3, Section 20).
11. Security / Supabase Rules
•	Public users may read only active products and public product images.
•	Customers may create orders through a controlled server-side endpoint or narrowly scoped insert policy.
•	Customers must not be able to read all orders, other customers' personal information, or the full promo_codes table.
•	Only authenticated admins can read payment screenshots and update order/payment status.
•	Only admins can create/update/delete products, promo codes, and store settings.
•	Payment screenshots should be stored in a private bucket; access through authorized/signed URLs.
•	Validate price, delivery charge, cart contents, and promo-code discount server-side. Never trust price or discount values submitted by the browser.
•	Recalculate order totals on the server from current product data, current stock, and current promo-code rules at order-creation time.
•	Payment status changes only through an authenticated admin action — there is no automated, webhook-driven, or customer-triggered path that can mark an order Verified. This is by design: the admin's manual cross-check against the bank/wallet statement is the only source of truth for payment.
•	Rate-limit and validate the order-tracking lookup endpoint (order number + phone) and return a generic 'not found' on any mismatch, to prevent order enumeration.
•	Rate-limit order submission, upload, and promo-code validation endpoints to reduce spam and prevent code-guessing/enumeration.
12. API / Server Actions
•	GET /products — active catalog
•	GET /products/:slug — product detail
•	POST /cart/validate — optional; re-check stock and current price for items in a client-side cart before checkout
•	POST /promo/validate — public, rate-limited; body {code, subtotal}; returns discount if the code is currently valid
•	POST /orders — create order after validating cart items/stock, customer details, promo code (re-validated server-side) and payment screenshot
•	GET /orders/track — public, rate-limited; query {order_number, phone} or {tracking_token}; returns that order's status only
•	GET /admin/orders — admin-only order list, filterable by status/date/promo code
•	GET /admin/orders/:id — admin-only order detail
•	PATCH /admin/orders/:id/status — admin-only status update
•	PATCH /admin/orders/:id/payment — admin-only payment verification/rejection, with an optional statement cross-check note
•	POST /admin/products — create product
•	PATCH /admin/products/:id — update product
•	DELETE /admin/products/:id — remove/deactivate product
•	POST /admin/promo-codes — create a promo/referral code
•	PATCH /admin/promo-codes/:id — update or deactivate a code
•	DELETE /admin/promo-codes/:id — remove a code
•	GET /admin/promo-codes — list codes with usage stats
•	GET /admin/marketing — orders grouped by UTM source/medium/campaign and by promo code
•	PATCH /admin/settings — update QR, delivery charge and store settings
13. Admin Dashboard Screens
•	Login
•	Dashboard (incl. marketing snapshot: orders by source, top promo codes)
•	Orders list
•	Order detail + payment screenshot + tracking link + statement cross-check note
•	Products list
•	Add/Edit product
•	Inventory/variants
•	Promo & referral codes list
•	Add/Edit promo/referral code + usage stats
•	Store settings
•	QR payment settings
•	Ads & tracking settings (Meta Pixel ID, TikTok Pixel ID, tracking on/off)
14. Customer Screens
•	Home
•	Product listing/category
•	Product detail (primary ad-landing page)
•	Cart (items, quantities, subtotal, remove)
•	Checkout details form (with promo/referral code field)
•	Payment/QR page (shows final discounted amount and the current QR)
•	Payment screenshot upload
•	Order submitted / confirmation (includes tracking link and 'Pending Verification' status)
•	Order tracking lookup page (tracking link, or Order Number + Phone Number)
15. UI / Brand Direction
•	Brand: Rina Collection
•	Location: Hetauda Bus Park, Nepal
•	Design priority: premium, single-brand boutique feel — not a marketplace-style grid — that beats the look and conversion rate of large mall-style e-commerce sites.
•	Mobile-first by default: most traffic will arrive from Facebook/Instagram/TikTok ads on phones; design every screen at mobile width first.
•	Use high-quality product photography with consistent aspect ratios and an editorial, lookbook-style presentation.
•	Keep Order Now / Buy Now and Add-to-Cart CTAs prominent, thumb-reachable, and bottom-fixed on mobile.
•	Show a persistent cart icon with an item-count badge across the storefront.
•	Payment page must clearly display the final amount due (after any promo discount) and the QR.
•	Show a clear notice: 'After payment, upload your payment screenshot.'
•	Avoid unnecessary account creation, chat widgets, or complex multi-step checkout.
•	Distinctive visual identity — a custom color palette and typography for Rina Collection rather than a default template look — with tasteful micro-interactions (image zoom, size-chart modal).
•	Fast perceived load on typical Nepali mobile networks: optimized images, lazy loading, skeleton loaders.
•	Honest social proof where real data supports it (e.g., recently-ordered or low-stock indicators) to aid conversion without misleading customers.
•	Surface the tracking link clearly on the confirmation screen so customers can bookmark or screenshot it.
16. Referral & Promo Code System — Detailed Design
This section goes deeper on FR-C15–FR-C18 and FR-A15–FR-A19 above. Codes are always created and controlled by the admin. Neither the customer nor a referrer ever needs to log in or hold an account to use, share, or be attributed by a code.
16.1 Code types
Type	Typical use	Discount required?
Promo code	General discount campaign the admin runs itself (e.g. festival sale, Facebook post)	Yes — flat NPR or % off
Referral code	Given to a specific person/influencer to share; primarily for attribution	Optional — can carry NPR 0 discount and still be tracked, or include a discount as an incentive

Both types live in the same promo_codes table and share the same validation logic — 'referral' vs 'promo' is simply how the admin labels and reports on the code (via the referrer_name field), not a different technical mechanism.
16.2 Referral link mechanics
•	Each code can be shared as a plain code (typed at checkout) or as a link, e.g. rinacollection.com/?ref=DASHAIN10.
•	When a customer arrives via a ?ref= link, the code auto-fills into the checkout form's code field but remains editable — the customer can remove or replace it.
•	The ?ref= parameter is also captured as attribution data even if the customer never completes checkout with that code applied, so the admin can see link clicks vs. converted orders (future upgrade: a lightweight click counter per code).
16.3 Validation flow (server-side, on /promo/validate and again on /orders)
1.	Normalize the entered code: trim whitespace, treat matching case-insensitively.
2.	Look up the code; if not found → 'Invalid code' (no hint about why, to avoid enabling code-guessing).
3.	If inactive or deleted → 'This code is no longer available.'
4.	If past expires_at → 'This code has expired.'
5.	If used_count ≥ max_uses → 'This code has reached its usage limit.'
6.	If per_customer_limit is set and this phone number has already used it that many times → 'This code has already been used on this number.'
7.	If min_order_amount is set and the current subtotal is below it → show the minimum required to unlock the code.
8.	If all checks pass, compute the discount (flat NPR, or % of subtotal, capped so the discount never exceeds the subtotal), optionally including the delivery charge if applies_to_delivery is true, and return the discount plus the new total.
9.	At order submission, repeat every check above against the live database before creating the order — the amount shown to the customer earlier is only a preview, never the source of truth.
10.	On successful order creation, increment used_count and store promo_code_id + discount_amount on the order in the same transaction, so usage counts can never drift from real orders.
16.4 Admin creation form (FR-A15 detail)
Field	Notes
Code	Free text, stored uppercase; must be unique
Discount type	Flat NPR or Percentage
Discount value	Numeric; percentage capped at 100
Minimum order amount	Optional; blank = no minimum
Applies to delivery charge?	Yes/No toggle, default No
Max total uses	Optional; blank = unlimited
Max uses per phone number	Optional; blank = unlimited
Expiry date	Optional; blank = no expiry
Referrer / campaign name	Free text, for attribution and reporting only
Active	On/off toggle, defaults on

16.5 Admin reporting per code
•	Times used and remaining uses.
•	Total discount amount given out (NPR).
•	List of linked orders (order ID, date, customer, order total).
•	For referral codes: the same figures rolled up by referrer_name, so the admin can see which referrer/influencer produced the most paying orders — not just clicks.
16.6 Business rules recap
•	The discount is always calculated and re-validated on the server at order-creation time.
•	By default the discount applies to the product subtotal only, not the NPR 110 delivery charge, unless the admin sets applies_to_delivery for that specific code.
•	Only one code may be applied per order; stacking codes is out of scope.
•	A rejected/expired/inactive code must never block the rest of the order — the customer can simply remove the code and continue at full price.
•	Deactivating a code is instant and does not affect orders that already used it historically.
16.7 Full admin control guarantee
•	Every promo code and referral code — its text, discount, minimum order amount, usage limits, expiry date, and active/inactive state — is created, edited, and retired exclusively from the admin panel.
•	A change takes effect immediately on save; there is no code deployment, developer request, or waiting period involved anywhere in a code's lifecycle.
•	Only the admin role can create, edit, expire, or delete a code. Customers and referrers can only enter a code — they never see or influence its rules.
17. Advertising & Marketing Optimization — Detailed Design
Since the store will run paid social ads, the site is built ready for ad-driven traffic and measurable return on ad spend (ROAS) from day one. All amounts are reported in NPR.
17.1 Tracking pixels & events
Event	Fires when	Platforms
PageView	Any page load	Meta Pixel, TikTok Pixel
ViewContent	Product detail page viewed	Meta Pixel, TikTok Pixel
AddToCart	Customer adds an item to the cart	Meta Pixel, TikTok Pixel
InitiateCheckout	Checkout details form opened	Meta Pixel, TikTok Pixel
Order Submitted (Purchase-equivalent)	Order successfully created, with value + NPR currency + promo code if used	Meta Pixel, TikTok Pixel

Because payment is verified manually rather than through a gateway, 'Order Submitted' — not 'Payment Verified' — is the conversion event optimized for. Most submitted orders convert after manual verification, so this remains an acceptable signal for ad-platform learning; it can be refined later if a payment gateway is ever added (see Section 24, Future Upgrade Path).
17.2 Attribution capture
•	Capture utm_source, utm_medium and utm_campaign from the landing URL and persist them for the session.
•	Store the captured UTM values (and the ?ref= promo/referral code, if any) directly on the order record at submission time, so every order is traceable to the ad/post/referrer that produced it.
•	The product detail page — not the homepage — is the primary ad-click landing page, to minimize drop-off from paid traffic.
17.3 Shareability & landing experience
•	Open Graph tags on every product page so links shared or boosted on Facebook, Instagram, WhatsApp and TikTok show a clean image/title/price preview.
•	A lightweight 'campaign landing page' template (single product, single CTA, no navigation) can be used for a major ad push where higher conversion matters more than browsing.
•	Keep the ad-landing product page fast (see Section 15) — page speed materially affects ad quality score and cost per result.
17.4 Admin marketing view (FR-A19 detail)
•	Orders broken down by utm_source / utm_medium / utm_campaign, with order count and total NPR value per source.
•	Orders broken down by promo/referral code, showing which codes (and which referrers) are actually converting into paying orders, not just being used.
•	This lets the owner judge each ad or influencer partnership by real orders rather than clicks or reach alone.
17.5 Admin-controlled ad settings
•	The Meta Pixel ID and TikTok Pixel ID are stored as editable store settings, not hard-coded into the site — the admin can add, change, or remove either at any time from the admin panel.
•	The admin can turn tracking on or off entirely (e.g. while testing a new campaign) with a single toggle, with no developer involvement or redeploy needed.
•	This guarantees the store owner can launch, pause, or reconfigure ad tracking for any campaign entirely on their own.
18. Product Photos & Description — Modern App-Style Media System
This section goes deeper on FR-A21–FR-A24. The goal is a product gallery and description experience that feels like a modern fashion app (e.g. a swipeable, well-photographed gallery), fully managed by the admin with no developer involvement for day-to-day catalog work.
18.1 Gallery requirements
•	Recommended 4–8 photos per product: front, back, a close-up/fabric-detail shot, and an on-model/lifestyle shot as a baseline.
•	Consistent aspect ratio across a product's photos (e.g. 4:5 or 1:1) so the gallery and listing grid look uniform, boutique-style rather than mismatched.
•	Swipeable gallery on the product page with tap-to-zoom for fabric/stitching detail, matching the swipe gestures customers already know from Instagram/Daraz/Sastodeal-style apps.
18.2 Variant-specific photos
•	When a product has color variants, the admin can attach a distinct photo set to each color, so a customer selecting 'Maroon' sees maroon photos, not a generic default set.
•	If a variant has no dedicated photos, the gallery falls back to the product's default photo set rather than showing a broken or empty gallery.
18.3 Cover photo & ordering
•	One photo per product (or per variant, if variant photos are used) is marked as the cover/thumbnail — this is what appears in listings, category grids, and shared links.
•	The admin can drag-and-drop to reorder the remaining gallery photos at any time.
18.4 Captions, alt text & description fields
•	Each photo can carry a short caption/alt-text (e.g. 'Front', 'Back', 'Fabric close-up', 'On model') — improves accessibility and helps the gallery read clearly.
•	The main product description is a full rich-text field, with optional structured fields for material/fabric, size & fit notes, and care instructions, so customers get boutique-quality detail without contacting the store.
18.5 Admin permissions for product media
•	Only the admin role can upload, reorder, caption, replace, or delete product photos, and edit any description field — customers only ever view the gallery, never edit it.
•	Uploaded photos are validated the same way as payment screenshots (file type, size, and minimum resolution) before they are accepted, per the Non-Functional Requirements in Section 8.
18.6 Database schema addition
Table	Added fields	Purpose
product_images	alt_text, is_cover (bool), variant_id (nullable FK)	Captions, cover-photo flag, and optional per-variant photo assignment.
products	material, size_fit_notes, care_instructions	Structured description detail, all admin-editable.
store_settings	meta_pixel_id, tiktok_pixel_id, tracking_enabled (as key/value rows)	Admin-editable ad-tracking configuration (see Section 17.5).

19. Payment Verification — Manual Reconciliation
This is a deliberate product decision, not a placeholder: Rina Collection accepts payment through its own QR code only. There is no payment gateway, no API integration, and no automatic payment confirmation anywhere in the system. Every single payment is verified by a human — the admin — who checks the customer's uploaded screenshot against the corresponding line on the store's own bank or wallet statement before the order is confirmed.
19.1 Why manual-only
•	No dependency on a third-party gateway's uptime, approval process, merchant account, or fees.
•	No integration risk, no API keys to secure, and no webhook infrastructure to maintain.
•	The admin sees the real money landing in the real account before an order is ever confirmed — the highest-certainty form of payment proof available.
19.2 Verification workflow
1.	Customer pays the exact amount shown via the store QR and uploads a screenshot of the payment.
2.	The order is created immediately in PENDING_VERIFICATION status — the customer sees this status and their order ID/tracking link right away.
3.	The admin opens the order in the dashboard and views the uploaded screenshot at full size.
4.	The admin separately opens their own bank or mobile-wallet app/statement and finds the matching transaction (by amount, time, and sender reference).
5.	Only after both the screenshot and the statement entry are confirmed as a genuine match does the admin mark the order Verified/Confirmed. If the admin optionally records a short cross-check note (e.g. the statement reference), it is saved with the order for their own audit trail.
6.	If the screenshot doesn't match any statement entry, is unclear, or looks altered, the admin marks the payment Rejected and enters a reason, which the customer can then see on the order-tracking page.
19.3 Rejection and follow-up
•	A rejected order is not deleted — it stays visible with its reason, so the admin can revisit it if the customer sends a corrected screenshot or the payment appears on the statement later.
•	There is no automatic retry flow for rejected payments; if a customer wants to try again, they can place a new order or the admin can manually move the same order back to Pending Verification and re-check it.
19.4 Full admin control guarantee
•	The QR image and delivery charge shown to every customer are set and changed exclusively from the admin panel, with no developer or code deployment involved.
•	The decision to verify or reject a payment is made exclusively by the admin, on a case-by-case basis, using their own judgment and their own bank/wallet statement — the platform itself never sets an order to Confirmed on its own.
•	Because there is no gateway, there is no third party who can ever hold, delay, or dispute a payment on the store's behalf — the admin is always the sole and final authority over whether a payment counts.
20. Cart — Detailed Design
This section adds real multi-item shopping to the previously single-product order flow, matching the behavior of modern e-commerce sites, while keeping the no-login guest model intact.
20.1 Cart model
•	The cart lives in the customer's browser (local storage), not on the server, since there is no customer account to attach a server-side cart to.
•	Each cart line stores product_id, variant_id (if applicable), quantity, and the price at the time it was added, so the customer sees a consistent subtotal while browsing.
•	The cart is scoped to one browser on one device; it is not synced across devices, which is an accepted trade-off of the no-login model.
20.2 Cart behavior
•	Add to cart, change quantity, and remove an item are all instant, client-side actions with no page reload.
•	The cart shows a live subtotal (before delivery charge and any promo code) and an item-count badge in the site header at all times.
•	A soft client-side stock check prevents obviously over-selecting quantity, but this is only a convenience — the authoritative check happens server-side at checkout.
20.3 Checkout conversion
•	At checkout, the entire cart is sent to the server, which re-validates every line's stock and current price before creating the order — exactly as promo codes are re-validated server-side (Section 16.3).
•	If a price changed or an item went out of stock since it was added to the cart, the customer sees a clear inline message and an updated total before they can proceed — the browser's cached price is never trusted.
•	Each cart line becomes one order_items row, snapshotted with the product name, size, color, unit price and quantity at order time, so later catalog edits never alter a past order.
•	The cart total (including delivery charge and any discount) is what the customer pays via QR; the cart is cleared automatically once the order is successfully created.
20.4 Business rules
•	One cart per browser session; there is no concept of saved or shared carts in this build.
•	There is no minimum or maximum item count enforced by default; the admin's per-code minimum-order-amount rule (Section 16.4) still applies to the cart subtotal as a whole.
20.5 Abandoned carts
A cart that is never converted to an order leaves no server-side trace beyond whatever UTM/attribution data was already captured for the session (Section 17.2). Full abandoned-cart recovery (e.g. reminder messages) remains a Future Upgrade (Section 24), since it would require a way to contact the customer before an order — and therefore a phone number — exists.
21. Order Tracking — Detailed Design
This closes the MVP's biggest gap: a guest customer previously had no way to learn that a payment was rejected, or to check status at all, without contacting the store.
21.1 Access methods
•	Tracking link: every order gets a unique tracking_token, shown as a link on the confirmation screen, e.g. rinacollection.com/track/TOKEN — opening it shows that order's status with no further input.
•	Manual lookup: a customer who didn't save the link can instead enter their Order Number and Phone Number on a tracking page to look up the same order.
•	Neither method requires an account, a password, or any login.
21.2 What the tracking page shows
•	Current status and a simple visual timeline (e.g. Confirmed → Processing → Shipped → Delivered).
•	The reason shown by the admin if the order is Payment Rejected, Payment Failed, or Cancelled.
•	Items ordered, quantities, and the total paid.
•	Delivery address is shown to the customer viewing their own order, but the tracking endpoint never returns any other customer's data.
21.3 Security
•	The GET /orders/track endpoint is public but rate-limited per IP/phone to prevent brute-forcing order numbers.
•	Any mismatch between order number and phone returns the same generic 'Order not found' message — the system never confirms that an order number exists on its own.
•	The tracking_token is a long, random, unguessable value (not a sequential ID), so a tracking link cannot be guessed from another order's link.
21.4 Admin visibility
The order-detail screen in the admin dashboard shows and lets the admin copy each order's tracking link, so staff can proactively share it with a customer over phone or SMS if asked.
22. Production Acceptance Criteria
•	Admin can log in securely.
•	Admin can add a product with multiple images, price and stock.
•	Product appears on the public storefront with a working photo gallery.
•	Customer can add multiple products/variants to a cart, adjust quantities, and remove items.
•	Customer can select a product/variant, add to cart, and complete checkout details.
•	Customer sees the current NPR 110 delivery charge and the store QR before paying.
•	Customer can enter or auto-fill a promo/referral code and see the correct discount and updated total, or a clear error if invalid.
•	Customer pays via QR and uploads a payment screenshot; the order is created in Pending Verification status.
•	A unique order is created — including all cart line items, any applied promo code and discount, and any UTM attribution — and is visible in admin.
•	Admin can view the customer's details, line items, and payment screenshot, and applied promo/referral code.
•	Admin can cross-check the screenshot against the bank/wallet statement and manually verify or reject the payment, with a reason required on rejection.
•	No order is ever marked Verified/Confirmed without this manual admin action — there is no automatic or gateway-driven confirmation anywhere.
•	Admin can move the order through fulfillment statuses.
•	Admin can create, edit, and deactivate a promo/referral code, and it is correctly enforced (expiry, usage limit, minimum order) at checkout.
•	Meta Pixel and TikTok Pixel fire PageView, ViewContent, AddToCart, InitiateCheckout and Order Submitted events with correct NPR value.
•	Customer cannot access other customers' orders.
•	Admin can change the QR and delivery charge without developer help.
•	The entire flow — browsing, cart, promo code, checkout, QR payment, and screenshot upload — works on a mobile phone.
•	Admin can upload multiple photos for a product, reorder them, set a cover photo, add captions, and attach a distinct photo set to a color variant — all without developer help.
•	Admin can edit the full product description plus material, size/fit notes, and care instructions.
•	Admin can set or change the Meta Pixel ID and TikTok Pixel ID and toggle ad tracking on/off, entirely from the admin panel.
•	A guest customer can look up any order's status via the tracking link or Order Number + Phone Number, and sees the correct status and rejection/failure reason if applicable.
23. Out of Scope for This Build
•	Customer accounts and passwords.
•	Customer chat/messaging system.
•	Stacking multiple promo codes on one order, or multi-tier loyalty/points programs.
•	Multi-vendor marketplace.
•	AI recommendations.
•	Server-side Conversions API / advanced ad-platform deduplication (client-side pixel only for this build).
•	Automated delivery partner integration and live delivery tracking.
•	Product videos/reels in the gallery (photos only).
•	Cross-device cart sync (cart is single-browser, local storage only).
•	Automated abandoned-cart recovery messages.
•	Any payment gateway or third-party payment API integration — payment is QR-only, verified manually, by decision.
•	Automatic bank/wallet payment reconciliation — the admin's manual statement cross-check is the only verification method.
24. Future Upgrade Path
•	SMS/WhatsApp/Viber order-status notifications, including promo-code reminders for abandoned checkouts.
•	Delivery partner integration and live delivery tracking.
•	Abandoned-cart recovery messages (requires capturing a phone number before checkout completes).
•	Stacked/tiered coupons, bundles, and loyalty-points campaigns.
•	Server-side Conversions API (Meta/TikTok) for more accurate ad tracking under iOS privacy restrictions.
•	Click-level tracking per referral link (not just converted orders).
•	Sales analytics and best-selling product reports.
•	Customer accounts and order history, including a saved, cross-device cart.
•	Short product videos/reels alongside the photo gallery.
•	An audit log of who changed ad-tracking settings or a promo code, and when.
•	Replacing manual QR verification with an integrated payment gateway (eSewa/Khalti/IME Pay/ConnectIPS), if and when it becomes commercially worthwhile — deliberately not part of this build.
25. Core Business Rule
The store does not require customers to message the store to place an order.
The website is the primary ordering channel: product selection → cart → optional promo/referral code → customer details → NPR 110 QR payment (net of any discount) → payment screenshot → order submission → admin manually verifies against the bank/wallet statement → order tracking available to the customer at any time → fulfillment. Every decision along this chain — products, codes, ads, and above all payment verification — is made by the admin alone.
