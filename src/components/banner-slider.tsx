'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const BANNERS = [
  {
    id: 1,
    title: 'दशैं SALE',
    titleSize: 'text-4xl sm:text-5xl md:text-6xl',
    subtitle: 'UP TO 50% OFF',
    subtitleSize: 'text-xl sm:text-2xl md:text-3xl',
    desc: 'on Kurtas, Sarees & Lehenga',
    bg: '#F85606',
    bgGradient: 'linear-gradient(135deg, #F85606 0%, #FF2D00 50%, #D94400 100%)',
    textColor: 'white',
    cta: 'SHOP NOW',
    href: '/products?sale=true',
  },
  {
    id: 2,
    title: 'NEW ARRIVALS',
    titleSize: 'text-3xl sm:text-4xl md:text-5xl',
    subtitle: 'Latest Collection 2026',
    subtitleSize: 'text-lg sm:text-xl',
    desc: 'Kurta Sets · Sarees · Western Wear',
    bg: '#1A1A2E',
    bgGradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    textColor: 'white',
    cta: 'EXPLORE NOW',
    href: '/products?sort=newest',
  },
  {
    id: 3,
    title: 'FREE DELIVERY',
    titleSize: 'text-3xl sm:text-4xl md:text-5xl',
    subtitle: 'Orders Above Rs.2,000',
    subtitleSize: 'text-lg sm:text-xl',
    desc: 'All across Nepal 🇳🇵',
    bg: '#00A650',
    bgGradient: 'linear-gradient(135deg, #00A650 0%, #00C853 50%, #009624 100%)',
    textColor: 'white',
    cta: 'ORDER NOW',
    href: '/products',
  },
];

export function BannerSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = BANNERS[current];

  return (
    <div className="relative overflow-hidden">
      <div
        className="transition-all duration-700 ease-out"
        style={{ background: banner.bgGradient }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center min-h-[180px] sm:min-h-[240px] md:min-h-[300px] py-6">
            {/* Text content */}
            <div className="text-white max-w-[600px]">
              <h2
                className={`${banner.titleSize} font-black leading-none tracking-tight`}
                style={{ fontFamily: 'Arial Black, Arial, sans-serif', color: banner.textColor }}
              >
                {banner.title}
              </h2>
              <p
                className={`${banner.subtitleSize} font-bold mt-2 opacity-95`}
                style={{ color: banner.textColor }}
              >
                {banner.subtitle}
              </p>
              <p className="text-sm sm:text-base mt-1 opacity-80" style={{ color: banner.textColor }}>
                {banner.desc}
              </p>
              <Link
                href={banner.href}
                className="inline-block mt-4 px-8 py-3 bg-white text-[#F85606] font-bold text-sm rounded hover:bg-gray-100 transition-colors shadow-md"
              >
                {banner.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
