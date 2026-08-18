'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Building,
  Briefcase,
  Mail,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  Tag,
  FileText,
  ArrowLeft,
  Info,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Button, Badge, useToast, BadgeVariant } from '@/components/ui';
import { CreateApplicationData } from '@/lib/types';
import { ApplicationFormErrors } from '@/lib/validations/applicationValidation';
import { useI18n } from '@/context/I18nContext';
import { formatDate } from '@/lib/utils';
import {
  AI_APPLICATION_IMPORT_TEMPLATE,
  parseAndValidateApplicationJson,
} from './jsonImportHelper';

export interface ApplicationJsonImportProps {
  onSubmit: (data: CreateApplicationData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const STATUS_BADGE_VARIANT: Record<string, BadgeVariant> = {
  Applied: 'applied',
  Interview: 'interview',
  Offer: 'offer',
  Rejected: 'rejected',
  Ghosted: 'ghosted',
};

export function ApplicationJsonImport({
  onSubmit,
  onClose,
  isLoading = false,
}: ApplicationJsonImportProps) {
  const { t, locale } = useI18n();
  const toast = useToast();

  const [step, setStep] = useState<'input' | 'preview'>('input');

  const [rawJson, setRawJson] = useState<string>('');
  const [parsedData, setParsedData] = useState<CreateApplicationData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ApplicationFormErrors | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Copy AI prompt template to clipboard
  const handleCopyTemplate = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(AI_APPLICATION_IMPORT_TEMPLATE);
      } else {
        // Fallback for non-HTTPS or older environments
        const textArea = document.createElement('textarea');
        textArea.value = AI_APPLICATION_IMPORT_TEMPLATE;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      toast.success(t('jsonImport.templateCopied'));
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy template to clipboard:', err);
      toast.error('Failed to copy template to clipboard');
    }
  };

  // Validate & parse JSON string
  const handleParse = () => {
    if (!rawJson.trim()) {
      setParseError(t('jsonImport.errorEmpty'));
      setValidationErrors(null);
      return;
    }

    const result = parseAndValidateApplicationJson(rawJson);

    if (!result.isValid) {
      if (result.parseError) {
        setParseError(result.parseError);
        setValidationErrors(null);
      } else if (result.errors) {
        setValidationErrors(result.errors);
        setParseError(null);
      }
      return;
    }

    if (result.data) {
      setParsedData(result.data);
      setParseError(null);
      setValidationErrors(null);
      setStep('preview');
    }
  };

  // Clear JSON input
  const handleClear = () => {
    setRawJson('');
    setParseError(null);
    setValidationErrors(null);
  };

  // Submit parsed data to parent
  const handleConfirmSave = async () => {
    if (!parsedData) return;
    try {
      await onSubmit(parsedData);
    } catch (err) {
      console.error('Failed to save parsed application:', err);
    }
  };

  return (
    <div className="space-y-5">
      {step === 'input' ? (
        <div className="space-y-4">
          {/* AI Template Prompt Banner */}
          <div className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-surface)] backdrop-blur-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] shrink-0 mt-0.5">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                    {t('jsonImport.aiPromptTitle')}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                    {t('jsonImport.aiPromptSubtitle')}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopyTemplate}
                className="shrink-0 text-xs font-semibold shadow-sm"
                leftIcon={
                  copied ? (
                    <Check size={15} className="text-emerald-400" />
                  ) : (
                    <Copy size={15} />
                  )
                }
              >
                {copied ? t('jsonImport.templateCopied') : t('jsonImport.copyTemplate')}
              </Button>
            </div>
          </div>

