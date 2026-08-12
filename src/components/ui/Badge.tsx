'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  // Status lamaran
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'ghosted'
  // Aging alert
  | 'fresh'
  | 'warning'
  | 'danger'
  // General/Neutral
  | 'default'
  | 'accent';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
  applied: {
    bg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  interview: {
    bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    dot: 'bg-amber-500 dark:bg-amber-400 animate-pulse',
  },
  offer: {
    bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  rejected: {
    bg: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30',
    dot: 'bg-red-500 dark:bg-red-400',
  },
  ghosted: {
    bg: 'bg-gray-500/15 text-slate-700 dark:text-gray-300 border-gray-500/30',
    dot: 'bg-slate-500 dark:bg-gray-400',
  },
  fresh: {
    bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  warning: {
    bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  danger: {
    bg: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30',
    dot: 'bg-red-500 dark:bg-red-400 animate-ping',
  },
  default: {
    bg: 'bg-[var(--glass-surface-strong)] text-[var(--text-secondary)] border-[var(--glass-border)]',
    dot: 'bg-[var(--text-muted)]',
  },
  accent: {
    bg: 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/30',
    dot: 'bg-[var(--accent-primary)]',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
  md: 'text-sm px-2.5 py-1 gap-2 font-semibold',
};

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border backdrop-blur-sm transition-colors cursor-default select-none',
        styles.bg,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={cn('inline-flex rounded-full h-2 w-2', styles.dot)} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
