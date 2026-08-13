'use client';

import React, { useState } from 'react';
import { Globe, ExternalLink, Mail, User, Calendar, Clock, Copy, Check, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { JobSource } from '@/lib/types';
import { useI18n } from '@/context/I18nContext';
import { Modal, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface JobSourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: JobSource | null;
  onEdit: (source: JobSource) => void;
}

export function JobSourceDetailModal({
  isOpen,
  onClose,
  source,
  onEdit,
}: JobSourceDetailModalProps) {
  const { t } = useI18n();
  const [imageError, setImageError] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!source) return null;

  const getFaviconUrl = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=128`;
    } catch {
      return '';
    }
  };

  const logoSrc = source.logo_url || (source.url ? getFaviconUrl(source.url) : '');

  const handleCopyEmail = () => {
    if (!source.login_email) return;
    navigator.clipboard.writeText(source.login_email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const paymentLabel = {
    IDR: t('jobSources.paymentIdr'),
    International: t('jobSources.paymentIntl'),
    Both: t('jobSources.paymentBoth'),
  }[source.payment_category] || source.payment_category;

  const regionLabel = {
    Indonesia: t('jobSources.regionIndo'),
    International: t('jobSources.regionIntl'),
    Both: t('jobSources.regionBoth'),
  }[source.region_category] || source.region_category;

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

  const formatDate = (date: Date) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 p-2.5 shadow-md border border-[var(--glass-border)]">
              {logoSrc && !imageError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoSrc}
                  alt={source.name}
                  className="h-full w-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-2xl text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 rounded-xl">
                  {source.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[var(--text-primary)] truncate">{source.name}</h2>
              {source.url ? (
                <a
                  href={source.url.startsWith('http') ? source.url : `https://${source.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-primary)] hover:underline truncate mt-1"
                >
                  <Globe size={14} />
                  <span>{source.url}</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="text-sm text-[var(--text-muted)] italic">Tidak ada URL</span>
              )}
            </div>
          </div>

          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 self-start sm:self-center',
              statusBadgeConfig.bg
            )}
          >
            <StatusIcon size={14} />
            <span>{statusBadgeConfig.label}</span>
          </span>
        </div>

        {/* Categories Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[var(--bg-base)]/70 p-3.5 border border-[var(--glass-border)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t('jobSources.paymentCategory')}
            </span>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
              💳 {paymentLabel}
            </p>
          </div>

          <div className="rounded-xl bg-[var(--bg-base)]/70 p-3.5 border border-[var(--glass-border)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t('jobSources.regionCategory')}
            </span>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
              🌐 {regionLabel}
            </p>
          </div>
        </div>

        {/* Account Info Box */}
        <div className="space-y-3 rounded-2xl bg-[var(--bg-base)] p-4 border border-[var(--glass-border)]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Detail Akun Login
          </h4>

          {/* Email */}
          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0">
              <Mail size={16} className="text-[var(--accent-primary)] shrink-0" />
              <span className="truncate">{source.login_email || 'Belum diisi'}</span>
            </div>
            {source.login_email && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyEmail}
                className="text-xs h-7 px-2"
              >
                {copiedEmail ? (
                  <Check size={14} className="text-emerald-500 mr-1" />
                ) : (
                  <Copy size={14} className="mr-1" />
                )}
                <span>{copiedEmail ? t('jobSources.emailCopied') : t('jobSources.copyEmail')}</span>
              </Button>
            )}
          </div>

          {/* Username / Profile link */}
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <User size={16} className="text-[var(--accent-primary)] shrink-0" />
            {source.account_username ? (
              source.account_username.startsWith('http') ? (
                <a
                  href={source.account_username}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-[var(--accent-primary)] font-medium truncate"
                >
                  {source.account_username}
                </a>
              ) : (
                <span className="font-medium text-[var(--text-primary)]">{source.account_username}</span>
              )
            ) : (
              <span className="text-[var(--text-muted)] italic">Username / Link profil belum diisi</span>
            )}
          </div>
        </div>

        {/* Notes section */}
        {source.notes && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t('jobSources.notes')}
            </h4>
            <div className="rounded-xl bg-[var(--glass-surface-strong)]/60 p-3.5 text-sm text-[var(--text-primary)] border border-[var(--glass-border)] whitespace-pre-wrap">
              {source.notes}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--glass-border)] gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>Ditambahkan: {formatDate(source.created_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>Diperbarui: {formatDate(source.updated_at)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            {t('jobSources.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onEdit(source);
            }}
          >
            {t('jobSources.edit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default JobSourceDetailModal;
