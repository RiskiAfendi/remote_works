// Konstanta aplikasi
export const APP_NAME = 'Remote Works';
export const APP_DESCRIPTION = 'Dashboard CRUD tracker lamaran kerja remote';

// Daftar status lamaran dengan warna dan ikon
export const APPLICATION_STATUSES = [
  { value: 'Applied', color: 'var(--status-applied)', bgClass: 'bg-blue-400/15 text-blue-400 border-blue-400/25' },
  { value: 'Interview', color: 'var(--status-interview)', bgClass: 'bg-amber-400/15 text-amber-400 border-amber-400/25' },
  { value: 'Offer', color: 'var(--status-offer)', bgClass: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/25' },
  { value: 'Rejected', color: 'var(--status-rejected)', bgClass: 'bg-red-400/15 text-red-400 border-red-400/25' },
  { value: 'Ghosted', color: 'var(--status-ghosted)', bgClass: 'bg-gray-400/15 text-gray-400 border-gray-400/25' },
] as const;

// Jenis pekerjaan
export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Hourly',
  'Internship',
] as const;

// Navigasi sidebar
export const NAV_ITEMS = [
  { labelKey: 'nav.dashboard', href: '/', icon: 'LayoutDashboard' },
  { labelKey: 'nav.applications', href: '/applications', icon: 'FileText' },
  { labelKey: 'nav.jobSources', href: '/job-sources', icon: 'Globe' },
  { labelKey: 'nav.analytics', href: '/analytics', icon: 'BarChart3' },
  { labelKey: 'nav.settings', href: '/settings', icon: 'Settings' },
] as const;

// Kategori Pembayaran Job Sources
export const PAYMENT_CATEGORIES = [
  { value: 'IDR', labelKey: 'jobSources.paymentIdr', bgClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  { value: 'International', labelKey: 'jobSources.paymentIntl', bgClass: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  { value: 'Both', labelKey: 'jobSources.paymentBoth', bgClass: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
] as const;

// Kategori Wilayah Job Sources
export const REGION_CATEGORIES = [
  { value: 'Indonesia', labelKey: 'jobSources.regionIndo', bgClass: 'bg-red-500/15 text-red-400 border-red-500/25' },
  { value: 'International', labelKey: 'jobSources.regionIntl', bgClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25' },
  { value: 'Both', labelKey: 'jobSources.regionBoth', bgClass: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
] as const;

// Status Akun Job Sources
export const JOB_SOURCE_STATUSES = [
  { value: 'active', labelKey: 'jobSources.statusActive', bgClass: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/25' },
  { value: 'inactive', labelKey: 'jobSources.statusInactive', bgClass: 'bg-slate-400/15 text-slate-400 border-slate-400/25' },
  { value: 'suspended', labelKey: 'jobSources.statusSuspended', bgClass: 'bg-rose-500/15 text-rose-400 border-rose-500/25' },
] as const;


// Breakpoints responsif
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Dimensi layout
export const LAYOUT = {
  navbarHeight: 64,
  sidebarWidth: 260,
  sidebarCollapsedWidth: 72,
  contentMaxWidth: 1280,
} as const;
