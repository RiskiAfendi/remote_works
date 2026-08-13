'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Mail, User, Sparkles, Upload, RefreshCw, AlertCircle, Link as LinkIcon, FileText } from 'lucide-react';
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

export function JobSourceForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: JobSourceFormProps) {
  const { t } = useI18n();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>('International');
  const [regionCategory, setRegionCategory] = useState<RegionCategory>('International');
  const [loginEmail, setLoginEmail] = useState('');
  const [accountUsername, setAccountUsername] = useState('');
  const [status, setStatus] = useState<JobSourceStatus>('active');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setUrl(initialData.url || '');
      setLogoUrl(initialData.logo_url || '');
      setPaymentCategory(initialData.payment_category || 'International');
      setRegionCategory(initialData.region_category || 'International');
      setLoginEmail(initialData.login_email || '');
      setAccountUsername(initialData.account_username || '');
      setStatus(initialData.status || 'active');
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setUrl('');
      setLogoUrl('');
      setPaymentCategory('International');
      setRegionCategory('International');
      setLoginEmail('');
      setAccountUsername('');
      setStatus('active');
      setNotes('');
    }
    setErrors({});
    setLogoError(false);
  }, [initialData, isOpen]);

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
      alert('File harus berupa gambar');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setIsUploadingLogo(true);
    setLogoError(false);

    try {
      const uploadedUrl = await uploadJobSourceLogo(file);
      setLogoUrl(uploadedUrl);
    } catch (err) {
      console.error('Failed to upload logo:', err);
      alert('Gagal mengunggah logo. Silakan coba lagi.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Nama platform wajib diisi';
    }

    if (url.trim()) {
      try {
        let testUrl = url.trim();
        if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
          testUrl = `https://${testUrl}`;
        }
        new URL(testUrl);
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
    if (!validate()) return;

    let formattedUrl = url.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const payload: CreateJobSourceData = {
      name: name.trim(),
      url: formattedUrl,
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('jobSources.edit') : t('jobSources.addNew')}
      subtitle={t('jobSources.subtitle')}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Platform */}
        <Input
          label={t('jobSources.platformName')}
          placeholder={t('jobSources.platformNamePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          leftIcon={<Globe size={18} />}
          required
        />

        {/* URL Website & Auto-Fetch Logo */}
        <div className="space-y-1.5">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label={t('jobSources.websiteUrl')}
                placeholder={t('jobSources.urlPlaceholder')}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={errors.url}
                leftIcon={<LinkIcon size={18} />}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleAutoFetchFavicon}
              disabled={isFetchingFavicon || !url.trim()}
              className="shrink-0 h-[42px] border-[var(--accent-primary)]/40 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
              title={t('jobSources.fetchFavicon')}
            >
              {isFetchingFavicon ? (
                <RefreshCw size={16} className="animate-spin mr-1.5" />
              ) : (
                <Sparkles size={16} className="mr-1.5 text-[var(--accent-primary)]" />
              )}
              <span className="text-xs font-semibold">{t('jobSources.fetchFavicon')}</span>
            </Button>
          </div>
        </div>

        {/* Logo Preview & Upload Manual */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            {t('jobSources.logo')}
          </label>
          <div className="flex items-center gap-4 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-base)]/50 p-3">
            {/* Logo Preview Box */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--glass-border)] bg-white/90 dark:bg-slate-800/90 p-2 shadow-sm">
              {logoUrl && !logoError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoUrl}
                  alt="Logo Preview"
                  className="h-full w-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[var(--text-muted)] text-[10px]">
                  <Globe size={18} />
                  <span>No Logo</span>
                </div>
              )}
            </div>

            {/* Upload & Controls */}
            <div className="flex-1 space-y-1">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--glass-surface-strong)] hover:bg-[var(--accent-primary)]/15 hover:text-[var(--accent-primary)] text-[var(--text-primary)] cursor-pointer transition-colors border border-[var(--glass-border)]">
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
              <p className="text-[11px] text-[var(--text-muted)]">{t('jobSources.logoHint')}</p>
            </div>
          </div>
        </div>

        {/* Categories: Payment & Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Account Login Details: Email & Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('jobSources.loginEmail')}
            placeholder={t('jobSources.loginEmailPlaceholder')}
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            error={errors.loginEmail}
            leftIcon={<Mail size={18} />}
          />

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
    </Modal>
  );
}

export default JobSourceForm;
