-- ============================================================
-- Migration: 004_create_server_functions
-- SECURITY DEFINER functions callable by anon for:
--   - Promo code validation
--   - Order placement
--   - Order tracking (by token or order_number+phone)
-- ============================================================

-- validate_promo_code: returns discount info without exposing promo_codes table
CREATE OR REPLACE FUNCTION validate_promo_code(
  p_code text,
  p_subtotal numeric DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo  promo_codes%ROWTYPE;
  v_discount numeric;
BEGIN
  SELECT * INTO v_promo
    FROM promo_codes
   WHERE code = upper(p_code)
     AND active = true;

  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'Invalid or inactive promo code');
  END IF;

  IF v_promo.expires_at IS NOT NULL AND v_promo.expires_at < now() THEN
    RETURN json_build_object('valid', false, 'error', 'This code has expired');
  END IF;

  IF v_promo.max_uses IS NOT NULL AND v_promo.used_count >= v_promo.max_uses THEN
    RETURN json_build_object('valid', false, 'error', 'This code has reached its usage limit');
  END IF;

  IF v_promo.min_order_amount IS NOT NULL AND p_subtotal < v_promo.min_order_amount THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Minimum order of NPR ' || v_promo.min_order_amount || ' required for this code'
    );
  END IF;

  IF v_promo.type = 'FLAT' THEN
    v_discount := v_promo.value;
  ELSE
    v_discount := round(p_subtotal * v_promo.value / 100, 2);
  END IF;

  RETURN json_build_object(
    'valid', true,
    'promo_code_id', v_promo.id,
    'code', v_promo.code,
    'type', v_promo.type,
    'value', v_promo.value,
    'discount', v_discount,
    'applies_to_delivery', v_promo.applies_to_delivery
  );
END;
$$;

GRANT EXECUTE ON FUNCTION validate_promo_code(text, numeric) TO anon;
GRANT EXECUTE ON FUNCTION validate_promo_code(text, numeric) TO authenticated;

-- place_order: SECURITY DEFINER — inserts order + items, bypasses RLS
CREATE OR REPLACE FUNCTION place_order(
  p_customer_name       text,
  p_phone               text,
  p_address             text,
  p_city                text,
  p_subtotal            numeric,
  p_delivery_charge     numeric,
  p_promo_code_id       uuid DEFAULT NULL,
  p_discount_amount     numeric DEFAULT 0,
  p_total               numeric DEFAULT 0,
  p_payment_screenshot_url text DEFAULT NULL,
  p_utm_source          text DEFAULT NULL,
  p_utm_medium          text DEFAULT NULL,
  p_utm_campaign        text DEFAULT NULL,
  p_items               jsonb DEFAULT '[]'::jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id      uuid;
  v_order_number  text;
  v_tracking_token text;
  v_item          jsonb;
BEGIN
  INSERT INTO orders (
    customer_name, phone, address, city,
    subtotal, delivery_charge, promo_code_id, discount_amount, total,
    payment_screenshot_url, utm_source, utm_medium, utm_campaign
  ) VALUES (
    p_customer_name, p_phone, p_address, p_city,
    p_subtotal, p_delivery_charge, p_promo_code_id, p_discount_amount, p_total,
    p_payment_screenshot_url, p_utm_source, p_utm_medium, p_utm_campaign
  )
  RETURNING id, order_number, tracking_token
     INTO v_order_id, v_order_number, v_tracking_token;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id, product_id, variant_id,
      product_name_snapshot, size_snapshot, color_snapshot,
      unit_price, quantity, line_total
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::uuid,
      NULLIF(v_item->>'variant_id', '')::uuid,
      v_item->>'product_name_snapshot',
      v_item->>'size_snapshot',
      v_item->>'color_snapshot',
      (v_item->>'unit_price')::numeric,
      (v_item->>'quantity')::integer,
      (v_item->>'line_total')::numeric
    );
  END LOOP;

  IF p_promo_code_id IS NOT NULL THEN
    UPDATE promo_codes SET used_count = used_count + 1 WHERE id = p_promo_code_id;
  END IF;

  RETURN json_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'tracking_token', v_tracking_token
  );
END;
$$;

GRANT EXECUTE ON FUNCTION place_order(text, text, text, text, numeric, numeric, uuid, numeric, numeric, text, text, text, text, jsonb) TO anon;
GRANT EXECUTE ON FUNCTION place_order(text, text, text, text, numeric, numeric, uuid, numeric, numeric, text, text, text, text, jsonb) TO authenticated;

-- track_order_by_token: returns a single order by tracking token
CREATE OR REPLACE FUNCTION track_order_by_token(p_tracking_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order  json;
  v_items  json;
BEGIN
  SELECT json_build_object(
    'order_number', o.order_number,
    'status', o.status,
    'customer_name', o.customer_name,
    'city', o.city,
    'subtotal', o.subtotal,
    'delivery_charge', o.delivery_charge,
    'discount_amount', o.discount_amount,
    'total', o.total,
    'rejection_reason', o.rejection_reason,
    'created_at', o.created_at,
    'updated_at', o.updated_at
  ) INTO v_order
  FROM orders o
  WHERE o.tracking_token = p_tracking_token;

  IF v_order IS NULL THEN
    RETURN json_build_object('found', false);
  END IF;

  SELECT json_agg(json_build_object(
    'product_name', oi.product_name_snapshot,
    'size', oi.size_snapshot,
    'color', oi.color_snapshot,
    'unit_price', oi.unit_price,
    'quantity', oi.quantity,
    'line_total', oi.line_total
  )) INTO v_items
  FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  WHERE o.tracking_token = p_tracking_token;

  RETURN json_build_object('found', true, 'order', v_order, 'items', v_items);
END;
$$;

GRANT EXECUTE ON FUNCTION track_order_by_token(text) TO anon;
GRANT EXECUTE ON FUNCTION track_order_by_token(text) TO authenticated;

-- track_order_by_number_phone: returns a single order by order_number + phone
CREATE OR REPLACE FUNCTION track_order_by_number_phone(
  p_order_number text,
  p_phone text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order  json;
  v_items  json;
  v_order_id uuid;
BEGIN
  SELECT o.id, json_build_object(
    'order_number', o.order_number,
    'tracking_token', o.tracking_token,
    'status', o.status,
    'customer_name', o.customer_name,
    'city', o.city,
    'subtotal', o.subtotal,
    'delivery_charge', o.delivery_charge,
    'discount_amount', o.discount_amount,
    'total', o.total,
    'rejection_reason', o.rejection_reason,
    'created_at', o.created_at,
    'updated_at', o.updated_at
  ) INTO v_order_id, v_order
  FROM orders o
  WHERE o.order_number = upper(p_order_number)
    AND o.phone = p_phone;

  IF v_order IS NULL THEN
    RETURN json_build_object('found', false);
  END IF;

  SELECT json_agg(json_build_object(
    'product_name', oi.product_name_snapshot,
    'size', oi.size_snapshot,
    'color', oi.color_snapshot,
    'unit_price', oi.unit_price,
    'quantity', oi.quantity,
    'line_total', oi.line_total
  )) INTO v_items
  FROM order_items oi
  WHERE oi.order_id = v_order_id;

  RETURN json_build_object('found', true, 'order', v_order, 'items', v_items);
END;
$$;

GRANT EXECUTE ON FUNCTION track_order_by_number_phone(text, text) TO anon;
GRANT EXECUTE ON FUNCTION track_order_by_number_phone(text, text) TO authenticated;
