-- ============================================================
-- Migration: 003_create_rls_policies
-- Row Level Security for all tables
-- ============================================================

-- Enable RLS
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images      ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings      ENABLE ROW LEVEL SECURITY;

-- PRODUCTS — anon reads active only; admin full CRUD
CREATE POLICY "products_public_read"
  ON products FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "products_admin_all"
  ON products FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- PRODUCT_VARIANTS — anon reads active (with active parent product); admin full
CREATE POLICY "variants_public_read"
  ON product_variants FOR SELECT TO anon
  USING (
    active = true
    AND EXISTS (
      SELECT 1 FROM products WHERE products.id = product_variants.product_id AND products.active = true
    )
  );

CREATE POLICY "variants_admin_all"
  ON product_variants FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- PRODUCT_IMAGES — anon reads (for active products); admin full
CREATE POLICY "images_public_read"
  ON product_images FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.active = true
    )
  );

CREATE POLICY "images_admin_all"
  ON product_images FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- PROMO_CODES — NO public access; admin full
-- (anon validates via the validate_promo_code() function)
CREATE POLICY "promo_codes_admin_all"
  ON promo_codes FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ORDERS — NO public SELECT/UPDATE; admin full
-- (anon places via place_order() and tracks via track_order_* functions)
CREATE POLICY "orders_admin_all"
  ON orders FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ORDER_ITEMS — NO public access; admin full
CREATE POLICY "order_items_admin_all"
  ON order_items FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- STORE_SETTINGS — anon can read all; admin full
CREATE POLICY "settings_public_read"
  ON store_settings FOR SELECT TO anon
  USING (true);

CREATE POLICY "settings_admin_all"
  ON store_settings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
