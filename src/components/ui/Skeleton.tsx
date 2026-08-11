'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

/**
 * Komponen Skeleton untuk placeholder memuat data.
 * Memiliki efek pulse & shimmer Liquid Glass yang mirip dengan konten aslinya.
 */
export function Skeleton({ className, variant = 'text', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[var(--glass-surface-strong)]/60 animate-pulse border border-[var(--glass-border)]/50',
        variant === 'text' && 'h-4 w-full rounded-md',
        variant === 'circular' && 'rounded-full shrink-0',
        variant === 'rectangular' && 'rounded-xl w-full h-full',
        variant === 'card' && 'rounded-2xl w-full p-4 glass-panel',
        className
      )}
      {...props}
    >
      {/* Shimmer Highlight Light Pass */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
