'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lock, KeyRound, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export interface PinModalProps {
  isOpen: boolean;
  onUnlock: (pin: string) => boolean;
}

export function PinModal({ isOpen, onUnlock }: PinModalProps) {
  const { t } = useI18n();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [unlockedSuccess, setUnlockedSuccess] = useState<boolean>(false);

  // Focus and Keydown listener for numpad / keyboard numbers
  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length < 4) {
        const nextPin = pin + digit;
        setPin(nextPin);
        setError(false);

        // Jika sudah 4 digit, otomatis coba unlock
        if (nextPin.length === 4) {
          const success = onUnlock(nextPin);
          if (success) {
            setUnlockedSuccess(true);
            setTimeout(() => {
              setPin('');
              setUnlockedSuccess(false);
            }, 500);
          } else {
            setError(true);
            setShake(true);
            setTimeout(() => {
              setShake(false);
              setPin('');
            }, 600);
          }
        }
      }
    },
    [pin, onUnlock]
  );

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  }, []);

  // Listen to physical keyboard events when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDigit, handleBackspace]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
    >
      <div
        className={cn(
          'relative w-full max-w-sm p-6 sm:p-8 rounded-3xl space-y-6 text-center shadow-2xl transition-all duration-300',
          'glass-panel border border-[var(--glass-border-strong)] bg-[var(--bg-elevated)]/90 backdrop-blur-2xl',
          shake && 'animate-shake'
        )}
      >
        {/* Subtle Edge Lighting Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" />

        {/* Lock Icon */}
        <div className="flex justify-center">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl border',
              unlockedSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 scale-110'
                : error
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
            )}
          >
            {unlockedSuccess ? (
              <CheckCircle2 size={32} className="animate-bounce" />
            ) : error ? (
              <AlertCircle size={32} />
            ) : (
              <Lock size={32} />
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h2 id="pin-modal-title" className="font-heading text-xl font-bold text-[var(--text-primary)]">
            {t('auth.pinRequired', { defaultValue: 'Dashboard Terkunci' })}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {t('auth.pinSubtitle', { defaultValue: 'Masukkan 4-digit PIN keamanan Anda untuk mengakses data.' })}
          </p>
        </div>

        {/* 4-Digit Indicator Dots */}
        <div className="flex justify-center items-center gap-4 py-2">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={cn(
                  'w-4 h-4 rounded-full transition-all duration-200 border',
                  isFilled
                    ? error
                      ? 'bg-red-500 border-red-400 scale-110 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                      : unlockedSuccess
                      ? 'bg-emerald-400 border-emerald-300 scale-110 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                      : 'bg-[var(--accent-primary)] border-[var(--accent-primary)] scale-110 shadow-[0_0_12px_var(--accent-primary)]'
                    : 'bg-[var(--glass-surface)] border-[var(--glass-border)]'
                )}
              />
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-400 font-medium animate-fade-in flex items-center justify-center gap-1">
            <AlertCircle size={13} />
            {t('auth.invalidPin', { defaultValue: 'PIN salah, silakan coba lagi (Default: 1234)' })}
          </p>
        )}

        {/* Onscreen Liquid Glass Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className={cn(
                'py-3 rounded-2xl text-lg font-bold font-heading transition-all duration-150 active-press focus-ring',
                'glass-panel hover:bg-[var(--glass-surface-strong)] border border-[var(--glass-border)] text-[var(--text-primary)]'
              )}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className={cn(
              'col-start-2 py-3 rounded-2xl text-lg font-bold font-heading transition-all duration-150 active-press focus-ring',
              'glass-panel hover:bg-[var(--glass-surface-strong)] border border-[var(--glass-border)] text-[var(--text-primary)]'
            )}
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className={cn(
              'py-3 rounded-2xl text-xs font-semibold transition-all duration-150 active-press focus-ring',
              'glass-panel hover:bg-[var(--glass-surface-strong)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-red-400'
            )}
          >
            Hapus
          </button>
        </div>

        <div className="pt-2 text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1">
          <Shield size={12} className="text-[var(--accent-primary)]" />
          <span>Personal Local Security (PIN Default: 1234)</span>
        </div>
      </div>
    </div>
  );
}
