// Status lamaran kerja
export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Ghosted';

// Jenis pekerjaan
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Hourly';

// Locale yang didukung
export type Locale = 'en' | 'id';

// Theme yang didukung
export type Theme = 'light' | 'dark';

// Entitas Lamaran Kerja
export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  source_url: string;
  apply_url: string;
  account_email: string;
  applied_date: Date;
  status: ApplicationStatus;
  image_url: string;
  salary_rate: string;
  employment_type: EmploymentType;
  skills_required: string[];
  notes: string;
  created_at: Date;
  updated_at: Date;
}

// Data untuk membuat lamaran baru (tanpa id dan timestamp otomatis)
export type CreateApplicationData = Omit<Application, 'id' | 'created_at' | 'updated_at'>;

// Data untuk memperbarui lamaran (semua field opsional kecuali id)
export type UpdateApplicationData = Partial<Omit<Application, 'id' | 'created_at'>> & { id: string };

// Interface navigasi sidebar
export interface NavItem {
  labelKey: string;
  href: string;
  icon: string;
}

// Kategori Pembayaran Sumber Loker
export type PaymentCategory = 'IDR' | 'International' | 'Both';

// Kategori Wilayah Sumber Loker
export type RegionCategory = 'Indonesia' | 'International' | 'Both';

// Status Akun Sumber Loker
export type JobSourceStatus = 'active' | 'inactive' | 'suspended';

// Entitas Sumber Loker (Job Source)
export interface JobSource {
  id: string;
  name: string;
  url: string;
  logo_url: string;
  payment_category: PaymentCategory;
  region_category: RegionCategory;
  login_email: string;
  account_username: string;
  status: JobSourceStatus;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

// Data untuk membuat Job Source baru
export type CreateJobSourceData = Omit<JobSource, 'id' | 'created_at' | 'updated_at'>;

// Data untuk memperbarui Job Source
export type UpdateJobSourceData = Partial<Omit<JobSource, 'id' | 'created_at'>> & { id: string };

