'use client';

import React from 'react';
import { Sun, Moon, Globe, Menu, Plus, Lock, Keyboard } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenNewApplicationModal?: () => void;
  onLockDashboard?: () => void;
  onOpenShortcuts?: () => void;
  searchInputValue?: string;
  onSearchInputChange?: (val: string) => void;
}

export default function Navbar({
  onToggleSidebar,
  onOpenNewApplicationModal,
  onLockDashboard,
  onOpenShortcuts,
}: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : true;

  return (
    <nav className="glass-navbar fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 border-b border-[var(--glass-border)] shadow-[var(--inner-highlight),0_4px_20px_rgba(0,0,0,0.1)]">
      {/* Edge Lighting Highlight Bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--edge-top)] to-transparent pointer-events-none" />

      {/* Kiri: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-[var(--glass-surface-strong)] active-press focus-ring transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent-400)] to-[var(--color-accent-600)] rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-700)] flex items-center justify-center shadow-lg border border-white/20">
              <span className="text-white font-heading font-bold text-sm tracking-wider">RW</span>
            </div>
          </div>

          <div className="hidden sm:block">
            <h1 className="font-heading text-lg font-bold bg-gradient-to-r from-[var(--accent-primary)] via-[var(--color-accent-300)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              {t('app.name')}
            </h1>
            <p className="text-[10px] font-medium text-[var(--text-muted)] tracking-wider uppercase">
              Job Tracker
            </p>
          </div>
        </div>
      </div>

      {/* Kanan: Quick Actions, Shortcuts, Lock, Toggle Bahasa & Tema */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Add Button */}
        {onOpenNewApplicationModal && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={onOpenNewApplicationModal}
            className="hidden sm:inline-flex shadow-sm"
          >
            {t('common.add')}
          </Button>
        )}

        {/* Shortcuts Help Button */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className={cn(
              'p-2 rounded-xl transition-all',
              'hover:bg-[var(--glass-surface-strong)] active-press focus-ring',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--glass-border)]'
            )}
            aria-label={t('common.shortcuts')}
            title="Pintasan Keyboard (?)"
          >
            <Keyboard size={18} className="text-[var(--accent-primary)]" />
          </button>
        )}

        {/* Lock Dashboard Button */}
        {onLockDashboard && (
          <button
            onClick={onLockDashboard}
            className={cn(
              'p-2 rounded-xl transition-all',
              'hover:bg-[var(--glass-surface-strong)] active-press focus-ring',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--glass-border)]'
            )}
            aria-label={t('auth.lockDashboard')}
            title="Kunci Dashboard (L)"
          >
            <Lock size={18} className="text-amber-400" />
          </button>
        )}

        {/* Toggle Bahasa (ID / EN) */}
        <button
          onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
            'hover:bg-[var(--glass-surface-strong)] active-press focus-ring transition-all',
            'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--glass-border)]'
          )}
          aria-label={t('common.language')}
          title="Switch Language (ID/EN)"
        >
          <Globe size={16} className="text-[var(--accent-primary)]" />
          <span className="uppercase font-mono">{locale}</span>
        </button>

        {/* Toggle Tema (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className={cn(
            'p-2 rounded-xl transition-all',
            'hover:bg-[var(--glass-surface-strong)] active-press focus-ring',
            'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--glass-border)]'
          )}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-300" />
          ) : (
            <Moon size={18} className="text-sky-600" />
          )}
        </button>
      </div>
    </nav>
  );
}
