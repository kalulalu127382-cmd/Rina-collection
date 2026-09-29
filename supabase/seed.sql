-- ============================================================
-- Seed data for local development / testing
-- Run with: supabase db seed
-- ============================================================

-- Store settings
INSERT INTO store_settings (key, value) VALUES
  ('store_name',       'Rina Collection'),
  ('qr_image_url',     ''),
  ('delivery_charge',  '110'),
  ('contact_number',   ''),
  ('meta_pixel_id',    ''),
  ('tiktok_pixel_id',  ''),
  ('tracking_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- Sample product 1: Kurta Set
INSERT INTO products (id, name, slug, description, material, size_fit_notes, care_instructions, price, sale_price)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'Classic Kurta Set - Navy Blue',
  'classic-kurta-set-navy-blue',
  'Elegant navy blue kurta set perfect for everyday wear and casual gatherings. Features intricate embroidery on the neckline and sleeves.',
  '100% Cotton',
  'Regular fit. Order your usual size. Model wears size M.',
  'Machine wash cold. Do not bleach. Iron on low heat.',
  2500,
  1999
);

-- Sample product 2: Saree
INSERT INTO products (id, name, slug, description, material, size_fit_notes, care_instructions, price, sale_price)
VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'Floral Printed Saree',
  'floral-printed-saree',
  'Beautiful floral printed saree with contrast border. Comes with matching unstitched blouse piece. Perfect for festivals and special occasions.',
  'Georgette with Silk Border',
  'Free size. Saree length: 5.5m, Blouse piece: 0.8m.',
  'Dry clean recommended. Store folded, avoid hanging.',
  3200,
  NULL
);

-- Variants: Kurta Set
INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'S',  'Navy Blue', 'KS-NB-S',  5),
  ('a1111111-1111-1111-1111-111111111111', 'M',  'Navy Blue', 'KS-NB-M',  10),
  ('a1111111-1111-1111-1111-111111111111', 'L',  'Navy Blue', 'KS-NB-L',  8),
  ('a1111111-1111-1111-1111-111111111111', 'XL', 'Navy Blue', 'KS-NB-XL', 3);

-- Variants: Saree
INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES
  ('b2222222-2222-2222-2222-222222222222', 'Free Size', 'Red Floral',   'SAR-RF-FS', 12),
  ('b2222222-2222-2222-2222-222222222222', 'Free Size', 'Blue Floral',  'SAR-BF-FS', 7);

-- Sample promo codes
INSERT INTO promo_codes (code, type, value, min_order_amount, max_uses, referrer_name)
VALUES ('WELCOME10', 'PERCENT', 10, 1000, 100, NULL);

INSERT INTO promo_codes (code, type, value, referrer_name)
VALUES ('RAMESH50', 'FLAT', 50, 'Ramesh Sharma');
