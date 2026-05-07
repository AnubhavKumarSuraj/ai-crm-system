import React from 'react';

/**
 * Button Component
 * Variants: default | outline | secondary | ghost | link | hero | danger
 * Sizes: sm | md (default)
 */

const variantStyles = {
  default:      'bg-primary text-primary-fg border-primary hover:brightness-110 shadow-sm transition-all',
  outline:      'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-surface2 hover:border-[var(--border2)] shadow-sm transition-all',
  secondary:    'bg-surface2 text-[var(--text)] border-[var(--border)] hover:border-[var(--border2)] shadow-sm transition-all',
  ghost:        'bg-transparent border-transparent text-[var(--text2)] hover:bg-surface2 hover:text-[var(--text)] transition-all',
  link:         'bg-transparent border-transparent text-[var(--accent)] hover:underline p-0 transition-all',
  hero:         'bg-[var(--accent)] text-white border-transparent hover:brightness-110 shadow-md shadow-[var(--accent)]/20 hover:shadow-lg hover:shadow-[var(--accent)]/30 hover:-translate-y-0.5 transition-all',
  danger:       'bg-[var(--danger-light)] text-[var(--danger)] border-transparent hover:brightness-95 transition-all',
  whitePrimary: 'bg-white text-indigo-700 border-transparent hover:bg-gray-50 shadow-lg hover:-translate-y-0.5 transition-all',
};

const sizeStyles = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
};

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium',
        'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]',
        'transition-all duration-200 cursor-pointer leading-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.md,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
