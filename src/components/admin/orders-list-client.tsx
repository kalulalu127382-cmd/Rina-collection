'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, cn } from '@/lib/utils';
import Link from 'next/link';
import { Eye, RefreshCw, Bell, Search } from 'lucide-react';
import { toast } from 'sonner';

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

interface Order {
  id: string;
  order_number: string | null;
  customer_name: string;
  phone: string;
  city: string;
  total: number;
  status: string;
  payment_method: string | null;
  amount_paid: number | null;
  amount_remaining: number | null;
  created_at: string;
}

export default function OrdersListClient() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, phone, city, total, status, payment_method, amount_paid, amount_remaining, created_at')
      .order('created_at', { ascending: false });

    setOrders((data || []) as Order[]);
    setLastUpdated(new Date());
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const n = payload.new as any;
            toast.success(`🎉 New order ${n.order_number || ''} from ${n.customer_name}!`, { duration: 8000 });
            setNewOrderIds((prev) => new Set(prev).add(n.id));
            setTimeout(() => {
              setNewOrderIds((prev) => {
                const next = new Set(prev);
                next.delete(n.id);
                return next;
              });
            }, 5000);
          }
          if (payload.eventType === 'UPDATE') {
            const u = payload.new as any;
            toast.info(`Order ${u.order_number || ''} → ${(u.status || '').replace(/_/g, ' ')}`, { duration: 4000 });
          }
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = search.trim()
    ? orders.filter((o) =>
        (o.order_number || '').toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search) ||
        o.city.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const pending = filtered.filter((o) => o.status === 'PENDING_VERIFICATION');
  const others = filtered.filter((o) => o.status !== 'PENDING_VERIFICATION');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-12 w-full rounded-xl" />
        <div className="skeleton h-80 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Orders</h1>
          <p className="font-sans text-sm text-text-muted mt-1">{orders.length} total orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wider">Live</span>
          </div>
          <span className="text-[10px] text-text-muted font-medium hidden sm:block">
            {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={() => fetchOrders()}
            className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center hover:bg-bg-warm transition-colors"
            title="Refresh now"
          >
            <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name, phone, city, order #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
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
              <OrderRow key={order.id} order={order} isNew={newOrderIds.has(order.id)} />
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
              <OrderRow key={order.id} order={order} isNew={newOrderIds.has(order.id)} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="font-sans text-sm text-text-muted">
              {search.trim() ? 'No orders match your search' : 'No processed orders yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderRow({ order, isNew }: { order: Order; isNew: boolean }) {
  const paid = order.amount_paid ?? 0;
  const remaining = order.amount_remaining ?? order.total;

  return (
    <Link
      href={`/admin/orders/${order.id}`}
      className={cn(
        'flex items-center justify-between px-5 py-4 hover:bg-bg-warm/30 transition-all group',
        isNew && 'bg-green-50 animate-pulse'
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {isNew && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[9px] font-bold">
              <Bell className="w-2.5 h-2.5" /> NEW
            </span>
          )}
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
        {/* Payment info row */}
        <div className="flex items-center gap-3 mt-1">
          <span className="font-sans text-[11px] font-medium text-green-600">
            Paid: {formatPrice(paid)}
          </span>
          {remaining > 0 && (
            <span className="font-sans text-[11px] font-medium text-orange-500">
              Due: {formatPrice(remaining)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <p className="font-sans text-sm font-bold text-text">
          {formatPrice(order.total)}
        </p>
        {/* Visible "View" icon */}
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Eye className="w-4 h-4 text-primary" />
        </div>
      </div>
    </Link>
  );
}
