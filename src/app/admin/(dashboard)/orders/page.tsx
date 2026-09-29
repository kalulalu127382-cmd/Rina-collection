import { createClient } from '@/lib/supabase/server';
import { formatPrice, cn } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Orders' };
export const revalidate = 0;

const STATUS_COLORS: Record<string, string> = {
  PENDING_VERIFICATION: 'bg-warning/10 text-warning',
  CONFIRMED: 'bg-primary/10 text-primary',
  PROCESSING: 'bg-accent/10 text-accent',
  SHIPPED: 'bg-blue-50 text-blue-600',
  DELIVERED: 'bg-success/10 text-success',
  PAYMENT_REJECTED: 'bg-error/10 text-error',
  CANCELLED: 'bg-error/10 text-error',
  OUT_OF_STOCK: 'bg-bg-warm text-text-muted',
};

async function getOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, phone, city, total, status, created_at')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function OrdersPage() {
  const orders = await getOrders();
  const pending = orders.filter((o) => o.status === 'PENDING_VERIFICATION');
  const others = orders.filter((o) => o.status !== 'PENDING_VERIFICATION');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Orders</h1>
        <p className="font-sans text-sm text-text-muted mt-1">{orders.length} total orders</p>
      </div>

      {/* Pending verification — highlighted */}
      {pending.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-warning/20">
            <h2 className="font-sans text-sm font-bold text-warning uppercase tracking-wider">
              ⏳ Pending Verification ({pending.length})
            </h2>
          </div>
          <div className="divide-y divide-warning/10">
            {pending.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* All other orders */}
      <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
        <div className="px-5 py-3 border-b border-border-light">
          <h2 className="font-sans text-sm font-bold text-text uppercase tracking-wider">All Orders</h2>
        </div>
        {others.length > 0 ? (
          <div className="divide-y divide-border-light">
            {others.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="font-sans text-sm text-text-muted">No processed orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: {
  id: string;
  order_number: string | null;
  customer_name: string;
  phone: string;
  city: string;
  total: number;
  status: string;
  created_at: string;
} }) {
  return (
    <Link
      href={`/admin/orders/${order.id}`}
      className="flex items-center justify-between px-5 py-4 hover:bg-bg-warm/30 transition-colors"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-sans text-sm font-bold text-text">{order.order_number}</p>
          <span className={cn(
            'inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold',
            STATUS_COLORS[order.status]
          )}>
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="font-sans text-xs text-text-muted mt-0.5">
          {order.customer_name} · {order.city} · {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>
      <p className="font-sans text-sm font-bold text-text shrink-0 ml-4">
        {formatPrice(order.total)}
      </p>
    </Link>
  );
}
