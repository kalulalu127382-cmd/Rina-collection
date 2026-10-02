import { Suspense } from 'react';
import CheckoutClient from './checkout-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order at Sasto Bazar',
};

function CheckoutFallback() {
  return (
    <div className="content-container py-6 space-y-6">
      <div className="skeleton h-8 w-32" />
      <div className="skeleton h-48 w-full rounded-2xl" />
      <div className="skeleton h-64 w-full rounded-2xl" />
      <div className="skeleton h-48 w-full rounded-2xl" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutClient />
    </Suspense>
  );
}
