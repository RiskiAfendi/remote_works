import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Menggabungkan class Tailwind dengan penanganan konflik
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format tanggal ke string lokal
export function formatDate(date: Date, locale: string = 'id-ID'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Format tanggal relatif (misal: '3 hari yang lalu')
export function formatRelativeDate(date: Date, locale: string = 'id'): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (locale === 'en') {
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  if (diffInDays === 0) return 'Hari ini';
  if (diffInDays === 1) return 'Kemarin';
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
  return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
}

// Hitung umur lamaran dalam hari (untuk aging alert)
export function calculateAgingDays(appliedDate: Date): number {
  const now = new Date();
  const diffInMs = now.getTime() - appliedDate.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

// Tentukan level aging berdasarkan jumlah hari
export function getAgingLevel(days: number): 'fresh' | 'warning' | 'danger' {
  if (days < 7) return 'fresh';
  if (days <= 14) return 'warning';
  return 'danger';
}

// Truncate teks panjang
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
