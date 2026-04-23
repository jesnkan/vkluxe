import React from 'react';
import { motion } from 'motion/react';
import { Home, Search, Sparkles, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import type { ViewState } from '../types';
import { bounce } from '../utils/animations';

const navItems: { id: ViewState; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Explore' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'concierge', icon: Sparkles, label: 'Concierge' },
  { id: 'cart', icon: ShoppingBag, label: 'Boutique' },
  { id: 'profile', icon: User, label: 'Profile' },
];

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-3xl border border-gray-200 dark:border-white/10 px-4 sm:px-8 py-3 flex justify-between items-center rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = currentView === item.id || (item.id === 'home' && currentView === 'product');
        const showBadge = item.id === 'cart' && itemCount > 0;

        return (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            className={`relative flex flex-col items-center gap-1 transition-colors duration-300 ${
              isActive ? 'text-luxury-gold' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
            }`}
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate(item.id)}
          >
            <motion.div
              animate={isActive ? { y: -2 } : { y: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="relative"
            >
              <motion.div
                animate={isActive ? {
                  filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6))',
                } : {
                  filter: 'drop-shadow(0 0 0px rgba(212,175,55,0))',
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>

              {/* Cart Badge */}
              {showBadge && (
                <motion.span
                  initial="initial"
                  animate="animate"
                  variants={bounce}
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] bg-luxury-pink text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#1a1a1a] px-1"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              )}
            </motion.div>

            {/* Label with animation */}
            <motion.span
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.6,
                y: isActive ? 0 : 2,
              }}
              transition={{ duration: 0.2 }}
              className="text-xs font-semibold tracking-tight uppercase"
            >
              {item.label}
            </motion.span>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 w-1 h-1 bg-luxury-gold rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.nav>
  );
};
