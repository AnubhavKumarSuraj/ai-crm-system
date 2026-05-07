import React from 'react';

/**
 * Card Component
 * Usage:
 *   <Card>
 *     <CardHeader title="Title" action={<Button>...</Button>} />
 *     <CardContent>...</CardContent>
 *     <CardFooter>...</CardFooter>
 *   </Card>
 */

export default function Card({ children, className = '', noPadding = false }) {
  return (
    <div
      className={[
        'bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div
      className={[
        'px-5 py-3.5 border-b border-[var(--border)]',
        'flex items-center justify-between gap-3',
        className,
      ].join(' ')}
    >
      <div>
        <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--text3)] mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div
      className={[
        'px-5 py-3 border-t border-[var(--border)]',
        'flex items-center justify-end gap-2',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
