import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import { Heart, Plus, Minus, Star, ChevronRight } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useUserStore } from '../stores/userStore';
import { useToast } from '../components';
import { useDoubleTap } from '../hooks/useGestures';
import { useKeyboardNavigation } from '../hooks/useAccessibility';
import type { ViewState } from '../types';

interface ProductDetailsViewProps {
  onNavigate: (view: ViewState) => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ onNavigate }) => {
  const { selectedProduct, setSelectedProduct } = useProductStore();
  const { addToCart } = useCartStore();
  const { favorites, toggleFavorite } = useUserStore();
  const toast = useToast();

  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard navigation for quantity and going back
  const { handleKeyDown: handleQuantityKey } = useKeyboardNavigation(
    undefined,
    () => onNavigate('home'),
    () => setQuantity(prev => prev + 1),
    () => setQuantity(prev => Math.max(1, prev - 1))
  );

  // Swipe gesture setup
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  // Handle drag end
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Swipe right to go back
    if (offset > threshold || velocity > 500) {
      onNavigate('home');
    }
  };

  // Double tap to favorite
  const handleDoubleTapImage = useDoubleTap({
    onDoubleTap: () => {
      if (selectedProduct) {
        toggleFavorite(selectedProduct.id);
        if (!isFav) {
          toast.success('Added to favorites!');
        }
      }
    },
  });

  if (!selectedProduct) {
    return (
      <div className="min-h-[80dvh] flex items-center justify-center">
        <button
          onClick={() => onNavigate('home')}
          className="px-8 py-4 bg-luxury-gold text-black rounded-xl font-black"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedColor, quantity);
    toast.success(`Added ${selectedProduct.name} to your bag`);
    onNavigate('cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="pb-40 sm:pb-12 lg:px-12 max-w-7xl mx-auto"
    >
      {/* Swipe hint - mobile only */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isDragging ? 0 : 1, x: 0 }}
        className="lg:hidden px-4 py-2 flex items-center gap-2 text-zinc-500 text-sm"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span>Swipe right to go back</span>
      </motion.div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:mt-12">
        {/* Image Section with Swipe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ x, opacity, scale }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="relative w-full aspect-[4/5] sm:aspect-square bg-gray-100 dark:bg-zinc-900 sm:rounded-[3rem] overflow-hidden border border-white/5 cursor-grab active:cursor-grabbing touch-pan-y"
        >
          <motion.img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover select-none"
            onClick={handleDoubleTapImage}
            draggable={false}
          />

          {/* Swipe indicator */}
          <motion.div
            style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 lg:hidden"
          >
            <div className="w-12 h-12 rounded-full bg-luxury-gold/20 backdrop-blur flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-luxury-gold rotate-180" />
            </div>
          </motion.div>

          <button
            onClick={() => toggleFavorite(selectedProduct.id)}
            className={`absolute top-6 right-6 sm:top-8 sm:right-8 p-3 sm:p-4 backdrop-blur-xl border rounded-2xl transition-all shadow-2xl active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isFav
                ? 'bg-luxury-pink text-white border-transparent'
                : 'bg-black/40 text-white border-white/20 hover:bg-luxury-pink hover:border-transparent'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFav ? 'fill-white' : ''}`} />
          </button>

          {/* Color Picker */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/70 dark:bg-black/50 backdrop-blur-2xl px-5 py-2.5 rounded-[1.25rem] border border-gray-200 dark:border-white/10 shadow-2xl">
            {selectedProduct.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 sm:w-8 h-8 rounded-full border-2 transition-all duration-300 min-w-[32px] min-h-[32px] ${
                  selectedColor === color
                    ? 'border-luxury-gold scale-125 shadow-[0_0_15px_rgba(212,175,55,0.6)]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pt-8 sm:pt-10 lg:pt-4"
        >
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-luxury-gold font-bold tracking-[0.2em] text-xs uppercase px-3 py-1 bg-luxury-gold/5 border border-luxury-gold/20 rounded-full">
                Atelier Selection
              </span>
              {selectedProduct.stock <= 5 && selectedProduct.stock > 0 && (
                <span className="text-luxury-pink font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-luxury-pink" />
                  Only {selectedProduct.stock} Left in Atelier
                </span>
              )}
              {selectedProduct.stock === 0 && (
                <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Currently Out of Stock
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-gray-900 dark:text-white mb-4 tracking-tight leading-tight font-serif">
              {selectedProduct.name}
            </h2>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-luxury-gold text-luxury-gold" />
                <span className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{selectedProduct.rating}</span>
              </div>
              <span className="text-zinc-500 font-medium text-xs sm:text-sm uppercase tracking-[0.2em]">{selectedProduct.reviews} verified reviews</span>
            </div>
          </div>

          <div className="text-2xl sm:text-4xl font-light text-gray-900 dark:text-white mb-8 sm:mb-12 flex items-center gap-4 font-serif">
            ₵{selectedProduct.price.toLocaleString()}
            {selectedProduct.originalPrice && (
              <span className="text-lg sm:text-xl text-zinc-400 line-through font-light tracking-tight font-sans">
                ₵{selectedProduct.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mb-10 sm:mb-14">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-[0.3em]">
              Heritage & Craft
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm sm:text-lg font-light tracking-wide">{selectedProduct.description}</p>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6 mt-12">
            <div 
              className={`flex items-center bg-gray-50 dark:bg-black/30 rounded-2xl p-2 border border-gray-100 dark:border-white/10 shadow-inner ${selectedProduct.stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}
              onKeyDown={handleQuantityKey}
              tabIndex={0}
              role="group"
              aria-label="Adjust quantity"
            >
              <button
                disabled={selectedProduct.stock === 0}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-luxury-gold hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all"
                aria-label="Decrease quantity"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-16 text-center text-gray-900 dark:text-white text-lg font-bold" aria-live="polite">{quantity}</span>
              <button
                disabled={selectedProduct.stock === 0 || quantity >= selectedProduct.stock}
                onClick={() => setQuantity(prev => Math.min(selectedProduct.stock, prev + 1))}
                className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-luxury-gold hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all disabled:opacity-30"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <button
              disabled={selectedProduct.stock === 0}
              onClick={handleAddToCart}
              className={`group relative flex-1 bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-bold transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.25em] overflow-hidden ${selectedProduct.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-luxury-gold hover:text-white'}`}
            >
              <span className="relative z-10">{selectedProduct.stock === 0 ? 'Out of Stock' : 'Reserve Piece'}</span>
              {selectedProduct.stock > 0 && <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border-t border-gray-100 dark:border-white/10 lg:hidden z-50 pb-safe">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div 
            className={`flex items-center bg-gray-50 dark:bg-black/30 rounded-2xl p-1.5 border border-gray-100 dark:border-white/10 shadow-inner shrink-0 ${selectedProduct.stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}
            onKeyDown={handleQuantityKey}
            tabIndex={0}
            role="group"
            aria-label="Adjust quantity"
          >
            <button
              disabled={selectedProduct.stock === 0}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-luxury-gold transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-gray-900 dark:text-white font-bold text-base" aria-live="polite">{quantity}</span>
            <button
              disabled={selectedProduct.stock === 0 || quantity >= selectedProduct.stock}
              onClick={() => setQuantity(prev => Math.min(selectedProduct.stock, prev + 1))}
              className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-luxury-gold transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            disabled={selectedProduct.stock === 0}
            onClick={handleAddToCart}
            className={`group relative flex-1 bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center uppercase tracking-[0.2em] overflow-hidden text-xs sm:text-sm ${selectedProduct.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="relative z-10">{selectedProduct.stock === 0 ? 'Out of Stock' : 'Add To Bag'}</span>
            {selectedProduct.stock > 0 && <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
