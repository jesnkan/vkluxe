import type React from 'react';

// --- Types ---
export type ViewState = 'home' | 'product' | 'cart' | 'checkout' | 'search' | 'profile' | 'checkout-success' | 'concierge' | 'notifications' | 'admin';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors: string[];
  rating: number;
  reviews: number;
  category: string;
  description: string;
  stock: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface Promotion {
  heroTitle: string;
  heroGradient: string;
  heroDescription: string;
  heroImage: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: 'Elite' | 'Member' | string;
  orders: number;
}

export interface NavItem {
  id: ViewState;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

export interface NotificationItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  time: string;
  unread: boolean;
}
