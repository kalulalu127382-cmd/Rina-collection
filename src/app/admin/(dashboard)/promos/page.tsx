'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Plus, Tag, Trash2, Copy, X } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  type: 'FLAT' | 'PERCENT';
  value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  referrer_name: string | null;
  active: boolean;
  created_at: string;
}

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchPromos(); }, []);

  async function fetchPromos() {
    setLoading(true);
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    setPromos((data || []) as PromoCode[]);
    setLoading(false);
  }

  async function toggleActive(promo: PromoCode) {
    await supabase.from('promo_codes').update({ active: !promo.active }).eq('id', promo.id);
    toast.success(promo.active ? 'Code deactivated' : 'Code activated');
    fetchPromos();
  }

  async function deletePromo(promo: PromoCode) {
    if (!confirm(`Delete code "${promo.code}"?`)) return;
    await supabase.from('promo_codes').delete().eq('id', promo.id);
    toast.success('Promo code deleted');
    fetchPromos();
  }

  function copyLink(code: string) {
    const url = `${window.location.origin}/checkout?ref=${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Referral link copied!');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Promo Codes</h1>
          <p className="font-sans text-sm text-text-muted mt-1">{promos.length} codes</p>
        </div>
        <Button variant="primary" rounded onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Add Code
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <PromoForm
          onClose={() => { setShowForm(false); fetchPromos(); }}
        />
      )}

      {/* Promos list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="skeleton h-20 w-full rounded-2xl" />)}
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-light p-12 text-center">
          <Tag className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <h2 className="font-serif text-lg font-semibold">No Promo Codes</h2>
          <p className="text-sm text-text-muted mt-1">Create discount and referral codes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={cn(
                'bg-white rounded-2xl border p-4 flex items-center gap-4',
                promo.active ? 'border-border-light' : 'border-border-light opacity-60'
              )}
            >
              {/* Code badge */}
              <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <Tag className="w-6 h-6 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-sm font-bold text-text tracking-wider">{promo.code}</h3>
                  <span className={cn(
                    'badge',
                    promo.active ? 'bg-success/10 text-success' : 'bg-bg-warm text-text-muted'
                  )}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="font-sans text-sm text-text-secondary mt-0.5">
                  {promo.type === 'PERCENT' ? `${promo.value}% off` : `${formatPrice(promo.value)} off`}
                  {promo.min_order_amount ? ` · Min ${formatPrice(promo.min_order_amount)}` : ''}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                  <span>Used: {promo.used_count}{promo.max_uses ? `/${promo.max_uses}` : ''}</span>
                  {promo.referrer_name && <span>· Ref: {promo.referrer_name}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => copyLink(promo.code)}
                  className="p-2 rounded-xl hover:bg-bg-warm transition-colors"
                  title="Copy referral link"
                >
                  <Copy className="w-4 h-4 text-text-muted" />
                </button>
                <button
                  onClick={() => toggleActive(promo)}
                  className="p-2 rounded-xl hover:bg-bg-warm transition-colors text-xs font-medium text-text-muted"
                >
                  {promo.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => deletePromo(promo)}
                  className="p-2 rounded-xl hover:bg-error/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-error/60" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PromoForm({ onClose }: { onClose: () => void }) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'PERCENT' as 'FLAT' | 'PERCENT',
    value: '',
    min_order_amount: '',
    max_uses: '',
    referrer_name: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.value) {
      toast.error('Code and value are required');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('promo_codes').insert({
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: parseFloat(form.value),
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        referrer_name: form.referrer_name.trim() || null,
      });

      if (error) throw error;
      toast.success('Promo code created');
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create promo code');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-8 sm:pt-16 px-4">
      <div className="bg-white rounded-2xl border border-border-light w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h2 className="font-sans text-lg font-semibold">New Promo Code</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-xl hover:bg-bg-warm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input
            label="Code"
            required
            value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
            placeholder="WELCOME10"
            hint="Will be auto-uppercased"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text">Type</label>
            <div className="flex rounded-xl bg-bg-warm p-1">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: 'PERCENT' }))}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
                  form.type === 'PERCENT' ? 'bg-white text-text shadow-sm' : 'text-text-muted'
                )}
              >
                Percentage
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: 'FLAT' }))}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
                  form.type === 'FLAT' ? 'bg-white text-text shadow-sm' : 'text-text-muted'
                )}
              >
                Flat Amount
              </button>
            </div>
          </div>

          <Input
            label={form.type === 'PERCENT' ? 'Discount (%)' : 'Discount (NPR)'}
            required
            type="number"
            min="0"
            value={form.value}
            onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
            placeholder={form.type === 'PERCENT' ? '10' : '50'}
          />

          <Input
            label="Min Order Amount (NPR)"
            type="number"
            min="0"
            value={form.min_order_amount}
            onChange={(e) => setForm((p) => ({ ...p, min_order_amount: e.target.value }))}
            placeholder="Optional"
          />

          <Input
            label="Max Uses"
            type="number"
            min="0"
            value={form.max_uses}
            onChange={(e) => setForm((p) => ({ ...p, max_uses: e.target.value }))}
            placeholder="Unlimited"
          />

          <Input
            label="Referrer Name"
            value={form.referrer_name}
            onChange={(e) => setForm((p) => ({ ...p, referrer_name: e.target.value }))}
            placeholder="Optional — for referral tracking"
          />

          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="primary" rounded fullWidth isLoading={saving}>
              Create Code
            </Button>
            <Button type="button" variant="ghost" rounded onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
