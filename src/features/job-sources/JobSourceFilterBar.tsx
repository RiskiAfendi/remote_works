'use client';

import React from 'react';
import { Search, RotateCcw, Filter, ArrowUpDown } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Input, Select, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

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
    <div className="space-y-3.5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] p-4 sm:p-5 backdrop-blur-xl shadow-md transition-all">
      {/* Top row: Search & Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder={t('jobSources.searchPlaceholder')}
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>

        {/* Sort Select & Desktop Reset Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="flex-1 md:flex-none md:w-60 lg:w-64">
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                onFilterChange('sortBy', field as 'name' | 'created_at');
                onFilterChange('sortOrder', order as 'asc' | 'desc');
              }}
              leftIcon={<ArrowUpDown size={16} />}
              options={[
                { value: 'name-asc', label: t('jobSources.sortByName') },
                { value: 'created_at-desc', label: t('jobSources.sortByDate') },
              ]}
            />
          </div>

          {/* Desktop Reset Filters Button */}
          {isFiltered && (
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              className="hidden md:flex shrink-0 text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
              title={t('jobSources.resetFilters')}
            >
              <RotateCcw size={16} className="mr-1.5" />
              <span className="text-xs font-semibold">{t('jobSources.resetFilters')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom section: Category Filters Header & Grid */}
      <div className="pt-3 border-t border-[var(--glass-border)]/60 space-y-2.5">
        {/* Section Header: Label & Total Counter */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Filter size={14} className="text-[var(--accent-primary)]" />
            <span>Filter Platform:</span>
          </span>

          {/* Counter Badge */}
          <div className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--glass-surface-strong)] px-3 py-1 rounded-xl border border-[var(--glass-border)] shrink-0">
            Total: <span className="font-bold text-[var(--accent-primary)]">{totalResults}</span> platform
          </div>
        </div>

        {/* Filters Controls: 2x2 Grid on Mobile, Flex Row on Desktop */}
        <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:items-center md:gap-3">
          {/* Payment Category Filter */}
          <div className="col-span-1 md:w-52 lg:w-60">
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
          <div className="col-span-1 md:w-52 lg:w-60">
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
          <div className={cn("col-span-1 md:w-44 lg:w-52", !isFiltered && "col-span-2 md:col-span-1")}>
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

          {/* Mobile Reset Button (shows in bottom-right of 2x2 grid when filters are active) */}
          {isFiltered && (
            <div className="col-span-1 flex items-end md:hidden">
              <Button
                variant="outline"
                size="md"
                onClick={onResetFilters}
                className="w-full h-[42px] text-rose-500 border-rose-500/30 hover:bg-rose-500/10 justify-center"
              >
                <RotateCcw size={15} className="mr-1.5" />
                <span className="text-xs font-semibold">{t('jobSources.resetFilters')}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobSourceFilterBar;
