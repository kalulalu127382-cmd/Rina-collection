-- ============================================================
-- Migration: 002_create_functions_and_triggers
-- Auto-generate order_number, tracking_token, updated_at
-- ============================================================

-- Generate order_number (RC-YYYYMMDD-NNN) using Nepal timezone
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  today_str text;
  seq       integer;
BEGIN
  IF NEW.order_number IS NOT NULL AND NEW.order_number != '' THEN
    RETURN NEW;
  END IF;

  today_str := to_char(now() AT TIME ZONE 'Asia/Kathmandu', 'YYYYMMDD');

  SELECT count(*) + 1
    INTO seq
    FROM orders
   WHERE order_number LIKE 'RC-' || today_str || '-%';

  NEW.order_number := 'RC-' || today_str || '-' || lpad(seq::text, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Generate tracking_token (40-char hex random string)
CREATE OR REPLACE FUNCTION generate_tracking_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_token IS NOT NULL AND NEW.tracking_token != '' THEN
    RETURN NEW;
  END IF;

  NEW.tracking_token := encode(gen_random_bytes(20), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_tracking_token
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_tracking_token();

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
