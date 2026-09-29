import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Customer Care */}
          <div>
            <h3 className="font-sans text-sm font-bold text-white mb-3">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><a href="tel:+977" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-sans text-sm font-bold text-white mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=kurta-sets" className="hover:text-white transition-colors">Kurta Sets</Link></li>
              <li><Link href="/products?category=sarees" className="hover:text-white transition-colors">Sarees</Link></li>
              <li><Link href="/products?category=lehenga" className="hover:text-white transition-colors">Lehenga</Link></li>
              <li><Link href="/products?category=western-wear" className="hover:text-white transition-colors">Western Wear</Link></li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-sans text-sm font-bold text-white mb-3">Payment Methods</h3>
            <ul className="space-y-2 text-sm">
              <li>eSewa QR</li>
              <li>Khalti</li>
              <li>Bank Transfer</li>
              <li>Cash on Delivery</li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-sans text-sm font-bold text-white mb-3">Rina Collection</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Hetauda, Makwanpur, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+977-XXXXXXXXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Rina Collection. All rights reserved.</p>
          <p className="mt-1">Nepal&apos;s trusted clothing destination 🇳🇵</p>
        </div>
      </div>
    </footer>
  );
}
