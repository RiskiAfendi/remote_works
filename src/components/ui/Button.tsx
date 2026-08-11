'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] text-white hover:brightness-110 shadow-md hover:shadow-lg shadow-accent-500/20 border border-white/20',
  secondary:
    'glass-panel text-[var(--text-primary)] hover:bg-[var(--glass-surface-strong)] hover:border-[var(--glass-border-strong)]',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110 shadow-md shadow-red-500/20 border border-white/20',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface)]',
  outline:
    'border border-[var(--glass-border-strong)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--glass-surface)] hover:border-[var(--accent-primary)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isButtonDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring cursor-pointer select-none',
          'active-press hover-lift',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          isButtonDisabled &&
            'opacity-50 pointer-events-none transform-none shadow-none filter-none',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin text-current shrink-0" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
