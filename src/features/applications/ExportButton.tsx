'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { Button, useToast } from '@/components/ui';
import { Application } from '@/lib/types';
import { exportApplicationsToCSV } from '@/lib/utils/export';

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

  const handleExport = () => {
    if (!applications || applications.length === 0) {
      toast.error('Tidak ada data lamaran untuk diexport.', 'Export Gagal');
      return;
    }

    try {
      exportApplicationsToCSV(applications);
      toast.success(
        `Berhasil mengeksport ${applications.length} data lamaran ke CSV.`,
        'Export Berhasil'
      );
    } catch (err: unknown) {
      console.error('Failed to export CSV:', err);
      toast.error('Gagal membuat file CSV.', 'Export Gagal');
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
      title="Unduh data ke file CSV"
    >
      Export CSV
    </Button>
  );
}

export default ExportButton;
