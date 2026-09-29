'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice, cn } from '@/lib/utils';
import { Search, Package, CheckCircle, Truck, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface OrderData {
  order_number: string;
  status: string;
  customer_name: string;
  city: string;
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  total: number;
  rejection_reason: string | null;
  tracking_token?: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  product_name: string;
  size: string | null;
  color: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface TrackResult {
  found: boolean;
  order?: OrderData;
  items?: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  PENDING_VERIFICATION: { label: 'Pending Verification', color: 'text-warning bg-warning/10', icon: <Clock className="w-4 h-4" />, step: 1 },
  CONFIRMED: { label: 'Confirmed', color: 'text-primary bg-primary/10', icon: <CheckCircle className="w-4 h-4" />, step: 2 },
  PROCESSING: { label: 'Processing', color: 'text-accent bg-accent/10', icon: <Package className="w-4 h-4" />, step: 3 },
  SHIPPED: { label: 'Shipped', color: 'text-blue-600 bg-blue-50', icon: <Truck className="w-4 h-4" />, step: 4 },
  DELIVERED: { label: 'Delivered', color: 'text-success bg-success/10', icon: <CheckCircle className="w-4 h-4" />, step: 5 },
  PAYMENT_REJECTED: { label: 'Payment Rejected', color: 'text-error bg-error/10', icon: <XCircle className="w-4 h-4" />, step: -1 },
  CANCELLED: { label: 'Cancelled', color: 'text-error bg-error/10', icon: <XCircle className="w-4 h-4" />, step: -1 },
  OUT_OF_STOCK: { label: 'Out of Stock', color: 'text-text-muted bg-bg-warm', icon: <AlertTriangle className="w-4 h-4" />, step: -1 },
};

const PROGRESS_STEPS = [
  { label: 'Verification', step: 1 },
  { label: 'Confirmed', step: 2 },
  { label: 'Processing', step: 3 },
  { label: 'Shipped', step: 4 },
  { label: 'Delivered', step: 5 },
];

export default function TrackClient() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'token' | 'number'>('number');
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const supabase = createClient();

  // Auto-track by token from URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      setMode('token');
      handleTrackByToken(urlToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleTrackByToken(trackingToken?: string) {
    const t = trackingToken || token;
    if (!t.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.rpc('track_order_by_token', {
        p_tracking_token: t.trim(),
      });
      if (error) throw error;
      setResult(data as unknown as TrackResult);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  }

  async function handleTrackByNumber() {
    if (!orderNumber.trim() || !phone.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.rpc('track_order_by_number_phone', {
        p_order_number: orderNumber.trim(),
        p_phone: phone.replace(/\D/g, ''),
      });
      if (error) throw error;
      setResult(data as unknown as TrackResult);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'token') {
      handleTrackByToken();
    } else {
      handleTrackByNumber();
    }
  }

  return (
    <div className="content-container section-gap">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Track Your Order</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your order details to see the current status
          </p>
        </div>

        {/* Search form */}
        <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
          {/* Mode tabs */}
          <div className="flex rounded-xl bg-bg-warm p-1">
            <button
              type="button"
              onClick={() => setMode('number')}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
                mode === 'number'
                  ? 'bg-white text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
              )}
            >
              Order Number
            </button>
            <button
              type="button"
              onClick={() => setMode('token')}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
                mode === 'token'
                  ? 'bg-white text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
              )}
            >
              Tracking Link
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'number' ? (
              <>
                <Input
                  label="Order Number"
                  placeholder="RC-20260927-001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </>
            ) : (
              <Input
                label="Tracking Token"
                placeholder="Paste your tracking token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            )}

            <Button type="submit" variant="primary" fullWidth rounded size="lg" isLoading={loading}>
              <Search className="w-4 h-4" />
              Track Order
            </Button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8">
            {!result.found ? (
              <div className="bg-white rounded-2xl border border-border-light p-8 text-center">
                <XCircle className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <h2 className="font-serif text-lg font-semibold text-text">Order Not Found</h2>
                <p className="text-sm text-text-muted mt-1">
                  Please double-check your order number and phone number.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status card */}
                <div className="bg-white rounded-2xl border border-border-light p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-sans text-xs text-text-muted uppercase tracking-wider">Order</p>
                      <p className="font-sans text-lg font-bold text-primary">{result.order!.order_number}</p>
                    </div>
                    <div className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                      STATUS_CONFIG[result.order!.status]?.color
                    )}>
                      {STATUS_CONFIG[result.order!.status]?.icon}
                      {STATUS_CONFIG[result.order!.status]?.label}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {STATUS_CONFIG[result.order!.status]?.step > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-0.5">
                        {PROGRESS_STEPS.map((ps, i) => (
                          <div
                            key={ps.step}
                            className={cn(
                              'flex-1 h-1.5 rounded-full transition-colors',
                              ps.step <= STATUS_CONFIG[result.order!.status]?.step
                                ? 'bg-primary'
                                : 'bg-border-light'
                            )}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between">
                        {PROGRESS_STEPS.map((ps) => (
                          <span key={ps.step} className="font-sans text-[9px] text-text-muted">{ps.label}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rejection reason */}
                  {result.order!.rejection_reason && (
                    <div className="bg-error/5 border border-error/20 rounded-xl px-4 py-3">
                      <p className="font-sans text-xs font-semibold text-error">Reason:</p>
                      <p className="font-sans text-sm text-error/80 mt-1">{result.order!.rejection_reason}</p>
                    </div>
                  )}

                  {/* Order date */}
                  <p className="font-sans text-xs text-text-muted">
                    Placed on {new Date(result.order!.created_at).toLocaleDateString('en-NP', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-border-light p-5 space-y-3">
                  <h3 className="font-sans text-sm font-bold text-text uppercase tracking-wider">Items</h3>
                  {result.items?.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border-light last:border-0">
                      <div>
                        <p className="font-sans text-sm font-medium text-text">{item.product_name}</p>
                        <p className="font-sans text-xs text-text-muted">
                          {[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-sans text-sm font-semibold text-text">{formatPrice(item.line_total)}</p>
                    </div>
                  ))}

                  <div className="pt-3 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Subtotal</span>
                      <span>{formatPrice(result.order!.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Delivery</span>
                      <span>{formatPrice(result.order!.delivery_charge)}</span>
                    </div>
                    {result.order!.discount_amount > 0 && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Discount</span>
                        <span>-{formatPrice(result.order!.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border-light">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(result.order!.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
