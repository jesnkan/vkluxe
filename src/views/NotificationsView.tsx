import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Package, Heart, ShoppingBag } from 'lucide-react';
import type { NotificationItem } from '../types';

const notifications: NotificationItem[] = [
  {
    icon: Sparkles,
    title: 'Atelier Invitation',
    content: 'Our new Winter Masterpiece collection is now available for private viewing.',
    time: '2h ago',
    unread: true,
  },
  {
    icon: Package,
    title: 'Dispatch Confirmed',
    content: 'Your Heritage Satchel has been verified and is now in transit.',
    time: '5h ago',
    unread: true,
  },
  {
    icon: Heart,
    title: 'Style Match',
    content: 'The Lux AI Concierge found a piece that matches your recent favorites.',
    time: '1d ago',
    unread: false,
  },
  {
    icon: ShoppingBag,
    title: 'Acquisition Reminder',
    content: 'The Midnight Tote in your boutique bag is in high demand.',
    time: '2d ago',
    unread: false,
  },
];

export const NotificationsView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="px-5 pt-10 pb-40 lg:px-12 max-w-4xl mx-auto min-h-[80dvh]"
    >
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
          Notifications
        </h2>
        <button className="text-luxury-gold font-bold text-sm uppercase tracking-widest hover:text-luxury-pink transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
              item.unread
                ? 'glass-card border-luxury-gold/30 shadow-luxury-gold/5'
                : 'bg-white/40 dark:bg-white/2 border-white/5 opacity-70'
            }`}
          >
            <div className="flex gap-5">
              <div
                className={`p-4 rounded-2xl h-fit ${
                  item.unread
                    ? 'bg-luxury-gold/10 text-luxury-gold'
                    : 'bg-zinc-500/10 text-zinc-500'
                }`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-gray-900 dark:text-white group-hover:text-luxury-gold transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-xs font-bold text-zinc-500">{item.time}</span>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                  {item.content}
                </p>
              </div>
              {item.unread && (
                <div className="w-2 h-2 bg-luxury-pink rounded-full self-center"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
