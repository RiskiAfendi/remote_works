'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, BarChart3, Settings, ChevronLeft, X, Sparkles } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

// Peta ikon berdasarkan nama string
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
};

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <>
      {/* Backdrop overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-fade-in transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'glass-sidebar fixed top-16 bottom-0 z-40 flex flex-col transition-all duration-300 ease-in-out',
          'border-r border-[var(--glass-border)] bg-[var(--glass-surface)]/80 backdrop-blur-xl',
          // Desktop: selalu tampil, bisa collapsed
          'lg:translate-x-0',
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]',
          // Mobile: drawer
          isOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px]',
          'lg:flex'
        )}
      >
        {/* Tombol close mobile */}
        <div className="flex justify-between items-center p-3 border-b border-[var(--glass-border)] lg:hidden">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider pl-2">
            {t('nav.navigation')}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[var(--glass-surface-strong)] focus-ring transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Header menu (Expanded desktop only) */}
        {!isCollapsed && (
          <div className="hidden lg:flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <Sparkles size={12} className="text-[var(--accent-primary)]" />
            <span>{t('nav.mainMenu')}</span>
          </div>
        )}

        {/* Navigasi Utama */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const IconComponent = iconMap[item.icon];
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={isCollapsed ? t(item.labelKey) : undefined}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group focus-ring',
                  isActive
                    ? 'bg-[var(--glass-surface-strong)] text-[var(--accent-primary)] border border-[var(--glass-border-strong)] shadow-[0_0_16px_var(--glass-surface-strong)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--glass-surface)] hover:text-[var(--text-primary)] border border-transparent'
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_8px_var(--accent-primary)]" />
                )}

                {IconComponent && (
                  <IconComponent
                    size={20}
                    className={cn(
                      'shrink-0 transition-colors duration-200',
                      isActive ? 'text-[var(--accent-primary)]' : 'group-hover:text-[var(--text-primary)]'
                    )}
                  />
                )}
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate">
                    {t(item.labelKey)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Collapse Button (Desktop) */}
        <div className="hidden lg:flex p-3 border-t border-[var(--glass-border)] bg-[var(--glass-surface)]/50">
          <button
            onClick={onToggleCollapse}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-200',
              'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
              'hover:bg-[var(--glass-surface-strong)] border border-transparent hover:border-[var(--glass-border)] focus-ring'
            )}
            aria-label={isCollapsed ? t('nav.expand') : t('nav.collapse')}
            title={isCollapsed ? t('nav.expand') : t('nav.collapse')}
          >
            <ChevronLeft
              size={18}
              className={cn(
                'transition-transform duration-300 text-[var(--accent-primary)]',
                isCollapsed && 'rotate-180'
              )}
            />
            {!isCollapsed && <span className="text-xs font-semibold">{t('nav.collapse')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
