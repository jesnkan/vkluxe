import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
  cart: CartItem[];
  shippingFee: number;

  // Actions
  addToCart: (product: Product, color: string, quantity: number) => void;
  updateCartQuantity: (id: number, color: string, delta: number) => void;
  removeFromCart: (id: number, color: string) => void;
  clearCart: () => void;
  setShippingFee: (fee: number) => void;

  // Computed
  getSubtotal: () => number;
  getDelivery: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      shippingFee: 150,

      addToCart: (product, color, quantity) => {
        set((state) => {
          const existing = state.cart.find(
            (item) => item.id === product.id && item.selectedColor === color
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id && item.selectedColor === color
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { ...product, quantity, selectedColor: color }],
          };
        });
      },

      updateCartQuantity: (id, color, delta) => {
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id === id && item.selectedColor === color) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
              }
              return item;
            })
            .filter((item) => item.quantity > 0),
        }));
      },

      removeFromCart: (id, color) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.id === id && item.selectedColor === color)
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      setShippingFee: (fee) => set({ shippingFee: fee }),

      getSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDelivery: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 0 ? get().shippingFee : 0;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDelivery();
      },

      getItemCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'vkluxe-cart-storage',
    }
  )
);
