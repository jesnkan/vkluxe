import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useProductStore } from '../stores/productStore';
import type { Product, ViewState } from '../types';

interface RecentlyViewedProps {
  onProductClick: (product: Product) => void;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ onProductClick }) => {
  const { recentlyViewed } = useUserStore();
  const { catalog } = useProductStore();

  const recentProducts = recentlyViewed
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 4);

  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-luxury-gold" />
        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Recently Viewed</h3>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {recentProducts.map((product) => (
          <motion.button
            key={product.id}
            onClick={() => onProductClick(product)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 w-32 sm:w-40 text-left group"
          >
            <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-white/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1">
              {product.name}
            </h4>
            <p className="text-luxury-pink font-bold text-sm">₵{product.price}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
