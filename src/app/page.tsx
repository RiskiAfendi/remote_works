'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useI18n } from '@/context/I18nContext';
import {
  FileText,
  Send,
  Target,
  Trophy,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button, StatCard, ConfirmModal, ImagePreviewModal } from '@/components/ui';
import { Application, CreateApplicationData } from '@/lib/types';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/components/ui/Toast';
import { ApplicationTable, SortField, SortOrder } from '@/features/applications/ApplicationTable';
import { ApplicationForm } from '@/features/applications/ApplicationForm';
import { FilterBar, FilterState } from '@/features/applications/FilterBar';
import { StatCardsSkeleton } from '@/features/applications/StatCardsSkeleton';
import { calculateAgingDays, getAgingLevel } from '@/lib/utils';

const initialFilters: FilterState = {
  searchQuery: '',
  status: '',
  email: '',
  company: '',
  aging: '',
};

export default function DashboardPage() {
  const { t } = useI18n();
  const { applications, loading, addApp, updateApp, deleteApp } = useApplications();
  const toast = useToast();

  // Search input ref for keyboard shortcut '/'
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Filter & Search States
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sorting States
  const [sortField, setSortField] = useState<SortField>('applied_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);

  // Image Preview Modal States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    imageUrl: string;
    companyName: string;
    jobTitle: string;
  }>({
    imageUrl: '',
    companyName: '',
    jobTitle: '',
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Dynamic Statistics Calculations from Firestore real-time applications
  const totalCount = applications.length;
  const appliedCount = applications.filter((a) => a.status === 'Applied').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;

  // Filter Change Handler
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Sort Change Handler
  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Open Screenshot Preview Handler
  const handlePreviewImage = (imageUrl: string, companyName: string, jobTitle: string) => {
    setPreviewData({ imageUrl, companyName, jobTitle });
    setIsPreviewOpen(true);
  };

  // Client-Side Filtered & Sorted Applications
  const filteredAndSortedApplications = useMemo(() => {
    let result = [...applications];

    // 1. Search Query Filter (by company_name or job_title)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.company_name.toLowerCase().includes(query) ||
          app.job_title.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (filters.status) {
      result = result.filter((app) => app.status === filters.status);
    }

    // 3. Account Email Filter
    if (filters.email) {
      result = result.filter((app) => app.account_email === filters.email);
    }

    // 4. Company Filter
    if (filters.company) {
      result = result.filter((app) => app.company_name === filters.company);
    }

    // 5. Aging Filter
    if (filters.aging) {
      result = result.filter((app) => {
        const days = calculateAgingDays(new Date(app.applied_date));
        const level = getAgingLevel(days);
        return level === filters.aging;
      });
    }

    // 6. Sorting
    result.sort((a, b) => {
      let valA: string | number = 0;
      let valB: string | number = 0;

      if (sortField === 'applied_date') {
        valA = new Date(a.applied_date).getTime();
        valB = new Date(b.applied_date).getTime();
      } else {
        valA = (a[sortField] || '').toString().toLowerCase();
        valB = (b[sortField] || '').toString().toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [applications, filters, sortField, sortOrder]);

  // Handler: Open Add Modal
  const handleOpenAddForm = () => {
    setEditingApp(null);
    setIsFormOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditForm = (app: Application) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  // Handler: Open Delete Confirmation Modal
  const handleOpenDeleteModal = (app: Application) => {
    setDeletingApp(app);
    setIsDeleteModalOpen(true);
  };

  // Handler: Form Submit (Create / Update)
  const handleFormSubmit = async (formData: CreateApplicationData) => {
    setFormSubmitting(true);
    let success = false;
    if (editingApp) {
      success = await updateApp(editingApp.id, formData);
      if (success) {
        toast.success(t('toast.updateSuccess', { company: formData.company_name }));
      }
    } else {
      success = await addApp(formData);
      if (success) {
        toast.success(t('toast.addSuccess', { company: formData.company_name }));
      }
    }
    setFormSubmitting(false);
    if (success) {
      setIsFormOpen(false);
      setEditingApp(null);
    }
  };

  // Handler: Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingApp) return;
    setDeleteSubmitting(true);
    const success = await deleteApp(deletingApp.id, deletingApp.company_name);
    setDeleteSubmitting(false);
    if (success) {
      toast.info(t('toast.deleteSuccess', { company: deletingApp.company_name }));
      setIsDeleteModalOpen(false);
      setDeletingApp(null);
    }
  };

  const { isLocked, lock } = useAuth();

  // Global Keyboard Shortcuts Registration
  useKeyboardShortcuts({
    disabled: isLocked,
    onSearchFocus: () => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    },
    onNewApplication: () => {
      if (!isFormOpen && !isDeleteModalOpen && !isPreviewOpen) {
        handleOpenAddForm();
      }
    },
    onToggleLock: () => {
      lock();
      toast.info(t('toast.dashboardLocked'));
    },
    onEscape: () => {
      if (isPreviewOpen) { setIsPreviewOpen(false); }
      else if (isFormOpen) { setIsFormOpen(false); }
      else if (isDeleteModalOpen) { setIsDeleteModalOpen(false); }
      else if (filters.searchQuery) { setFilters((prev) => ({ ...prev, searchQuery: '' })); }
    },
  });

  const isFilteredActive =
    Boolean(filters.searchQuery) ||
    Boolean(filters.status) ||
    Boolean(filters.email) ||
    Boolean(filters.company) ||
    Boolean(filters.aging);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles size={12} />
              FASE 5 Complete
            </span>
            <span className="text-xs text-[var(--text-muted)]">• Auth, i18n & UX Polish</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            {t('dashboard.welcome', { name: 'Remote Work Hunter' })}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm md:text-base mt-1">
            {t('dashboard.subtitle', {
              defaultValue:
                'Kelola, saring, dan analisis seluruh lamaran pekerjaan remote Anda secara efisien.',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={handleOpenAddForm}
            className="shadow-lg"
          >
            {t('application.addNew', { defaultValue: 'Tambah Lamaran' })}
          </Button>
        </div>
      </div>

      {/* 1. Stat Cards Grid (Dynamic real-time values from Firestore or Skeleton loader) */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Trophy size={18} className="text-[var(--accent-primary)]" />
          <span>{t('dashboard.summaryTitle', { defaultValue: 'Statistik Ringkasan' })}</span>
        </h2>

        {loading ? (
          <StatCardsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={t('dashboard.totalApplications')}
              value={totalCount.toString()}
              icon={<FileText size={20} />}
              subtitle={t('dashboard.totalSub', { defaultValue: 'Total lamaran tercatat' })}
              gradientColor="from-blue-400 to-sky-600"
            />
            <StatCard
              title={t('dashboard.activeApplications')}
              value={appliedCount.toString()}
              icon={<Send size={20} />}
              subtitle={t('dashboard.activeSub', { defaultValue: 'Status Applied' })}
              gradientColor="from-amber-400 to-amber-600"
            />
            <StatCard
              title={t('dashboard.interviews')}
              value={interviewCount.toString()}
              icon={<Target size={20} />}
              subtitle={t('dashboard.interviewsSub', { defaultValue: 'Tahap wawancara' })}
              gradientColor="from-purple-400 to-purple-600"
            />
            <StatCard
              title={t('dashboard.offers')}
              value={offerCount.toString()}
              icon={<Trophy size={20} />}
              subtitle={t('dashboard.offersSub', { defaultValue: 'Penawaran diterima' })}
              gradientColor="from-emerald-400 to-emerald-600"
            />
          </div>
        )}
      </section>

      {/* 2. Filter & Search Controls Bar */}
      <section>
        <FilterBar
          ref={searchInputRef}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          applications={applications}
          filteredCount={filteredAndSortedApplications.length}
          totalCount={applications.length}
        />
      </section>

      {/* 3. Application Data Table & Skeleton / Empty States */}
      <section className="space-y-4">
        <ApplicationTable
          applications={filteredAndSortedApplications}
          loading={loading}
          onEdit={handleOpenEditForm}
          onDelete={handleOpenDeleteModal}
          onPreviewImage={handlePreviewImage}
          onAddNew={handleOpenAddForm}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          isFiltered={isFilteredActive}
          onResetFilters={handleResetFilters}
        />
      </section>


      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewData.imageUrl}
        companyName={previewData.companyName}
        jobTitle={previewData.jobTitle}
      />

      {/* Application Form Modal (Create & Edit) */}
      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => {
          if (!formSubmitting) {
            setIsFormOpen(false);
            setEditingApp(null);
          }
        }}
        initialData={editingApp}
        onSubmit={handleFormSubmit}
        isLoading={formSubmitting}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleteSubmitting) {
            setIsDeleteModalOpen(false);
            setDeletingApp(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title={t('application.deleteConfirmTitle', { defaultValue: 'Hapus Lamaran Kerja?' })}
        message={
          deletingApp
            ? t('application.deleteConfirmMessage', {
                company: deletingApp.company_name,
                position: deletingApp.job_title,
              })
            : t('common.confirm')
        }
        confirmText={t('common.yes')}
        cancelText={t('common.no')}
        variant="danger"
        isLoading={deleteSubmitting}
      />
    </div>
  );
}
