'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  gradientColor?: string; // e.g. "from-accent-400 to-accent-600"
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  gradientColor = 'from-[var(--accent-primary)] to-[var(--color-accent-600)]',
  onClick,
  className,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card glass-noise relative overflow-hidden p-5 md:p-6 transition-all duration-300',
        'hover-lift cursor-default',
        onClick && 'cursor-pointer active-press',
        className
      )}
    >
      {/* Top accent bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r rounded-t-[var(--radius-card)]',
          gradientColor
        )}
      />

      <div className="relative z-10 space-y-3">
        {/* Header row: title & icon */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            {title}
          </p>
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-[var(--glass-surface-strong)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent-primary)] shadow-sm shrink-0">
              {icon}
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className="space-y-1">
          <p className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {value}
          </p>

          {/* Subtitle / Trend */}
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 text-xs">
              {trend && (
                <span
                  className={cn(
                    'font-semibold px-1.5 py-0.5 rounded-md',
                    trend.isPositive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/15 text-red-400 border border-red-500/20'
                  )}
                >
                  {trend.value}
                </span>
              )}
              {subtitle && (
                <span className="text-[var(--text-muted)] font-medium">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
