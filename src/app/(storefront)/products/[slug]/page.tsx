import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';
import type { Metadata } from 'next';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.description || `Shop ${product.name} at Sasto Bazar`,
  };
}

async function getProduct(slug: string) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      material,
      size_fit_notes,
      care_instructions,
      price,
      sale_price,
      product_variants (
        id,
        size,
        color,
        sku,
        stock,
        active
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_cover,
        variant_id,
        sort_order
      )
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single();

  return product;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Sort images by sort_order
  const sortedImages = (product.product_images || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  // Filter active variants
  const activeVariants = (product.product_variants || []).filter(
    (v: { active: boolean }) => v.active
  );

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        material: product.material,
        size_fit_notes: product.size_fit_notes,
        care_instructions: product.care_instructions,
        price: product.price,
        sale_price: product.sale_price,
      }}
      variants={activeVariants}
      images={sortedImages}
    />
  );
}
