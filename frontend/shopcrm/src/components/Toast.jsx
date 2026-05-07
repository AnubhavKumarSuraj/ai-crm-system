import React from 'react';

/**
 * Toast Component
 * Renders a stack of toast notifications at bottom-right.
 * Used with useToast() hook.
 */

const typeStyles = {
  default: 'bg-primary text-primary-fg',
  success: 'bg-[var(--success)] text-white',
  error:   'bg-[var(--danger)]  text-white',
  warn:    'bg-[var(--warn)]    text-white',
};

function Toast({ message, type = 'default', onRemove }) {
  return (
    <div
      onClick={onRemove}
      className={[
        'flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer',
        'text-sm font-medium shadow-lg max-w-xs',
        'animate-[slideIn_0.2s_ease]',
        typeStyles[type] || typeStyles.default,
      ].join(' ')}
      style={{ animation: 'slideIn 0.2s ease' }}
    >
      {message}
    </div>
  );
}

export default function ToastContainer({ toasts, removeToast }) {
  console.log("Toast rendering", toasts);
  if (!toasts || !toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[999]">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onRemove={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
}
