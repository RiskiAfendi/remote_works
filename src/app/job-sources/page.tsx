'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Globe,
  Layers,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Compass,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Button, ConfirmModal } from '@/components/ui';
import {
  JobSource,
  CreateJobSourceData,
  JobDirectory,
  CreateJobDirectoryData,
  Application,
  CreateApplicationData,
} from '@/lib/types';
import { useJobSources } from '@/hooks/useJobSources';
import { useJobDirectories } from '@/hooks/useJobDirectories';
import { useApplications } from '@/hooks/useApplications';
import {
  JobSourceCard,
  JobSourceForm,
  JobSourceFilterBar,
  JobSourceFilterState,
  JobSourceSkeleton,
  JobSourceDetailModal,
  JobDirectoryCard,
  JobDirectoryFilterBar,
  JobDirectoryFilterState,
  JobDirectoryForm,
  JobDirectoryDetailModal,
} from '@/features/job-sources';
import { ApplicationForm } from '@/features/applications/ApplicationForm';
import { cn } from '@/lib/utils';

type ActiveTab = 'platforms' | 'directories';

const initialPlatformFilters: JobSourceFilterState = {
  searchQuery: '',
  paymentCategory: '',
  regionCategory: '',
  status: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const initialDirectoryFilters: JobDirectoryFilterState = {
  searchQuery: '',
  category: '',
  regionScope: '',
  compensationModel: '',
  sourceType: 'all',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

export default function JobSourcesPage() {
  const { t } = useI18n();

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('platforms');

  // Hooks
  const {
    jobSources,
    loading: sourcesLoading,
    addJobSource,
    updateJobSource,
    deleteJobSource,
  } = useJobSources();

  const {
    directories,
    loading: directoriesLoading,
    addDirectory,
    updateDirectory,
    deleteDirectory,
  } = useJobDirectories();

  const { addApp } = useApplications();

  // Filters State (Isolated per tab)
  const [platformFilters, setPlatformFilters] = useState<JobSourceFilterState>(
    initialPlatformFilters
  );
  const [directoryFilters, setDirectoryFilters] = useState<JobDirectoryFilterState>(
    initialDirectoryFilters
  );

  // Platform Modal States
  const [isSourceFormOpen, setIsSourceFormOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<JobSource | null>(null);
  const [isSourceDeleteOpen, setIsSourceDeleteOpen] = useState(false);
  const [deletingSource, setDeletingSource] = useState<JobSource | null>(null);
  const [isSourceDetailOpen, setIsSourceDetailOpen] = useState(false);
  const [detailSource, setDetailSource] = useState<JobSource | null>(null);

  // Directory Modal States
  const [isDirectoryFormOpen, setIsDirectoryFormOpen] = useState(false);
  const [editingDirectory, setEditingDirectory] = useState<JobDirectory | null>(null);
  const [isDirectoryDeleteOpen, setIsDirectoryDeleteOpen] = useState(false);
  const [deletingDirectory, setDeletingDirectory] = useState<JobDirectory | null>(null);
  const [isDirectoryDetailOpen, setIsDirectoryDetailOpen] = useState(false);
  const [detailDirectory, setDetailDirectory] = useState<JobDirectory | null>(null);

  // Quick Track State
  const [isQuickTrackOpen, setIsQuickTrackOpen] = useState(false);
  const [quickTrackData, setQuickTrackData] = useState<Partial<Application> | null>(null);
  const [quickTrackSubmitting, setQuickTrackSubmitting] = useState(false);

  // Loading / Submitting flags
  const [sourceFormSubmitting, setSourceFormSubmitting] = useState(false);
  const [sourceDeleteSubmitting, setSourceDeleteSubmitting] = useState(false);
  const [directoryFormSubmitting, setDirectoryFormSubmitting] = useState(false);
  const [directoryDeleteSubmitting, setDirectoryDeleteSubmitting] = useState(false);

  // Filter handlers for Platforms
  const handlePlatformFilterChange = (key: keyof JobSourceFilterState, value: string) => {
    setPlatformFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetPlatformFilters = () => {
    setPlatformFilters(initialPlatformFilters);
  };

  // Filter handlers for Directories
  const handleDirectoryFilterChange = (
    key: keyof JobDirectoryFilterState,
    value: string
  ) => {
    setDirectoryFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetDirectoryFilters = () => {
    setDirectoryFilters(initialDirectoryFilters);
  };

  // Platform Actions
  const handleOpenAddSource = () => {
    setEditingSource(null);
    setIsSourceFormOpen(true);
  };

  const handleOpenEditSource = (source: JobSource) => {
    setEditingSource(source);
    setIsSourceFormOpen(true);
  };

  const handleOpenDeleteSource = (source: JobSource) => {
    setDeletingSource(source);
    setIsSourceDeleteOpen(true);
  };

  const handleOpenDetailSource = (source: JobSource) => {
    setDetailSource(source);
    setIsSourceDetailOpen(true);
  };

  const handleSourceFormSubmit = async (data: CreateJobSourceData): Promise<boolean> => {
    setSourceFormSubmitting(true);
    let success = false;
    if (editingSource) {
      success = await updateJobSource(editingSource.id, data);
    } else {
      success = await addJobSource(data);
    }
    setSourceFormSubmitting(false);
    return success;
  };

  const handleSourceDeleteConfirm = async () => {
    if (!deletingSource) return;
    setSourceDeleteSubmitting(true);
    const success = await deleteJobSource(deletingSource.id, deletingSource.name);
    setSourceDeleteSubmitting(false);
    if (success) {
      setIsSourceDeleteOpen(false);
      setDeletingSource(null);
    }
  };

  // Directory Actions
  const handleOpenAddDirectory = () => {
    setEditingDirectory(null);
    setIsDirectoryFormOpen(true);
  };

  const handleOpenEditDirectory = (directory: JobDirectory) => {
    setEditingDirectory(directory);
    setIsDirectoryFormOpen(true);
  };

  const handleOpenDeleteDirectory = (directory: JobDirectory) => {
    setDeletingDirectory(directory);
    setIsDirectoryDeleteOpen(true);
  };

  const handleOpenDetailDirectory = (directory: JobDirectory) => {
    setDetailDirectory(directory);
    setIsDirectoryDetailOpen(true);
  };

  const handleDirectoryFormSubmit = async (
    data: CreateJobDirectoryData
  ): Promise<boolean> => {
    setDirectoryFormSubmitting(true);
    let success = false;
    if (editingDirectory) {
      success = await updateDirectory(editingDirectory.id, data);
    } else {
      success = await addDirectory(data);
    }
    setDirectoryFormSubmitting(false);
    return success;
  };

  const handleDirectoryDeleteConfirm = async () => {
    if (!deletingDirectory) return;
    setDirectoryDeleteSubmitting(true);
    const success = await deleteDirectory(deletingDirectory.id, deletingDirectory.name);
    setDirectoryDeleteSubmitting(false);
    if (success) {
      setIsDirectoryDeleteOpen(false);
      setDeletingDirectory(null);
    }
  };

  // Quick Track Action (R4)
  const handleQuickTrack = (directory: JobDirectory) => {
    setQuickTrackData({
      source_url: directory.url,
      company_name: '',
      job_title: '',
      status: 'Applied',
      employment_type: 'Full-time',
      notes: `${t('jobDirectories.title')}: ${directory.name} (${directory.url})`,
    });
    setIsQuickTrackOpen(true);
  };

  const handleQuickTrackSubmit = async (formData: CreateApplicationData) => {
    setQuickTrackSubmitting(true);
    const success = await addApp(formData);
    setQuickTrackSubmitting(false);
    if (success) {
      setIsQuickTrackOpen(false);
      setQuickTrackData(null);
    }
  };

  // Filter & Sort Logic for Freelance Platforms
  const filteredAndSortedSources = useMemo(() => {
    let result = [...jobSources];

    if (platformFilters.searchQuery.trim()) {
      const query = platformFilters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.name || '').toLowerCase().includes(query) ||
          (item.url || '').toLowerCase().includes(query) ||
          (item.login_email || '').toLowerCase().includes(query) ||
          (item.account_username || '').toLowerCase().includes(query)
      );
    }

    if (platformFilters.paymentCategory) {
      result = result.filter((item) => item.payment_category === platformFilters.paymentCategory);
    }

    if (platformFilters.regionCategory) {
      result = result.filter((item) => item.region_category === platformFilters.regionCategory);
    }

    if (platformFilters.status) {
      result = result.filter((item) => item.status === platformFilters.status);
    }

    result.sort((a, b) => {
      if (platformFilters.sortBy === 'name') {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return platformFilters.sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        const parseTime = (val?: Date) => {
          if (!val) return 0;
          const t = new Date(val).getTime();
          return isNaN(t) ? 0 : t;
        };
        const timeA = parseTime(a.created_at);
        const timeB = parseTime(b.created_at);
        return platformFilters.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
    });

    return result;
  }, [jobSources, platformFilters]);

  // Filter & Sort Logic for Job Directories
  const filteredAndSortedDirectories = useMemo(() => {
    let result = [...directories];

    if (directoryFilters.searchQuery.trim()) {
      const q = directoryFilters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.name || '').toLowerCase().includes(q) ||
          (item.url || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.tags || []).some((tag) => (tag || '').toLowerCase().includes(q))
      );
    }

    if (directoryFilters.category) {
      result = result.filter((item) => item.category === directoryFilters.category);
    }

    if (directoryFilters.regionScope) {
      result = result.filter(
        (item) =>
          item.region_scope === directoryFilters.regionScope ||
          (directoryFilters.regionScope === 'Worldwide' && item.region_scope === 'All')
      );
    }

    if (directoryFilters.compensationModel) {
      result = result.filter(
        (item) => item.compensation_model === directoryFilters.compensationModel
      );
    }

    if (directoryFilters.sourceType === 'curated') {
      result = result.filter((item) => item.is_curated);
    } else if (directoryFilters.sourceType === 'custom') {
      result = result.filter((item) => !item.is_curated);
    }

    result.sort((a, b) => {
      if (directoryFilters.sortBy === 'name') {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return directoryFilters.sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        const parseTime = (val?: Date) => {
          if (!val) return 0;
          const t = new Date(val).getTime();
          return isNaN(t) ? 0 : t;
        };
        const timeA = parseTime(a.created_at);
        const timeB = parseTime(b.created_at);
        return directoryFilters.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
    });

    return result;
  }, [directories, directoryFilters]);

  // Metrics
  const activeSourcesCount = useMemo(() => {
    return jobSources.filter((s) => s.status === 'active').length;
  }, [jobSources]);

  const curatedCount = useMemo(() => {
    return directories.filter((d) => d.is_curated).length;
  }, [directories]);

  const customCount = useMemo(() => {
    return directories.filter((d) => !d.is_curated).length;
  }, [directories]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-[var(--glass-surface)] p-6 md:p-8 border border-[var(--glass-border)] shadow-xl relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
              {activeTab === 'platforms' ? <Globe size={24} /> : <Compass size={24} />}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {activeTab === 'platforms'
                  ? t('jobSources.title')
                  : t('jobDirectories.title')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5 max-w-xl">
                {activeTab === 'platforms'
                  ? t('jobSources.subtitle')
                  : t('jobDirectories.subtitle')}
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {activeTab === 'platforms' ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--glass-surface-strong)] text-xs font-semibold text-[var(--text-secondary)] border border-[var(--glass-border)]">
                  <Layers size={14} className="text-[var(--accent-primary)]" />
                  <span>
                    {t('jobSources.totalPlatforms')}:{' '}
                    <strong className="text-[var(--text-primary)]">{jobSources.length}</strong>
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  <CheckCircle2 size={14} />
                  <span>
                    {t('jobSources.activePlatforms')}: <strong>{activeSourcesCount}</strong>
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--glass-surface-strong)] text-xs font-semibold text-[var(--text-secondary)] border border-[var(--glass-border)]">
                  <Compass size={14} className="text-[var(--accent-primary)]" />
                  <span>
                    {t('jobSources.totalDirectories')}:{' '}
                    <strong className="text-[var(--text-primary)]">{directories.length}</strong>
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/25">
                  <Sparkles size={14} />
                  <span>
                    {t('jobSources.curatedCount')}: <strong>{curatedCount}</strong>
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/10 text-xs font-semibold text-sky-600 dark:text-sky-400 border border-sky-500/25">
                  <Plus size={14} />
                  <span>
                    {t('jobSources.customCount')}: <strong>{customCount}</strong>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10">
          {activeTab === 'platforms' ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAddSource}
              leftIcon={<Plus size={18} />}
              className="shadow-lg shadow-[var(--accent-primary)]/20 w-full sm:w-auto"
            >
              {t('jobSources.addNewPlatform')}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAddDirectory}
              leftIcon={<Plus size={18} />}
              className="shadow-lg shadow-[var(--accent-primary)]/20 w-full sm:w-auto"
            >
              {t('jobSources.addNewDirectory')}
            </Button>
          )}
        </div>
      </div>

      {/* Tab View Segment Control (R1) */}
      <div
        role="tablist"
        aria-label={t('jobSources.title')}
        className="flex p-1.5 rounded-2xl bg-[var(--glass-surface)] border border-[var(--glass-border)] shadow-md backdrop-blur-xl"
      >
        <button
          type="button"
          role="tab"
          id="tab-platforms"
          aria-controls="panel-platforms"
          aria-selected={activeTab === 'platforms'}
          onClick={() => setActiveTab('platforms')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 sm:gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200',
            activeTab === 'platforms'
              ? 'bg-[var(--glass-surface-strong)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 shadow-md scale-[1.005]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)]/40'
          )}
        >
          <Briefcase size={16} className="shrink-0" />
          <span className="truncate">{t('jobSources.tabPlatforms')}</span>
          <span
            className={cn(
              'text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 transition-colors',
              activeTab === 'platforms'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--glass-surface-strong)] text-[var(--text-secondary)]'
            )}
          >
            {jobSources.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-directories"
          aria-controls="panel-directories"
          aria-selected={activeTab === 'directories'}
          onClick={() => setActiveTab('directories')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 sm:gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200',
            activeTab === 'directories'
              ? 'bg-[var(--glass-surface-strong)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 shadow-md scale-[1.005]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)]/40'
          )}
        >
          <Sparkles size={16} className="shrink-0 text-purple-500" />
          <span className="truncate">{t('jobSources.tabDirectories')}</span>
          <span
            className={cn(
              'text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 transition-colors',
              activeTab === 'directories'
                ? 'bg-purple-600 text-white'
                : 'bg-[var(--glass-surface-strong)] text-[var(--text-secondary)]'
            )}
          >
            {directories.length}
          </span>
        </button>
      </div>

      {/* Content for TAB 1: Platform Freelance & Akun Saya */}
      {activeTab === 'platforms' && (
        <div
          role="tabpanel"
          id="panel-platforms"
          aria-labelledby="tab-platforms"
          className="space-y-6 animate-in fade-in duration-200"
        >
          {/* Filter Bar */}
          <JobSourceFilterBar
            filters={platformFilters}
            onFilterChange={handlePlatformFilterChange}
            onResetFilters={handleResetPlatformFilters}
            totalResults={filteredAndSortedSources.length}
          />

          {/* Cards List or Skeleton or Empty State */}
          {sourcesLoading ? (
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
                onClick={handleOpenAddSource}
                leftIcon={<Plus size={18} />}
                className="mt-2"
              >
                {t('jobSources.addNewPlatform')}
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
              <Button variant="outline" size="md" onClick={handleResetPlatformFilters}>
                {t('jobSources.resetFilters')}
              </Button>
            </div>
          ) : (
            /* Grid of Freelance Platform Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAndSortedSources.map((source) => (
                <JobSourceCard
                  key={source.id}
                  source={source}
                  onEdit={handleOpenEditSource}
                  onDelete={handleOpenDeleteSource}
                  onViewDetail={handleOpenDetailSource}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content for TAB 2: Direktori & Agregator Lowongan */}
      {activeTab === 'directories' && (
        <div
          role="tabpanel"
          id="panel-directories"
          aria-labelledby="tab-directories"
          className="space-y-6 animate-in fade-in duration-200"
        >
          {/* Directory Filter Bar */}
          <JobDirectoryFilterBar
            filters={directoryFilters}
            onFilterChange={handleDirectoryFilterChange}
            onResetFilters={handleResetDirectoryFilters}
            totalResults={filteredAndSortedDirectories.length}
          />

          {/* Cards List or Skeleton or Empty State */}
          {directoriesLoading ? (
            <JobSourceSkeleton />
          ) : directories.length === 0 ? (
            /* Empty State: No directories */
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-[var(--glass-surface)] border border-[var(--glass-border)] space-y-4">
              <div className="p-4 rounded-3xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                <Compass size={48} />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {t('jobDirectories.noDirectoriesTitle')}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {t('jobDirectories.noDirectoriesSub')}
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleOpenAddDirectory}
                leftIcon={<Plus size={18} />}
                className="mt-2"
              >
                {t('jobSources.addNewDirectory')}
              </Button>
            </div>
          ) : filteredAndSortedDirectories.length === 0 ? (
            /* Empty State: Filter produced 0 results */
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-[var(--glass-surface)] border border-[var(--glass-border)] space-y-4">
              <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Compass size={48} />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {t('jobDirectories.emptyFilterTitle')}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {t('jobDirectories.emptyFilterSub')}
                </p>
              </div>
              <Button variant="outline" size="md" onClick={handleResetDirectoryFilters}>
                {t('jobSources.resetFilters')}
              </Button>
            </div>
          ) : (
            /* Grid of Job Directory Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAndSortedDirectories.map((directory) => (
                <JobDirectoryCard
                  key={directory.id}
                  directory={directory}
                  onQuickTrack={handleQuickTrack}
                  onEdit={handleOpenEditDirectory}
                  onDelete={handleOpenDeleteDirectory}
                  onViewDetail={handleOpenDetailDirectory}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Platform Form Modal (Add / Edit) */}
      <JobSourceForm
        isOpen={isSourceFormOpen}
        onClose={() => setIsSourceFormOpen(false)}
        onSubmit={handleSourceFormSubmit}
        initialData={editingSource}
        isSubmitting={sourceFormSubmitting}
      />

      {/* Platform Detail Modal */}
      <JobSourceDetailModal
        isOpen={isSourceDetailOpen}
        onClose={() => setIsSourceDetailOpen(false)}
        source={detailSource}
        onEdit={handleOpenEditSource}
      />

      {/* Platform Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isSourceDeleteOpen}
        onClose={() => setIsSourceDeleteOpen(false)}
        onConfirm={handleSourceDeleteConfirm}
        title={t('jobSources.deleteConfirmTitle')}
        message={t('jobSources.deleteConfirmMessage', {
          name: deletingSource?.name || '',
        })}
        isLoading={sourceDeleteSubmitting}
        variant="danger"
      />

      {/* Directory Form Modal (Add / Edit) */}
      <JobDirectoryForm
        isOpen={isDirectoryFormOpen}
        onClose={() => setIsDirectoryFormOpen(false)}
        onSubmit={handleDirectoryFormSubmit}
        initialData={editingDirectory}
        isSubmitting={directoryFormSubmitting}
      />

      {/* Directory Detail Modal */}
      <JobDirectoryDetailModal
        isOpen={isDirectoryDetailOpen}
        onClose={() => setIsDirectoryDetailOpen(false)}
        directory={detailDirectory}
        onQuickTrack={handleQuickTrack}
        onEdit={handleOpenEditDirectory}
      />

      {/* Directory Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDirectoryDeleteOpen}
        onClose={() => setIsDirectoryDeleteOpen(false)}
        onConfirm={handleDirectoryDeleteConfirm}
        title={t('jobDirectories.deleteConfirmTitle')}
        message={t('jobDirectories.deleteConfirmMessage', {
          name: deletingDirectory?.name || '',
        })}
        isLoading={directoryDeleteSubmitting}
        variant="danger"
      />

      {/* Quick Track to Application Modal (R4) */}
      <ApplicationForm
        isOpen={isQuickTrackOpen}
        onClose={() => {
          setIsQuickTrackOpen(false);
          setQuickTrackData(null);
        }}
        initialData={quickTrackData}
        onSubmit={handleQuickTrackSubmit}
        isLoading={quickTrackSubmitting}
      />
    </div>
  );
}
