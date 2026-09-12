'use client';

import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import {
  JobDirectory,
  CreateJobDirectoryData,
  DirectoryCategory,
  DirectoryRegion,
  DirectoryCompensation,
} from '@/lib/types';
import { useI18n } from '@/context/I18nContext';
import { Modal, Input, Select, Textarea, Button } from '@/components/ui';

interface JobDirectoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobDirectoryData) => Promise<boolean>;
  initialData?: JobDirectory | null;
  isSubmitting?: boolean;
}

interface DirectoryFormContentProps {
  initialData?: JobDirectory | null;
  onSubmit: (data: CreateJobDirectoryData) => Promise<boolean>;
  onClose: () => void;
  isSubmitting: boolean;
}

function DirectoryFormContent({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: DirectoryFormContentProps) {
  const { t } = useI18n();

  const [name, setName] = useState(() => initialData?.name || '');
  const [url, setUrl] = useState(() => initialData?.url || '');
  const [logoUrl, setLogoUrl] = useState(() => initialData?.logo_url || '');
  const [description, setDescription] = useState(() => initialData?.description || '');
  const [category, setCategory] = useState<DirectoryCategory>(
    () => initialData?.category || 'tech'
  );
  const [regionScope, setRegionScope] = useState<DirectoryRegion>(
    () => initialData?.region_scope || 'Worldwide'
  );
  const [compensationModel, setCompensationModel] = useState<DirectoryCompensation>(
    () => initialData?.compensation_model || 'Mixed'
  );
  const [tagsInput, setTagsInput] = useState(() =>
    initialData?.tags ? initialData.tags.join(', ') : ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Helper untuk auto-fetch logo dari favicon domain
  const handleAutoFetchFavicon = () => {
    if (!url.trim()) {
      setErrors((prev) => ({ ...prev, url: t('jobDirectories.errUrlRequired') }));
      return;
    }

    setIsFetchingFavicon(true);
    setLogoError(false);

    try {
      let hostname = url.trim();
      if (!hostname.startsWith('http://') && !hostname.startsWith('https://')) {
        hostname = `https://${hostname}`;
      }
      const parsedUrl = new URL(hostname);
      const favicon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;

      setLogoUrl(favicon);
      setErrors((prev) => ({ ...prev, url: '' }));
    } catch {
      setErrors((prev) => ({ ...prev, url: t('jobDirectories.errInvalidUrl') }));
    } finally {
      setIsFetchingFavicon(false);
    }
  };

  const handleAddTagPreset = (preset: string) => {
    const currentTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const exists = currentTags.some((t) => t.toLowerCase() === preset.toLowerCase());
    if (!exists) {
      const updated = [...currentTags, preset].join(', ');
      setTagsInput(updated);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('jobDirectories.errNameRequired');
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      newErrors.url = t('jobDirectories.errUrlRequired');
    } else {
      const lowerUrl = trimmedUrl.toLowerCase();
      if (
        lowerUrl.startsWith('javascript:') ||
        lowerUrl.startsWith('data:') ||
        lowerUrl.startsWith('file:') ||
        lowerUrl.startsWith('vbscript:') ||
        lowerUrl.startsWith('ftp://') ||
        lowerUrl.startsWith('mailto:')
      ) {
        newErrors.url = t('jobDirectories.errInvalidUrl');
      } else {
        try {
          const formatted =
            trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
              ? trimmedUrl
              : `https://${trimmedUrl}`;
          const parsed = new URL(formatted);
          if (
            (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') ||
            !parsed.hostname ||
            (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')
          ) {
            newErrors.url = t('jobDirectories.errInvalidUrl');
          }
        } catch {
          newErrors.url = t('jobDirectories.errInvalidUrl');
        }
      }
    }

    const trimmedLogo = logoUrl.trim();
    if (trimmedLogo) {
      const lowerLogo = trimmedLogo.toLowerCase();
      if (
        lowerLogo.startsWith('javascript:') ||
        lowerLogo.startsWith('file:') ||
        lowerLogo.startsWith('vbscript:')
      ) {
        newErrors.logoUrl = t('jobDirectories.errInvalidUrl');
      } else if (lowerLogo.startsWith('data:')) {
        if (!lowerLogo.startsWith('data:image/')) {
          newErrors.logoUrl = t('jobDirectories.errInvalidUrl');
        }
      } else {
        try {
          const formattedLogo =
            trimmedLogo.startsWith('http://') || trimmedLogo.startsWith('https://')
              ? trimmedLogo
              : `https://${trimmedLogo}`;
          const parsedLogo = new URL(formattedLogo);
          if (parsedLogo.protocol !== 'http:' && parsedLogo.protocol !== 'https:') {
            newErrors.logoUrl = t('jobDirectories.errInvalidUrl');
          }
        } catch {
          newErrors.logoUrl = t('jobDirectories.errInvalidUrl');
        }
      }
    }

    if (!description.trim()) {
      newErrors.description = t('jobDirectories.errDescRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    let finalLogoUrl = logoUrl.trim();
    if (
      finalLogoUrl &&
      !finalLogoUrl.startsWith('http://') &&
      !finalLogoUrl.startsWith('https://') &&
      !finalLogoUrl.startsWith('data:')
    ) {
      finalLogoUrl = `https://${finalLogoUrl}`;
    }

    const seenTags = new Set<string>();
    const parsedTags: string[] = [];
    for (const rawTag of tagsInput.split(',').map((t) => t.trim()).filter(Boolean)) {
      const cleanTag = rawTag.slice(0, 50);
      const lower = cleanTag.toLowerCase();
      if (!seenTags.has(lower)) {
        seenTags.add(lower);
        parsedTags.push(cleanTag);
        if (parsedTags.length >= 15) break;
      }
    }

    const payload: CreateJobDirectoryData = {
      name: name.trim(),
      url: finalUrl,
      logo_url: finalLogoUrl,
      description: description.trim(),
      category,
      region_scope: regionScope,
      compensation_model: compensationModel,
      tags: parsedTags,
      is_curated: false,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Platform Name */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
          {t('jobDirectories.formName')} <span className="text-rose-500">*</span>
        </label>
        <Input
          placeholder={t('jobDirectories.formNamePlaceholder')}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          error={errors.name}
          leftIcon={<Globe size={16} />}
        />
      </div>

      {/* Website URL + Auto Fetch Favicon */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
          {t('jobDirectories.formUrl')} <span className="text-rose-500">*</span>
        </label>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <Input
              placeholder={t('jobDirectories.formUrlPlaceholder')}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors((prev) => ({ ...prev, url: '' }));
              }}
              error={errors.url}
              leftIcon={<LinkIcon size={16} />}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleAutoFetchFavicon}
            isLoading={isFetchingFavicon}
            leftIcon={<Sparkles size={16} className="text-[var(--accent-primary)]" />}
            className="shrink-0 text-xs font-semibold h-[42px]"
          >
            {t('jobSources.fetchFavicon')}
          </Button>
        </div>
      </div>

      {/* Logo URL Preview / Input */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
          {t('jobDirectories.formLogoUrl')}
        </label>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-[var(--glass-border)] flex items-center justify-center overflow-hidden p-1.5 shadow-sm">
            {logoUrl && !logoError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-bold text-base text-[var(--accent-primary)]">
                {(name?.trim().charAt(0) || '?').toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <Input
              placeholder={t('jobDirectories.formLogoPlaceholder')}
              value={logoUrl}
              onChange={(e) => {
                setLogoUrl(e.target.value);
                setLogoError(false);
                if (errors.logoUrl) setErrors((prev) => ({ ...prev, logoUrl: '' }));
              }}
              error={errors.logoUrl}
              leftIcon={<LinkIcon size={16} />}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
          {t('jobDirectories.formDescription')} <span className="text-rose-500">*</span>
        </label>
        <Textarea
          placeholder={t('jobDirectories.formDescriptionPlaceholder')}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          error={errors.description}
          rows={3}
        />
      </div>

      {/* 3 Col: Category, Region Scope, Compensation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
            {t('jobDirectories.formCategory')}
          </label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as DirectoryCategory)}
            leftIcon={<Briefcase size={15} />}
            options={[
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

        {/* Region Scope */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
            {t('jobDirectories.formRegion')}
          </label>
          <Select
            value={regionScope}
            onChange={(e) => setRegionScope(e.target.value as DirectoryRegion)}
            leftIcon={<Globe size={15} />}
            options={[
              { value: 'Worldwide', label: t('jobDirectories.regionWorldwide') },
              { value: 'Indonesia', label: t('jobDirectories.regionIndonesia') },
              { value: 'US / Regional', label: t('jobDirectories.regionUsRegional') },
              { value: 'All', label: t('jobDirectories.regionAll') },
            ]}
          />
        </div>

        {/* Compensation Model */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
            {t('jobDirectories.formCompensation')}
          </label>
          <Select
            value={compensationModel}
            onChange={(e) => setCompensationModel(e.target.value as DirectoryCompensation)}
            leftIcon={<DollarSign size={15} />}
            options={[
              { value: 'Hourly', label: t('jobDirectories.compHourly') },
              { value: 'Salaried', label: t('jobDirectories.compSalaried') },
              { value: 'Mixed', label: t('jobDirectories.compMixed') },
            ]}
          />
        </div>
      </div>

      {/* Feature Tags */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
            {t('jobDirectories.formTags')}
          </label>
          <span className="text-[11px] text-[var(--text-muted)]">
            {t('jobDirectories.formTagsHint')}
          </span>
        </div>
        <Input
          placeholder={t('jobDirectories.formTagsPlaceholder')}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          leftIcon={<Tag size={16} />}
        />

        {/* Preset Tag Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[11px] font-medium text-[var(--text-muted)] mr-1">
            {t('jobDirectories.quickAddTags')}:
          </span>
          {[
            'Verified Pay',
            'No Login Needed',
            'Aggregator Feed',
            'Direct Apply',
            'Remote Worldwide',
            'Startup Jobs',
          ].map((tagPreset) => (
            <button
              key={tagPreset}
              type="button"
              onClick={() => handleAddTagPreset(tagPreset)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--glass-surface-strong)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 border border-[var(--glass-border)] transition-colors"
            >
              + {tagPreset}
            </button>
          ))}
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--glass-border)] mt-6">
        <Button variant="ghost" size="md" type="button" onClick={onClose} disabled={isSubmitting}>
          {t('jobSources.cancel')}
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          isLoading={isSubmitting}
          className="shadow-md shadow-[var(--accent-primary)]/20"
        >
          {initialData ? t('jobDirectories.saveChanges') : t('jobDirectories.addNewBtn')}
        </Button>
      </div>
    </form>
  );
}

export function JobDirectoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: JobDirectoryFormProps) {
  const { t } = useI18n();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('jobDirectories.editTitle') : t('jobDirectories.addTitle')}
      size="lg"
    >
      {isOpen && (
        <DirectoryFormContent
          key={initialData?.id || 'new'}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
}

export default JobDirectoryForm;
