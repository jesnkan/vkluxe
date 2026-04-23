import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewState } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  isDarkMode: boolean;
  isHighContrast: boolean;
  currentView: ViewState;
  isLoading: boolean;
  toasts: Toast[];

  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setCurrentView: (view: ViewState) => void;
  setLoading: (loading: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  initPreferences: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      isDarkMode: true,
      isHighContrast: false,
      currentView: 'home',
      isLoading: false,
      toasts: [],

      initPreferences: () => {
        // Detect system dark mode if no preference saved
        const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        const stored = localStorage.getItem('vkluxe-ui-storage');
        if (!stored) {
          get().setDarkMode(systemDarkMode);
        } else {
          // Re-apply stored preference to classList
          const { isDarkMode } = JSON.parse(stored).state;
          if (isDarkMode) document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }
        
        get().setHighContrast(systemHighContrast);

        // Listen for system changes
        window.matchMedia('(prefers-color-scheme: dark)').onchange = (e) => {
          if (!localStorage.getItem('vkluxe-ui-storage')) {
            get().setDarkMode(e.matches);
          }
        };
        
        window.matchMedia('(prefers-contrast: high)').onchange = (e) => {
          get().setHighContrast(e.matches);
        };
      },

      toggleDarkMode: () => {
        set((state) => {
          const newValue = !state.isDarkMode;
          if (newValue) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newValue };
        });
      },

      setDarkMode: (value) => {
        set({ isDarkMode: value });
        if (value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setHighContrast: (value) => {
        set({ isHighContrast: value });
        if (value) {
          document.documentElement.classList.add('high-contrast');
        } else {
          document.documentElement.classList.remove('high-contrast');
        }
      },

      setCurrentView: (view) => set({ currentView: view }),
      setLoading: (loading) => set({ isLoading: loading }),

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(7);
        const newToast = { ...toast, id, duration: toast.duration || 3000 };
        set((state) => ({ toasts: [...state.toasts, newToast] }));

        // Auto remove after duration
        setTimeout(() => {
          get().removeToast(id);
        }, newToast.duration);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'vkluxe-ui-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);
