-- ============================================================
-- Migration: 001_create_enums_and_tables
-- Rina Collection — Full schema setup
-- ============================================================

-- ENUMS
CREATE TYPE promo_code_type AS ENUM ('FLAT', 'PERCENT');

CREATE TYPE order_status AS ENUM (
  'PENDING_VERIFICATION',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'PAYMENT_REJECTED',
  'CANCELLED',
  'OUT_OF_STOCK'
);

-- 1. products
CREATE TABLE products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  description     text,
  material        text,
  size_fit_notes  text,
  care_instructions text,
  price           numeric(10,2) NOT NULL CHECK (price >= 0),
  sale_price      numeric(10,2) CHECK (sale_price IS NULL OR sale_price >= 0),
  active          boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_active ON products (active) WHERE active = true;

-- 2. product_variants
CREATE TABLE product_variants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size        text,
  color       text,
  sku         text,
  stock       integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_variants_product ON product_variants (product_id);

-- 3. product_images
CREATE TABLE product_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url   text NOT NULL,
  alt_text    text,
  is_cover    boolean NOT NULL DEFAULT false,
  variant_id  uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_images_product ON product_images (product_id);
CREATE INDEX idx_product_images_variant ON product_images (variant_id) WHERE variant_id IS NOT NULL;

-- 4. promo_codes
CREATE TABLE promo_codes (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                text NOT NULL UNIQUE,
  type                promo_code_type NOT NULL,
  value               numeric(10,2) NOT NULL CHECK (value > 0),
  min_order_amount    numeric(10,2),
  max_uses            integer,
  used_count          integer NOT NULL DEFAULT 0,
  per_customer_limit  integer,
  applies_to_delivery boolean NOT NULL DEFAULT false,
  referrer_name       text,
  active              boolean NOT NULL DEFAULT true,
  expires_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Trigger: ensure code is always stored uppercase
CREATE OR REPLACE FUNCTION uppercase_promo_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := upper(NEW.code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_promo_code_uppercase
  BEFORE INSERT OR UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION uppercase_promo_code();

CREATE INDEX idx_promo_codes_code ON promo_codes (code);

-- 5. orders
CREATE TABLE orders (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number            text UNIQUE,
  tracking_token          text UNIQUE,
  customer_name           text NOT NULL,
  phone                   text NOT NULL,
  address                 text NOT NULL,
  city                    text NOT NULL,
  subtotal                numeric(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_charge         numeric(10,2) NOT NULL DEFAULT 110,
  promo_code_id           uuid REFERENCES promo_codes(id) ON DELETE SET NULL,
  discount_amount         numeric(10,2) NOT NULL DEFAULT 0,
  total                   numeric(10,2) NOT NULL CHECK (total >= 0),
  status                  order_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
  payment_screenshot_url  text,
  verification_note       text,
  rejection_reason        text,
  utm_source              text,
  utm_medium              text,
  utm_campaign            text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_phone ON orders (phone);
CREATE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_tracking_token ON orders (tracking_token);
CREATE INDEX idx_orders_promo ON orders (promo_code_id) WHERE promo_code_id IS NOT NULL;

-- 6. order_items
CREATE TABLE order_items (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id            uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id            uuid REFERENCES product_variants(id) ON DELETE RESTRICT,
  product_name_snapshot text NOT NULL,
  size_snapshot         text,
  color_snapshot        text,
  unit_price            numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity              integer NOT NULL CHECK (quantity > 0),
  line_total            numeric(10,2) NOT NULL CHECK (line_total >= 0),
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items (order_id);

-- 7. store_settings (key-value)
CREATE TABLE store_settings (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
