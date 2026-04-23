import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product, Promotion } from '../types';

export const CATEGORIES = ['All', 'Satchel', 'Briefcase', 'Purse', 'Backpack', 'Tote'];

interface ProductState {
  catalog: Product[];
  promotions: Promotion;
  activeCategory: string;
  searchQuery: string;
  selectedProduct: Product | null;
  isLoading: boolean;

  // Actions
  initCatalog: () => Promise<void>;
  initPromotions: () => Promise<void>;
  updateProduct: (id: number, field: keyof Product, value: string | number) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  decrementStock: (id: number, quantity: number) => Promise<void>;
  setPromotions: (promotions: Promotion) => Promise<void>;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (product: Product | null) => void;

  // Computed
  getFilteredProducts: () => Product[];
}

const DEFAULT_PROMOTIONS: Promotion = {
  heroTitle: "Timeless",
  heroGradient: "Artistry",
  heroDescription: "Experience a symphony of pure gold accents and midnight aesthetics.",
  heroImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800"
};

export const useProductStore = create<ProductState>((set, get) => ({
  catalog: [],
  promotions: DEFAULT_PROMOTIONS,
  activeCategory: 'All',
  searchQuery: '',
  selectedProduct: null,
  isLoading: false,

  initCatalog: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching catalog:', error);
    } else {
      // Map Supabase snake_case to camelCase if necessary, but I used camelCase in DDL mostly, 
      // wait, DDL uses snake_case by default in Postgres if not quoted. 
      // Let's check my DDL: it has original_price, created_at.
      const mappedData = data?.map((item: any) => ({
        ...item,
        originalPrice: item.original_price,
      })) as Product[];
      set({ catalog: mappedData || [] });
    }
    set({ isLoading: false });
  },

  initPromotions: async () => {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching promotions:', error);
    } else {
      const mappedData = {
        heroTitle: data.hero_title,
        heroGradient: data.hero_gradient,
        heroDescription: data.hero_description,
        heroImage: data.hero_image,
      } as Promotion;
      set({ promotions: mappedData });
    }
  },

  updateProduct: async (id, field, value) => {
    const dbField = field === 'originalPrice' ? 'original_price' : field;
    const { error } = await supabase
      .from('products')
      .update({ [dbField]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
    } else {
      set((state) => ({
        catalog: state.catalog.map((bag) =>
          bag.id === id ? { ...bag, [field]: value } : bag
        ),
      }));
    }
  },

  addProduct: async (product) => {
    const { error } = await supabase
      .from('products')
      .insert([{
        id: product.id,
        name: product.name,
        price: product.price,
        original_price: product.originalPrice,
        image: product.image,
        colors: product.colors,
        rating: product.rating,
        reviews: product.reviews,
        category: product.category,
        description: product.description,
        stock: product.stock
      }]);

    if (error) {
      console.error('Error adding product:', error);
    } else {
      set((state) => ({
        catalog: [...state.catalog, product],
      }));
    }
  },

  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      set((state) => ({
        catalog: state.catalog.filter((bag) => bag.id !== id),
      }));
    }
  },

  decrementStock: async (id, quantity) => {
    const { error } = await supabase.rpc('decrement_product_stock', {
      product_id_param: id,
      quantity_param: quantity,
    });

    if (error) {
      console.error('Error decrementing stock:', error);
    } else {
      set((state) => ({
        catalog: state.catalog.map((bag) =>
          bag.id === id ? { ...bag, stock: Math.max(0, bag.stock - quantity) } : bag
        ),
      }));
    }
  },

  setPromotions: async (promotions) => {
    const { error } = await supabase
      .from('promotions')
      .update({
        hero_title: promotions.heroTitle,
        hero_gradient: promotions.heroGradient,
        hero_description: promotions.heroDescription,
        hero_image: promotions.heroImage,
      })
      .eq('id', 1);

    if (error) {
      console.error('Error setting promotions:', error);
    } else {
      set({ promotions });
    }
  },

  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  getFilteredProducts: () => {
    const { catalog, activeCategory, searchQuery } = get();
    return catalog.filter((bag) => {
      const matchesCategory = activeCategory === 'All' || bag.category === activeCategory;
      const matchesSearch = bag.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  },
}));
