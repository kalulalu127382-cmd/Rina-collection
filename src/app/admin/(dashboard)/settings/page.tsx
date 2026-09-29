'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, Settings as SettingsIcon } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const supabase = createClient();

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase
      .from('store_settings')
      .select('*')
      .order('key');
    
    const settingsData = (data || []) as unknown as Setting[];
    setSettings(settingsData);
    
    // Initialize edit values
    const values: Record<string, string> = {};
    settingsData.forEach((s) => { values[s.key] = s.value || ''; });
    setEditedValues(values);
    
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      for (const setting of settings) {
        const newValue = editedValues[setting.key];
        if (newValue !== (setting.value || '')) {
          const { error } = await supabase
            .from('store_settings')
            .update({ value: newValue || null } as any)
            .eq('key', setting.key);
          if (error) throw error;
        }
      }
      toast.success('Settings saved');
      fetchSettings();
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const SETTING_LABELS: Record<string, { label: string; hint: string; type?: string }> = {
    store_name: { label: 'Store Name', hint: 'Display name of the store' },
    store_phone: { label: 'Store Phone', hint: 'Contact phone number' },
    store_address: { label: 'Store Address', hint: 'Physical store address' },
    delivery_charge: { label: 'Delivery Charge (NPR)', hint: 'Default delivery fee', type: 'number' },
    delivery_charge_outside: { label: 'Outside Delivery Charge (NPR)', hint: 'Fee for deliveries outside Hetauda', type: 'number' },
    qr_image_url: { label: 'QR Code Image URL', hint: 'Full URL to the payment QR image in storage' },
    payment_instructions: { label: 'Payment Instructions', hint: 'Instructions shown during checkout' },
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Settings</h1>
          <p className="font-sans text-sm text-text-muted mt-1">Store configuration</p>
        </div>
        <Button variant="primary" rounded onClick={handleSave} isLoading={saving}>
          <Save className="w-4 h-4" />
          Save All
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-16 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-light divide-y divide-border-light">
          {settings.map((setting) => {
            const config = SETTING_LABELS[setting.key];
            return (
              <div key={setting.key} className="p-5 space-y-2">
                <Input
                  label={config?.label || setting.key}
                  hint={config?.hint}
                  type={config?.type || 'text'}
                  value={editedValues[setting.key] || ''}
                  onChange={(e) =>
                    setEditedValues((prev) => ({ ...prev, [setting.key]: e.target.value }))
                  }
                  placeholder={`Enter ${config?.label || setting.key}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
