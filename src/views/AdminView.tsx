import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Sparkles, 
  User, 
  MapPin, 
  Plus, 
  Trash2, 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Search,
  ChevronRight,
  Edit2,
  LogOut
} from 'lucide-react';
import { useProductStore, CATEGORIES } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useUserStore } from '../stores/userStore';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import type { Product, Order } from '../types';
import { Button } from '../components';

type AdminTab = 'dashboard' | 'orders' | 'inventory' | 'promotions' | 'users' | 'logistics';

const tabs = [
  { id: 'dashboard' as AdminTab, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders' as AdminTab, icon: ShoppingBag, label: 'Orders' },
  { id: 'inventory' as AdminTab, icon: Package, label: 'Inventory' },
  { id: 'users' as AdminTab, icon: User, label: 'Clients' },
  { id: 'promotions' as AdminTab, icon: Sparkles, label: 'Marketing' },
  { id: 'logistics' as AdminTab, icon: MapPin, label: 'Settings' },
];

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { catalog, promotions, setPromotions, updateProduct, addProduct, deleteProduct, initCatalog } = useProductStore();
  const { shippingFee, setShippingFee } = useCartStore();
  const { users } = useUserStore();
  const { orders, updateOrderStatus, getTotalRevenue, getPendingOrdersCount, initOrders } = useOrderStore();
  const { signOut } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch fresh data for admin
  React.useEffect(() => {
    initCatalog();
    initOrders();
  }, [initCatalog, initOrders]);

  // --- Dashboard Metrics ---
  const metrics = useMemo(() => [
    { label: 'Total Revenue', value: `₵${getTotalRevenue().toLocaleString()}`, icon: BarChart, color: 'text-luxury-gold', bg: 'bg-luxury-gold/10' },
    { label: 'Active Orders', value: getPendingOrdersCount(), icon: Clock, color: 'text-luxury-pink', bg: 'bg-luxury-pink/10' },
    { label: 'Total Pieces', value: catalog.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Elite Clients', value: users.filter(u => u.status === 'Elite').length, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
  ], [getTotalRevenue, getPendingOrdersCount, catalog, users]);

  const handleAddBag = () => {
    const newBag: Product = {
      id: Math.max(...catalog.map((b) => b.id), 0) + 1,
      name: 'New Masterpiece',
      price: 1000,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
      colors: ['#000000'],
      rating: 5.0,
      reviews: 0,
      category: 'Purse',
      description: 'A new exquisite addition to the atelier.',
      stock: 5
    };
    addProduct(newBag);
  };

  const handleDeleteBag = (id: number) => {
    if (confirm('Verify: Are you sure you want to remove this piece from the atelier?')) {
      deleteProduct(id);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return Clock;
      case 'Processing': return Edit2;
      case 'Shipped': return Truck;
      case 'Delivered': return CheckCircle2;
      case 'Cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="px-5 pt-10 pb-40 lg:px-12 max-w-7xl mx-auto min-h-[80vh]"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter font-serif italic mb-2">
            Atelier Control
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">Boutique Management Systems v1.0</p>
            <button 
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
        <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-luxury-gold text-black shadow-lg translate-y-[-2px]'
                  : 'text-zinc-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((m, i) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between">
                  <div className={`${m.bg} ${m.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1">{m.label}</div>
                    <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{m.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="glass-card p-8 rounded-[3rem] border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-serif italic">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-luxury-gold font-bold text-sm flex items-center gap-1 hover:underline">View All <ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                           {React.createElement(getStatusIcon(order.status), { className: "w-5 h-5" })}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{order.customerName}</div>
                          <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{order.id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-luxury-pink text-sm">₵{order.total}</div>
                        <div className="text-[10px] text-zinc-500 font-bold">{order.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8 rounded-[3rem] border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-serif italic">Low Stock Alert</h3>
                  <button onClick={() => setActiveTab('inventory')} className="text-luxury-gold font-bold text-sm flex items-center gap-1 hover:underline">Inventory <ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  {catalog.filter(p => p.stock < 10).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{p.name}</div>
                          <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{p.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-red-500 text-sm">{p.stock} left</div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Restock Needed</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
               <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight font-serif italic">Acquisition Management</h3>
               <div className="relative w-full sm:w-72 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-luxury-gold" />
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-luxury-gold transition-all text-sm"
                  />
               </div>
            </div>

            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Manifest ID</th>
                      <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Client</th>
                      <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Status</th>
                      <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Total</th>
                      <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-6 px-8 font-bold text-gray-900 dark:text-white text-sm tracking-widest uppercase">{order.id}</td>
                        <td className="py-6 px-8">
                           <div className="font-bold text-gray-900 dark:text-white text-sm">{order.customerName}</div>
                           <div className="text-xs text-zinc-500">{order.customerEmail}</div>
                        </td>
                        <td className="py-6 px-8">
                           <select 
                             value={order.status}
                             onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                             className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-luxury-gold appearance-none cursor-pointer"
                           >
                              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                <option key={s} value={s} className="bg-white dark:bg-black">{s}</option>
                              ))}
                           </select>
                        </td>
                        <td className="py-6 px-8 font-black text-luxury-pink">₵{order.total.toLocaleString()}</td>
                        <td className="py-6 px-8">
                           <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-500 hover:text-luxury-gold">
                              <ChevronRight className="w-5 h-5" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight font-serif italic">Masterpiece Catalog</h3>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-luxury-gold" />
                  <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-luxury-gold transition-all text-sm"
                  />
                </div>
                <button
                  onClick={handleAddBag}
                  className="px-6 py-3 bg-luxury-gold text-black rounded-xl font-black flex items-center gap-2 hover:bg-luxury-pink hover:text-white transition-all shadow-xl whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" /> New Piece
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {catalog.map((bag) => (
                <div
                  key={bag.id}
                  className="glass-card p-6 rounded-[2.5rem] border-white/5 flex flex-col sm:flex-row items-center gap-8 group transition-all hover:border-luxury-gold/20"
                >
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 border border-white/10 shadow-2xl">
                    <img src={bag.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                    <div className="md:col-span-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Name</label>
                      <input
                        type="text"
                        value={bag.name}
                        onChange={(e) => updateProduct(bag.id, 'name', e.target.value)}
                        className="bg-transparent text-gray-900 dark:text-white font-bold border-b border-transparent focus:border-luxury-gold outline-none w-full text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Price (₵)</label>
                      <input
                        type="number"
                        value={bag.price}
                        onChange={(e) => updateProduct(bag.id, 'price', parseInt(e.target.value))}
                        className="bg-transparent text-luxury-pink font-black border-b border-transparent focus:border-luxury-gold outline-none w-full text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Stock Level</label>
                      <input
                        type="number"
                        value={bag.stock}
                        onChange={(e) => updateProduct(bag.id, 'stock', parseInt(e.target.value))}
                        className={`bg-transparent font-black border-b border-transparent focus:border-luxury-gold outline-none w-full text-lg ${bag.stock < 5 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Category</label>
                      <select
                        value={bag.category}
                        onChange={(e) => updateProduct(bag.id, 'category', e.target.value)}
                        className="bg-transparent text-gray-900 dark:text-white font-bold border-b border-transparent focus:border-luxury-gold outline-none w-full appearance-none py-1"
                      >
                        {CATEGORIES.slice(1).map((c) => (
                          <option key={c} value={c} className="bg-white dark:bg-black">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDeleteBag(bag.id)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <motion.div
            key="promotions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 max-w-2xl"
          >
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight font-serif italic mb-8">
              Atelier Presentation
            </h3>

            <div className="space-y-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 block mb-3">Hero Title</label>
                  <input
                    type="text"
                    value={promotions.heroTitle}
                    onChange={(e) => setPromotions({ ...promotions, heroTitle: e.target.value })}
                    className="w-full bg-white dark:bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-luxury-gold text-gray-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 block mb-3">Hero Gradient Highlight</label>
                  <input
                    type="text"
                    value={promotions.heroGradient}
                    onChange={(e) => setPromotions({ ...promotions, heroGradient: e.target.value })}
                    className="w-full bg-white dark:bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-luxury-gold text-luxury-pink font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 block mb-3">Description</label>
                  <textarea
                    value={promotions.heroDescription}
                    onChange={(e) => setPromotions({ ...promotions, heroDescription: e.target.value })}
                    rows={4}
                    className="w-full bg-white dark:bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-luxury-gold text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 block mb-3">Background Image URL</label>
                  <input
                    type="text"
                    value={promotions.heroImage}
                    onChange={(e) => setPromotions({ ...promotions, heroImage: e.target.value })}
                    className="w-full bg-white dark:bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-luxury-gold text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight font-serif italic mb-8">Client Ledger</h3>
            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Client</th>
                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Status</th>
                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Acquisitions</th>
                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-8 px-8">
                        <div className="font-bold text-gray-900 dark:text-white text-base">{u.name}</div>
                        <div className="text-xs text-zinc-500">{u.email}</div>
                      </td>
                      <td className="py-8 px-8">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                            u.status === 'Elite'
                              ? 'bg-luxury-gold/20 text-luxury-gold'
                              : 'bg-zinc-500/20 text-zinc-500'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-8 px-8 font-black text-gray-900 dark:text-white text-lg">{u.orders} Pieces</td>
                      <td className="py-8 px-8">
                        <button className="text-luxury-pink font-black text-xs hover:underline uppercase tracking-widest">Manage Access</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Logistics Tab */}
        {activeTab === 'logistics' && (
          <motion.div
            key="logistics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight font-serif italic mb-8">
              Atelier Logistics
            </h3>

            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl">
              <div className="glass-card p-10 rounded-[3rem] border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 text-luxury-gold flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white font-black text-xl tracking-tight leading-tight">Priority White-Glove</div>
                    <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Delivery Surcharge</div>
                  </div>
                </div>
                
                <div className="space-y-6">
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-luxury-gold text-2xl">₵</span>
                      <input
                        type="number"
                        value={shippingFee}
                        onChange={(e) => setShippingFee(parseFloat(e.target.value))}
                        className="w-full bg-white dark:bg-white/5 p-6 pl-12 rounded-2xl border border-white/10 outline-none focus:border-luxury-gold text-3xl font-black text-luxury-gold shadow-inner"
                      />
                   </div>
                   <p className="text-sm text-zinc-500 font-medium leading-relaxed italic">
                      "Excellence in dispatch is the final hallmark of luxury." This fee covers specialized transit and courier-verified delivery.
                   </p>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[3rem] border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white font-black text-xl tracking-tight leading-tight">Stock Thresholds</div>
                    <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Automation Settings</div>
                  </div>
                </div>
                
                <div className="space-y-6">
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span className="text-zinc-400 font-bold">Low Stock Warning</span>
                      <span className="font-black text-gray-900 dark:text-white">5 Pieces</span>
                   </div>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between opacity-50">
                      <span className="text-zinc-400 font-bold">Auto-Restock Email</span>
                      <span className="text-xs uppercase font-black tracking-widest">Disabled</span>
                   </div>
                   <Button variant="primary" size="sm" className="w-full opacity-50 cursor-not-allowed">Update Configurations</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
