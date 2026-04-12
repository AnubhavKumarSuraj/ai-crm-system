import React, { useEffect } from 'react';
import Button from './Button';

/**
 * Modal Component
 * Usage:
 *   <Modal isOpen={bool} onClose={fn} title="Title">
 *     <Modal.Body>...</Modal.Body>
 *     <Modal.Footer>...</Modal.Footer>
 *   </Modal>
 */

export default function Modal({ isOpen, onClose, title, children, maxWidth = '480px' }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-surface rounded-xl w-full shadow-xl"
        style={{ maxWidth }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)]">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-[var(--text2)] hover:bg-surface2 hover:text-[var(--text)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

Modal.Body = function ModalBody({ children, className = '' }) {
  return <div className={`px-5 py-5 ${className}`}>{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[var(--border)]">
      {children}
    </div>
  );
};
