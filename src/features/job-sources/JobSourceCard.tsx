'use client';

import React, { useState } from 'react';
import { ExternalLink, Edit3, Trash2, Eye, Mail, User, Globe, Copy, Check, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { JobSource } from '@/lib/types';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface JobSourceCardProps {
  source: JobSource;
  onEdit: (source: JobSource) => void;
  onDelete: (source: JobSource) => void;
  onViewDetail: (source: JobSource) => void;
}

export function JobSourceCard({ source, onEdit, onDelete, onViewDetail }: JobSourceCardProps) {
  const { t } = useI18n();
  const [imageError, setImageError] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Helper domain favicon URL
  const getFaviconUrl = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=128`;
    } catch {
      return '';
    }
  };

  const logoSrc = source.logo_url || (source.url ? getFaviconUrl(source.url) : '');

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!source.login_email) return;
    navigator.clipboard.writeText(source.login_email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Badges color configuration
  const paymentBadgeConfig = {
    IDR: {
      bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      label: t('jobSources.paymentIdr'),
    },
    International: {
      bg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
      label: t('jobSources.paymentIntl'),
    },
    Both: {
      bg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      label: t('jobSources.paymentBoth'),
    },
  }[source.payment_category] || {
    bg: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
    label: source.payment_category,
  };

  const regionBadgeConfig = {
    Indonesia: {
      bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      label: t('jobSources.regionIndo'),
    },
    International: {
      bg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      label: t('jobSources.regionIntl'),
    },
    Both: {
      bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      label: t('jobSources.regionBoth'),
    },
  }[source.region_category] || {
    bg: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
    label: source.region_category,
  };

  const statusBadgeConfig = {
    active: {
      bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      label: t('jobSources.statusActive'),
    },
    inactive: {
      bg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
      icon: XCircle,
      label: t('jobSources.statusInactive'),
    },
    suspended: {
      bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: ShieldAlert,
      label: t('jobSources.statusSuspended'),
    },
  }[source.status] || {
    bg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
    icon: CheckCircle2,
    label: source.status,
  };

  const StatusIcon = statusBadgeConfig.icon;

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-300',
        'bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)]',
        'border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/40',
        'shadow-md hover:shadow-xl hover:-translate-y-1'
      )}
    >
      {/* Top Section */}
      <div className="space-y-4">
        {/* Header: Logo, Name & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Logo Container */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/80 dark:bg-slate-800/80 p-2 shadow-sm border border-[var(--glass-border)]">
              {logoSrc && !imageError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoSrc}
                  alt={source.name}
                  className="h-full w-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-lg text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 rounded-lg">
                  {source.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Title & Website */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                  {source.name}
                </h3>
              </div>

              {source.url ? (
                <a
                  href={source.url.startsWith('http') ? source.url : `https://${source.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-primary)] hover:underline truncate mt-0.5"
                  title={source.url}
                >
                  <Globe size={12} className="shrink-0" />
                  <span className="truncate">{source.url.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink size={11} className="shrink-0 opacity-70" />
                </a>
              ) : (
                <span className="text-xs text-[var(--text-muted)] italic">No URL</span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0',
              statusBadgeConfig.bg
            )}
          >
            <StatusIcon size={12} />
            <span>{statusBadgeConfig.label}</span>
          </span>
        </div>

        {/* Category Badges (Payment & Region) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
              paymentBadgeConfig.bg
            )}
          >
            💳 {paymentBadgeConfig.label}
          </span>
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
              regionBadgeConfig.bg
            )}
          >
            🌐 {regionBadgeConfig.label}
          </span>
        </div>

        {/* Login Account Details */}
        <div className="space-y-2 rounded-xl bg-[var(--bg-base)]/60 p-3 text-xs border border-[var(--glass-border)]">
          {/* Email */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] truncate">
              <Mail size={13} className="shrink-0 text-[var(--accent-primary)]" />
              <span className="truncate">{source.login_email || '—'}</span>
            </div>
            {source.login_email && (
              <button
                onClick={handleCopyEmail}
                className="p-1 rounded-md hover:bg-[var(--glass-surface-strong)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                title={t('jobSources.copyEmail')}
              >
                {copiedEmail ? (
                  <Check size={13} className="text-emerald-500 animate-in zoom-in" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            )}
          </div>

          {/* Username / Profile link */}
          {source.account_username && (
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] truncate">
              <User size={13} className="shrink-0 text-[var(--accent-primary)]" />
              {source.account_username.startsWith('http') ? (
                <a
                  href={source.account_username}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-[var(--accent-primary)] truncate font-medium"
                >
                  {source.account_username}
                </a>
              ) : (
                <span className="truncate font-medium">{source.account_username}</span>
              )}
            </div>
          )}
        </div>

        {/* Notes preview if exists */}
        {source.notes && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 italic bg-[var(--glass-surface-strong)]/40 p-2.5 rounded-lg border border-[var(--glass-border)]">
            &quot;{source.notes}&quot;
          </p>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-end gap-1.5 pt-4 mt-4 border-t border-[var(--glass-border)]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetail(source)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 h-8"
          title={t('jobSources.viewDetails')}
        >
          <Eye size={14} className="mr-1" />
          <span>{t('jobSources.viewDetails')}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(source)}
          className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 px-2.5 py-1 h-8"
          title={t('jobSources.edit')}
        >
          <Edit3 size={14} className="mr-1" />
          <span>{t('jobSources.edit')}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(source)}
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 px-2.5 py-1 h-8"
          title={t('jobSources.delete')}
        >
          <Trash2 size={14} className="mr-1" />
          <span>{t('jobSources.delete')}</span>
        </Button>
      </div>
    </div>
  );
}

export default JobSourceCard;
