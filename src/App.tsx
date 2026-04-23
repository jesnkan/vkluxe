import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { TopNav, BottomNav, ToastContainer } from './components';
import { 
  HomeView, 
  SearchView, 
  ConciergeView, 
  NotificationsView, 
  AdminView, 
  ProductDetailsView, 
  CartView, 
  ProfileView, 
  CheckoutSuccessView,
  CheckoutView,
  LoginView
} from './views';
import { useUIStore, useProductStore, useAuthStore } from './stores';
import type { Product, ViewState } from './types';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { initPreferences } = useUIStore();
  const { setSelectedProduct, initCatalog, initPromotions } = useProductStore();
  const { session, isAdmin, initialize: initAuth, isLoading: authLoading } = useAuthStore();

  // Initialize theme, system preferences, and fetch store data from Supabase
  useEffect(() => {
    initPreferences();
    initCatalog();
    initPromotions();
    initAuth();
  }, [initPreferences, initCatalog, initPromotions, initAuth]);

  const currentPath = location.pathname.split('/')[1] || 'home';

  // Update document title for SEO/UX
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'VK Luxe | Discover Luxury Masterpieces',
      search: 'Search Boutique | VK Luxe',
      concierge: 'AI Concierge | VK Luxe Atelier',
      notifications: 'Notifications | VK Luxe',
      admin: 'Atelier Control | Management',
      product: 'Masterpiece Details | VK Luxe',
      cart: 'Boutique Bag | VK Luxe',
      checkout: 'Secure Acquisition | VK Luxe',
      profile: 'Client Profile | VK Luxe',
      'checkout-success': 'Acquisition Complete | VK Luxe'
    };
    document.title = titles[currentPath] || 'VK Luxe | Luxury Boutique';
  }, [currentPath]);

  const navigateTo = (view: ViewState, product?: Product) => {
    if (product) setSelectedProduct(product);
    
    if (view === 'home') navigate('/');
    else navigate(`/${view}`);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-zinc-50 font-sans selection:bg-luxury-pink/30 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-mesh opacity-40 dark:opacity-100 pointer-events-none z-0"></div>
      
      <div className="relative z-10">
        <TopNav 
          currentView={currentPath as any} 
          onNavigate={navigateTo} 
        />
        
        <main className="min-h-[calc(100dvh-80px)]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomeView onNavigate={navigateTo} onSearchFocus={() => navigateTo('search')} />} />
              <Route path="/search" element={<SearchView onNavigate={navigateTo} />} />
              <Route path="/concierge" element={<ConciergeView />} />
              <Route path="/notifications" element={<NotificationsView />} />
              <Route 
                path="/admin" 
                element={
                  authLoading ? (
                    <div className="min-h-[80vh] flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin" />
                    </div>
                  ) : (session && isAdmin) ? (
                    <AdminView />
                  ) : (
                    <LoginView />
                  )
                } 
              />
              <Route path="/product" element={<ProductDetailsView onNavigate={navigateTo} />} />
              <Route path="/cart" element={<CartView onNavigate={navigateTo} />} />
              <Route path="/checkout" element={<CheckoutView onNavigate={navigateTo} />} />
              <Route path="/profile" element={<ProfileView onNavigate={navigateTo} />} />
              <Route path="/checkout-success" element={<CheckoutSuccessView onNavigate={navigateTo} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        {currentPath !== 'product' && currentPath !== 'checkout' && (
          <BottomNav currentView={currentPath as any} onNavigate={navigateTo} />
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