          {/* Paste Textarea Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                {t('jsonImport.pasteLabel')}
              </label>
              {rawJson && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>{t('jsonImport.clearInput')}</span>
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                value={rawJson}
                onChange={(e) => {
                  setRawJson(e.target.value);
                  if (parseError || validationErrors) {
                    setParseError(null);
                    setValidationErrors(null);
                  }
                }}
                disabled={isLoading}
                placeholder={t('jsonImport.pastePlaceholder')}
                rows={9}
                className="w-full font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all resize-y min-h-[190px] leading-relaxed"
                spellCheck={false}
              />
            </div>

            <p className="text-[11px] text-[var(--text-muted)]">
              {t('jsonImport.pasteHint')}
            </p>
          </div>

          {/* Error Feedback Alerts */}
          {parseError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-start gap-2.5 animate-slide-in-left">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1">
                <p className="font-semibold">{t('jsonImport.errorInvalidJson')}</p>
                <p className="text-[11px] text-red-300/90 mt-0.5">{parseError}</p>
              </div>
            </div>
          )}

          {validationErrors && Object.keys(validationErrors).length > 0 && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium space-y-1.5 animate-slide-in-left">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={16} className="shrink-0 text-red-400" />
                <span>{t('jsonImport.errorValidationFailed')}</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-300/90 pl-1">
                {Object.entries(validationErrors).map(([field, err]) =>
                  err ? (
                    <li key={field}>
                      <span className="font-medium capitalize">{field.replace('_', ' ')}</span>: {err}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--glass-border)]">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('application.cancel')}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleParse}
              disabled={isLoading || !rawJson.trim()}
              leftIcon={<Sparkles size={16} />}
            >
              {t('jsonImport.parseButton')}
            </Button>
          </div>
        </div>
      ) : (
        /* Preview State */
        <div className="space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-heading font-bold text-[var(--text-primary)]">
              {t('jsonImport.previewTitle')}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {t('jsonImport.previewSubtitle')}
            </p>
          </div>

          {parsedData && (
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] backdrop-blur-md space-y-4 shadow-sm">
              {/* Header: Company, Position, Status & Employment Type */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--glass-border)]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-[var(--accent-primary)] shrink-0" />
                    <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                      {parsedData.company_name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                    <Briefcase size={14} className="text-[var(--text-muted)] shrink-0" />
                    <span className="font-medium">{parsedData.job_title}</span>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <Badge
                    variant={STATUS_BADGE_VARIANT[parsedData.status] || 'default'}
                    size="md"
                    dot
                  >
                    {parsedData.status}
                  </Badge>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--glass-surface-strong)] text-[var(--text-primary)] border border-[var(--glass-border)]">
                    {parsedData.employment_type}
                  </span>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Account Email */}
                <div className="p-3 rounded-xl bg-[var(--glass-surface-strong)] border border-[var(--glass-border)]/60 flex items-start gap-2.5">
                  <Mail size={15} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      {t('jsonImport.fieldAccountEmail')}
                    </p>
                    <p className="text-xs font-medium text-[var(--text-primary)] truncate mt-0.5">
                      {parsedData.account_email}
                    </p>
                  </div>
                </div>

                {/* Applied Date */}
                <div className="p-3 rounded-xl bg-[var(--glass-surface-strong)] border border-[var(--glass-border)]/60 flex items-start gap-2.5">
                  <Calendar size={15} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      {t('jsonImport.fieldAppliedDate')}
                    </p>
                    <p className="text-xs font-medium text-[var(--text-primary)] mt-0.5">
                      {parsedData.applied_date instanceof Date && !isNaN(parsedData.applied_date.getTime())
                        ? formatDate(parsedData.applied_date, locale === 'en' ? 'en-US' : 'id-ID')
                        : String(parsedData.applied_date)}
                    </p>
                  </div>
                </div>

                {/* Salary Rate */}
                <div className="p-3 rounded-xl bg-[var(--glass-surface-strong)] border border-[var(--glass-border)]/60 flex items-start gap-2.5">
                  <DollarSign size={15} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      {t('jsonImport.fieldSalary')}
                    </p>
                    <p className="text-xs font-medium text-[var(--text-primary)] mt-0.5">
                      {parsedData.salary_rate || (
                        <span className="text-[var(--text-muted)] italic">
                          {t('jsonImport.notSpecified')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Source URL */}
                <div className="p-3 rounded-xl bg-[var(--glass-surface-strong)] border border-[var(--glass-border)]/60 flex items-start gap-2.5">
                  <LinkIcon size={15} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      {t('jsonImport.fieldSourceUrl')}
                    </p>
                    {parsedData.source_url ? (
                      <a
                        href={
                          parsedData.source_url.startsWith('http')
                            ? parsedData.source_url
                            : `https://${parsedData.source_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-[var(--accent-primary)] hover:underline truncate mt-0.5 flex items-center gap-1"
                      >
                        <span className="truncate">{parsedData.source_url}</span>
                        <ExternalLink size={11} className="shrink-0" />
                      </a>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] italic mt-0.5">
                        {t('jsonImport.notSpecified')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Apply URL */}
                <div className="sm:col-span-2 p-3 rounded-xl bg-[var(--glass-surface-strong)] border border-[var(--glass-border)]/60 flex items-start gap-2.5">
                  <LinkIcon size={15} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      {t('jsonImport.fieldApplyUrl')}
                    </p>
                    {parsedData.apply_url ? (
                      <a
                        href={
                          parsedData.apply_url.startsWith('http')
                            ? parsedData.apply_url
                            : `https://${parsedData.apply_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-[var(--accent-primary)] hover:underline truncate mt-0.5 flex items-center gap-1"
                      >
                        <span className="truncate">{parsedData.apply_url}</span>
                        <ExternalLink size={11} className="shrink-0" />
                      </a>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] italic mt-0.5">
                        {t('jsonImport.notSpecified')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Required */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                  <Tag size={14} className="text-[var(--accent-primary)]" />
                  <span>{t('jsonImport.fieldSkills')}</span>
                </div>
                {parsedData.skills_required && parsedData.skills_required.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.skills_required.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--glass-surface-strong)] text-[var(--accent-primary)] border border-[var(--glass-border)] shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic">
                    {t('jsonImport.notSpecified')}
                  </p>
                )}
              </div>

              {/* Notes */}
              {parsedData.notes && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                    <FileText size={14} className="text-[var(--accent-primary)]" />
                    <span>{t('jsonImport.fieldNotes')}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--glass-surface-strong)] border border-[var(--glass-border)]/60 text-xs text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                    {parsedData.notes}
                  </div>
                </div>
              )}

              {/* Screenshot Hint */}
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] bg-[var(--glass-surface-strong)]/50 p-2.5 rounded-lg border border-[var(--glass-border)]/40">
                <Info size={14} className="text-[var(--accent-primary)] shrink-0" />
                <span>{t('jsonImport.fieldScreenshotNote')}</span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--glass-border)]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep('input')}
              disabled={isLoading}
              leftIcon={<ArrowLeft size={16} />}
            >
              {t('jsonImport.editJson')}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmSave}
              isLoading={isLoading}
              leftIcon={<Check size={16} />}
            >
              {isLoading ? t('jsonImport.saving') : t('jsonImport.saveApplication')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationJsonImport;
