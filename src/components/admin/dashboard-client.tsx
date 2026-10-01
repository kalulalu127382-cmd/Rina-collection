'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, cn } from '@/lib/utils';
import { Package, ShoppingCart, DollarSign, Clock, RefreshCw, Bell, Eye } from 'lucide-react';
import Link from 'next/link';
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

interface OrderRow {
  id: string;
  order_number: string | null;
  customer_name: string;
  total: number;
  status: string;
  amount_paid: number | null;
  created_at: string;
}

export default function AdminDashboardClient() {
  const supabase = createClient();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [newOrderPulse, setNewOrderPulse] = useState(false);

  async function fetchStats() {
    const [
      { count: prodCount },
      { count: ordCount },
      { count: pendCount },
      { data: revenueData },
      { data: recent },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'PENDING_VERIFICATION'),
      supabase.from('orders').select('total').in('status', ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']),
      supabase.from('orders')
        .select('id, order_number, customer_name, total, status, amount_paid, created_at')
        .order('created_at', { ascending: false })
        .limit(8),
    ]);

    setTotalProducts(prodCount || 0);
    setTotalOrders(ordCount || 0);
    setPendingOrders(pendCount || 0);
    setTotalRevenue((revenueData || []).reduce((sum, o) => sum + (o.total || 0), 0));
    setRecentOrders((recent || []) as OrderRow[]);
    setLastUpdated(new Date());
    setLoading(false);
  }

  useEffect(() => {
    fetchStats();

    // Real-time subscription for orders
    const channel = supabase
      .channel('admin-dashboard-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // New order came in
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as any;
            toast.success(`🎉 New order ${newOrder.order_number || ''} from ${newOrder.customer_name}!`, {
              duration: 8000,
            });
            setNewOrderPulse(true);
            setTimeout(() => setNewOrderPulse(false), 3000);
          }
          // Refetch everything on any change
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-32 mt-2" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with live indicator */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Dashboard</h1>
          <p className="font-sans text-sm text-text-muted mt-1">Overview of your store</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wider">Live</span>
          </div>
          <button
            onClick={() => fetchStats()}
            className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center hover:bg-bg-warm transition-colors"
            title="Refresh now"
          >
            <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Revenue"
          value={formatPrice(totalRevenue)}
          color="text-success bg-success/10"
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5" />}
          label="Total Orders"
          value={totalOrders.toString()}
          color="text-primary bg-primary/10"
          pulse={newOrderPulse}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Pending"
          value={pendingOrders.toString()}
          color="text-warning bg-warning/10"
          highlight={pendingOrders > 0}
          pulse={newOrderPulse}
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="Products"
          value={totalProducts.toString()}
          color="text-accent bg-accent/10"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <div className="flex items-center gap-2">
            <h2 className="font-sans text-sm font-bold text-text uppercase tracking-wider">Recent Orders</h2>
            {newOrderPulse && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold animate-pulse">
                <Bell className="w-3 h-3" /> NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-text-muted font-medium">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
            <Link href="/admin/orders" className="font-sans text-xs font-medium text-primary hover:text-primary-dark transition-colors">
              View All →
            </Link>
          </div>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-border-light">
            {recentOrders.map((order, i) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className={cn(
                  'flex items-center justify-between px-5 py-3.5 hover:bg-bg-warm/50 transition-all group',
                  i === 0 && newOrderPulse && 'bg-green-50/50 animate-pulse'
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-sans text-sm font-semibold text-text">{order.order_number}</p>
                    <span className={cn(
                      'inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold',
                      STATUS_COLORS[order.status]
                    )}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-text-muted mt-0.5">{order.customer_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-sans text-sm font-semibold text-text">{formatPrice(order.total)}</p>
                    {(order.amount_paid ?? 0) > 0 && (
                      <p className="text-[10px] text-green-600 font-medium">Paid: {formatPrice(order.amount_paid ?? 0)}</p>
                    )}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="font-sans text-sm text-text-muted">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  highlight,
  pulse,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
  pulse?: boolean;
}) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border p-5 space-y-3 transition-all',
      highlight ? 'border-warning/40 ring-1 ring-warning/20' : 'border-border-light',
      pulse && 'ring-2 ring-green-300 ring-offset-1'
    )}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="font-sans text-2xl font-bold text-text">{value}</p>
        <p className="font-sans text-xs text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}
