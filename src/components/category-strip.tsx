import Link from 'next/link';
import Image from 'next/image';

const STORAGE_BASE = 'https://efcjtwmxvavoddruxxso.supabase.co/storage/v1/object/public/categories';

const CLOTHING_CATEGORIES = [
  { name: 'Kurta Sets', image: `${STORAGE_BASE}/kurta-sets.jpg`, href: '/products?category=kurta-sets' },
  { name: 'Sarees', image: `${STORAGE_BASE}/sarees.jpg`, href: '/products?category=sarees' },
  { name: 'Lehenga', image: `${STORAGE_BASE}/lehenga.jpg`, href: '/products?category=lehenga' },
  { name: 'Western Wear', image: `${STORAGE_BASE}/western-wear.jpg`, href: '/products?category=western-wear' },
  { name: 'Dresses', image: `${STORAGE_BASE}/dresses.jpg`, href: '/products?category=dresses' },
  { name: 'Tops & Blouses', image: `${STORAGE_BASE}/tops.jpg`, href: '/products?category=tops-blouses' },
  { name: 'Pants & Bottoms', image: null, emoji: '👖', href: '/products?category=pants-bottoms' },
  { name: 'Accessories', image: null, emoji: '💍', href: '/products?category=accessories' },
  { name: 'New In', image: null, emoji: '✨', href: '/products?sort=newest' },
  { name: 'Sale', image: null, emoji: '🏷️', href: '/products?sale=true' },
];

export function CategoryStrip() {
  return (
    <section className="max-w-[1200px] mx-auto px-3 sm:px-4 mt-3">
      <div className="bg-white rounded shadow-sm">
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-gray-100">
          <h2 className="text-[12px] sm:text-[14px] font-bold text-gray-800 uppercase tracking-wide">
            Categories
          </h2>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 py-2 sm:py-3">
          {CLOTHING_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex flex-col items-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 hover:bg-orange-50 transition-colors group"
            >
              <div className="w-[48px] h-[48px] sm:w-[68px] sm:h-[68px] rounded-lg overflow-hidden border border-gray-100 bg-gray-50 group-hover:border-orange-300 transition-colors relative">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="68px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl">
                    {cat.emoji}
                  </div>
                )}
              </div>
              <span className="text-[9px] sm:text-[11px] font-medium text-gray-600 text-center leading-tight px-1 group-hover:text-[#F85606]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
