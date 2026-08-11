'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Locale } from '@/lib/types';
import enTranslations from '../../public/locales/en/common.json';
import idTranslations from '../../public/locales/id/common.json';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Tipe untuk nested translation object
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = Record<string, TranslationValue>;

/**
 * Provider untuk internasionalisasi (i18n).
 * Mendukung bahasa Indonesia dan English dengan file JSON lokal.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'id';
    const saved = localStorage.getItem('rw-locale') as Locale | null;
    if (saved && (saved === 'en' || saved === 'id')) return saved;
    return 'id';
  });
  const [translations, setTranslations] = useState<Translations>(() =>
    locale === 'id' ? idTranslations : enTranslations
  );
  const [isLoading, setIsLoading] = useState(false);

  // Muat file terjemahan saat locale berubah
  useEffect(() => {
    setTranslations(locale === 'id' ? idTranslations : enTranslations);
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('rw-locale', newLocale);
  }, []);

  /**
   * Fungsi translasi - mengambil nilai dari nested object berdasarkan key.
   * Mendukung parameter template seperti {{name}}.
   * Contoh: t('dashboard.welcome', { name: 'John' })
   */
  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      const keys = key.split('.');
      let value: TranslationValue | undefined = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, TranslationValue>)[k];
        } else {
          return key; // Kembalikan key jika terjemahan tidak ditemukan
        }
      }

      if (typeof value !== 'string') return key;

      // Ganti parameter template {{param}}
      if (params) {
        return Object.entries(params).reduce(
          (str, [paramKey, paramVal]) => str.replace(`{{${paramKey}}}`, paramVal),
          value
        );
      }

      return value;
    },
    [translations]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook untuk mengakses fungsi i18n.
 * Harus digunakan di dalam I18nProvider.
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n harus digunakan di dalam I18nProvider');
  }
  return context;
}
