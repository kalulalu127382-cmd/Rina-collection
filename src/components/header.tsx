'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { CartDrawer } from '@/components/cart-drawer';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { name: 'All Clothing', href: '/products' },
  { name: 'Kurta Sets', href: '/products?category=kurta-sets' },
  { name: 'Sarees', href: '/products?category=sarees' },
  { name: 'Lehenga', href: '/products?category=lehenga' },
  { name: 'Western Wear', href: '/products?category=western-wear' },
  { name: 'Tops & Blouses', href: '/products?category=tops-blouses' },
  { name: 'Dresses', href: '/products?category=dresses' },
  { name: 'Pants & Bottoms', href: '/products?category=pants-bottoms' },
  { name: 'Accessories', href: '/products?category=accessories' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div className="bg-[#F85606] text-white">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 flex items-center justify-between h-[28px] text-[11px]">
          <span className="opacity-90 truncate">Free Delivery on orders above Rs.2000 | Biratnagar & Nationwide</span>
          <Link href="/track" className="hidden sm:block hover:underline opacity-90 shrink-0 ml-4">TRACK ORDER</Link>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="sticky top-0 z-50 bg-[#F85606]">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 flex items-center gap-2 sm:gap-4 h-[56px] sm:h-[60px]">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0 mr-1 sm:mr-4">
            <span className="text-white text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
              Sasto Bazar
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in Sasto Bazar"
              className="flex-1 h-[36px] sm:h-[40px] px-3 sm:px-4 bg-white rounded-l text-[12px] sm:text-[13px] text-gray-700 border-0 outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="h-[36px] sm:h-[40px] w-[44px] sm:w-[60px] bg-[#F85606] border-2 border-white rounded-r flex items-center justify-center hover:bg-[#D94400] transition-colors"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </form>

          {/* Cart only — NO admin links */}
          <button
            onClick={openCart}
            className="relative text-white p-2 hover:opacity-80 shrink-0"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-yellow-400 text-[#F85606] text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ===== CATEGORY BAR ===== */}
      <nav className="bg-white border-b border-gray-200 sticky top-[56px] sm:top-[60px] z-40">
        <div className="max-w-[1200px] mx-auto">
          <ul className="flex overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <li key={cat.name}>
                <Link
                  href={cat.href}
                  className="block px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-medium text-gray-700 hover:text-[#F85606] hover:bg-orange-50 whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-[#F85606]"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[84px] sm:top-[88px] z-40 bg-black/40" onClick={() => setMobileMenuOpen(false)}>
          <nav className="bg-white w-[280px] h-full shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="py-2">
              <p className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Categories</p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-orange-50 hover:text-[#F85606] border-b border-gray-50"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-[13px] font-medium text-gray-700">
                  📦 Track Order
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
