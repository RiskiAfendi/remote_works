'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Globe, Layers, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Button, ConfirmModal } from '@/components/ui';
import { JobSource, CreateJobSourceData } from '@/lib/types';
import { useJobSources } from '@/hooks/useJobSources';
import {
  JobSourceCard,
  JobSourceForm,
  JobSourceFilterBar,
  JobSourceFilterState,
  JobSourceSkeleton,
  JobSourceDetailModal,
} from '@/features/job-sources';

const initialFilters: JobSourceFilterState = {
  searchQuery: '',
  paymentCategory: '',
  regionCategory: '',
  status: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

export default function JobSourcesPage() {
  const { t } = useI18n();
  const { jobSources, loading, addJobSource, updateJobSource, deleteJobSource } = useJobSources();

  const [filters, setFilters] = useState<JobSourceFilterState>(initialFilters);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<JobSource | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSource, setDeletingSource] = useState<JobSource | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailSource, setDetailSource] = useState<JobSource | null>(null);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const handleFilterChange = (key: keyof JobSourceFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleOpenAddForm = () => {
    setEditingSource(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (source: JobSource) => {
    setEditingSource(source);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (source: JobSource) => {
    setDeletingSource(source);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetailModal = (source: JobSource) => {
    setDetailSource(source);
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateJobSourceData): Promise<boolean> => {
    setFormSubmitting(true);
    let success = false;
    if (editingSource) {
      success = await updateJobSource(editingSource.id, data);
    } else {
      success = await addJobSource(data);
    }
    setFormSubmitting(false);
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSource) return;
    setDeleteSubmitting(true);
    const success = await deleteJobSource(deletingSource.id, deletingSource.name);
    setDeleteSubmitting(false);
    if (success) {
      setIsDeleteModalOpen(false);
      setDeletingSource(null);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedSources = useMemo(() => {
    let result = [...jobSources];

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.url.toLowerCase().includes(query) ||
          item.login_email.toLowerCase().includes(query) ||
          item.account_username.toLowerCase().includes(query)
      );
    }

    if (filters.paymentCategory) {
      result = result.filter((item) => item.payment_category === filters.paymentCategory);
    }

    if (filters.regionCategory) {
      result = result.filter((item) => item.region_category === filters.regionCategory);
    }

    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    result.sort((a, b) => {
      if (filters.sortBy === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return filters.sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return filters.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
    });

    return result;
  }, [jobSources, filters]);

  // Metrics
  const activeCount = useMemo(() => {
    return jobSources.filter((s) => s.status === 'active').length;
  }, [jobSources]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-[var(--glass-surface)] p-6 md:p-8 border border-[var(--glass-border)] shadow-xl relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
              <Globe size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {t('jobSources.title')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5 max-w-xl">
                {t('jobSources.subtitle')}
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--glass-surface-strong)] text-xs font-semibold text-[var(--text-secondary)] border border-[var(--glass-border)]">
              <Layers size={14} className="text-[var(--accent-primary)]" />
              <span>
                {t('jobSources.totalPlatforms')}: <strong className="text-[var(--text-primary)]">{jobSources.length}</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 size={14} />
              <span>
                {t('jobSources.activePlatforms')}: <strong>{activeCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddForm}
            leftIcon={<Plus size={18} />}
            className="shadow-lg shadow-[var(--accent-primary)]/20 w-full sm:w-auto"
          >
            {t('jobSources.addNew')}
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <JobSourceFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={filteredAndSortedSources.length}
      />

      {/* Cards List or Skeleton or Empty State */}
      {loading ? (
        <JobSourceSkeleton />
      ) : jobSources.length === 0 ? (
        /* Empty State: No data recorded yet */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-[var(--glass-surface)] border border-[var(--glass-border)] space-y-4">
          <div className="p-4 rounded-3xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
            <Globe size={48} />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {t('jobSources.noSourcesTitle')}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {t('jobSources.noSourcesSub')}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddForm}
            leftIcon={<Plus size={18} />}
            className="mt-2"
          >
            {t('jobSources.addNew')}
          </Button>
        </div>
      ) : filteredAndSortedSources.length === 0 ? (
        /* Empty State: Filters produced 0 results */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-[var(--glass-surface)] border border-[var(--glass-border)] space-y-4">
          <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Globe size={48} />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {t('jobSources.emptyFilterTitle')}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {t('jobSources.emptyFilterSub')}
            </p>
          </div>
          <Button variant="outline" size="md" onClick={handleResetFilters}>
            {t('jobSources.resetFilters')}
          </Button>
        </div>
      ) : (
        /* Grid of Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedSources.map((source) => (
            <JobSourceCard
              key={source.id}
              source={source}
              onEdit={handleOpenEditForm}
              onDelete={handleOpenDeleteModal}
              onViewDetail={handleOpenDetailModal}
            />
          ))}
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <JobSourceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSource}
        isSubmitting={formSubmitting}
      />

      {/* Detail Modal */}
      <JobSourceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        source={detailSource}
        onEdit={handleOpenEditForm}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('jobSources.deleteConfirmTitle')}
        message={t('jobSources.deleteConfirmMessage', {
          name: deletingSource?.name || '',
        })}
        isLoading={deleteSubmitting}
        variant="danger"
      />
    </div>
  );
}
