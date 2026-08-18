/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Building,
  Mail,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  Tag,
  Upload,
  X,
  ClipboardPaste,
} from 'lucide-react';
import { Modal, Input, Select, Textarea, Button } from '@/components/ui';
import { Application, CreateApplicationData, ApplicationStatus, EmploymentType } from '@/lib/types';
import { validateApplication, ApplicationFormErrors } from '@/lib/validations/applicationValidation';
import { uploadApplicationScreenshot } from '@/lib/firebase/services/storage';
import { useI18n } from '@/context/I18nContext';

export interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Application | null;
  onSubmit: (data: CreateApplicationData) => Promise<void>;
  isLoading?: boolean;
}

interface FormContentProps {
  initialData?: Application | null;
  onSubmit: (data: CreateApplicationData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

function ApplicationFormContent({
  initialData,
  onSubmit,
  onClose,
  isLoading,
}: FormContentProps) {
  const { t } = useI18n();
  const isEditMode = Boolean(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusOptions = [
    { value: 'Applied', label: `Applied (${t('status.Applied')})` },
    { value: 'Interview', label: `Interview (${t('status.Interview')})` },
    { value: 'Offer', label: `Offer (${t('status.Offer')})` },
    { value: 'Rejected', label: `Rejected (${t('status.Rejected')})` },
    { value: 'Ghosted', label: `Ghosted (${t('status.Ghosted')})` },
  ];

  const employmentOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Hourly', label: 'Hourly' },
    { value: 'Internship', label: 'Internship' },
  ];

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      const formattedDate = initialData.applied_date
        ? new Date(initialData.applied_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return {
        company_name: initialData.company_name || '',
        job_title: initialData.job_title || '',
        account_email: initialData.account_email || '',
        applied_date: formattedDate,
        status: initialData.status || ('Applied' as ApplicationStatus),
        employment_type: initialData.employment_type || ('Full-time' as EmploymentType),
        source_url: initialData.source_url || '',
        apply_url: initialData.apply_url || '',
        salary_rate: initialData.salary_rate || '',
        skills_required_input: Array.isArray(initialData.skills_required)
          ? initialData.skills_required.join(', ')
          : '',
        notes: initialData.notes || '',
        image_url: initialData.image_url || '',
      };
    }

    return {
      company_name: '',
      job_title: '',
      account_email: '',
      applied_date: new Date().toISOString().split('T')[0],
      status: 'Applied' as ApplicationStatus,
      employment_type: 'Full-time' as EmploymentType,
      source_url: '',
      apply_url: '',
      salary_rate: '',
      skills_required_input: '',
      notes: '',
      image_url: '',
    };
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(initialData?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [errors, setErrors] = useState<ApplicationFormErrors>({});

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ApplicationFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Shared helper: set file + preview from a File object
  const processImageFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle paste from clipboard (Ctrl+V / Cmd+V)
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (isLoading || uploadingImage) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            // Create a named file from the blob
            const extension = item.type.split('/')[1] || 'png';
            const filename = `screenshot-paste-${Date.now()}.${extension}`;
            const file = new File([blob], filename, { type: item.type });
            processImageFile(file);
          }
          break;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, uploadingImage]
  );

  // Register global paste listener so Ctrl+V works anywhere while the form is open
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = formData.skills_required_input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let finalImageUrl = formData.image_url;

    // Upload screenshot to Firebase Storage if a new file was selected
    if (selectedFile) {
      try {
        setUploadingImage(true);
        finalImageUrl = await uploadApplicationScreenshot(selectedFile);
      } catch (uploadErr) {
        console.error('Error uploading screenshot to Firebase Storage:', uploadErr);
        setErrors((prev) => ({
          ...prev,
          image_url: 'Gagal mengunggah gambar ke Firebase Storage.',
        }));
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    const payload: CreateApplicationData = {
      company_name: formData.company_name.trim(),
      job_title: formData.job_title.trim(),
      account_email: formData.account_email.trim(),
      applied_date: new Date(formData.applied_date),
      status: formData.status,
      employment_type: formData.employment_type,
      source_url: formData.source_url.trim(),
      apply_url: formData.apply_url.trim(),
      salary_rate: formData.salary_rate.trim(),
      skills_required: skillsArray,
      notes: formData.notes.trim(),
      image_url: finalImageUrl,
    };

    const validation = validateApplication(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error('Failed to submit application:', err);
    }
  };

  const isSubmitting = isLoading || uploadingImage;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Company Name & Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`${t('application.company')} *`}
          placeholder="e.g. OpenAI, Automattic, Vercel"
          leftIcon={<Building size={18} />}
          value={formData.company_name}
          onChange={(e) => handleChange('company_name', e.target.value)}
          error={errors.company_name}
          disabled={isSubmitting}
        />

        <Input
          label={`${t('application.position')} *`}
          placeholder="e.g. Senior Full Stack Engineer"
          leftIcon={<Briefcase size={18} />}
          value={formData.job_title}
          onChange={(e) => handleChange('job_title', e.target.value)}
          error={errors.job_title}
          disabled={isSubmitting}
        />
      </div>

