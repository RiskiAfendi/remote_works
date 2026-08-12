'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { Button, useToast } from '@/components/ui';
import { Application } from '@/lib/types';
import { exportApplicationsToCSV } from '@/lib/utils/export';
import { useI18n } from '@/context/I18nContext';

export interface ExportButtonProps {
  applications: Application[];
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export function ExportButton({
  applications,
  disabled = false,
  className,
  variant = 'secondary',
}: ExportButtonProps) {
  const toast = useToast();
  const { t, locale } = useI18n();

  const handleExport = () => {
    if (!applications || applications.length === 0) {
      toast.error(t('export.noDataError'), t('export.noDataTitle'));
      return;
    }

    try {
      exportApplicationsToCSV(applications, undefined, locale);
      toast.success(
        t('export.successToast', { count: applications.length }),
        t('export.successTitle')
      );
    } catch (err: unknown) {
      console.error('Failed to export CSV:', err);
      toast.error(t('export.failToast'), t('export.noDataTitle'));
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      leftIcon={<Download size={16} />}
      onClick={handleExport}
      disabled={disabled || !applications || applications.length === 0}
      className={className}
      title={t('export.tooltip')}
    >
      {t('export.btnLabel')}
    </Button>
  );
}

export default ExportButton;
