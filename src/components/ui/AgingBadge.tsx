'use client';

import React from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { calculateAgingDays, getAgingLevel, cn } from '@/lib/utils';

export interface AgingBadgeProps {
  appliedDate: Date | string;
  showText?: boolean;
  className?: string;
}

export function AgingBadge({ appliedDate, showText = true, className }: AgingBadgeProps) {
  const dateObj = typeof appliedDate === 'string' ? new Date(appliedDate) : appliedDate;
  const days = calculateAgingDays(dateObj);
  const level = getAgingLevel(days);

  const levelConfigs = {
    fresh: {
      colorClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: Clock,
      label: days === 0 ? 'Hari ini' : days === 1 ? '1 hari' : `${days} hr`,
      title: `Lamaran baru (${days} hari yang lalu)`,
    },
    warning: {
      colorClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: AlertCircle,
      label: `${days} hr (Follow-up)`,
      title: `Lamaran perlu di-follow up (${days} hari tanpa kabar)`,
    },
    danger: {
      colorClass: 'bg-red-500/15 text-red-400 border-red-500/30',
      icon: AlertTriangle,
      label: `${days} hr (Ghosting?)`,
      title: `Potensi ghosting tinggi (${days} hari tanpa respon)`,
    },
  };

  const config = levelConfigs[level];
  const IconComponent = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200 shadow-sm',
        config.colorClass,
        className
      )}
      title={config.title}
    >
      <IconComponent size={12} className="shrink-0" />
      {showText && <span>{config.label}</span>}
    </span>
  );
}

export default AgingBadge;
