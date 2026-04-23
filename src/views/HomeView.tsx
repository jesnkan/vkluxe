import React from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, ChevronLeft, RefreshCcw } from 'lucide-react';
import { ProductCard, RecentlyViewed, Button } from '../components';
import { useProductStore, CATEGORIES } from '../stores/productStore';
import { useUIStore } from '../stores/uiStore';
import { useKeyboardNavigation } from '../hooks/useAccessibility';
import { usePullToRefresh } from '../hooks/useGestures';
import type { Product, ViewState } from '../types';
import { staggerContainer, staggerItem } from '../utils/animations';

interface HomeViewProps {
  onNavigate: (view: ViewState, product?: Product) => void;
  onSearchFocus: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSearchFocus }) => {
  const { promotions, activeCategory, setActiveCategory, searchQuery, setSearchQuery, getFilteredProducts } = useProductStore();
  const { isDarkMode } = useUIStore();
  const [sortBy, setSortBy] = React.useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const filteredBags = React.useMemo(() => {
    let bags = getFilteredProducts();
    
    switch (sortBy) {
      case 'price-low':
        return [...bags].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...bags].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...bags].sort((a, b) => b.rating - a.rating);
      default:
        return bags;
    }
  }, [getFilteredProducts, sortBy]);

  // Pull to refresh simulation
  const { isRefreshing, pullDistance, handlers } = usePullToRefresh({
    onRefresh: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  });

  const { handleKeyDown } = useKeyboardNavigation(
    undefined,
    undefined,
    () => {
      // Arrow up - previous category
      const currentIndex = CATEGORIES.indexOf(activeCategory);
      if (currentIndex > 0) {
        setActiveCategory(CATEGORIES[currentIndex - 1]);
      }
    },
    () => {
      // Arrow down - next category
      const currentIndex = CATEGORIES.indexOf(activeCategory);
      if (currentIndex < CATEGORIES.length - 1) {
        setActiveCategory(CATEGORIES[currentIndex + 1]);
      }
    }
  );

  return (
    <motion.div
      {...handlers}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="pb-36 sm:pb-12 relative"
      role="main"
      aria-label="Home page"
    >
      {/* Pull to Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-50"
        style={{ height: pullDistance }}
      >
        <div 
          className="bg-white dark:bg-zinc-900 shadow-2xl rounded-full p-3 border border-luxury-gold/20 flex items-center justify-center"
          style={{ 
            transform: `translateY(${Math.min(pullDistance - 50, 20)}px) rotate(${pullDistance * 2}deg)`,
            opacity: Math.min(pullDistance / 100, 1)
          }}
        >
          <RefreshCcw className={`w-5 h-5 text-luxury-gold ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {/* Search & Sort Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 sm:px-6 mt-4 sm:mt-8 lg:px-12 max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 relative group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-luxury-gold transition-colors" aria-hidden="true" />
            <input
              type="text"
              placeholder="Find your statement piece..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={onSearchFocus}
              onKeyDown={handleKeyDown}
              className="w-full bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-[1.25rem] py-3.5 sm:py-4 pl-12 pr-4 outline-none border border-gray-100 dark:border-white/10 focus:border-luxury-gold/50 focus:ring-2 focus:ring-luxury-gold/20 transition-all placeholder:text-zinc-500 text-sm sm:text-base shadow-sm"
              aria-label="Search products"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
            <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-1.5 rounded-2xl">
              {[
                { id: 'featured', label: 'Featured' },
                { id: 'price-low', label: '₵ Low' },
                { id: 'price-high', label: '₵ High' },
                { id: 'rating', label: 'Rating' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    sortBy === option.id 
                      ? 'bg-luxury-gold text-black shadow-lg' 
                      : 'text-zinc-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Promo Banner */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 sm:px-6 mt-6 sm:mt-10 lg:px-12 max-w-7xl mx-auto"
        role="banner"
        aria-label="Featured promotion"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 lg:p-20 flex flex-col sm:flex-row items-center justify-between group cursor-pointer border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0f0f0f] to-[#1a1a1a] z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.08),transparent_60%)] z-0"></div>

          <div className="relative z-10 w-full sm:max-w-[55%] text-center sm:text-left">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-luxury-gold text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-sm"
            >
              Couture Collection
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-medium text-white leading-tight mb-6 tracking-tight font-serif">
              {promotions.heroTitle} <br className="hidden sm:block" />
              <span className="text-gradient-luxury tracking-normal">{promotions.heroGradient}</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base lg:text-lg mb-10 max-w-md mx-auto sm:mx-0 leading-relaxed font-light tracking-wide">
              {promotions.heroDescription}
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
              <button
                onClick={() => setActiveCategory('Satchel')}
                className="group relative px-8 sm:px-10 py-4 bg-luxury-gold text-black rounded-2xl font-bold uppercase tracking-[0.2em] text-xs sm:text-sm overflow-hidden transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] active:scale-95 flex items-center gap-3"
              >
                <span className="relative z-10">Shop Now</span>
                <ChevronLeft className="w-4 h-4 rotate-180 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
              <button
                onClick={() => onNavigate('concierge')}
                className="px-8 sm:px-10 py-4 bg-transparent border border-white/20 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs sm:text-sm hover:bg-white/5 hover:border-white/40 transition-all active:scale-95"
              >
                AI Concierge
              </button>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 overflow-hidden pointer-events-none opacity-40 sm:opacity-100">
            <motion.img
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              src={promotions.heroImage}
              alt="Luxury Bags"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[3000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#050505] via-transparent to-transparent"></div>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <nav
        className="mt-10 sm:mt-14 pl-4 sm:pl-6 lg:pl-12 max-w-7xl mx-auto overflow-hidden"
        aria-label="Product categories"
      >
        <motion.div
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-6 scrollbar-hide pr-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          role="tablist"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              variants={staggerItem}
              key={cat}
              onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveCategory(cat);
                }
              }}
              className={`px-7 sm:px-10 py-3 rounded-2xl whitespace-nowrap font-bold text-sm sm:text-base transition-all duration-500 border focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 ${
                activeCategory === cat
                  ? 'bg-luxury-gold text-black border-transparent shadow-[0_15px_30px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-luxury-pink/40 hover:text-white'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>
      </nav>

      {/* Product Grid */}
      <section
        className="px-4 sm:px-6 mt-4 lg:px-12 max-w-7xl mx-auto"
        aria-label="Products"
      >
        {filteredBags.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-10"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            role="grid"
          >
            {filteredBags.map((bag, idx) => (
              <div key={bag.id} role="gridcell">
                <ProductCard
                  product={bag}
                  index={idx}
                  onClick={() => onNavigate('product', bag)}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20" role="status" aria-live="polite">
            <div className="w-20 h-20 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-luxury-gold opacity-50" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">No masterpieces found</h3>
            <p className="text-zinc-500 font-medium">Try adjusting your selection or search.</p>
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed onProductClick={(product) => onNavigate('product', product)} />
    </motion.div>
  );
};
