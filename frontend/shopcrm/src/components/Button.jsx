import React from 'react';

/**
 * Button Component
 * Variants: default | outline | secondary | ghost | link | hero | danger
 * Sizes: sm | md (default)
 */

const variantStyles = {
  default:   'bg-primary text-primary-fg border-primary hover:opacity-90',
  outline:   'bg-transparent text-[var(--text)] border-[var(--border2)] hover:bg-surface2',
  secondary: 'bg-surface2 text-[var(--text)] border-[var(--border)] hover:border-[var(--border2)]',
  ghost:     'bg-transparent border-transparent text-[var(--text2)] hover:bg-surface2 hover:text-[var(--text)]',
  link:      'bg-transparent border-transparent text-[var(--accent)] hover:underline p-0',
  hero:      'bg-accent text-white border-accent hover:opacity-90',
  danger:    'bg-[var(--danger-light)] text-[var(--danger)] border-transparent hover:opacity-90',
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
        'inline-flex items-center gap-1.5 rounded border font-medium',
        'transition-all duration-150 cursor-pointer leading-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
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
