'use client';

import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Sparkles,
  User,
  Briefcase,
  DollarSign,
  Calendar,
  PlusCircle,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { JobDirectory } from '@/lib/types';
import { useI18n } from '@/context/I18nContext';
import { Modal, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface JobDirectoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  directory: JobDirectory | null;
  onQuickTrack: (directory: JobDirectory) => void;
  onEdit?: (directory: JobDirectory) => void;
}

export function JobDirectoryDetailModal({
  isOpen,
  onClose,
  directory,
  onQuickTrack,
  onEdit,
}: JobDirectoryDetailModalProps) {
  const { t, locale } = useI18n();
  const [failedLogoSrc, setFailedLogoSrc] = useState<string | null>(null);

  if (!directory) return null;

  const getFaviconUrl = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=128`;
    } catch {
      return '';
    }
  };

  const cleanUrl = directory.url?.trim() || '';
  const cleanLogoUrl = directory.logo_url?.trim() || '';
  const logoSrc = cleanLogoUrl || (cleanUrl ? getFaviconUrl(cleanUrl) : '');

  const isValidWebUrl = (raw: string): boolean => {
    if (!raw) return false;
    try {
      const formatted = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
      const parsed = new URL(formatted);
      return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && Boolean(parsed.hostname);
    } catch {
      return false;
    }
  };

  const hasValidWebsite = isValidWebUrl(cleanUrl);
  const websiteUrl = hasValidWebsite
    ? cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')
      ? cleanUrl
      : `https://${cleanUrl}`
    : '#';

  const categoryLabels: Record<string, string> = {
    ai: t('jobDirectories.categoryAi'),
    tech: t('jobDirectories.categoryTech'),
    general: t('jobDirectories.categoryGeneral'),
    startup: t('jobDirectories.categoryStartup'),
    design: t('jobDirectories.categoryDesign'),
    marketing: t('jobDirectories.categoryMarketing'),
    other: t('jobDirectories.categoryOther'),
  };

  const regionLabels: Record<string, string> = {
    Worldwide: t('jobDirectories.regionWorldwide'),
    Indonesia: t('jobDirectories.regionIndonesia'),
    'US / Regional': t('jobDirectories.regionUsRegional'),
    All: t('jobDirectories.regionAll'),
  };

  const compLabels: Record<string, string> = {
    Hourly: t('jobDirectories.compHourly'),
    Salaried: t('jobDirectories.compSalaried'),
    Mixed: t('jobDirectories.compMixed'),
  };

  const formatDate = (date: Date) => {
    try {
      const loc = locale === 'en' ? 'en-US' : 'id-ID';
      return new Intl.DateTimeFormat(loc, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(date));
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-md border border-[var(--glass-border)]">
              {logoSrc && failedLogoSrc !== logoSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoSrc}
                  alt={directory.name}
                  className="h-full w-full object-contain"
                  onError={() => setFailedLogoSrc(logoSrc)}
                />
              ) : (
                <span className="font-bold text-2xl text-[var(--accent-primary)]">
                  {(directory.name?.trim().charAt(0) || '?').toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] truncate">
                  {directory.name}
                </h2>
                {directory.is_curated ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                    <Sparkles size={11} />
                    <span>{t('jobDirectories.curatedBadge')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    <User size={11} />
                    <span>{t('jobDirectories.customBadge')}</span>
                  </span>
                )}
              </div>

              <a
                href={websiteUrl}
                target={hasValidWebsite ? '_blank' : undefined}
                rel={hasValidWebsite ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (!hasValidWebsite) e.preventDefault();
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline mt-1',
                  !hasValidWebsite && 'opacity-60 cursor-not-allowed no-underline'
                )}
              >
                <Globe size={13} />
                <span className="truncate">{cleanUrl || directory.name}</span>
                {hasValidWebsite && <ExternalLink size={12} />}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!directory.is_curated && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(directory);
                }}
                leftIcon={<Edit3 size={14} />}
              >
                {t('jobSources.edit')}
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-[var(--glass-surface-strong)]/40 p-4 border border-[var(--glass-border)] space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {t('jobDirectories.detailAbout')}
          </h4>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            {directory.description}
          </p>
        </div>

        {/* Key Attributes 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-[var(--bg-base)]/60 p-3.5 border border-[var(--glass-border)] space-y-1">
            <span className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1.5">
              <Briefcase size={14} className="text-[var(--accent-primary)]" />
              <span>{t('jobDirectories.formCategory')}</span>
            </span>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {categoryLabels[directory.category] || directory.category}
            </p>
          </div>

          <div className="rounded-xl bg-[var(--bg-base)]/60 p-3.5 border border-[var(--glass-border)] space-y-1">
            <span className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1.5">
              <Globe size={14} className="text-[var(--accent-primary)]" />
              <span>{t('jobDirectories.formRegion')}</span>
            </span>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {regionLabels[directory.region_scope] || directory.region_scope}
            </p>
          </div>

          <div className="rounded-xl bg-[var(--bg-base)]/60 p-3.5 border border-[var(--glass-border)] space-y-1">
            <span className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1.5">
              <DollarSign size={14} className="text-[var(--accent-primary)]" />
              <span>{t('jobDirectories.formCompensation')}</span>
            </span>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {compLabels[directory.compensation_model] || directory.compensation_model}
            </p>
          </div>
        </div>

        {/* Feature Tags List */}
        {directory.tags && directory.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t('jobDirectories.detailFeatures')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {directory.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--glass-surface-strong)] text-xs font-semibold text-[var(--text-primary)] border border-[var(--glass-border)] max-w-full"
                >
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span className="break-all">{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp if present */}
        {directory.created_at && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-2">
            <Calendar size={13} />
            <span>
              {t('jobDirectories.dateAdded')}: {formatDate(new Date(directory.created_at))}
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-5 border-t border-[var(--glass-border)]">
          <Button variant="ghost" size="md" onClick={onClose} className="w-full sm:w-auto">
            {t('jobSources.cancel')}
          </Button>

          <a
            href={websiteUrl}
            target={hasValidWebsite ? '_blank' : undefined}
            rel={hasValidWebsite ? 'noopener noreferrer' : undefined}
            onClick={(e) => {
              if (!hasValidWebsite) e.preventDefault();
            }}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto',
              hasValidWebsite
                ? 'border border-[var(--glass-border)] bg-[var(--glass-surface-strong)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]'
                : 'border border-[var(--glass-border)] bg-[var(--glass-surface-strong)]/40 text-[var(--text-muted)] cursor-not-allowed opacity-60'
            )}
          >
            <Globe size={15} />
            <span>{t('jobDirectories.visitWebsite')}</span>
            {hasValidWebsite && <ExternalLink size={14} className="opacity-70" />}
          </a>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onQuickTrack(directory);
            }}
            leftIcon={<PlusCircle size={16} />}
            className="w-full sm:w-auto shadow-md shadow-[var(--accent-primary)]/20"
          >
            {t('jobDirectories.quickTrackBtn')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default JobDirectoryDetailModal;
