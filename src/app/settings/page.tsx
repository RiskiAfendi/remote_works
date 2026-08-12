'use client';

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Sun,
  Moon,
  Globe,
  KeyRound,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { PinSettingsModal } from '@/features/auth/PinSettingsModal';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { isPinEnabled, hasCustomPinSet, lock, resetToDefaultPin } = useAuth();
  const toast = useToast();

  const [isPinSettingsOpen, setIsPinSettingsOpen] = useState<boolean>(false);

  const handleResetPin = () => {
    resetToDefaultPin();
    toast.info(t('settings.pinResetToast'));
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header Halaman Pengaturan */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
            <Sparkles size={12} />
            {t('settings.systemBadge')}
          </span>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
          {t('settings.title')}
        </h1>
        <p className="text-[var(--text-secondary)] text-xs md:text-sm mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* 1. Keamanan & Proteksi PIN Dashboard */}
      <section className="solid-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield size={22} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-[var(--text-primary)]">
                {t('settings.pinSectionTitle')}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {t('settings.pinSectionSub')}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 items-center gap-1.5">
            <CheckCircle2 size={13} />
            {isPinEnabled ? t('settings.pinActive') : t('settings.pinReady')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Box Status PIN */}
          <div className="p-4 rounded-2xl glass-panel space-y-2">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">
              {t('settings.credentialStatus')}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {hasCustomPinSet ? t('settings.customPinSet') : t('settings.defaultPinSet')}
              </span>
              <KeyRound size={18} className="text-amber-400" />
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {hasCustomPinSet ? t('settings.customPinDesc') : t('settings.defaultPinDesc')}
            </p>
          </div>

          {/* Box Akses Cepat Kunci */}
          <div className="p-4 rounded-2xl glass-panel space-y-2">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase">
              {t('settings.quickAction')}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {t('settings.lockNow')}
              </span>
              <Lock size={18} className="text-sky-400" />
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {t('settings.lockShortcutDesc')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="primary"
            leftIcon={<KeyRound size={16} />}
            onClick={() => setIsPinSettingsOpen(true)}
            className="shadow-sm"
          >
            {t('settings.createChangePin')}
          </Button>

          <Button
            variant="secondary"
            leftIcon={<Lock size={16} />}
            onClick={lock}
          >
            {t('settings.lockDashboardBtn')}
          </Button>

          {hasCustomPinSet && (
            <Button
              variant="outline"
              leftIcon={<RefreshCw size={14} />}
              onClick={handleResetPin}
              className="text-xs"
            >
              {t('settings.resetDefaultBtn')}
            </Button>
          )}
        </div>
      </section>

      {/* 2. Preferensi Tampilan & Antarmuka */}
      <section className="solid-card p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--glass-border)] pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Sun size={22} />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[var(--text-primary)]">
              {t('settings.appearanceSectionTitle')}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {t('settings.appearanceSectionSub')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Toggle Tema */}
          <div className="p-4 rounded-2xl glass-panel flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[var(--text-primary)] block">
                {t('settings.displayMode')}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] block">
                {theme === 'dark' ? t('settings.activeThemeDark') : t('settings.activeThemeLight')}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              leftIcon={theme === 'dark' ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} className="text-sky-600" />}
            >
              {t('settings.changeTheme')}
            </Button>
          </div>

          {/* Toggle Bahasa */}
          <div className="p-4 rounded-2xl glass-panel flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[var(--text-primary)] block">
                {t('settings.appLanguage')}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] block">
                {t('settings.installedLanguage', {
                  lang: locale === 'en' ? t('settings.langEN') : t('settings.langID'),
                })}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
              leftIcon={<Globe size={16} className="text-[var(--accent-primary)]" />}
            >
              {t('settings.switchLangBtn')}
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Informasi Sistem Aplikasi */}
      <section className="solid-card p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-[var(--glass-border)] pb-4">
          <Info size={20} className="text-[var(--text-muted)]" />
          <h2 className="font-heading text-base font-bold text-[var(--text-primary)]">
            {t('settings.systemInfoTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[var(--text-muted)] block">{t('settings.infoApp')}</span>
            <span className="font-semibold text-[var(--text-primary)] block mt-0.5">Remote Works v1.0.0</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block">{t('settings.infoDatabase')}</span>
            <span className="font-semibold text-[var(--text-primary)] block mt-0.5">Firebase Firestore</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block">{t('settings.infoStorage')}</span>
            <span className="font-semibold text-[var(--text-primary)] block mt-0.5">Firebase Storage</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block">{t('settings.infoUI')}</span>
            <span className="font-semibold text-[var(--text-primary)] block mt-0.5">Ocean Breeze Liquid Glass</span>
          </div>
        </div>
      </section>

      {/* Modal Pengaturan & Verifikasi PIN */}
      <PinSettingsModal
        isOpen={isPinSettingsOpen}
        onClose={() => setIsPinSettingsOpen(false)}
      />
    </div>
  );
}
