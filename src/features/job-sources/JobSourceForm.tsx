'use client';

import React, { useState } from 'react';
import { Globe, Mail, User, Sparkles, Upload, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { JobSource, CreateJobSourceData, PaymentCategory, RegionCategory, JobSourceStatus } from '@/lib/types';
import { useI18n } from '@/context/I18nContext';
import { Modal, Input, Select, Textarea, Button } from '@/components/ui';
import { uploadJobSourceLogo } from '@/lib/firebase/services/storage';

interface JobSourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobSourceData) => Promise<boolean>;
  initialData?: JobSource | null;
  isSubmitting?: boolean;
}

interface JobSourceFormContentProps {
  initialData?: JobSource | null;
  onSubmit: (data: CreateJobSourceData) => Promise<boolean>;
  onClose: () => void;
  isSubmitting: boolean;
}

function JobSourceFormContent({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: JobSourceFormContentProps) {
  const { t } = useI18n();

  const [name, setName] = useState(() => initialData?.name || '');
  const [url, setUrl] = useState(() => initialData?.url || '');
  const [logoUrl, setLogoUrl] = useState(() => initialData?.logo_url || '');
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>(
    () => initialData?.payment_category || 'International'
  );
  const [regionCategory, setRegionCategory] = useState<RegionCategory>(
    () => initialData?.region_category || 'International'
  );
  const [loginEmail, setLoginEmail] = useState(() => initialData?.login_email || '');
  const [accountUsername, setAccountUsername] = useState(() => initialData?.account_username || '');
  const [status, setStatus] = useState<JobSourceStatus>(() => initialData?.status || 'active');
  const [notes, setNotes] = useState(() => initialData?.notes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Helper untuk auto-fetch logo dari favicon domain
  const handleAutoFetchFavicon = () => {
    if (!url.trim()) {
      setErrors((prev) => ({ ...prev, url: 'Masukkan URL website terlebih dahulu' }));
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
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;

      setLogoUrl(faviconUrl);
      setErrors((prev) => ({ ...prev, url: '' }));
    } catch {
      setErrors((prev) => ({ ...prev, url: 'Format URL website tidak valid' }));
    } finally {
      setIsFetchingFavicon(false);
    }
  };

  // Helper untuk unggah logo manual
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, logo: 'Format berkas harus berupa gambar' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, logo: 'Ukuran logo maksimal 2MB' }));
      return;
    }

    setIsUploadingLogo(true);
    setErrors((prev) => ({ ...prev, logo: '' }));

    try {
      const downloadUrl = await uploadJobSourceLogo(file);
      setLogoUrl(downloadUrl);
      setLogoError(false);
    } catch (err: unknown) {
      console.error('Failed to upload logo:', err);
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah logo';
      setErrors((prev) => ({ ...prev, logo: msg }));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nama platform wajib diisi';
    }

    const trimmedUrl = url.trim();
    if (trimmedUrl) {
      try {
        const testUrl =
          trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
            ? trimmedUrl
            : `https://${trimmedUrl}`;
        const parsed = new URL(testUrl);
        if (
          (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') ||
          !parsed.hostname
        ) {
          newErrors.url = 'Format URL tidak valid';
        }
      } catch {
        newErrors.url = 'Format URL tidak valid';
      }
    }

    if (loginEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      newErrors.loginEmail = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    let finalUrl = url.trim();
    if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const payload: CreateJobSourceData = {
      name: name.trim(),
      url: finalUrl,
      logo_url: logoUrl.trim(),
      payment_category: paymentCategory,
      region_category: regionCategory,
      login_email: loginEmail.trim(),
      account_username: accountUsername.trim(),
      status,
      notes: notes.trim(),
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Platform Name */}
      <Input
        label={t('jobSources.platformName')}
        placeholder={t('jobSources.platformNamePlaceholder')}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
        }}
        error={errors.name}
        leftIcon={<Globe size={18} />}
        required
      />

      {/* Website URL + Auto Fetch Favicon */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          {t('jobSources.websiteUrl')}
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder={t('jobSources.urlPlaceholder')}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors((prev) => ({ ...prev, url: '' }));
              }}
              error={errors.url}
              leftIcon={<LinkIcon size={18} />}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleAutoFetchFavicon}
            isLoading={isFetchingFavicon}
            leftIcon={<Sparkles size={16} className="text-[var(--accent-primary)]" />}
            className="shrink-0 text-xs font-semibold"
          >
            {t('jobSources.fetchFavicon')}
          </Button>
        </div>
      </div>

      {/* Logo & Upload Area */}
      <div className="space-y-2 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface-strong)]/40 p-3.5">
        <span className="block text-xs font-semibold text-[var(--text-secondary)]">
          {t('jobSources.logo')}
        </span>

        <div className="flex items-center gap-4">
          {/* Logo Preview */}
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-2 shadow-sm border border-[var(--glass-border)]">
            {logoUrl && !logoError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-bold text-lg text-[var(--accent-primary)]">
                {name ? name.charAt(0).toUpperCase() : '?'}
              </span>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1 space-y-1">
            <label className="inline-flex items-center gap-2 cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--glass-border)] bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)] text-[var(--text-primary)] transition-all shadow-sm">
              <Upload size={14} />
              <span>{isUploadingLogo ? 'Mengunggah...' : t('jobSources.uploadLogo')}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploadingLogo}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t('jobSources.logoHint')}
            </p>
            {errors.logo && (
              <p className="text-xs text-rose-500 font-medium">{errors.logo}</p>
            )}
          </div>

          {/* Reset Logo */}
          {logoUrl && (
            <button
              type="button"
              onClick={() => setLogoUrl('')}
              className="p-2 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
              title="Hapus Logo"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grid: Payment Category & Region Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Payment Category */}
        <Select
          label={t('jobSources.paymentCategory')}
          value={paymentCategory}
          onChange={(e) => setPaymentCategory(e.target.value as PaymentCategory)}
          options={[
            { value: 'IDR', label: t('jobSources.paymentIdr') },
            { value: 'International', label: t('jobSources.paymentIntl') },
            { value: 'Both', label: t('jobSources.paymentBoth') },
          ]}
        />

        {/* Region Category */}
        <Select
          label={t('jobSources.regionCategory')}
          value={regionCategory}
          onChange={(e) => setRegionCategory(e.target.value as RegionCategory)}
          options={[
            { value: 'Indonesia', label: t('jobSources.regionIndo') },
            { value: 'International', label: t('jobSources.regionIntl') },
            { value: 'Both', label: t('jobSources.regionBoth') },
          ]}
        />
      </div>

      {/* Login Account Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Login Email */}
        <Input
          label={t('jobSources.loginEmail')}
          placeholder={t('jobSources.loginEmailPlaceholder')}
          value={loginEmail}
          onChange={(e) => {
            setLoginEmail(e.target.value);
            if (errors.loginEmail) setErrors((prev) => ({ ...prev, loginEmail: '' }));
          }}
          error={errors.loginEmail}
          leftIcon={<Mail size={18} />}
        />

        {/* Username / Profile Link */}
        <Input
          label={t('jobSources.accountUsername')}
          placeholder={t('jobSources.usernamePlaceholder')}
          value={accountUsername}
          onChange={(e) => setAccountUsername(e.target.value)}
          leftIcon={<User size={18} />}
        />
      </div>

      {/* Account Status */}
      <Select
        label={t('jobSources.status')}
        value={status}
        onChange={(e) => setStatus(e.target.value as JobSourceStatus)}
        options={[
          { value: 'active', label: t('jobSources.statusActive') },
          { value: 'inactive', label: t('jobSources.statusInactive') },
          { value: 'suspended', label: t('jobSources.statusSuspended') },
        ]}
      />

      {/* Notes */}
      <Textarea
        label={t('jobSources.notes')}
        placeholder={t('jobSources.notesPlaceholder')}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />

      {/* Form Actions Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--glass-border)]">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
          {t('jobSources.cancel')}
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {t('jobSources.save')}
        </Button>
      </div>
    </form>
  );
}

export function JobSourceForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: JobSourceFormProps) {
  const { t } = useI18n();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('jobSources.edit') : t('jobSources.addNew')}
      size="lg"
    >
      {isOpen && (
        <JobSourceFormContent
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

export default JobSourceForm;
