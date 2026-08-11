'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
  id,
}: ToggleProps) {
  const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const trackSize = size === 'sm' ? 'w-9 h-5 p-0.5' : 'w-11 h-6 p-1';
  const knobSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';
  const translatePos = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <label
      htmlFor={toggleId}
      className={cn(
        'inline-flex items-center justify-between gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {(label || description) && (
        <div className="space-y-0.5 pr-2">
          {label && (
            <span className="block text-sm font-medium text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {description && (
            <span className="block text-xs text-[var(--text-muted)]">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex shrink-0 rounded-full transition-colors duration-200 ease-in-out focus-ring',
          'border border-[var(--glass-border)]',
          checked
            ? 'bg-[var(--accent-primary)] shadow-[0_0_12px_rgba(14,165,233,0.3)] border-transparent'
            : 'bg-[var(--glass-surface-strong)]',
          trackSize
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-md transform ring-0 transition duration-200 ease-in-out',
            knobSize,
            checked ? translatePos : 'translate-x-0'
          )}
        />
      </button>
    </label>
  );
}

export default Toggle;
