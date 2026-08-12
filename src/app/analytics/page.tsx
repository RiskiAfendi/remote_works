'use client';

import React from 'react';
import { useI18n } from '@/context/I18nContext';
import { useApplications } from '@/hooks/useApplications';
import { StatCard } from '@/components/ui/StatCard';
import { StatCardsSkeleton } from '@/features/applications/StatCardsSkeleton';
import { calculateAgingDays, getAgingLevel } from '@/lib/utils';
import {
  BarChart3,
  FileText,
  Send,
  Target,
  Trophy,
  XCircle,
  HelpCircle,
  TrendingUp,
  Percent,
  Clock,
  Briefcase,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useI18n();
  const { applications, loading } = useApplications();

  const total = applications.length;
  const appliedCount = applications.filter((a) => a.status === 'Applied').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;
  const ghostedCount = applications.filter((a) => a.status === 'Ghosted').length;

  // Conversion rates
  const interviewRate = total > 0 ? ((interviewCount / total) * 100).toFixed(1) : '0';
  const offerRate = total > 0 ? ((offerCount / total) * 100).toFixed(1) : '0';
  const responseRate = total > 0 ? (((interviewCount + offerCount + rejectedCount) / total) * 100).toFixed(1) : '0';

  // Aging distribution
  const agingStats = applications.reduce(
    (acc, app) => {
      const days = calculateAgingDays(new Date(app.applied_date));
      const level = getAgingLevel(days);
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    },
    { fresh: 0, warning: 0, danger: 0 } as Record<string, number>
  );

  // Employment type distribution
  const employmentStats = applications.reduce((acc, app) => {
    const type = app.employment_type || 'Full-time';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Halaman */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
          <BarChart3 className="text-[var(--accent-primary)]" size={28} />
          <span>{t('nav.analytics')}</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-xs md:text-sm mt-1">
          Analisis statistik performa dan konversi pencarian kerja remote Anda.
        </p>
      </div>

      {/* 1. Summary Cards */}
      {loading ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('dashboard.totalApplications')}
            value={total.toString()}
            icon={<FileText size={20} />}
            subtitle="Total seluruh lamaran"
            gradientColor="from-blue-400 to-sky-600"
          />
          <StatCard
            title="Interview Rate"
            value={`${interviewRate}%`}
            icon={<Target size={20} />}
            subtitle={`${interviewCount} dari ${total} lamaran`}
            gradientColor="from-purple-400 to-purple-600"
          />
          <StatCard
            title="Offer Rate"
            value={`${offerRate}%`}
            icon={<Trophy size={20} />}
            subtitle={`${offerCount} penawaran kerja`}
            gradientColor="from-emerald-400 to-emerald-600"
          />
          <StatCard
            title="Response Rate"
            value={`${responseRate}%`}
            icon={<TrendingUp size={20} />}
            subtitle="Total mendapat respon"
            gradientColor="from-cyan-400 to-teal-600"
          />
        </div>
      )}

      {/* 2. Status Breakdown Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Status Distribution */}
        <section className="solid-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
            <h2 className="font-heading text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Percent size={18} className="text-[var(--accent-primary)]" />
              <span>Distribusi Status Lamaran</span>
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-mono">{total} total</span>
          </div>

          <div className="space-y-4">
            {/* Applied */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <Send size={14} /> Applied
                </span>
                <span className="text-[var(--text-secondary)]">
                  {appliedCount} ({total > 0 ? Math.round((appliedCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--glass-surface-strong)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (appliedCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Interview */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-purple-400 flex items-center gap-1.5">
                  <Target size={14} /> Interview
                </span>
                <span className="text-[var(--text-secondary)]">
                  {interviewCount} ({total > 0 ? Math.round((interviewCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--glass-surface-strong)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (interviewCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Offer */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Trophy size={14} /> Offer Diterima
                </span>
                <span className="text-[var(--text-secondary)]">
                  {offerCount} ({total > 0 ? Math.round((offerCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--glass-surface-strong)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (offerCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Rejected */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-red-400 flex items-center gap-1.5">
                  <XCircle size={14} /> Rejected
                </span>
                <span className="text-[var(--text-secondary)]">
                  {rejectedCount} ({total > 0 ? Math.round((rejectedCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--glass-surface-strong)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (rejectedCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Ghosted */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <HelpCircle size={14} /> Ghosted (Tanpa Kabar)
                </span>
                <span className="text-[var(--text-secondary)]">
                  {ghostedCount} ({total > 0 ? Math.round((ghostedCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--glass-surface-strong)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (ghostedCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Card: Aging & Employment Breakdown */}
        <div className="space-y-6">
          {/* Aging Distribution */}
          <section className="solid-card p-6 space-y-4">
            <h2 className="font-heading text-base font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--glass-border)] pb-3">
              <Clock size={18} className="text-amber-400" />
              <span>Analisis Umur Lamaran (Aging)</span>
            </h2>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl glass-panel space-y-1">
                <span className="text-[11px] text-emerald-400 font-bold uppercase block">Fresh (&lt; 7 Hari)</span>
                <span className="text-2xl font-bold font-mono text-[var(--text-primary)] block">{agingStats.fresh}</span>
              </div>
              <div className="p-3 rounded-2xl glass-panel space-y-1">
                <span className="text-[11px] text-amber-400 font-bold uppercase block">Follow-up (7-14)</span>
                <span className="text-2xl font-bold font-mono text-[var(--text-primary)] block">{agingStats.warning}</span>
              </div>
              <div className="p-3 rounded-2xl glass-panel space-y-1">
                <span className="text-[11px] text-red-400 font-bold uppercase block">Stale (&gt; 14 Hari)</span>
                <span className="text-2xl font-bold font-mono text-[var(--text-primary)] block">{agingStats.danger}</span>
              </div>
            </div>
          </section>

          {/* Employment Type Distribution */}
          <section className="solid-card p-6 space-y-4">
            <h2 className="font-heading text-base font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--glass-border)] pb-3">
              <Briefcase size={18} className="text-sky-400" />
              <span>Tipe Pekerjaan</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {['Full-time', 'Part-time', 'Contract', 'Hourly'].map((type) => (
                <div key={type} className="p-3 rounded-2xl glass-panel space-y-1">
                  <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase block">{type}</span>
                  <span className="text-xl font-bold font-mono text-[var(--text-primary)] block">
                    {employmentStats[type] || 0}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
