'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, disabled, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'glass-input w-full px-3.5 py-2.5 text-sm transition-all placeholder:text-[var(--text-muted)] resize-y min-h-[80px]',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/25',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs font-medium text-red-400 animate-slide-up">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
