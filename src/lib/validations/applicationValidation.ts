import { CreateApplicationData, ApplicationStatus, EmploymentType } from '@/lib/types';

export interface ApplicationFormErrors {
  company_name?: string;
  job_title?: string;
  account_email?: string;
  applied_date?: string;
  status?: string;
  employment_type?: string;
  source_url?: string;
  apply_url?: string;
  image_url?: string;
}

export const validateApplication = (
  data: Partial<CreateApplicationData>
): {
  isValid: boolean;
  errors: ApplicationFormErrors;
} => {
  const errors: ApplicationFormErrors = {};

  if (!data.company_name || !data.company_name.trim()) {
    errors.company_name = 'Nama perusahaan wajib diisi';
  }

  if (!data.job_title || !data.job_title.trim()) {
    errors.job_title = 'Posisi / Job Title wajib diisi';
  }

  if (!data.account_email || !data.account_email.trim()) {
    errors.account_email = 'Email akun melamar wajib diisi';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.account_email.trim())) {
      errors.account_email = 'Format email tidak valid';
    }
  }

  if (!data.applied_date) {
    errors.applied_date = 'Tanggal melamar wajib diisi';
  } else if (isNaN(new Date(data.applied_date).getTime())) {
    errors.applied_date = 'Tanggal melamar tidak valid';
  }

  const validStatuses: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted'];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.status = 'Pilih status lamaran yang valid';
  }

  const validTypes: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Hourly'];
  if (!data.employment_type || !validTypes.includes(data.employment_type)) {
    errors.employment_type = 'Pilih jenis pekerjaan yang valid';
  }

  const isValidUrl = (urlStr?: string) => {
    if (!urlStr || !urlStr.trim()) return true;
    try {
      const formatted = urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`;
      new URL(formatted);
      return true;
    } catch {
      return false;
    }
  };

  if (data.source_url && !isValidUrl(data.source_url)) {
    errors.source_url = 'Format URL tidak valid';
  }

  if (data.apply_url && !isValidUrl(data.apply_url)) {
    errors.apply_url = 'Format URL tidak valid';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
