'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useI18n } from '@/context/I18nContext';
import { Plus, FileText } from 'lucide-react';
import { Button, ConfirmModal, ImagePreviewModal } from '@/components/ui';
import { Application, CreateApplicationData } from '@/lib/types';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/components/ui/Toast';
import { ApplicationTable, SortField, SortOrder } from '@/features/applications/ApplicationTable';
import { ApplicationForm } from '@/features/applications/ApplicationForm';
import { FilterBar, FilterState } from '@/features/applications/FilterBar';
import { calculateAgingDays, getAgingLevel } from '@/lib/utils';

const initialFilters: FilterState = {
  searchQuery: '',
  status: '',
  email: '',
  company: '',
  aging: '',
};

export default function ApplicationsPage() {
  const { t } = useI18n();
  const { applications, loading, addApp, updateApp, deleteApp } = useApplications();
  const { isLocked } = useAuth();
  const toast = useToast();

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortField, setSortField] = useState<SortField>('applied_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);

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

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handlePreviewImage = (imageUrl: string, companyName: string, jobTitle: string) => {
    setPreviewData({ imageUrl, companyName, jobTitle });
    setIsPreviewOpen(true);
  };

  const filteredAndSortedApplications = useMemo(() => {
    let result = [...applications];

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.company_name.toLowerCase().includes(query) ||
          app.job_title.toLowerCase().includes(query)
      );
    }

    if (filters.status) {
      result = result.filter((app) => app.status === filters.status);
    }

    if (filters.email) {
      result = result.filter((app) => app.account_email === filters.email);
    }

    if (filters.company) {
      result = result.filter((app) => app.company_name === filters.company);
    }

    if (filters.aging) {
      result = result.filter((app) => {
        const days = calculateAgingDays(new Date(app.applied_date));
        const level = getAgingLevel(days);
        return level === filters.aging;
      });
    }

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

  const handleOpenAddForm = () => {
    setEditingApp(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (app: Application) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (app: Application) => {
    setDeletingApp(app);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: CreateApplicationData) => {
    setFormSubmitting(true);
    let success = false;
    if (editingApp) {
      success = await updateApp(editingApp.id, formData);
      if (success) {
        toast.success(`Lamaran ke "${formData.company_name}" berhasil diperbarui.`);
      }
    } else {
      success = await addApp(formData);
      if (success) {
        toast.success(`Lamaran ke "${formData.company_name}" berhasil ditambahkan.`);
      }
    }
    setFormSubmitting(false);
    if (success) {
      setIsFormOpen(false);
      setEditingApp(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingApp) return;
    setDeleteSubmitting(true);
    const success = await deleteApp(deletingApp.id, deletingApp.company_name);
    setDeleteSubmitting(false);
    if (success) {
      toast.info(`Lamaran ke "${deletingApp.company_name}" telah dihapus.`);
      setIsDeleteModalOpen(false);
      setDeletingApp(null);
    }
  };

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
    onEscape: () => {
      if (isPreviewOpen) setIsPreviewOpen(false);
      if (isFormOpen) setIsFormOpen(false);
      if (isDeleteModalOpen) setIsDeleteModalOpen(false);
      if (filters.searchQuery) setFilters((prev) => ({ ...prev, searchQuery: '' }));
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
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <FileText className="text-[var(--accent-primary)]" size={28} />
            <span>{t('nav.applications')}</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-xs md:text-sm mt-1">
            Kelola dan lacak seluruh data lamaran pekerjaan remote Anda.
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

      {/* Filter & Search Bar */}
      <section>
        <FilterBar
          ref={searchInputRef}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          applications={filteredAndSortedApplications}
          filteredCount={filteredAndSortedApplications.length}
          totalCount={applications.length}
        />
      </section>

      {/* Application Table */}
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

      {/* Application Form Modal */}
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
