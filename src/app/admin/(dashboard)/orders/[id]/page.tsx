'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice, cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle, XCircle, Truck, Package,
  Clock, Eye, AlertTriangle, CreditCard, Banknote, Wallet
} from 'lucide-react';

const STATUS_FLOW: Record<string, { next: string; label: string; icon: React.ReactNode }[]> = {
  PENDING_VERIFICATION: [
    { next: 'CONFIRMED', label: 'Confirm Payment', icon: <CheckCircle className="w-4 h-4" /> },
    { next: 'PAYMENT_REJECTED', label: 'Reject Payment', icon: <XCircle className="w-4 h-4" /> },
  ],
  CONFIRMED: [
    { next: 'PROCESSING', label: 'Start Processing', icon: <Package className="w-4 h-4" /> },
    { next: 'CANCELLED', label: 'Cancel Order', icon: <XCircle className="w-4 h-4" /> },
  ],
  PROCESSING: [
    { next: 'SHIPPED', label: 'Mark as Shipped', icon: <Truck className="w-4 h-4" /> },
  ],
  SHIPPED: [
    { next: 'DELIVERED', label: 'Mark as Delivered', icon: <CheckCircle className="w-4 h-4" /> },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_VERIFICATION: 'bg-warning/10 text-warning border-warning/30',
  CONFIRMED: 'bg-primary/10 text-primary border-primary/30',
  PROCESSING: 'bg-accent/10 text-accent border-accent/30',
  SHIPPED: 'bg-blue-50 text-blue-600 border-blue-200',
  DELIVERED: 'bg-success/10 text-success border-success/30',
  PAYMENT_REJECTED: 'bg-error/10 text-error border-error/30',
  CANCELLED: 'bg-error/10 text-error border-error/30',
  OUT_OF_STOCK: 'bg-bg-warm text-text-muted border-border',
};

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  total: number;
  status: string;
  payment_method: string | null;
  amount_paid: number | null;
  amount_remaining: number | null;
  payment_screenshot_url: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
  tracking_token: string;
  utm_source: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  product_name_snapshot: string;
  size_snapshot: string | null;
  color_snapshot: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchOrder() {
    setLoading(true);
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderData) {
      setOrder(orderData as unknown as Order);

      // Get signed URL for payment screenshot
      if (orderData.payment_screenshot_url) {
        const { data: urlData } = await supabase.storage
          .from('payment-screenshots')
          .createSignedUrl(orderData.payment_screenshot_url, 3600);
        if (urlData) setScreenshotUrl(urlData.signedUrl);
      }
    }

    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    setItems((itemsData || []) as OrderItem[]);
    setLoading(false);
  }

  async function updateStatus(newStatus: string) {
    if (!order) return;

    if (newStatus === 'PAYMENT_REJECTED' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setUpdating(true);
    try {
      const updateData: { status: string; rejection_reason?: string } = { status: newStatus };
      if (newStatus === 'PAYMENT_REJECTED') {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData as any)
        .eq('id', order.id);

      if (error) throw error;

      toast.success(`Order ${newStatus.replace(/_/g, ' ').toLowerCase()}`);
      setShowRejectDialog(false);
      fetchOrder();
      router.refresh();
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-40 w-full rounded-2xl" />
        <div className="skeleton h-60 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="font-serif text-xl font-bold text-text">Order not found</h1>
        <Link href="/admin/orders" className="text-primary text-sm mt-2 inline-block">← Back to orders</Link>
      </div>
    );
  }

  const actions = STATUS_FLOW[order.status] || [];
  const amountPaid = order.amount_paid ?? 0;
  const amountRemaining = order.amount_remaining ?? order.total;
  const paymentMethodLabel = order.payment_method === 'cod' ? 'Cash on Delivery' : 'Half Pay + Delivery';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Orders
          </Link>
          <h1 className="font-serif text-2xl font-bold text-text">{order.order_number}</h1>
          <p className="font-sans text-xs text-text-muted mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
          STATUS_COLORS[order.status]
        )}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Action buttons */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.next}
              variant={action.next.includes('REJECT') || action.next.includes('CANCEL') ? 'danger' : 'primary'}
              size="md"
              rounded
              onClick={() => {
                if (action.next === 'PAYMENT_REJECTED') {
                  setShowRejectDialog(true);
                } else {
                  updateStatus(action.next);
                }
              }}
              isLoading={updating}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Reject dialog */}
      {showRejectDialog && (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-5 space-y-3">
          <h3 className="font-sans text-sm font-bold text-error">Rejection Reason</h3>
          <Input
            placeholder="e.g. Payment amount doesn't match"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              rounded
              onClick={() => updateStatus('PAYMENT_REJECTED')}
              isLoading={updating}
            >
              Confirm Rejection
            </Button>
            <Button
              variant="ghost"
              size="sm"
              rounded
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ——— PAYMENT BREAKDOWN ——— */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#F85606]" />
          <h2 className="font-sans text-sm font-bold text-text uppercase tracking-wider">Payment Details</h2>
        </div>

        {/* Payment method badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-orange-200 text-orange-700">
            <CreditCard className="w-3.5 h-3.5" />
            {paymentMethodLabel}
          </span>
        </div>

        {/* Amount cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Total */}
          <div className="bg-white rounded-xl p-3.5 border border-gray-200 text-center">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Total Order</p>
            <p className="text-lg font-bold text-text mt-1">{formatPrice(order.total)}</p>
          </div>
          {/* Paid */}
          <div className="bg-white rounded-xl p-3.5 border border-green-200 text-center">
            <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" /> Paid
            </p>
            <p className="text-lg font-bold text-green-600 mt-1">{formatPrice(amountPaid)}</p>
          </div>
          {/* Remaining */}
          <div className={cn(
            "bg-white rounded-xl p-3.5 border text-center col-span-2 sm:col-span-1",
            amountRemaining > 0 ? "border-orange-200" : "border-green-200"
          )}>
            <p className={cn(
              "text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1",
              amountRemaining > 0 ? "text-orange-600" : "text-green-600"
            )}>
              <Banknote className="w-3 h-3" /> {amountRemaining > 0 ? 'Due on Delivery' : 'Fully Paid'}
            </p>
            <p className={cn(
              "text-lg font-bold mt-1",
              amountRemaining > 0 ? "text-orange-600" : "text-green-600"
            )}>
              {formatPrice(amountRemaining)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {order.total > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-text-muted">
              <span>Payment Progress</span>
              <span>{Math.round((amountPaid / order.total) * 100)}%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-200">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (amountPaid / order.total) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-2xl border border-border-light p-5 space-y-3">
        <h2 className="font-sans text-sm font-bold text-text uppercase tracking-wider">Customer</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-muted text-xs">Name</p>
            <p className="font-medium text-text">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Phone</p>
            <p className="font-medium text-text">{order.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-text-muted text-xs">Address</p>
            <p className="font-medium text-text">{order.address}, {order.city}</p>
          </div>
          {order.utm_source && (
            <div className="col-span-2">
              <p className="text-text-muted text-xs">Source</p>
              <p className="font-medium text-text text-xs">
                {[order.utm_source].filter(Boolean).join(' / ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-border-light p-5 space-y-3">
        <h2 className="font-sans text-sm font-bold text-text uppercase tracking-wider">Items</h2>
        <div className="divide-y divide-border-light">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-text">{item.product_name_snapshot}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {[item.size_snapshot, item.color_snapshot].filter(Boolean).join(' · ')} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-text">{formatPrice(item.line_total)}</p>
            </div>
          ))}
        </div>
        <div className="pt-3 space-y-1.5 border-t border-border-light text-sm">
          <div className="flex justify-between"><span className="text-text-secondary">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Delivery</span><span>{formatPrice(order.delivery_charge)}</span></div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(order.discount_amount)}</span></div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border-light">
            <span>Total</span><span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Screenshot */}
      {screenshotUrl && (
        <div className="bg-white rounded-2xl border border-border-light p-5 space-y-3">
          <h2 className="font-sans text-sm font-bold text-text uppercase tracking-wider">Payment Screenshot</h2>
          <div className="relative max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl}
              alt="Payment screenshot"
              className="rounded-xl border border-border w-full max-h-[500px] object-contain bg-gray-50"
            />
            <a
              href={screenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            >
              <Eye className="w-3.5 h-3.5" />
              View Full Size
            </a>
          </div>
        </div>
      )}

      {/* Rejection reason */}
      {order.rejection_reason && (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-5">
          <h2 className="font-sans text-sm font-bold text-error uppercase tracking-wider">Rejection Reason</h2>
          <p className="font-sans text-sm text-error/80 mt-2">{order.rejection_reason}</p>
        </div>
      )}

      {/* Tracking info */}
      <div className="bg-bg-warm rounded-2xl p-5 text-sm">
        <p className="text-text-muted">
          <strong>Tracking token:</strong>{' '}
          <code className="bg-white px-2 py-0.5 rounded text-xs">{order.tracking_token}</code>
        </p>
      </div>
    </div>
  );
}
