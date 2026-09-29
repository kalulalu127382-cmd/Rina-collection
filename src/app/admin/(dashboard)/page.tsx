import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard' };
export const revalidate = 0; // Always fresh

async function getDashboardStats() {
  const supabase = await createClient();

  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { data: revenueData },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'PENDING_VERIFICATION'),
    supabase.from('orders').select('total').in('status', ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']),
    supabase.from('orders')
      .select('id, order_number, customer_name, total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const totalRevenue = (revenueData || []).reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    pendingOrders: pendingOrders || 0,
    totalRevenue,
    recentOrders: recentOrders || [],
  };
}

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

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Dashboard</h1>
        <p className="font-sans text-sm text-text-muted mt-1">Overview of your store</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Revenue"
          value={formatPrice(stats.totalRevenue)}
          color="text-success bg-success/10"
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5" />}
          label="Total Orders"
          value={stats.totalOrders.toString()}
          color="text-primary bg-primary/10"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Pending"
          value={stats.pendingOrders.toString()}
          color="text-warning bg-warning/10"
          highlight={stats.pendingOrders > 0}
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="Products"
          value={stats.totalProducts.toString()}
          color="text-accent bg-accent/10"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h2 className="font-sans text-sm font-bold text-text uppercase tracking-wider">Recent Orders</h2>
          <Link href="/admin/orders" className="font-sans text-xs font-medium text-primary hover:text-primary-dark transition-colors">
            View All →
          </Link>
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="divide-y divide-border-light">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-bg-warm/50 transition-colors"
              >
                <div>
                  <p className="font-sans text-sm font-semibold text-text">{order.order_number}</p>
                  <p className="font-sans text-xs text-text-muted mt-0.5">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm font-semibold text-text">{formatPrice(order.total)}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border p-5 space-y-3 ${highlight ? 'border-warning/40 ring-1 ring-warning/20' : 'border-border-light'}`}>
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
