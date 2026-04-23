import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem as CartItemType } from '../types';
import { useCartStore } from '../stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartQuantity, removeFromCart } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-luxury-gold/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-luxury-gold/5"
    >
      {/* Product Image - Artistic Frame */}
      <div className="relative w-full sm:w-32 h-48 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Details Section */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-luxury-gold uppercase tracking-[0.2em] mb-1">
            {item.category || 'Limited Edition'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-serif italic leading-tight group-hover:text-luxury-pink transition-colors">
            {item.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10">
            <div
              className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: item.selectedColor }}
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
              Spec
            </span>
          </div>
          <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 tracking-tighter">
            Ref: VK-{item.id.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Pricing & Controls - Clean & Minimal */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-sans tracking-tighter">
          ₵{item.price.toLocaleString()}
        </div>

        <div className="flex items-center gap-4">
          {/* Quantity Controller - Architectural Design */}
          <div className="flex items-center bg-gray-50 dark:bg-black/30 rounded-xl p-1 border border-gray-100 dark:border-white/10 shadow-inner">
            <button
              onClick={() => updateCartQuantity(item.id, item.selectedColor, -1)}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-luxury-gold hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-black text-gray-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => updateCartQuantity(item.id, item.selectedColor, 1)}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-luxury-gold hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Remove Button - Subtle & Precise */}
          <button
            onClick={() => removeFromCart(item.id, item.selectedColor)}
            className="p-3 text-zinc-300 hover:text-luxury-pink hover:bg-luxury-pink/5 rounded-xl transition-all active:scale-90"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
