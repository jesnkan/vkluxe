import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useProductStore, CATEGORIES } from '../stores/productStore';
import type { Product, ViewState } from '../types';

interface SearchViewProps {
  onNavigate: (view: ViewState, product?: Product) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onNavigate }) => {
  const { searchQuery, setSearchQuery, setActiveCategory, getFilteredProducts } = useProductStore();
  const filteredBags = getFilteredProducts();

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    onNavigate('home');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="px-4 sm:px-6 mt-8 lg:px-12 max-w-7xl mx-auto min-h-[80dvh]"
      role="main"
      aria-label="Search"
    >
      <div aria-live="polite" className="sr-only">
        {searchQuery ? `${filteredBags.length} results found for ${searchQuery}` : ''}
      </div>

      <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-8">
          Search Boutique
        </h2>
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-500 group-focus-within:text-luxury-gold transition-colors" />
          <input
            autoFocus
            type="text"
            placeholder="Searching for luxury..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-[1.5rem] py-6 pl-16 pr-6 outline-none border border-gray-100 dark:border-white/10 focus:border-luxury-gold/50 focus:ring-8 focus:ring-luxury-gold/5 transition-all placeholder:text-zinc-500 text-xl shadow-2xl"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">
          Trending Collections
        </h3>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.slice(1).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="px-6 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-luxury-gold hover:text-black transition-all font-bold text-gray-600 dark:text-zinc-300"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {!searchQuery && (
        <div className="mt-16">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">
            Suggested for You
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getFilteredProducts().slice(0, 4).map((bag) => (
              <div
                key={bag.id}
                onClick={() => onNavigate('product', bag)}
                className="cursor-pointer group"
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-zinc-900 border border-white/5">
                  <img
                    src={bag.image}
                    alt={bag.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-luxury-gold transition-colors text-sm">
                  {bag.name}
                </h4>
                <p className="text-luxury-pink font-black text-sm">₵{bag.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight font-serif">
            Results for "{searchQuery}"
          </h3>
          {filteredBags.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBags.map((bag) => (
                <div
                  key={bag.id}
                  onClick={() => onNavigate('product', bag)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-zinc-900">
                    <img
                      src={bag.image}
                      alt={bag.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-luxury-gold transition-colors">
                    {bag.name}
                  </h4>
                  <p className="text-luxury-pink font-black">₵{bag.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-500">No masterpieces found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SearchView;
