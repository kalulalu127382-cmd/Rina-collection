import type { Metadata } from 'next';
import OrdersListClient from '@/components/admin/orders-list-client';

export const metadata: Metadata = { title: 'Orders' };

export default function OrdersPage() {
  return <OrdersListClient />;
}
