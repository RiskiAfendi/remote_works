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
] as const;

// Navigasi sidebar
export const NAV_ITEMS = [
  { labelKey: 'nav.dashboard', href: '/', icon: 'LayoutDashboard' },
  { labelKey: 'nav.applications', href: '/applications', icon: 'FileText' },
  { labelKey: 'nav.analytics', href: '/analytics', icon: 'BarChart3' },
  { labelKey: 'nav.settings', href: '/settings', icon: 'Settings' },
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
