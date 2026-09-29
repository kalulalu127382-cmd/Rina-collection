import { Suspense } from 'react';
import TrackClient from './track-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order',
  description: 'Track your Rina Collection order status',
};

function TrackFallback() {
  return (
    <div className="content-container section-gap">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="skeleton h-14 w-14 rounded-full mx-auto" />
        <div className="skeleton h-8 w-48 mx-auto" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackFallback />}>
      <TrackClient />
    </Suspense>
  );
}
