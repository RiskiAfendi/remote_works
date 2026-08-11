'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)] space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton variant="circular" className="w-10 h-10" />
          </div>
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-3 w-36 rounded-md" />
        </div>
      ))}
    </div>
  );
}