      {/* Row 2: Account Email & Applied Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`${t('application.accountEmail')} *`}
          type="email"
          placeholder="john.doe@email.com"
          leftIcon={<Mail size={18} />}
          value={formData.account_email}
          onChange={(e) => handleChange('account_email', e.target.value)}
          error={errors.account_email}
          disabled={isSubmitting}
        />

        <Input
          label={`${t('application.dateApplied')} *`}
          type="date"
          leftIcon={<Calendar size={18} />}
          value={formData.applied_date}
          onChange={(e) => handleChange('applied_date', e.target.value)}
          error={errors.applied_date}
          disabled={isSubmitting}
        />
      </div>

      {/* Row 3: Status & Employment Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label={`${t('application.status')} *`}
          options={statusOptions}
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          error={errors.status}
          disabled={isSubmitting}
        />

        <Select
          label={`${t('application.employmentType')} *`}
          options={employmentOptions}
          value={formData.employment_type}
          onChange={(e) => handleChange('employment_type', e.target.value)}
          error={errors.employment_type}
          disabled={isSubmitting}
        />
      </div>

      {/* Row 4: Source URL & Apply URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('application.sourceUrl')}
          placeholder="https://linkedin.com/jobs/view/..."
          leftIcon={<LinkIcon size={18} />}
          value={formData.source_url}
          onChange={(e) => handleChange('source_url', e.target.value)}
          error={errors.source_url}
          disabled={isSubmitting}
        />

        <Input
          label={t('application.applyUrl')}
          placeholder="https://company.greenhouse.io/..."
          leftIcon={<LinkIcon size={18} />}
          value={formData.apply_url}
          onChange={(e) => handleChange('apply_url', e.target.value)}
          error={errors.apply_url}
          disabled={isSubmitting}
        />
      </div>

      {/* Row 5: Salary Rate & Skills Required */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('application.salary')}
          placeholder="e.g. $50/hr, $120k/yr, or Rp15M/mo"
          leftIcon={<DollarSign size={18} />}
          value={formData.salary_rate}
          onChange={(e) => handleChange('salary_rate', e.target.value)}
          disabled={isSubmitting}
        />

        <Input
          label={t('application.skills')}
          placeholder="React, TypeScript, Node.js, GraphQL"
          leftIcon={<Tag size={18} />}
          value={formData.skills_required_input}
          onChange={(e) => handleChange('skills_required_input', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Row 6: Notes */}
      <Textarea
        label={t('application.notes')}
        placeholder="Write HR contacts, interview steps, or key notes..."
        rows={3}
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        disabled={isSubmitting}
      />

      {/* Row 7: File Upload Screenshot (Firebase Storage) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          {t('application.screenshot')} (Optional)
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="screenshot-upload-input"
          disabled={isSubmitting}
        />

        {filePreview ? (
          <div className="relative group overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-surface-strong)] p-3 flex items-center gap-4">
            <img
              src={filePreview}
              alt="Preview screenshot"
              className="w-16 h-16 object-cover rounded-lg border border-[var(--glass-border)] shadow"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                {selectedFile ? selectedFile.name : 'Screenshot'}
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                  : 'Firebase Storage'}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isSubmitting}
              className="text-red-400 hover:text-red-300 p-2"
              title="Remove image"
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-[var(--glass-border)] hover:border-[var(--accent-primary)] bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)] rounded-xl p-4 transition-all duration-200">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Upload manual */}
              <label
                htmlFor="screenshot-upload-input"
                className="flex-1 flex flex-col items-center justify-center cursor-pointer text-center gap-2 group py-2"
              >
                <div className="p-2.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
                  <Upload size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    {t('application.uploadScreenshot')}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {t('application.uploadHint')}
                  </p>
                </div>
              </label>

              {/* Separator */}
              <div className="hidden sm:flex flex-col items-center gap-1">
                <div className="w-px h-6 bg-[var(--glass-border)]" />
                <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">or</span>
                <div className="w-px h-6 bg-[var(--glass-border)]" />
              </div>
              <div className="sm:hidden flex items-center gap-2 w-full">
                <div className="flex-1 h-px bg-[var(--glass-border)]" />
                <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">or</span>
                <div className="flex-1 h-px bg-[var(--glass-border)]" />
              </div>

              {/* Paste from clipboard */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-2">
                <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  <ClipboardPaste size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    Paste Screenshot
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Ctrl+V / ⌘V
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {errors.image_url && (
          <p className="text-xs text-red-400 mt-1 font-medium">{errors.image_url}</p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--glass-border)]">
        <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
          {t('application.cancel')}
        </Button>
        <Button variant="primary" type="submit" isLoading={isSubmitting}>
          {uploadingImage
            ? t('application.uploading')
            : isEditMode
            ? t('application.save')
            : t('application.addNew')}
        </Button>
      </div>
    </form>
  );
}

export function ApplicationForm({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
}: ApplicationFormProps) {
  const { t } = useI18n();
  const isEditMode = Boolean(initialData);
  const formKey = initialData?.id || (isOpen ? 'open' : 'closed');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t('application.edit') : t('application.addNew')}
      size="xl"
      closeOnBackdropClick={!isLoading}
    >
      {isOpen && (
        <ApplicationFormContent
          key={formKey}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={onClose}
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
}

export default ApplicationForm;
