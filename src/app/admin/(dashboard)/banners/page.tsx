'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, X, Image as ImageIcon } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cta_text: string;
  cta_link: string;
  bg_color: string;
  bg_gradient: string | null;
  text_color: string;
  image_url: string | null;
  sort_order: number;
  active: boolean;
}

const PRESET_GRADIENTS = [
  { name: 'Orange Fire', value: 'linear-gradient(135deg, #F85606 0%, #FF2D00 50%, #D94400 100%)' },
  { name: 'Deep Night', value: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)' },
  { name: 'Green Fresh', value: 'linear-gradient(135deg, #00A650 0%, #00C853 50%, #009624 100%)' },
  { name: 'Purple Dream', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Pink Passion', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Gold Luxury', value: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)' },
  { name: 'Ocean Blue', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { name: 'Solid Orange', value: '' },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const supabase = createClient();

  useEffect(() => { fetchBanners(); }, []);

  async function fetchBanners() {
    setLoading(true);
    const { data } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order');
    setBanners((data || []) as Banner[]);
    setLoading(false);
  }

  async function toggleActive(banner: Banner) {
    await supabase.from('banners').update({ active: !banner.active }).eq('id', banner.id);
    fetchBanners();
  }

  async function deleteBanner(banner: Banner) {
    if (!confirm(`Delete banner "${banner.title}"?`)) return;
    await supabase.from('banners').delete().eq('id', banner.id);
    fetchBanners();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage homepage banner carousel</p>
        </div>
        <Button variant="primary" rounded onClick={() => { setEditingBanner(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      {showForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => { setShowForm(false); setEditingBanner(null); fetchBanners(); }}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 w-full rounded-2xl" />)}
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold">No Banners</h2>
          <p className="text-sm text-gray-500 mt-1">Add your first banner to show on the homepage</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl border p-4 flex gap-4 transition-all ${!banner.active ? 'opacity-50' : ''}`}
            >
              {/* Preview */}
              <div
                className="w-32 h-20 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
                style={{ background: banner.bg_gradient || banner.bg_color || '#F85606' }}
              >
                <span className="text-white text-xs font-bold text-center px-2 leading-tight truncate">
                  {banner.title}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{banner.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{banner.subtitle || 'No subtitle'}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>CTA: {banner.cta_text}</span>
                  <span>→ {banner.cta_link}</span>
                  <span className={banner.active ? 'text-green-500' : 'text-gray-400'}>
                    {banner.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleActive(banner)} className="p-2 rounded-xl hover:bg-gray-50" title={banner.active ? 'Hide' : 'Show'}>
                  {banner.active ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </button>
                <button onClick={() => { setEditingBanner(banner); setShowForm(true); }} className="p-2 rounded-xl hover:bg-gray-50">
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => deleteBanner(banner)} className="p-2 rounded-xl hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BannerForm({ banner, onClose }: { banner: Banner | null; onClose: () => void }) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    description: banner?.description || '',
    cta_text: banner?.cta_text || 'SHOP NOW',
    cta_link: banner?.cta_link || '/products',
    bg_color: banner?.bg_color || '#F85606',
    bg_gradient: banner?.bg_gradient || PRESET_GRADIENTS[0].value,
    text_color: banner?.text_color || 'white',
    sort_order: banner?.sort_order?.toString() || '0',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);

    const data = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null,
      cta_text: form.cta_text.trim(),
      cta_link: form.cta_link.trim(),
      bg_color: form.bg_color,
      bg_gradient: form.bg_gradient || null,
      text_color: form.text_color,
      sort_order: parseInt(form.sort_order) || 0,
    };

    if (banner) {
      await supabase.from('banners').update(data).eq('id', banner.id);
    } else {
      await supabase.from('banners').insert(data);
    }
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-4 sm:pt-16 px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border w-full max-w-lg shadow-2xl mb-8">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">{banner ? 'Edit Banner' : 'New Banner'}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-xl hover:bg-gray-50"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Live preview */}
          <div
            className="rounded-xl p-4 min-h-[80px] flex items-center"
            style={{ background: form.bg_gradient || form.bg_color, color: form.text_color }}
          >
            <div>
              <p className="text-lg font-black">{form.title || 'Banner Title'}</p>
              {form.subtitle && <p className="text-sm font-bold opacity-90">{form.subtitle}</p>}
              {form.description && <p className="text-xs opacity-70">{form.description}</p>}
            </div>
          </div>

          <Input label="Title *" required value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. दशैं SALE" />
          <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))} placeholder="e.g. UP TO 50% OFF" />
          <Input label="Description" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. on Kurtas, Sarees & Lehenga" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Button Text" value={form.cta_text} onChange={(e) => setForm(p => ({ ...p, cta_text: e.target.value }))} placeholder="SHOP NOW" />
            <Input label="Button Link" value={form.cta_link} onChange={(e) => setForm(p => ({ ...p, cta_link: e.target.value }))} placeholder="/products" />
          </div>

          {/* Gradient presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Background Style</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_GRADIENTS.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, bg_gradient: g.value }))}
                  className={`h-10 rounded-lg border-2 transition-all ${form.bg_gradient === g.value ? 'border-blue-500 scale-105' : 'border-transparent'}`}
                  style={{ background: g.value || '#F85606' }}
                  title={g.name}
                />
              ))}
            </div>
          </div>

          <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm(p => ({ ...p, sort_order: e.target.value }))} placeholder="0" />

          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="primary" rounded fullWidth isLoading={saving}>
              {banner ? 'Save Changes' : 'Create Banner'}
            </Button>
            <Button type="button" variant="ghost" rounded onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
