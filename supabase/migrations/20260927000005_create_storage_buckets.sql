-- ============================================================
-- Migration: 005_create_storage_buckets
-- Storage buckets + policies
-- ============================================================

-- Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-code', 'qr-code', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- product-images: public read, admin write
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_public_read_auth"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- qr-code: public read, admin write
CREATE POLICY "qr_code_public_read"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'qr-code');

CREATE POLICY "qr_code_public_read_auth"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'qr-code');

CREATE POLICY "qr_code_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'qr-code');

CREATE POLICY "qr_code_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'qr-code');

CREATE POLICY "qr_code_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'qr-code');

-- payment-screenshots: anon upload, admin read/manage
CREATE POLICY "payment_screenshots_anon_upload"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "payment_screenshots_admin_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'payment-screenshots');

CREATE POLICY "payment_screenshots_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'payment-screenshots');

CREATE POLICY "payment_screenshots_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'payment-screenshots');
