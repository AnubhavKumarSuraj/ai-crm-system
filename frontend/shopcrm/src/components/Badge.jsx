import React from 'react';

/**
 * Badge Component
 * Variants: success | warn | info | accent | neutral | danger
 */

const variantStyles = {
  success: 'bg-[var(--success-light)] text-[var(--success)]',
  warn:    'bg-[var(--warn-light)]    text-[var(--warn)]',
  info:    'bg-[var(--info-light)]    text-[var(--info)]',
  accent:  'bg-[var(--accent-light)]  text-[var(--accent-text)]',
  purple:  'bg-[#f3e8ff]             text-[#7e22ce]',
  neutral: 'bg-surface2               text-[var(--text2)]',
  danger:  'bg-[var(--danger-light)]  text-[var(--danger)]',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium',
        variantStyles[variant] || variantStyles.neutral,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
