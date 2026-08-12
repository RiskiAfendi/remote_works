'use client';

import React from 'react';
import {
  Edit2,
  Trash2,
  ExternalLink,
  Building,
  Mail,
  Calendar,
  DollarSign,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from 'lucide-react';
import { Badge, Button, AgingBadge, BadgeVariant } from '@/components/ui';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from './TableSkeleton';
import { Application, ApplicationStatus } from '@/lib/types';
import { useI18n } from '@/context/I18nContext';
import { format } from 'date-fns';
import { id as localeID, enUS as localeEN } from 'date-fns/locale';

export type SortField = 'company_name' | 'job_title' | 'applied_date' | 'status' | 'account_email';
export type SortOrder = 'asc' | 'desc';

export interface ApplicationTableProps {
  applications: Application[];
  loading: boolean;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  onPreviewImage: (imageUrl: string, companyName: string, jobTitle: string) => void;
  onAddNew?: () => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

const statusBadgeVariantMap: Record<ApplicationStatus, BadgeVariant> = {
  Applied: 'applied',
  Interview: 'interview',
  Offer: 'offer',
  Rejected: 'rejected',
  Ghosted: 'ghosted',
};

export function ApplicationTable({
  applications,
  loading,
  onEdit,
  onDelete,
  onPreviewImage,
  onAddNew,
  sortField,
  sortOrder,
  onSortChange,
  isFiltered = false,
  onResetFilters,
}: ApplicationTableProps) {
  const { t, locale } = useI18n();

  const formatDate = (date: Date) => {
    try {
      const activeLocale = locale === 'id' ? localeID : localeEN;
      return format(new Date(date), 'd MMM yyyy', { locale: activeLocale });
    } catch {
      return '-';
    }
  };

  // Helper untuk merender ikon penunjuk sort
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="text-[var(--text-muted)] opacity-50 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="text-[var(--accent-primary)] font-bold" />
    ) : (
      <ArrowDown size={14} className="text-[var(--accent-primary)] font-bold" />
    );
  };

  // 1. Loading Skeleton State
  if (loading) {
    return <TableSkeleton />;
  }

  // 2. Empty State (No Data or No Filter Match)
  if (!applications || applications.length === 0) {
    return (
      <EmptyState
        type={isFiltered ? 'noResults' : 'noData'}
        onAction={isFiltered ? onResetFilters : onAddNew}
        actionText={
          isFiltered
            ? t('empty.resetFilters', { defaultValue: 'Reset Filter' })
            : t('application.addNew', { defaultValue: 'Tambah Lamaran' })
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Title / Counter */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <span>{t('table.title', { defaultValue: 'Daftar Lamaran Kerja' })}</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
            {applications.length}
          </span>
        </h3>
        <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
          {t('table.clickToSort', { defaultValue: 'Klik header kolom untuk mengurutkan data' })}
        </span>
      </div>

      {/* Desktop Table View (md:block) */}
      <div className="hidden md:block overflow-hidden rounded-2xl glass-panel border border-[var(--glass-border)] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" role="table" aria-label="Applications List">
            <thead>
              <tr className="border-b border-[var(--glass-border)] bg-[var(--glass-surface-strong)] text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider select-none">
                {/* Perusahaan & Posisi */}
                <th
                  className="py-4 px-6 cursor-pointer hover:bg-[var(--glass-surface)] transition-colors group focus-ring"
                  onClick={() => onSortChange('company_name')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by company name"
                >
                  <div className="flex items-center gap-2">
                    <span>{t('table.companyAndPosition', { defaultValue: 'Perusahaan & Posisi' })}</span>
                    {renderSortIcon('company_name')}
                  </div>
                </th>

                {/* Email Akun */}
                <th
                  className="py-4 px-6 cursor-pointer hover:bg-[var(--glass-surface)] transition-colors group focus-ring"
                  onClick={() => onSortChange('account_email')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by account email"
                >
                  <div className="flex items-center gap-2">
                    <span>{t('table.accountEmail', { defaultValue: 'Email Akun' })}</span>
                    {renderSortIcon('account_email')}
                  </div>
                </th>

                {/* Tgl Melamar */}
                <th
                  className="py-4 px-6 cursor-pointer hover:bg-[var(--glass-surface)] transition-colors group focus-ring"
                  onClick={() => onSortChange('applied_date')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by applied date"
                >
                  <div className="flex items-center gap-2">
                    <span>{t('table.appliedDate', { defaultValue: 'Tgl Melamar' })}</span>
                    {renderSortIcon('applied_date')}
                  </div>
                </th>

                {/* Jenis & Rate */}
                <th className="py-4 px-6">
                  {t('table.employmentAndRate', { defaultValue: 'Jenis & Rate' })}
                </th>

                {/* Status */}
                <th
                  className="py-4 px-6 cursor-pointer hover:bg-[var(--glass-surface)] transition-colors group focus-ring"
                  onClick={() => onSortChange('status')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by status"
                >
                  <div className="flex items-center gap-2">
                    <span>{t('table.statusAndAging', { defaultValue: 'Status & Aging' })}</span>
                    {renderSortIcon('status')}
                  </div>
                </th>

                {/* Aksi */}
                <th className="py-4 px-6 text-right">
                  {t('table.actions', { defaultValue: 'Aksi' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)] text-sm">
              {applications.map((app) => {
                const badgeVariant = statusBadgeVariantMap[app.status] || 'default';
                const statusLabel = t(`status.${app.status}`, { defaultValue: app.status });

                return (
                  <tr
                    key={app.id}
                    className="hover:bg-[var(--glass-surface-strong)]/60 transition-colors group"
                  >
                    {/* Perusahaan & Posisi */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2">
                          <Building size={16} className="text-[var(--text-muted)] shrink-0" />
                          <span>{app.company_name}</span>
                          {app.source_url && (
                            <a
                              href={
                                app.source_url.startsWith('http')
                                  ? app.source_url
                                  : `https://${app.source_url}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] p-0.5 rounded transition-colors focus-ring"
                              title="Buka sumber lowongan"
                              aria-label="Open job source link"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 pl-6">
                          {app.job_title}
                        </p>
                      </div>
                    </td>

                    {/* Email Akun */}
                    <td className="py-4 px-6 text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5 text-xs font-mono">
                        <Mail size={14} className="text-[var(--text-muted)] shrink-0" />
                        {app.account_email || '-'}
                      </span>
                    </td>

                    {/* Tanggal Melamar */}
                    <td className="py-4 px-6 text-[var(--text-secondary)] whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Calendar size={14} className="text-[var(--text-muted)] shrink-0" />
                        {formatDate(app.applied_date)}
                      </span>
                    </td>

                    {/* Jenis & Rate Gaji */}
                    <td className="py-4 px-6 text-[var(--text-secondary)]">
                      <div className="space-y-1">
                        <span className="inline-block text-xs px-2 py-0.5 rounded bg-[var(--glass-surface)] border border-[var(--glass-border)]">
                          {app.employment_type || 'Full-time'}
                        </span>
                        {app.salary_rate && (
                          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono">
                            <DollarSign size={12} />
                            {app.salary_rate}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status Badge & Aging Alert */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1.5">
                        <Badge variant={badgeVariant} dot size="md">
                          {statusLabel}
                        </Badge>
                        {app.status === 'Applied' && app.applied_date && (
                          <AgingBadge appliedDate={app.applied_date} />
                        )}
                      </div>
                    </td>

                    {/* Action Buttons & Screenshot Preview */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {app.image_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              onPreviewImage(app.image_url, app.company_name, app.job_title)
                            }
                            className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
                            title={t('table.viewScreenshot', { defaultValue: 'Lihat Screenshot' })}
                            aria-label="View screenshot"
                          >
                            <ImageIcon size={16} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(app)}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--glass-surface-strong)]"
                          title={t('application.edit', { defaultValue: 'Ubah' })}
                          aria-label="Edit application"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(app)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          title={t('application.delete', { defaultValue: 'Hapus' })}
                          aria-label="Delete application"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Layout Cards (block md:hidden) */}
      <div className="block md:hidden space-y-3">
        {applications.map((app) => {
          const badgeVariant = statusBadgeVariantMap[app.status] || 'default';
          const statusLabel = t(`status.${app.status}`, { defaultValue: app.status });

          return (
            <div
              key={app.id}
              className="glass-panel p-4 space-y-3 border border-[var(--glass-border)] relative rounded-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-heading text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Building size={16} className="text-[var(--accent-primary)] shrink-0" />
                    {app.company_name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                    {app.job_title}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={badgeVariant} dot size="sm">
                    {statusLabel}
                  </Badge>
                  {app.status === 'Applied' && app.applied_date && (
                    <AgingBadge appliedDate={app.applied_date} />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)] pt-1 border-t border-[var(--glass-border)] font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail size={13} className="text-[var(--text-muted)] shrink-0" />
                  <span className="truncate">{app.account_email}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Calendar size={13} className="text-[var(--text-muted)] shrink-0" />
                  <span>{formatDate(app.applied_date)}</span>
                </div>
              </div>

              {app.skills_required && app.skills_required.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {app.skills_required.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--glass-surface-strong)] text-[var(--text-secondary)]"
                    >
                      {skill}
                    </span>
                  ))}
                  {app.skills_required.length > 3 && (
                    <span className="text-[10px] text-[var(--text-muted)]">
                      +{app.skills_required.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[var(--glass-border)]">
                <span className="text-xs text-[var(--text-muted)]">
                  {app.employment_type} {app.salary_rate ? `• ${app.salary_rate}` : ''}
                </span>

                <div className="flex items-center gap-1.5">
                  {app.image_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onPreviewImage(app.image_url, app.company_name, app.job_title)
                      }
                      className="px-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
                      title="Screenshot"
                    >
                      <ImageIcon size={14} />
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(app)}
                    leftIcon={<Edit2 size={14} />}
                  >
                    {t('application.edit')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(app)}
                    className="px-2.5"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ApplicationTable;
