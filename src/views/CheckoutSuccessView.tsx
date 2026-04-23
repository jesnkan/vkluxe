import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import type { ViewState } from '../types';

interface CheckoutSuccessViewProps {
  onNavigate: (view: ViewState) => void;
}

export const CheckoutSuccessView: React.FC<CheckoutSuccessViewProps> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[85dvh] flex items-center justify-center px-6 py-20"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="text-center glass-card p-10 sm:p-20 rounded-[3rem] sm:rounded-[5rem] border-luxury-gold/20 max-w-2xl w-full relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-luxury-gold via-luxury-pink to-luxury-gold"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-luxury-gold/5 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-luxury-pink/5 blur-3xl rounded-full"></div>

        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          className="w-24 h-24 sm:w-32 sm:h-32 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(212,175,55,0.2)] border border-luxury-gold/20"
        >
          <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-luxury-gold" />
        </motion.div>

        <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tighter mb-6 font-serif italic">
          Acquisition <span className="text-luxury-gold">Complete</span>
        </h2>
        
        <div className="space-y-4 mb-12">
          <p className="text-zinc-500 dark:text-zinc-400 font-bold text-lg sm:text-xl leading-relaxed max-w-md mx-auto">
            Your curated selection is now being prepared for <span className="text-gray-900 dark:text-white">priority dispatch</span>.
          </p>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs sm:text-sm font-black uppercase tracking-[0.3em]">
            Order Ref: VK-{Math.random().toString(36).toUpperCase().substring(2, 10)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm sm:text-base hover:bg-luxury-gold hover:text-white transition-all shadow-2xl uppercase tracking-widest"
          >
            Return to Atelier
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="py-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl font-black text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest"
          >
            Track Status
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
