'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Edit3,
  Trash2,
  Sparkles,
  Globe,
  DollarSign,
  Briefcase,
  PlusCircle,
  Eye,
  User,
  CheckCircle2,
} from 'lucide-react';
import { JobDirectory } from '@/lib/types';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface JobDirectoryCardProps {
  directory: JobDirectory;
  onQuickTrack: (directory: JobDirectory) => void;
  onEdit?: (directory: JobDirectory) => void;
  onDelete?: (directory: JobDirectory) => void;
  onViewDetail?: (directory: JobDirectory) => void;
}

export function JobDirectoryCard({
  directory,
  onQuickTrack,
  onEdit,
  onDelete,
  onViewDetail,
}: JobDirectoryCardProps) {
  const { t } = useI18n();
  const [failedLogoSrc, setFailedLogoSrc] = useState<string | null>(null);

  // Helper untuk favicon jika logo_url belum ada atau gagal load
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

  const websiteDisplay = cleanUrl
    ? cleanUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') || directory.name
    : directory.name;

  // Konfigurasi Badge Kategori
  const categoryConfig: Record<string, { bg: string; label: string }> = {
    ai: {
      bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      label: t('jobDirectories.categoryAi'),
    },
    tech: {
      bg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
      label: t('jobDirectories.categoryTech'),
    },
    general: {
      bg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      label: t('jobDirectories.categoryGeneral'),
    },
    startup: {
      bg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      label: t('jobDirectories.categoryStartup'),
    },
    design: {
      bg: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30',
      label: t('jobDirectories.categoryDesign'),
    },
    marketing: {
      bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      label: t('jobDirectories.categoryMarketing'),
    },
    other: {
      bg: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
      label: t('jobDirectories.categoryOther'),
    },
  };

  const currentCategory = categoryConfig[directory.category] || categoryConfig.other;

  // Konfigurasi Badge Wilayah
  const regionConfig: Record<string, { bg: string; label: string }> = {
    Worldwide: {
      bg: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
      label: t('jobDirectories.regionWorldwide'),
    },
    Indonesia: {
      bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      label: t('jobDirectories.regionIndonesia'),
    },
    'US / Regional': {
      bg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
      label: t('jobDirectories.regionUsRegional'),
    },
    All: {
      bg: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
      label: t('jobDirectories.regionAll'),
    },
  };

  const currentRegion = regionConfig[directory.region_scope] || regionConfig.Worldwide;

  // Konfigurasi Badge Kompensasi
  const compensationConfig: Record<string, { bg: string; label: string }> = {
    Hourly: {
      bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      label: t('jobDirectories.compHourly'),
    },
    Salaried: {
      bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      label: t('jobDirectories.compSalaried'),
    },
    Mixed: {
      bg: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
      label: t('jobDirectories.compMixed'),
    },
  };

  const currentCompensation =
    compensationConfig[directory.compensation_model] || compensationConfig.Mixed;

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
        {/* Header: Logo, Name & Type Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Logo Container */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/90 dark:bg-slate-800/90 p-2 shadow-sm border border-[var(--glass-border)]">
              {logoSrc && failedLogoSrc !== logoSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoSrc}
                  alt={directory.name}
                  className="h-full w-full object-contain"
                  onError={() => setFailedLogoSrc(logoSrc)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-lg text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 rounded-lg">
                  {(directory.name?.trim().charAt(0) || '?').toUpperCase()}
                </div>
              )}
            </div>

            {/* Title & External Link */}
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                {directory.name}
              </h3>

              <a
                href={websiteUrl}
                target={hasValidWebsite ? '_blank' : undefined}
                rel={hasValidWebsite ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (!hasValidWebsite) e.preventDefault();
                }}
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-primary)] hover:underline truncate mt-0.5',
                  !hasValidWebsite && 'opacity-60 cursor-not-allowed no-underline'
                )}
                title={directory.url}
              >
                <Globe size={12} className="shrink-0" />
                <span className="truncate">{websiteDisplay}</span>
                {hasValidWebsite && <ExternalLink size={11} className="shrink-0 opacity-70" />}
              </a>
            </div>
          </div>

          {/* Curated or Custom Tag */}
          {directory.is_curated ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shrink-0"
              title={t('jobDirectories.curatedDesc')}
            >
              <Sparkles size={11} />
              <span>{t('jobDirectories.curatedBadge')}</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 shrink-0"
              title={t('jobDirectories.customDesc')}
            >
              <User size={11} />
              <span>{t('jobDirectories.customBadge')}</span>
            </span>
          )}
        </div>

        {/* Metadata Badges: Category, Region, Compensation */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border',
              currentCategory.bg
            )}
          >
            <Briefcase size={12} />
            <span>{currentCategory.label}</span>
          </span>

          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border',
              currentRegion.bg
            )}
          >
            <Globe size={12} />
            <span>{currentRegion.label}</span>
          </span>

          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border',
              currentCompensation.bg
            )}
          >
            <DollarSign size={12} />
            <span>{currentCompensation.label}</span>
          </span>
        </div>

        {/* Description */}
        {directory.description && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
            {directory.description}
          </p>
        )}

        {/* Feature Tags List */}
        {directory.tags && directory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {directory.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[var(--bg-base)]/80 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[11px] font-medium border border-[var(--glass-border)] transition-colors max-w-full"
              >
                <CheckCircle2 size={10} className="text-[var(--accent-primary)] shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[170px]" title={tag}>
                  {tag}
                </span>
              </span>
            ))}
            {directory.tags.length > 4 && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-[var(--bg-base)]/80 text-[var(--text-muted)] text-[11px] font-medium border border-[var(--glass-border)] cursor-default"
                title={directory.tags.slice(4).join(', ')}
              >
                +{directory.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 mt-4 border-t border-[var(--glass-border)] space-y-2.5">
        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Action Primer: Kunjungi Website */}
          <a
            href={websiteUrl}
            target={hasValidWebsite ? '_blank' : undefined}
            rel={hasValidWebsite ? 'noopener noreferrer' : undefined}
            onClick={(e) => {
              if (!hasValidWebsite) e.preventDefault();
            }}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all',
              hasValidWebsite
                ? 'border border-[var(--glass-border)] bg-[var(--glass-surface-strong)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] shadow-sm'
                : 'border border-[var(--glass-border)] bg-[var(--glass-surface-strong)]/40 text-[var(--text-muted)] cursor-not-allowed opacity-60'
            )}
          >
            <Globe size={14} className="shrink-0" />
            <span className="truncate">{t('jobDirectories.visitWebsite')}</span>
            {hasValidWebsite && <ExternalLink size={12} className="shrink-0 opacity-70" />}
          </a>

          {/* Action Sekunder: Catat Lamaran dari Sini (Quick Track) */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => onQuickTrack(directory)}
            leftIcon={<PlusCircle size={14} />}
            className="w-full text-xs font-semibold py-2 h-auto shadow-md shadow-[var(--accent-primary)]/15"
            title={t('jobDirectories.quickTrackTooltip')}
          >
            <span className="truncate">{t('jobDirectories.quickTrackBtn')}</span>
          </Button>
        </div>

        {/* Additional Management Actions for Custom & Detailed View */}
        <div className="flex items-center justify-between gap-1 pt-1 text-xs">
          {onViewDetail && (
            <button
              type="button"
              onClick={() => onViewDetail(directory)}
              className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            >
              <Eye size={13} />
              <span>{t('jobSources.viewDetails')}</span>
            </button>
          )}

          {!directory.is_curated && (
            <div className="flex items-center gap-1 ml-auto">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(directory)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                  title={t('jobSources.edit')}
                >
                  <Edit3 size={13} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(directory)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title={t('jobSources.delete')}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDirectoryCard;
