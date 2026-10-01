import Link from 'next/link';
import { CheckCircle, ArrowRight, Phone, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeliveryTracker } from '@/components/delivery-tracker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed — Rina Collection',
};

interface Props {
  searchParams: Promise<{ order?: string; token?: string }>;
}

export default async function OrderConfirmedPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderNumber = params.order || '';
  const trackingToken = params.token || '';
  const trackingUrl = `/track?token=${trackingToken}`;

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Success header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-center text-white">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-black">Order Placed! 🎉</h1>
          <p className="text-sm mt-1.5 text-white/80">
            Your payment is being verified. We&apos;ll start packing soon!
          </p>
        </div>

        {/* Order info card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Order Number</p>
              <p className="text-xl font-black text-[#F85606] mt-0.5">{orderNumber}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs font-bold text-yellow-700">Verifying</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[11px] text-gray-500">
              📸 We&apos;re verifying your payment screenshot. This usually takes <span className="font-bold text-gray-700">5-15 minutes</span>.
              You&apos;ll receive a confirmation once approved.
            </p>
          </div>
        </div>

        {/* 🚚 DELIVERY TRACKING MAP */}
        <DeliveryTracker status="pending" />

        {/* Estimated delivery */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-[#F85606]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Estimated Delivery</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Your order will arrive within the estimated time based on your payment method
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-600 font-medium">🚚 COD</p>
              <p className="text-lg font-black text-blue-700 mt-1">7 Days</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xs text-green-600 font-medium">⚡ Half Pay</p>
              <p className="text-lg font-black text-green-700 mt-1">24 Hours</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href={trackingUrl}>
            <Button variant="primary" fullWidth rounded size="xl">
              🔍 Track Your Order Live
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="ghost" fullWidth rounded size="md">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Help */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Need Help?</p>
            <p className="text-[11px] text-gray-500">
              Save order <strong>{orderNumber}</strong> • Call us or WhatsApp for any queries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
