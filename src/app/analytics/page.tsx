'use client';

import { useI18n } from '@/context/I18nContext';

export default function AnalyticsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
        {t('nav.analytics')}
      </h1>
      <div className="solid-card p-8 text-center space-y-3">
        <span className="text-4xl">📊</span>
        <p className="text-[var(--text-secondary)]">
          {t('common.noData')}
        </p>
      </div>
    </div>
  );
}
