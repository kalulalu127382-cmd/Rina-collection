'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cta_text: string;
  cta_link: string;
  bg_color: string;
  bg_gradient: string | null;
  text_color: string;
  image_url: string | null;
}

// Fallback banners if DB is empty
const FALLBACK_BANNERS: Banner[] = [
  {
    id: '1', title: 'दशैं SALE', subtitle: 'UP TO 50% OFF',
    description: 'on Kurtas, Sarees & Lehenga', cta_text: 'SHOP NOW',
    cta_link: '/products?sale=true', bg_color: '#F85606',
    bg_gradient: 'linear-gradient(135deg, #F85606 0%, #FF2D00 50%, #D94400 100%)',
    text_color: 'white', image_url: null,
  },
  {
    id: '2', title: 'NEW ARRIVALS', subtitle: 'Latest Collection 2026',
    description: 'Kurta Sets · Sarees · Western Wear', cta_text: 'EXPLORE NOW',
    cta_link: '/products?sort=newest', bg_color: '#1A1A2E',
    bg_gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    text_color: 'white', image_url: null,
  },
  {
    id: '3', title: 'FREE DELIVERY', subtitle: 'Orders Above Rs.2,000',
    description: 'All across Nepal 🇳🇵', cta_text: 'ORDER NOW',
    cta_link: '/products', bg_color: '#00A650',
    bg_gradient: 'linear-gradient(135deg, #00A650 0%, #00C853 50%, #009624 100%)',
    text_color: 'white', image_url: null,
  },
];

export function BannerSlider({ banners: serverBanners }: { banners?: Banner[] }) {
  const banners = serverBanners && serverBanners.length > 0 ? serverBanners : FALLBACK_BANNERS;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = banners[current];

  return (
    <div className="relative overflow-hidden">
      <div
        className="transition-all duration-700 ease-out"
        style={{ background: banner.bg_gradient || banner.bg_color }}
      >
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6">
          <div className="flex items-center min-h-[160px] sm:min-h-[220px] md:min-h-[300px] py-4 sm:py-6">
            <div className="max-w-[600px]" style={{ color: banner.text_color }}>
              <h2
                className="text-2xl sm:text-4xl md:text-6xl font-black leading-none tracking-tight"
                style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}
              >
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-base sm:text-xl md:text-3xl font-bold mt-1 sm:mt-2 opacity-95">
                  {banner.subtitle}
                </p>
              )}
              {banner.description && (
                <p className="text-xs sm:text-sm md:text-base mt-1 opacity-80">
                  {banner.description}
                </p>
              )}
              <Link
                href={banner.cta_link}
                className="inline-block mt-3 sm:mt-4 px-5 sm:px-8 py-2 sm:py-3 bg-white text-[#F85606] font-bold text-xs sm:text-sm rounded hover:bg-gray-100 transition-colors shadow-md"
              >
                {banner.cta_text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>
      <button
        onClick={next}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
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
