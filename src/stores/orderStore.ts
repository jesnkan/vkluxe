import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  
  // Actions
  initOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  
  // Computed
  getTotalRevenue: () => number;
  getPendingOrdersCount: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,

  initOrders: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      const mappedOrders = data?.map((order: any) => ({
        id: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        total: order.total,
        status: order.status,
        date: order.date,
        items: order.order_items.map((item: any) => ({
          ...item.products,
          id: item.product_id,
          quantity: item.quantity,
          selectedColor: item.selected_color,
          price: item.price
        }))
      })) as Order[];
      set({ orders: mappedOrders || [] });
    }
    set({ isLoading: false });
  },

  updateOrderStatus: async (id, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating order status:', error);
    } else {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, status } : order
        ),
      }));
    }
  },

  addOrder: async (order) => {
    // 1. Insert Order
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{
        id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        total: order.total,
        status: order.status,
        date: order.date
      }]);

    if (orderError) {
      console.error('Error adding order:', orderError);
      return;
    }

    // 2. Insert Order Items
    const orderItems = order.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      selected_color: item.selectedColor,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error adding order items:', itemsError);
    } else {
      set((state) => ({
        orders: [order, ...state.orders],
      }));
    }
  },

  getTotalRevenue: () => {
    return get().orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0);
  },

  getPendingOrdersCount: () => {
    return get().orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  },
}));
