import React from 'react';

/**
 * Input Component
 * Supports: text, email, tel, date, password
 * Also exports: Textarea, Select
 */

const baseClass = [
  'w-full px-3 py-2 rounded border border-[var(--border2)]',
  'bg-surface text-[var(--text)] text-sm placeholder:text-[var(--text3)]',
  'transition-colors duration-150',
  'focus:outline-none focus:border-primary',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

export default function Input({ className = '', ...props }) {
  return <input className={`${baseClass} ${className}`} {...props} />;
}

export function Textarea({ className = '', rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`${baseClass} resize-y ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={`${baseClass} cursor-pointer ${className}`} {...props}>
      {children}
    </select>
  );
}

export function FormField({ label, error, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-[var(--text2)]">{label}</label>
      )}
      {children}
      {error && (
        <span className="text-xs text-[var(--danger)]">{error}</span>
      )}
    </div>
  );
}
