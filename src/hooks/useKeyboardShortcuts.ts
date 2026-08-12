'use client';

import { useEffect } from 'react';

export interface ShortcutHandlers {
  onSearchFocus?: () => void;
  onNewApplication?: () => void;
  onToggleLock?: () => void;
  onToggleHelp?: () => void;
  onEscape?: () => void;
  disabled?: boolean;
}

/**
 * Custom Hook untuk mendengarkan tombol pintasan keyboard global (Shortcuts).
 */
export function useKeyboardShortcuts({
  onSearchFocus,
  onNewApplication,
  onToggleLock,
  onToggleHelp,
  onEscape,
  disabled = false,
}: ShortcutHandlers) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Abaikan shortcut jika user sedang mengetik di input / textarea
      const target = event.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Escape selalu berfungsi bahkan saat typing
      if (event.key === 'Escape') {
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          target.blur();
        }
        if (onEscape) {
          onEscape();
        }
        return;
      }

      if (isTyping) return;

      // 1. Search focus: '/' atau 'Ctrl+K' / 'Cmd+K'
      if (
        event.key === '/' ||
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')
      ) {
        event.preventDefault();
        onSearchFocus?.();
      }

      // 2. New application: 'n' atau 'N'
      if (!event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        onNewApplication?.();
      }

      // 3. Lock dashboard: 'l' atau 'L'
      if (!event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        onToggleLock?.();
      }

      // 4. Toggle Help: '?'
      if (event.key === '?') {
        event.preventDefault();
        onToggleHelp?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchFocus, onNewApplication, onToggleLock, onToggleHelp, onEscape, disabled]);
}
