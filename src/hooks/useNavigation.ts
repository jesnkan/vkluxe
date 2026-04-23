import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';
import { useProductStore } from '../stores/productStore';
import type { ViewState, Product } from '../types';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentView } = useUIStore();
  const { setSelectedProduct, setSearchQuery } = useProductStore();

  const currentPath = location.pathname.split('/')[1] || 'home';
  const currentView = currentPath as ViewState;

  const navigateTo = useCallback(
    (view: ViewState, product?: Product) => {
      setCurrentView(view);

      if (view === 'home') {
        navigate('/');
      } else {
        navigate(`/${view}`);
      }

      if (product) {
        setSelectedProduct(product);
      }

      // Clear search when navigating away from search
      if (view !== 'search') {
        setSearchQuery('');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate, setCurrentView, setSelectedProduct, setSearchQuery]
  );

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    currentView,
    navigateTo,
    goBack,
  };
};
