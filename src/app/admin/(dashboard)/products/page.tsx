'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { formatPrice, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Package, Eye, EyeOff, X } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  material: string | null;
  price: number;
  sale_price: number | null;
  active: boolean;
  created_at: string;
  product_variants: { id: string; size: string; color: string; stock: number; active: boolean }[];
  product_images: { id: string; image_url: string; is_cover: boolean }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const supabase = createClient();

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select(`
        id, name, slug, description, material, price, sale_price, active, created_at,
        product_variants (id, size, color, stock, active),
        product_images (id, image_url, is_cover)
      `)
      .order('created_at', { ascending: false });
    setProducts((data || []) as Product[]);
    setLoading(false);
  }

  async function toggleActive(product: Product) {
    const { error } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id);

    if (error) {
      toast.error('Failed to update product');
      return;
    }
    toast.success(product.active ? 'Product hidden' : 'Product visible');
    fetchProducts();
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) {
      toast.error('Failed to delete product');
      return;
    }
    toast.success('Product deleted');
    fetchProducts();
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleCreate() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Products</h1>
          <p className="font-sans text-sm text-text-muted mt-1">{products.length} products</p>
        </div>
        <Button variant="primary" rounded onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
        />
      )}

      {/* Products List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 w-full rounded-2xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-light p-12 text-center">
          <Package className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <h2 className="font-serif text-lg font-semibold">No Products Yet</h2>
          <p className="text-sm text-text-muted mt-1">Add your first product to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const cover = product.product_images?.find((i) => i.is_cover) || product.product_images?.[0];
            const totalStock = product.product_variants?.reduce((s, v) => s + v.stock, 0) || 0;
            return (
              <div
                key={product.id}
                className={cn(
                  'bg-white rounded-2xl border p-4 flex gap-4 transition-all',
                  product.active ? 'border-border-light' : 'border-border-light opacity-60'
                )}
              >
                {/* Thumbnail */}
                <div className="w-16 h-20 rounded-xl bg-bg-warm overflow-hidden shrink-0 relative">
                  {cover?.image_url ? (
                    <Image src={cover.image_url} alt={product.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-text-muted/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-text truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-sans text-sm font-bold text-primary">
                          {formatPrice(product.sale_price || product.price)}
                        </span>
                        {product.sale_price && (
                          <span className="font-sans text-xs price-original">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                    <span>{product.product_variants?.length || 0} variants</span>
                    <span>·</span>
                    <span>{totalStock} in stock</span>
                    <span>·</span>
                    <span className={product.active ? 'text-success' : 'text-text-muted'}>
                      {product.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(product)}
                    className="p-2 rounded-xl hover:bg-bg-warm transition-colors"
                    title={product.active ? 'Hide' : 'Show'}
                  >
                    {product.active ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-text-muted" />}
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-xl hover:bg-bg-warm transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-text-muted" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product)}
                    className="p-2 rounded-xl hover:bg-error/5 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-error/60" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ——— Product Create/Edit Form ——— */
function ProductForm({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    material: product?.material || '',
    price: product?.price?.toString() || '',
    sale_price: product?.sale_price?.toString() || '',
  });

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: product ? prev.slug : generateSlug(name),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug || !form.price) {
      toast.error('Name, slug, and price are required');
      return;
    }

    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        material: form.material.trim() || null,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      };

      if (product) {
        const { error } = await supabase.from('products').update(data).eq('id', product.id);
        if (error) throw error;
        toast.success('Product updated');
      } else {
        const { error } = await supabase.from('products').insert(data);
        if (error) throw error;
        toast.success('Product created');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-8 sm:pt-16 px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-border-light w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h2 className="font-sans text-lg font-semibold text-text">
            {product ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-xl hover:bg-bg-warm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input
            label="Product Name"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Elegant Silk Kurta"
          />
          <Input
            label="URL Slug"
            required
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="elegant-silk-kurta"
            hint="Used in the product URL"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (NPR)"
              required
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              placeholder="2500"
            />
            <Input
              label="Sale Price (NPR)"
              type="number"
              min="0"
              step="1"
              value={form.sale_price}
              onChange={(e) => setForm((p) => ({ ...p, sale_price: e.target.value }))}
              placeholder="Optional"
            />
          </div>
          <Textarea
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Describe the product..."
          />
          <Input
            label="Material"
            value={form.material}
            onChange={(e) => setForm((p) => ({ ...p, material: e.target.value }))}
            placeholder="e.g. Pure Silk"
          />

          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="primary" rounded fullWidth isLoading={saving}>
              {product ? 'Save Changes' : 'Create Product'}
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
