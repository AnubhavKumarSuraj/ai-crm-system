import React from 'react';

/**
 * StatsCard Component
 * Displays a single metric with label, value, and optional change/note.
 *
 * Props:
 *   label    - string
 *   value    - string | number
 *   note     - string (optional sub-text)
 *   dotColor - CSS color string for the indicator dot
 */

export default function StatsCard({ label, value, note, dotColor }) {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-lg p-4">
      <div className="flex items-center gap-1.5 mb-2">
        {dotColor && (
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: dotColor }}
          />
        )}
        <span className="text-[11px] font-semibold text-[var(--text3)] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-[26px] font-semibold leading-none text-[var(--text)]">
        {value ?? '—'}
      </div>
      {note && (
        <div className="text-[11px] text-[var(--text3)] mt-1.5">{note}</div>
      )}
    </div>
  );
}
