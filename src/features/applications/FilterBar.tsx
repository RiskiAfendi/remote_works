'use client';

import React, { forwardRef } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Input, Select, Button } from '@/components/ui';
import { Application } from '@/lib/types';
import { ExportButton } from './ExportButton';
import { useI18n } from '@/context/I18nContext';

export interface FilterState {
  searchQuery: string;
  status: string;
  email: string;
  company: string;
  aging: string;
}

export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  applications: Application[];
  filteredCount: number;
  totalCount: number;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const FilterBar = forwardRef<HTMLInputElement, FilterBarProps>(
  (
    {
      filters,
      onFilterChange,
      onResetFilters,
      applications,
      filteredCount,
      totalCount,
      searchInputRef,
    },
    ref
  ) => {
    const { t } = useI18n();

    const statusOptions = [
      { value: '', label: t('filter.allStatus', { defaultValue: 'Semua Status' }) },
      { value: 'Applied', label: `Applied (${t('status.Applied')})` },
      { value: 'Interview', label: `Interview (${t('status.Interview')})` },
      { value: 'Offer', label: `Offer (${t('status.Offer')})` },
      { value: 'Rejected', label: `Rejected (${t('status.Rejected')})` },
      { value: 'Ghosted', label: `Ghosted (${t('status.Ghosted')})` },
    ];

    const agingOptions = [
      { value: '', label: t('filter.allAging', { defaultValue: 'Semua Umur Lamaran' }) },
      { value: 'fresh', label: `${t('aging.fresh')} (< 7 Days)` },
      { value: 'warning', label: `${t('aging.warning')} (7-14 Days)` },
      { value: 'danger', label: `${t('aging.danger')} (> 14 Days)` },
    ];

    // Ambil daftar email dan perusahaan unik dari seluruh data lamaran
    const uniqueEmails = Array.from(
      new Set(applications.map((app) => app.account_email).filter(Boolean))
    ).sort();

    const uniqueCompanies = Array.from(
      new Set(applications.map((app) => app.company_name).filter(Boolean))
    ).sort();

    const emailOptions = [
      { value: '', label: t('filter.allEmail', { defaultValue: 'Semua Email' }) },
      ...uniqueEmails.map((email) => ({ value: email, label: email })),
    ];

    const companyOptions = [
      { value: '', label: t('filter.allCompany', { defaultValue: 'Semua Perusahaan' }) },
      ...uniqueCompanies.map((c) => ({ value: c, label: c })),
    ];

    const isFilterActive =
      Boolean(filters.searchQuery) ||
      Boolean(filters.status) ||
      Boolean(filters.email) ||
      Boolean(filters.company) ||
      Boolean(filters.aging);

    return (
      <div className="glass-panel p-4 md:p-5 rounded-2xl border border-[var(--glass-border)] space-y-4 shadow-lg">
        {/* Upper Row: Search input & Export Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Input
              ref={ref || searchInputRef}
              placeholder={t('filter.searchPlaceholder', {
                defaultValue: 'Cari berdasarkan perusahaan atau posisi job title...',
              })}
              leftIcon={<Search size={18} />}
              value={filters.searchQuery}
              onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              className="pr-9"
              aria-label="Search applications"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange('searchQuery', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-lg focus-ring"
                title="Hapus pencarian"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Actions: Export CSV */}
          <div className="flex items-center gap-2 shrink-0">
            <ExportButton applications={applications} />
          </div>
        </div>

        {/* Lower Row: Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-[var(--glass-border)]">
          {/* Status Filter */}
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            aria-label="Filter by status"
          />

          {/* Email Filter */}
          <Select
            options={emailOptions}
            value={filters.email}
            onChange={(e) => onFilterChange('email', e.target.value)}
            aria-label="Filter by email"
          />

          {/* Company Filter */}
          <Select
            options={companyOptions}
            value={filters.company}
            onChange={(e) => onFilterChange('company', e.target.value)}
            aria-label="Filter by company"
          />

          {/* Aging Filter */}
          <Select
            options={agingOptions}
            value={filters.aging}
            onChange={(e) => onFilterChange('aging', e.target.value)}
            aria-label="Filter by application age"
          />
        </div>

        {/* Filter Status Summary & Reset */}
        {isFilterActive && (
          <div className="flex items-center justify-between pt-2 border-t border-[var(--glass-border)] text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--accent-primary)]">
                {t('filter.showingResults', {
                  count: filteredCount.toString(),
                  total: totalCount.toString(),
                })}
              </span>
              {filteredCount === 0 && (
                <span className="text-red-400 font-medium">({t('filter.noMatchingItems')})</span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              leftIcon={<RotateCcw size={13} />}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] p-1.5 h-auto"
            >
              {t('filter.reset', { defaultValue: 'Reset Filter' })}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

FilterBar.displayName = 'FilterBar';

export default FilterBar;
