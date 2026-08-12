'use client';

import React from 'react';
import { Command, Keyboard } from 'lucide-react';
import { Modal } from './Modal';
import { useI18n } from '@/context/I18nContext';

export interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  const { t } = useI18n();

  const shortcutsList = [
    { key: '/', description: t('shortcuts.focusSearch') },
    { key: 'Ctrl + K', description: t('shortcuts.focusSearchAlt') },
    { key: 'N', description: t('shortcuts.newApp') },
    { key: 'L', description: t('shortcuts.lockDashboard') },
    { key: '?', description: t('shortcuts.toggleHelp') },
    { key: 'Esc', description: t('shortcuts.closeEsc') },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Keyboard size={20} className="text-[var(--accent-primary)]" />
          <span>{t('shortcuts.modalTitle')}</span>
        </div>
      }
      size="md"
    >
      <div className="space-y-4 py-2">
        <p className="text-xs text-[var(--text-secondary)]">
          {t('shortcuts.modalSubtitle')}
        </p>

        <div className="divide-y divide-[var(--glass-border)] rounded-2xl glass-panel border border-[var(--glass-border)] overflow-hidden">
          {shortcutsList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 sm:p-4 hover:bg-[var(--glass-surface-strong)] transition-colors"
            >
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {item.description}
              </span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[var(--glass-surface-strong)] border border-[var(--glass-border-strong)] text-[var(--accent-primary)] shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1 text-center">
          <Command size={12} />
          <span>{t('shortcuts.pressEscToClose')}</span>
        </div>
      </div>
    </Modal>
  );
}
