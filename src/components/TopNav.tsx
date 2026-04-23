import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sun, Moon, Bell } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import type { ViewState } from '../types';
import { IconButton } from './Button';

interface TopNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ currentView, onNavigate }) => {
  const { isDarkMode, toggleDarkMode } = useUIStore();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between lg:px-12 transition-all duration-500"
      role="banner"
    >
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <AnimatePresence mode="wait">
          {currentView !== 'home' && currentView !== 'product' && (
            <motion.button
              key="back"
              initial={{ scale: 0.8, opacity: 0, x: -20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.8, opacity: 0, x: -20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('home')}
              className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-luxury-gold/50 transition-all text-gray-700 dark:text-white"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-black tracking-tighter cursor-pointer flex items-center justify-center font-serif"
          onClick={() => onNavigate('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('home')}
          aria-label="Go home"
        >
          <motion.span
            className="text-luxury-black dark:text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            VK
          </motion.span>
          <motion.span
            className="text-luxury-pink ml-0.5"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            Luxe
          </motion.span>
        </motion.h1>
      </div>

      <div className="flex items-center justify-end gap-1.5 sm:gap-4 flex-1">
        {/* Dark Mode Toggle */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            onClick={toggleDarkMode}
            variant="ghost"
            size="sm"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="text-gray-700 dark:text-white"
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </IconButton>
        </motion.div>

        {/* Notifications */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            onClick={() => onNavigate('notifications')}
            variant="ghost"
            size="sm"
            className="relative text-gray-700 dark:text-white"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="absolute top-1 right-1 w-2 h-2 bg-luxury-pink rounded-full border border-white dark:border-black shadow-[0_0_10px_rgba(251,113,133,0.8)]"
            />
          </IconButton>
        </motion.div>

        {/* Profile Avatar (Desktop) */}
        <motion.button
          onClick={() => onNavigate('profile')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 border-luxury-gold/20 hidden sm:block"
          aria-label="View profile"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
            alt="Profile"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </motion.header>
  );
};
