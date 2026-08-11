import { Application } from '@/lib/types';
import { format } from 'date-fns';

/**
 * Escapes values for CSV compatibility (handles quotes, commas, newlines)
 */
function escapeCSVValue(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exports application list to a CSV file downloadable in browser
 */
export function exportApplicationsToCSV(applications: Application[], filename?: string): void {
  const headers = [
    'Nama Perusahaan',
    'Posisi (Job Title)',
    'Status',
    'Email Akun',
    'Tanggal Melamar',
    'Jenis Pekerjaan',
    'Salary Rate',
    'Skills Required',
    'URL Sumber',
    'URL Melamar',
    'Catatan',
    'URL Screenshot',
    'Tanggal Dibuat',
  ];

  const rows = applications.map((app) => [
    escapeCSVValue(app.company_name),
    escapeCSVValue(app.job_title),
    escapeCSVValue(app.status),
    escapeCSVValue(app.account_email),
    escapeCSVValue(
      app.applied_date ? format(new Date(app.applied_date), 'yyyy-MM-dd') : ''
    ),
    escapeCSVValue(app.employment_type || 'Full-time'),
    escapeCSVValue(app.salary_rate),
    escapeCSVValue(Array.isArray(app.skills_required) ? app.skills_required.join(', ') : ''),
    escapeCSVValue(app.source_url),
    escapeCSVValue(app.apply_url),
    escapeCSVValue(app.notes),
    escapeCSVValue(app.image_url),
    escapeCSVValue(app.created_at ? format(new Date(app.created_at), 'yyyy-MM-dd HH:mm') : ''),
  ]);

  const csvContent = [
    headers.map(escapeCSVValue).join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  // Prepend UTF-8 BOM for Microsoft Excel & Google Sheets compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const defaultFilename = `RemoteWorks_Applications_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename || defaultFilename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
