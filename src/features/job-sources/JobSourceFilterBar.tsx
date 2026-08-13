'use client';

import React from 'react';
import { Search, RotateCcw, Filter, ArrowUpDown } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Input, Select, Button } from '@/components/ui';

export interface JobSourceFilterState {
  searchQuery: string;
  paymentCategory: string;
  regionCategory: string;
  status: string;
  sortBy: 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

interface JobSourceFilterBarProps {
  filters: JobSourceFilterState;
  onFilterChange: (key: keyof JobSourceFilterState, value: string) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export function JobSourceFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}: JobSourceFilterBarProps) {
  const { t } = useI18n();

  const isFiltered =
    Boolean(filters.searchQuery) ||
    Boolean(filters.paymentCategory) ||
    Boolean(filters.regionCategory) ||
    Boolean(filters.status);

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] p-4 backdrop-blur-xl shadow-md">
      {/* Top row: Search & Reset */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder={t('jobSources.searchPlaceholder')}
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <div className="w-48">
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                onFilterChange('sortBy', field);
                onFilterChange('sortOrder', order);
              }}
              leftIcon={<ArrowUpDown size={16} />}
              options={[
                { value: 'name-asc', label: t('jobSources.sortByName') },
                { value: 'created_at-desc', label: t('jobSources.sortByDate') },
              ]}
            />
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              className="shrink-0 text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
              title={t('jobSources.resetFilters')}
            >
              <RotateCcw size={16} className="mr-1.5" />
              <span className="text-xs font-semibold">{t('jobSources.resetFilters')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom row: Category Filters & Total Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--glass-border)]/60">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 pr-1">
            <Filter size={14} className="text-[var(--accent-primary)]" />
            <span>Filter:</span>
          </span>

          {/* Payment Category Filter */}
          <div className="w-40">
            <Select
              value={filters.paymentCategory}
              onChange={(e) => onFilterChange('paymentCategory', e.target.value)}
              options={[
                { value: '', label: t('jobSources.allPayment') },
                { value: 'IDR', label: t('jobSources.paymentIdr') },
                { value: 'International', label: t('jobSources.paymentIntl') },
                { value: 'Both', label: t('jobSources.paymentBoth') },
              ]}
            />
          </div>

          {/* Region Category Filter */}
          <div className="w-40">
            <Select
              value={filters.regionCategory}
              onChange={(e) => onFilterChange('regionCategory', e.target.value)}
              options={[
                { value: '', label: t('jobSources.allRegion') },
                { value: 'Indonesia', label: t('jobSources.regionIndo') },
                { value: 'International', label: t('jobSources.regionIntl') },
                { value: 'Both', label: t('jobSources.regionBoth') },
              ]}
            />
          </div>

          {/* Account Status Filter */}
          <div className="w-36">
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              options={[
                { value: '', label: t('jobSources.allStatus') },
                { value: 'active', label: t('jobSources.statusActive') },
                { value: 'inactive', label: t('jobSources.statusInactive') },
                { value: 'suspended', label: t('jobSources.statusSuspended') },
              ]}
            />
          </div>
        </div>

        {/* Counter Badge */}
        <div className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--glass-surface-strong)] px-3 py-1.5 rounded-xl border border-[var(--glass-border)] shrink-0">
          Total: <span className="font-bold text-[var(--accent-primary)]">{totalResults}</span> platform
        </div>
      </div>
    </div>
  );
}

export default JobSourceFilterBar;
