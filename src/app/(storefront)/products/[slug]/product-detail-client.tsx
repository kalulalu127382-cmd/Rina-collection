'use client';

import { useState, useMemo } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { ProductGallery } from '@/components/product-gallery';
import { Button } from '@/components/ui/button';
import { formatPrice, getDiscountPercent, cn } from '@/lib/utils';
import { ShoppingBag, Check, Minus, Plus, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  material: string | null;
  size_fit_notes: string | null;
  care_instructions: string | null;
  price: number;
  sale_price: number | null;
}

interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  sku: string | null;
  stock: number;
  active: boolean;
}

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_cover: boolean;
  variant_id: string | null;
  sort_order: number;
}

interface Props {
  product: Product;
  variants: Variant[];
  images: ProductImage[];
}

export function ProductDetailClient({ product, variants, images }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length === 1 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Get unique sizes and colors
  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[],
    [variants]
  );
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[],
    [variants]
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizes.length === 1 ? sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors.length === 1 ? colors[0] : null
  );

  // Find matching variant when size/color changes
  useMemo(() => {
    if (selectedSize || selectedColor) {
      const match = variants.find(
        (v) =>
          (!selectedSize || v.size === selectedSize) &&
          (!selectedColor || v.color === selectedColor)
      );
      setSelectedVariant(match || null);
    }
  }, [selectedSize, selectedColor, variants]);

  // Filter images by selected variant
  const displayImages = useMemo(() => {
    if (selectedVariant?.id) {
      const variantImages = images.filter((img) => img.variant_id === selectedVariant.id);
      if (variantImages.length > 0) return variantImages;
    }
    return images.filter((img) => !img.variant_id);
  }, [images, selectedVariant]);

  const displayPrice = product.sale_price ?? product.price;
  const discount = product.sale_price
    ? getDiscountPercent(product.price, product.sale_price)
    : 0;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : variants.some((v) => v.stock > 0);
  const needsVariant = variants.length > 1 && !selectedVariant;
  const maxQty = selectedVariant?.stock ?? 1;

  function handleAddToCart() {
    if (needsVariant) {
      toast.error('Please select a size and color');
      return;
    }

    addItem({
      product_id: product.id,
      variant_id: selectedVariant?.id ?? null,
      quantity,
      price: displayPrice,
      name: product.name,
      slug: product.slug,
      size: selectedVariant?.size ?? null,
      color: selectedVariant?.color ?? null,
      image_url: displayImages[0]?.image_url ?? null,
      stock: maxQty,
    });

    setJustAdded(true);
    toast.success(`${product.name} added to cart`, {
      description: selectedVariant
        ? `${[selectedVariant.size, selectedVariant.color].filter(Boolean).join(' · ')} × ${quantity}`
        : `× ${quantity}`,
    });
    setTimeout(() => setJustAdded(false), 2000);
  }

  function toggleSection(section: string) {
    setExpandedSection((prev) => (prev === section ? null : section));
  }

  return (
    <div className="flex flex-col pb-28 lg:pb-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:content-container lg:py-8">
        {/* Gallery */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ProductGallery images={displayImages} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="content-container lg:px-0 mt-5 lg:mt-0 space-y-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted font-sans">
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-text transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-text truncate">{product.name}</span>
          </nav>

          {/* Name & Price */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl font-sans font-bold text-text">
                {formatPrice(displayPrice)}
              </span>
              {product.sale_price && (
                <>
                  <span className="text-lg price-original">{formatPrice(product.price)}</span>
                  <span className="badge badge-sale">-{discount}%</span>
                </>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="font-sans text-sm font-semibold text-text">Size</label>
                {selectedSize && (
                  <span className="font-sans text-xs text-text-muted">{selectedSize}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const hasStock = variants.some(
                    (v) => v.size === size && v.stock > 0 && (!selectedColor || v.color === selectedColor)
                  );
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                      disabled={!hasStock}
                      className={cn(
                        'min-w-[3rem] h-11 px-4 rounded-xl border font-sans text-sm font-medium transition-all duration-200',
                        selectedSize === size
                          ? 'border-primary bg-primary text-white shadow-sm'
                          : hasStock
                          ? 'border-border text-text hover:border-text-muted'
                          : 'border-border-light text-text-muted/40 line-through cursor-not-allowed'
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="font-sans text-sm font-semibold text-text">Color</label>
                {selectedColor && (
                  <span className="font-sans text-xs text-text-muted">{selectedColor}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const hasStock = variants.some(
                    (v) => v.color === color && v.stock > 0 && (!selectedSize || v.size === selectedSize)
                  );
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                      disabled={!hasStock}
                      className={cn(
                        'h-11 px-5 rounded-xl border font-sans text-sm font-medium transition-all duration-200',
                        selectedColor === color
                          ? 'border-primary bg-primary/5 text-primary'
                          : hasStock
                          ? 'border-border text-text hover:border-text-muted'
                          : 'border-border-light text-text-muted/40 cursor-not-allowed'
                      )}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2.5">
            <label className="font-sans text-sm font-semibold text-text">Quantity</label>
            <div className="flex items-center gap-0.5 w-fit border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-bg-warm transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-sans text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-bg-warm transition-colors"
                disabled={quantity >= maxQty}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
              <p className="font-sans text-xs text-warning font-medium">
                Only {selectedVariant.stock} left in stock
              </p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-3 border-t border-border-light">
              <p className="font-sans text-sm text-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Accordion details */}
          <div className="border-t border-border-light divide-y divide-border-light">
            {product.material && (
              <AccordionItem
                title="Material & Fabric"
                isOpen={expandedSection === 'material'}
                onToggle={() => toggleSection('material')}
              >
                <p className="font-sans text-sm text-text-secondary leading-relaxed">{product.material}</p>
              </AccordionItem>
            )}
            {product.size_fit_notes && (
              <AccordionItem
                title="Size & Fit"
                isOpen={expandedSection === 'fit'}
                onToggle={() => toggleSection('fit')}
              >
                <p className="font-sans text-sm text-text-secondary leading-relaxed">{product.size_fit_notes}</p>
              </AccordionItem>
            )}
            {product.care_instructions && (
              <AccordionItem
                title="Care Instructions"
                isOpen={expandedSection === 'care'}
                onToggle={() => toggleSection('care')}
              >
                <p className="font-sans text-sm text-text-secondary leading-relaxed">{product.care_instructions}</p>
              </AccordionItem>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA — mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border-light z-40 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-sans text-lg font-bold text-text">{formatPrice(displayPrice * quantity)}</p>
            {quantity > 1 && (
              <p className="font-sans text-xs text-text-muted">{formatPrice(displayPrice)} × {quantity}</p>
            )}
          </div>
          <Button
            variant="primary"
            rounded
            size="lg"
            onClick={handleAddToCart}
            disabled={!inStock || needsVariant}
            className="min-w-[160px]"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : !inStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Desktop CTA */}
      <div className="hidden lg:block content-container mt-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          <div />
          <div>
            <Button
              variant="primary"
              fullWidth
              rounded
              size="xl"
              onClick={handleAddToCart}
              disabled={!inStock || needsVariant}
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart!
                </>
              ) : !inStock ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart — {formatPrice(displayPrice * quantity)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 font-sans text-sm font-semibold text-text hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}
