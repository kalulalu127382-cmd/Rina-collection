import Link from 'next/link';
import { CheckCircle, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed',
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
    <div className="content-container section-gap">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>

        {/* Heading */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-text">Order Placed!</h1>
          <p className="mt-2 text-text-secondary text-sm">
            Your order has been submitted and is awaiting payment verification.
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white rounded-2xl border border-border-light p-6 space-y-4 text-left">
          <div>
            <p className="font-sans text-xs text-text-muted uppercase tracking-wider">Order Number</p>
            <p className="font-sans text-lg font-bold text-primary mt-1">{orderNumber}</p>
          </div>

          <div>
            <p className="font-sans text-xs text-text-muted uppercase tracking-wider">Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <p className="font-sans text-sm font-semibold text-warning">Pending Verification</p>
            </div>
          </div>

          <div className="pt-3 border-t border-border-light">
            <p className="font-sans text-xs text-text-muted">
              We will review your payment screenshot and confirm your order.
              You can track the status anytime using the link below.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href={trackingUrl}>
            <Button variant="primary" fullWidth rounded size="lg">
              Track Your Order
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="ghost" fullWidth rounded size="md">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Info note */}
        <p className="text-xs text-text-muted">
          Save your order number <strong>{orderNumber}</strong> and your phone number — 
          you can use them to track your order anytime.
        </p>
      </div>
    </div>
  );
}
