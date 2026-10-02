import Link from 'next/link';
import { MapPin, Phone, Mail, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#fafafa] border-t border-gray-200 mt-6">
      {/* Trust Badges — Daraz style */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <TrustBadge icon={<Truck className="w-6 h-6 text-[#F85606]" />} title="Free Delivery" desc="Orders above Rs.2000" />
            <TrustBadge icon={<ShieldCheck className="w-6 h-6 text-[#F85606]" />} title="Secure Payment" desc="100% secure checkout" />
            <TrustBadge icon={<RotateCcw className="w-6 h-6 text-[#F85606]" />} title="Easy Returns" desc="7 days return policy" />
            <TrustBadge icon={<Headphones className="w-6 h-6 text-[#F85606]" />} title="Customer Support" desc="Call us anytime" />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Customer Care</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/track" className="hover:text-[#F85606] transition-colors">Track Order</Link></li>
              <li><Link href="/products" className="hover:text-[#F85606] transition-colors">All Products</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-[#F85606] transition-colors">Sale & Offers</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/products?category=kurta-sets" className="hover:text-[#F85606] transition-colors">Kurta Sets</Link></li>
              <li><Link href="/products?category=sarees" className="hover:text-[#F85606] transition-colors">Sarees</Link></li>
              <li><Link href="/products?category=lehenga" className="hover:text-[#F85606] transition-colors">Lehenga</Link></li>
              <li><Link href="/products?category=western-wear" className="hover:text-[#F85606] transition-colors">Western Wear</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Contact Us</h3>
            <div className="space-y-2.5 text-sm text-gray-500">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                <span>Biratnagar, Hatkhola Chowk, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-gray-400" />
                <a href="tel:+977" className="hover:text-[#F85606]">+977-XXXXXXXXXX</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-gray-400" />
                <span>info@sastobazar.com</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Sasto Bazar</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Nepal&apos;s trusted online clothing store. Quality ethnic and western wear delivered across Nepal.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods — Daraz style bottom bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-center mb-4">Payment Methods</h4>
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            <PaymentBadge name="Cash on Delivery" bg="#4CAF50" text="COD" />
            <PaymentBadge name="eSewa" bg="#60BB46" text="eSewa" />
            <PaymentBadge name="Khalti" bg="#5C2D91" text="khalti" />
            <PaymentBadge name="Bank Transfer" bg="#1565C0" text="Bank" />
            <PaymentBadge name="IME Pay" bg="#ED1C24" text="IME" />
            <PaymentBadge name="QR Pay" bg="#F85606" text="QR" />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 py-4 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Sasto Bazar. All rights reserved. Nepal 🇳🇵
          </p>
        </div>
      </div>
    </footer>
  );
}

function TrustBadge({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-800">{title}</p>
        <p className="text-[10px] text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

function PaymentBadge({ name, bg, text }: { name: string; bg: string; text: string }) {
  return (
    <div
      className="flex items-center justify-center h-8 px-4 rounded text-white text-xs font-bold tracking-wide"
      style={{ backgroundColor: bg }}
      title={name}
    >
      {text}
    </div>
  );
}
