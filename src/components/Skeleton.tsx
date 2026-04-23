import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ repeat: Infinity, duration: 1.5 }}
    className={`bg-gray-200 dark:bg-white/10 rounded-xl ${className}`}
  />
);

export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col h-full">
    <div className="relative aspect-[4/5] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden mb-4">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="px-1">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

export const CartItemSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-white/5 rounded-[2rem] p-4 sm:p-6 flex gap-5 sm:gap-8 items-center border border-gray-100 dark:border-white/5">
    <Skeleton className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl shrink-0" />
    <div className="flex-1 min-w-0 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-20" />
    </div>
    <div className="flex flex-col items-end gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>
  </div>
);

export const ProductDetailSkeleton: React.FC = () => (
  <div className="pb-40 sm:pb-12">
    <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:mt-12">
      <Skeleton className="relative w-full aspect-[4/5] sm:aspect-square bg-gray-100 dark:bg-zinc-900 sm:rounded-[3rem]" />
      <div className="px-5 pt-8 sm:pt-10 lg:pt-4 space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);
