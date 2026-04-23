import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
  favorites: number[];
  users: User[];
  currentUser: User | null;
  recentlyViewed: number[];

  // Actions
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  addToRecentlyViewed: (id: number) => void;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
}

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Vanessa K.', email: 'vanessa@luxe.com', status: 'Elite', orders: 12 },
  { id: 2, name: 'Marcus D.', email: 'marcus@gold.com', status: 'Member', orders: 4 },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      favorites: [1, 2],
      users: INITIAL_USERS,
      currentUser: INITIAL_USERS[0],
      recentlyViewed: [],

      toggleFavorite: (id) => {
        set((state) => {
          const isFav = state.favorites.includes(id);
          return {
            favorites: isFav
              ? state.favorites.filter((f) => f !== id)
              : [...state.favorites, id],
          };
        });
      },

      isFavorite: (id) => get().favorites.includes(id),

      addToRecentlyViewed: (id) => {
        set((state) => ({
          recentlyViewed: [id, ...state.recentlyViewed.filter((rid) => rid !== id)].slice(0, 10),
        }));
      },

      setUsers: (users) => set({ users }),
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: 'vkluxe-user-storage',
    }
  )
);
