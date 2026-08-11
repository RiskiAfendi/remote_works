'use client';

import React from 'react';
import { SearchX, FileX2, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  type?: 'noData' | 'noResults';
  onAction?: () => void;
  actionText?: string;
  className?: string;
}

export function EmptyState({
  type = 'noData',
  onAction,
  actionText,
  className,
}: EmptyStateProps) {
  const { t } = useI18n();

  const isNoResults = type === 'noResults';

  return (
    <div
      className={cn(
        'glass-panel p-8 sm:p-14 md:p-16 flex flex-col items-center justify-center text-center space-y-6 border border-[var(--glass-border)] rounded-3xl shadow-2xl relative overflow-hidden',
        className
      )}
    >
      {/* Dynamic Background Glow effect */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Glass Illustration / Icon Container */}
      <div className="relative group cursor-pointer">
        <div className="absolute -inset-2 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[var(--bg-elevated)]/80 border border-[var(--glass-border-strong)] backdrop-blur-2xl flex items-center justify-center shadow-2xl text-[var(--accent-primary)] group-hover:scale-105 transition-transform duration-300">
          {isNoResults ? (
            <SearchX size={48} className="animate-pulse" />
          ) : (
            <FileX2 size={48} className="animate-pulse" />
          )}

          {/* Decorative Floating Sparkle Badge */}
          <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[var(--glass-surface-strong)] border border-[var(--glass-border)] text-amber-400 shadow-md">
            <Sparkles size={16} />
          </div>
        </div>
      </div>

      {/* Text Info */}
      <div className="space-y-2 max-w-md">
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          {isNoResults
            ? t('empty.noResultsTitle', { defaultValue: 'Tidak Ada Data yang Cocok' })
            : t('empty.noDataTitle', { defaultValue: 'Belum Ada Lamaran Kerja' })}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {isNoResults
            ? t('empty.noResultsMessage', {
                defaultValue:
                  'Tidak ada lamaran yang memenuhi kriteria kata kunci pencarian atau filter yang Anda terapkan.',
              })
            : t('empty.noDataMessage', {
                defaultValue:
                  'Catat dan pantau proses lamaran kerja remote Anda di sini. Mulai tambahkan lamaran pertama Anda sekarang!',
              })}
        </p>
      </div>

      {/* Action Button */}
      {onAction && (
        <div className="pt-2">
          <Button
            variant={isNoResults ? 'secondary' : 'primary'}
            size="md"
            onClick={onAction}
            leftIcon={isNoResults ? <RotateCcw size={16} /> : <Plus size={16} />}
            className="shadow-lg"
          >
            {actionText ||
              (isNoResults
                ? t('empty.resetFilters', { defaultValue: 'Reset Filter' })
                : t('application.addNew', { defaultValue: 'Tambah Lamaran' }))}
          </Button>
        </div>
      )}
    </div>
  );
}
