'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Save, Store, Truck, CreditCard, Phone } from 'lucide-react';

interface SettingsMap {
  [key: string]: string;
}

const DEFAULT_SETTINGS: SettingsMap = {
  store_name: 'Rina Collection',
  store_tagline: "Nepal's Fashion Destination",
  store_phone: '+977-XXXXXXXXXX',
  store_email: 'info@rinacollection.com',
  store_address: 'Hetauda, Makwanpur, Nepal',
  delivery_charge: '110',
  free_delivery_min: '2000',
  delivery_areas: 'Nationwide (Nepal)',
  payment_methods: 'eSewa QR, Khalti, Bank Transfer, Cash on Delivery',
  esewa_id: '',
  khalti_id: '',
  bank_name: '',
  bank_account: '',
  announcement_text: 'Free Delivery on orders above Rs.2000 | Hetauda & Nationwide',
  flash_sale_hours: '24',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase.from('store_settings').select('key, value');
    if (data) {
      const map: SettingsMap = { ...DEFAULT_SETTINGS };
      data.forEach((row: { key: string; value: string }) => {
        map[row.key] = row.value;
      });
      setSettings(map);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('store_settings').upsert(upserts, { onConflict: 'key' });
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store configuration</p>
        </div>
        <Button variant="primary" rounded onClick={handleSave} isLoading={saving}>
          <Save className="w-4 h-4" />
          {saved ? 'Saved ✓' : 'Save All'}
        </Button>
      </div>

      {/* Store Info */}
      <Section title="Store Information" icon={<Store className="w-4 h-4" />}>
        <Input label="Store Name" value={settings.store_name} onChange={(e) => update('store_name', e.target.value)} />
        <Input label="Tagline" value={settings.store_tagline} onChange={(e) => update('store_tagline', e.target.value)} />
        <Input label="Announcement Bar Text" value={settings.announcement_text} onChange={(e) => update('announcement_text', e.target.value)} hint="Shows on top of the website" />
      </Section>

      {/* Contact */}
      <Section title="Contact" icon={<Phone className="w-4 h-4" />}>
        <Input label="Phone Number" value={settings.store_phone} onChange={(e) => update('store_phone', e.target.value)} />
        <Input label="Email" value={settings.store_email} onChange={(e) => update('store_email', e.target.value)} />
        <Input label="Address" value={settings.store_address} onChange={(e) => update('store_address', e.target.value)} />
      </Section>

      {/* Delivery */}
      <Section title="Delivery" icon={<Truck className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Delivery Charge (Rs.)" type="number" value={settings.delivery_charge} onChange={(e) => update('delivery_charge', e.target.value)} />
          <Input label="Free Delivery Minimum (Rs.)" type="number" value={settings.free_delivery_min} onChange={(e) => update('free_delivery_min', e.target.value)} />
        </div>
        <Input label="Delivery Areas" value={settings.delivery_areas} onChange={(e) => update('delivery_areas', e.target.value)} />
      </Section>

      {/* Payment */}
      <Section title="Payment Methods" icon={<CreditCard className="w-4 h-4" />}>
        <Input label="Accepted Methods" value={settings.payment_methods} onChange={(e) => update('payment_methods', e.target.value)} hint="Comma-separated" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="eSewa ID" value={settings.esewa_id} onChange={(e) => update('esewa_id', e.target.value)} placeholder="9XXXXXXXXX" />
          <Input label="Khalti ID" value={settings.khalti_id} onChange={(e) => update('khalti_id', e.target.value)} placeholder="9XXXXXXXXX" />
        </div>
        <Input label="Bank Name" value={settings.bank_name} onChange={(e) => update('bank_name', e.target.value)} />
        <Input label="Bank Account Number" value={settings.bank_account} onChange={(e) => update('bank_account', e.target.value)} />
      </Section>

      {/* Flash Sale */}
      <Section title="Flash Sale" icon={<span className="text-sm">⚡</span>}>
        <Input label="Flash Sale Duration (hours)" type="number" value={settings.flash_sale_hours} onChange={(e) => update('flash_sale_hours', e.target.value)} hint="How long each flash sale lasts" />
      </Section>

      <div className="pb-8">
        <Button variant="primary" rounded fullWidth onClick={handleSave} isLoading={saving} size="lg">
          <Save className="w-4 h-4" />
          {saved ? 'All Settings Saved ✓' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border p-5 space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        {icon}
        <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}
