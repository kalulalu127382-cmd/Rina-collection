import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product-card';
import Link from 'next/link';
import { BannerSlider } from '@/components/banner-slider';
import { FlashSaleTimer } from '@/components/flash-sale-timer';
import { CategoryStrip } from '@/components/category-strip';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rina Collection — Nepal\'s Fashion Destination',
  description: 'Shop kurtas, sarees, lehengas, western wear and more. Best prices, QR payment, nationwide delivery.',
};

export const revalidate = 60;

async function getHomeData() {
  const supabase = await createClient();

  const [
    { data: allProducts },
    { data: saleProducts },
    { data: newArrivals },
  ] = await Promise.all([
    supabase
      .from('products')
      .select(`id, name, slug, price, sale_price, active,
        product_images (image_url, is_cover, sort_order)`)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(24),
    supabase
      .from('products')
      .select(`id, name, slug, price, sale_price, active,
        product_images (image_url, is_cover, sort_order)`)
      .eq('active', true)
      .not('sale_price', 'is', null)
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('products')
      .select(`id, name, slug, price, sale_price, active,
        product_images (image_url, is_cover, sort_order)`)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  return {
    allProducts: allProducts || [],
    saleProducts: saleProducts || [],
    newArrivals: newArrivals || [],
  };
}

export default async function HomePage() {
  const { allProducts, saleProducts, newArrivals } = await getHomeData();

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      {/* Banner Slider */}
      <BannerSlider />

      {/* Category Strip */}
      <CategoryStrip />

      {/* ===== FLASH SALE — Daraz style ===== */}
      {saleProducts.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 mt-3">
          <div className="bg-white rounded shadow-sm overflow-hidden">
            {/* Header — orange left border like Daraz */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#F85606] text-lg">⚡</span>
                  <h2 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Flash Sale
                  </h2>
                </div>
                <FlashSaleTimer />
              </div>
              <Link
                href="/products?sale=true"
                className="text-[#F85606] text-[13px] font-semibold hover:underline"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                SHOP ALL →
              </Link>
            </div>

            {/* Horizontal scroll — like Daraz */}
            <div className="flex overflow-x-auto scrollbar-hide">
              {saleProducts.map((product) => (
                <div key={product.id} className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] border-r border-gray-100 last:border-r-0 shrink-0">
                  <ProductCard product={product as any} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== NEW ARRIVALS ===== */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 mt-3">
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <h2 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: 'Arial, sans-serif' }}>
                New Arrivals
              </h2>
              <Link href="/products?sort=newest" className="text-[#F85606] text-[13px] font-semibold hover:underline" style={{ fontFamily: 'Arial, sans-serif' }}>
                VIEW ALL →
              </Link>
            </div>
            <div className="flex overflow-x-auto scrollbar-hide">
              {newArrivals.map((product) => (
                <div key={product.id} className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] border-r border-gray-100 last:border-r-0 shrink-0">
                  <ProductCard product={product as any} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== JUST FOR YOU — main grid ===== */}
      <section className="max-w-[1200px] mx-auto px-4 mt-3 pb-8">
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <h2 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: 'Arial, sans-serif' }}>
              Just For You
            </h2>
            <Link href="/products" className="text-[#F85606] text-[13px] font-semibold hover:underline" style={{ fontFamily: 'Arial, sans-serif' }}>
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {allProducts.map((product) => (
              <div key={product.id} className="border-r border-b border-gray-100">
                <ProductCard product={product as any} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
