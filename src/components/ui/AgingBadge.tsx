'use client';

import React from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { calculateAgingDays, getAgingLevel, cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export interface AgingBadgeProps {
  appliedDate: Date | string;
  showText?: boolean;
  className?: string;
}

export function AgingBadge({ appliedDate, showText = true, className }: AgingBadgeProps) {
  const { t, locale } = useI18n();
  const dateObj = typeof appliedDate === 'string' ? new Date(appliedDate) : appliedDate;
  const days = calculateAgingDays(dateObj);
  const level = getAgingLevel(days);

  const freshLabel = days === 0 ? t('aging.today') : `${days} ${t('aging.daysAbbrev')}`;

  const levelConfigs = {
    fresh: {
      colorClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      icon: Clock,
      label: freshLabel,
      title: `${t('aging.fresh')} (${days} ${t('aging.daysAgo')})`,
    },
    warning: {
      colorClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
      icon: AlertCircle,
      label: `${days} ${t('aging.daysAbbrev')} (${t('aging.warning')})`,
      title: `${t('aging.warning')} (${days} ${t('aging.daysNoUpdate')})`,
    },
    danger: {
      colorClass: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
      icon: AlertTriangle,
      label: `${days} ${t('aging.daysAbbrev')} (${t('aging.danger')})`,
      title: `${t('aging.danger')} (${days} ${t('aging.daysNoResponse')})`,
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
