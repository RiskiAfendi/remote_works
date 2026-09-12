'use client';

import React from 'react';
import { Search, RotateCcw, Filter, ArrowUpDown } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Input, Select, Button } from '@/components/ui';

export interface JobDirectoryFilterState {
  searchQuery: string;
  category: string;
  regionScope: string;
  compensationModel: string;
  sourceType: string; // 'all' | 'curated' | 'custom'
  sortBy: 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

interface JobDirectoryFilterBarProps {
  filters: JobDirectoryFilterState;
  onFilterChange: (key: keyof JobDirectoryFilterState, value: string) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export function JobDirectoryFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}: JobDirectoryFilterBarProps) {
  const { t } = useI18n();

  const isFiltered =
    Boolean(filters.searchQuery) ||
    Boolean(filters.category) ||
    Boolean(filters.regionScope) ||
    Boolean(filters.compensationModel) ||
    (Boolean(filters.sourceType) && filters.sourceType !== 'all');

  return (
    <div className="space-y-3.5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] p-4 sm:p-5 backdrop-blur-xl shadow-md transition-all">
      {/* Top row: Search & Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder={t('jobDirectories.searchPlaceholder')}
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

      {/* Bottom section: Category Filters */}
      <div className="pt-3 border-t border-[var(--glass-border)]/60 space-y-2.5">
        {/* Section Header: Label & Total Counter */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Filter size={14} className="text-[var(--accent-primary)]" />
            <span>{t('jobDirectories.filterHeader')}:</span>
          </span>

          {/* Counter Badge */}
          <div className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--glass-surface-strong)] px-3 py-1 rounded-xl border border-[var(--glass-border)] shrink-0">
            Total: <span className="font-bold text-[var(--accent-primary)]">{totalResults}</span> {t('jobDirectories.resultsCount')}
          </div>
        </div>

        {/* Filter Controls: 2x2 Grid on Mobile, Flex Row on Desktop */}
        <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:items-center md:gap-3">
          {/* Specialization / Category Filter */}
          <div className="col-span-1 md:w-52 lg:w-56">
            <Select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              options={[
                { value: '', label: t('jobDirectories.allCategories') },
                { value: 'ai', label: t('jobDirectories.categoryAi') },
                { value: 'tech', label: t('jobDirectories.categoryTech') },
                { value: 'general', label: t('jobDirectories.categoryGeneral') },
                { value: 'startup', label: t('jobDirectories.categoryStartup') },
                { value: 'design', label: t('jobDirectories.categoryDesign') },
                { value: 'marketing', label: t('jobDirectories.categoryMarketing') },
                { value: 'other', label: t('jobDirectories.categoryOther') },
              ]}
            />
          </div>

          {/* Region Scope Filter */}
          <div className="col-span-1 md:w-48 lg:w-52">
            <Select
              value={filters.regionScope}
              onChange={(e) => onFilterChange('regionScope', e.target.value)}
              options={[
                { value: '', label: t('jobDirectories.allRegions') },
                { value: 'Worldwide', label: t('jobDirectories.regionWorldwide') },
                { value: 'Indonesia', label: t('jobDirectories.regionIndonesia') },
                { value: 'US / Regional', label: t('jobDirectories.regionUsRegional') },
                { value: 'All', label: t('jobDirectories.regionAll') },
              ]}
            />
          </div>

          {/* Compensation Model Filter */}
          <div className="col-span-1 md:w-48 lg:w-52">
            <Select
              value={filters.compensationModel}
              onChange={(e) => onFilterChange('compensationModel', e.target.value)}
              options={[
                { value: '', label: t('jobDirectories.allComp') },
                { value: 'Hourly', label: t('jobDirectories.compHourly') },
                { value: 'Salaried', label: t('jobDirectories.compSalaried') },
                { value: 'Mixed', label: t('jobDirectories.compMixed') },
              ]}
            />
          </div>

          {/* Source Type Filter (Curated vs Custom) */}
          <div className="col-span-1 md:w-44 lg:w-48">
            <Select
              value={filters.sourceType}
              onChange={(e) => onFilterChange('sourceType', e.target.value)}
              options={[
                { value: 'all', label: t('jobDirectories.allTypes') },
                { value: 'curated', label: t('jobDirectories.typeCurated') },
                { value: 'custom', label: t('jobDirectories.typeCustom') },
              ]}
            />
          </div>

          {/* Mobile Reset Button */}
          {isFiltered && (
            <div className="col-span-2 flex items-center md:hidden pt-1">
              <Button
                variant="outline"
                size="md"
                onClick={onResetFilters}
                className="w-full h-[40px] text-rose-500 border-rose-500/30 hover:bg-rose-500/10 justify-center"
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

export default JobDirectoryFilterBar;
