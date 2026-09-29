import Link from 'next/link';

const CLOTHING_CATEGORIES = [
  { name: 'Kurta Sets', icon: '👗', color: '#FFF3E0', href: '/products?category=kurta-sets' },
  { name: 'Sarees', icon: '🥻', color: '#F3E5F5', href: '/products?category=sarees' },
  { name: 'Lehenga', icon: '💃', color: '#E8F5E9', href: '/products?category=lehenga' },
  { name: 'Western Wear', icon: '👚', color: '#E3F2FD', href: '/products?category=western-wear' },
  { name: 'Dresses', icon: '👘', color: '#FCE4EC', href: '/products?category=dresses' },
  { name: 'Tops', icon: '👕', color: '#FFF8E1', href: '/products?category=tops-blouses' },
  { name: 'Pants', icon: '👖', color: '#E0F7FA', href: '/products?category=pants-bottoms' },
  { name: 'Accessories', icon: '💍', color: '#F3E5F5', href: '/products?category=accessories' },
  { name: 'New In', icon: '🆕', color: '#FBE9E7', href: '/products?sort=newest' },
  { name: 'Sale', icon: '🔥', color: '#FFEBEE', href: '/products?sale=true' },
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
              className="flex flex-col items-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 hover:bg-orange-50 transition-colors"
            >
              <div
                className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full flex items-center justify-center text-xl sm:text-3xl"
                style={{ backgroundColor: cat.color }}
              >
                {cat.icon}
              </div>
              <span className="text-[9px] sm:text-[11px] font-medium text-gray-600 text-center leading-tight px-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
