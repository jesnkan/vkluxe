import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../components';
import { useCartStore } from '../stores/cartStore';
import type { ViewState } from '../types';

interface CartViewProps {
  onNavigate: (view: ViewState) => void;
}

export const CartView: React.FC<CartViewProps> = ({ onNavigate }) => {
  const { cart, getSubtotal, getDelivery, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const delivery = getDelivery();
  const total = getTotal();

  const handleCheckout = () => {
    onNavigate('checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-8 pb-32 sm:pb-20 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto"
      role="main"
      aria-label="Shopping Cart"
    >
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 relative">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-luxury-gold"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Curated Collection</span>
          </motion.div>
          <h1 className="text-5xl sm:text-8xl font-bold text-gray-900 dark:text-white tracking-tighter font-serif italic leading-none">
            Boutique <span className="text-luxury-gold/30">.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-8 border-b border-gray-100 dark:border-white/5 pb-2">
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Items</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-serif">{cart.length}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Subtotal</div>
            <div className="text-2xl font-bold text-luxury-gold font-serif">₵{subtotal.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto py-20 sm:py-40 text-center space-y-12"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-luxury-gold/10 blur-[100px] rounded-full" />
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <ShoppingBag className="w-12 h-12 sm:w-20 sm:h-20 text-luxury-gold/30" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white font-serif italic">Your boutique is waiting.</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-xl font-medium max-w-md mx-auto leading-relaxed font-sans">
              Discover our latest masterpieces and begin your curation of luxury.
            </p>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="group relative px-12 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-[0.3em] text-xs sm:text-sm overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Start Exploring</span>
            <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          {/* Main List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Selections</h2>
              <button 
                onClick={() => onNavigate('home')}
                className="text-xs font-bold text-zinc-400 hover:text-luxury-gold transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
              >
                <ChevronLeft className="w-3 h-3" />
                Continue Shopping
              </button>
            </div>
            
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <CartItem key={`${item.id}-${item.selectedColor}`} item={item} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar - The "Atelier" Card */}
          <div className="lg:col-span-5 xl:col-span-4 mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 space-y-8"
            >
              <div className="bg-white dark:bg-[#0f0f0f] rounded-[3rem] p-10 sm:p-14 border border-gray-100 dark:border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[100px] -mr-32 -mt-32" />
                
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 tracking-tight font-serif italic">
                  Manifest <span className="text-luxury-gold">.</span>
                </h3>

                <div className="space-y-8 mb-16">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Couture Subtotal</div>
                      <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Standard curation fee included</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white font-serif">₵{subtotal.toLocaleString()}</div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Concierge Dispatch</div>
                      <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Insured express handling</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white font-serif">₵{delivery.toLocaleString()}</div>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent my-10" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-900 dark:text-white tracking-[0.2em] uppercase">Total Acquisition</span>
                    <span className="text-4xl sm:text-5xl font-bold text-luxury-gold font-serif italic drop-shadow-2xl">
                      ₵{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-7 rounded-2xl font-bold text-sm sm:text-base hover:bg-luxury-gold hover:text-white transition-all shadow-2xl flex items-center justify-center gap-6 group uppercase tracking-[0.4em] overflow-hidden relative"
                  >
                    <span className="relative z-10">Checkout</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-3 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-luxury-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-3 py-4 text-zinc-400 dark:text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Bank-Grade SSL Security</span>
                  </div>
                </div>
              </div>

              {/* Mini Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-white/50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                  <div className="text-xs font-black text-luxury-gold uppercase tracking-widest mb-2">Authenticity</div>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">Every piece is verified by our elite concierge team.</p>
                </div>
                <div className="p-6 bg-white/50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                  <div className="text-xs font-black text-luxury-gold uppercase tracking-widest mb-2">Returns</div>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">30-day discrete return policy for all acquisitions.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
