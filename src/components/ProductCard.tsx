import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useUserStore } from '../stores/userStore';
import { useToast } from './Toast';
import { useLongPress } from '../hooks/useGestures';
import { cardHover, buttonTap, imageHover } from '../utils/animations';

interface ProductCardProps {
  product: Product;
  index?: number;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0, onClick }) => {
  const { addToCart } = useCartStore();
  const { favorites, toggleFavorite, addToRecentlyViewed } = useUserStore();
  const toast = useToast();
  const isFav = favorites.includes(product.id);

  const handleClick = () => {
    addToRecentlyViewed(product.id);
    onClick?.();
  };

  const handleAddToCart = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    addToCart(product, product.colors[0], 1);
    toast.success(`Added ${product.name} to bag`);
  };

  const { isPressing, handlers } = useLongPress({
    onLongPress: () => {
      handleAddToCart();
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    },
    onClick: handleClick,
    duration: 600
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
    if (!isFav) {
      toast.success('Added to favorites');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 * index,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      {...handlers}
      className={`group cursor-pointer flex flex-col h-full relative ${isPressing ? 'scale-[0.98]' : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View ${product.name}. Long press to quick add to bag.`}
    >
      <motion.div
        className={`relative aspect-[4/5] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden mb-4 bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-white/5 transition-all duration-500 shadow-xl group-hover:shadow-luxury-gold/20 group-hover:border-luxury-gold/30 ${isPressing ? 'ring-2 ring-luxury-gold/50' : ''}`}
      >
        <AnimatePresence>
          {isPressing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-white text-black p-4 rounded-full shadow-2xl">
                <ShoppingBag className="w-8 h-8 animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          initial="rest"
          whileHover="hover"
          variants={imageHover}
        />

        {/* Favorite Button */}
        <motion.div
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index + 0.2 }}
        >
          <motion.button
            whileTap={buttonTap}
            className={`p-2 sm:p-3 backdrop-blur-xl border rounded-xl transition-all shadow-lg ${
              isFav
                ? 'bg-luxury-pink text-white border-transparent'
                : 'bg-black/40 text-white border-white/20 hover:bg-luxury-pink hover:border-transparent'
            }`}
            onClick={handleToggleFavorite}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <motion.div
              initial={false}
              animate={isFav ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'fill-white' : ''}`} />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Add to Cart Button (Desktop) */}
        <motion.div
          className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5 z-20 hidden sm:block"
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="w-full py-3 sm:py-4 bg-white text-black font-bold rounded-xl hover:bg-luxury-gold hover:text-white transition-all flex items-center justify-center gap-2 shadow-2xl overflow-hidden group/btn relative"
            onClick={(e) => handleAddToCart(e as any)}
            aria-label={`Add ${product.name} to bag`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.2em]">Add to Bag</span>
            </span>
            <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          </motion.button>
        </motion.div>

        {/* Mobile Rating Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-lg sm:hidden flex items-center gap-1 shadow-sm border border-white/20 dark:border-white/10">
          <Star className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
          <span className="text-xs text-gray-900 dark:text-white font-bold">{product.rating}</span>
        </div>
      </motion.div>

      {/* Product Info */}
      <motion.div
        className="px-2 flex-1 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 * index + 0.1 }}
      >
        <div className="text-xs font-bold text-luxury-gold uppercase tracking-[0.2em] mb-1.5">
          {product.category || 'Collection'}
        </div>
        <h3 className="text-zinc-900 dark:text-zinc-100 font-medium text-sm sm:text-lg mb-2 group-hover:text-luxury-pink transition-colors duration-300 line-clamp-1 font-serif">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-baseline gap-1.5 sm:gap-3">
            <span className="text-gray-900 dark:text-white font-medium text-base sm:text-xl font-serif">₵{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs line-through font-light tracking-tight text-zinc-400">
                ₵{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
            <Star className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">{product.rating}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
