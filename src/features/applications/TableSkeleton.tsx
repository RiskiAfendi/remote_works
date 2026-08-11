'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Skeleton Loader khusus untuk ApplicationTable.
 * Memiliki bentuk yang persis mirip dengan tabel dan card lamaran asli.
 */
export function TableSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Title Header Skeleton */}
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-4 w-32 rounded-md hidden sm:block" />
      </div>

      {/* Desktop Table View Skeleton */}
      <div className="hidden md:block overflow-hidden rounded-2xl glass-panel border border-[var(--glass-border)] shadow-xl">
        <div className="p-4 border-b border-[var(--glass-border)] bg-[var(--glass-surface-strong)] flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="divide-y divide-[var(--glass-border)] p-2 space-y-2">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex items-center justify-between p-4 gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <Skeleton className="h-4 w-28 shrink-0" />
              <Skeleton className="h-4 w-24 shrink-0" />
              <Skeleton className="h-6 w-20 rounded-full shrink-0" />
              <Skeleton className="h-6 w-24 rounded-full shrink-0" />
              <div className="flex gap-2 shrink-0">
                <Skeleton variant="circular" className="w-8 h-8" />
                <Skeleton variant="circular" className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="block md:hidden space-y-3">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="glass-panel p-4 space-y-3 border border-[var(--glass-border)] rounded-2xl">
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-2/3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="pt-2 border-t border-[var(--glass-border)] flex justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
