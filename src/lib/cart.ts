export interface CartItem {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  price_at_add: number;
  name: string;
  size?: string;
  color?: string;
  image_url?: string;
}

const CART_STORAGE_KEY = 'rina_collection_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCart(cart: CartItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
  );

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  
  saveCart(cart);
  return cart;
}

export function updateQuantity(productId: string, variantId: string | null | undefined, quantity: number) {
  const cart = getCart();
  const itemIndex = cart.findIndex(
    (i) => i.product_id === productId && i.variant_id === variantId
  );
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart);
  }
  
  return cart;
}

export function removeFromCart(productId: string, variantId: string | null | undefined) {
  const cart = getCart();
  const updatedCart = cart.filter(
    (i) => !(i.product_id === productId && i.variant_id === variantId)
  );
  saveCart(updatedCart);
  return updatedCart;
}

export function clearCart() {
  saveCart([]);
}
