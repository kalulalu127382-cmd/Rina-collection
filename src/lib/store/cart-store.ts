'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  variant_id: string | null;
  quantity: number;
  price: number;       // current price (sale_price if exists, else price)
  name: string;
  slug: string;
  size: string | null;
  color: string | null;
  image_url: string | null;
  stock: number;       // max stock available
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
          );

          if (existingIndex >= 0) {
            const updated = [...state.items];
            const newQty = Math.min(
              updated[existingIndex].quantity + item.quantity,
              updated[existingIndex].stock
            );
            updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
            return { items: updated, isOpen: true };
          }

          return { items: [...state.items, item], isOpen: true };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product_id === productId && i.variant_id === variantId)
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => !(i.product_id === productId && i.variant_id === variantId)
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              i.product_id === productId && i.variant_id === variantId
                ? { ...i, quantity: Math.min(quantity, i.stock) }
                : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: 'sasto-bazar-cart',
      partialize: (state) => ({ items: state.items }), // only persist items, not UI state
    }
  )
);
