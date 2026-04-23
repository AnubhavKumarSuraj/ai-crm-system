import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    section: 'Overview',
    links: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="6" height="6" rx="1.5"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5"/>
          </svg>
        ),
      },
    ],
  },

  {
    section: 'Manage',
    links: [
      {
        to: '/customers',
        label: 'Customers',
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="5" r="3"/>
            <path d="M1 14c0-3 2-5 5-5s5 2 5 5"/>
            <circle cx="12" cy="5" r="2.5"/>
            <path d="M14.5 14c0-2-1-3.5-2.5-4"/>
          </svg>
        ),
      },

      {
        to: '/campaigns',
        label: 'Campaigns',
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 3L2 7l4 2 2 5 2-4 4-7z"/>
          </svg>
        ),
      },

      {
        to: '/messages',
        label: 'Messages',
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1.5" y="3" width="13" height="10" rx="2"/>
            <path d="M3 5l5 4 5-4"/>
          </svg>
        ),
      },
    ],
  },
];

export default function Navbar() {
  return (
    <aside
      className="flex flex-col flex-shrink-0"
      style={{ width: 220, background: 'var(--primary)' }}
    >
      {/* Brand */}
      <div className="px-5 pt-5 pb-3 border-b border-white/10">
        <div className="text-[15px] font-semibold text-primary-fg tracking-tight">
          ShopCRM
        </div>
        <div
          className="text-[11px] mt-0.5"
          style={{ color: 'rgba(247,246,242,0.35)', fontFamily: "'DM Mono', monospace" }}
        >
          v1.0 · dashboard
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-4">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <div
              className="text-[10px] font-semibold uppercase tracking-widest px-2.5 mb-1.5"
              style={{ color: 'rgba(247,246,242,0.28)' }}
            >
              {group.section}
            </div>
            <div className="space-y-0.5">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium',
                      'transition-all duration-150',
                      isActive
                        ? 'bg-white/[0.13] text-primary-fg'
                        : 'text-white/[0.55] hover:bg-white/[0.07] hover:text-white/80',
                    ].join(' ')
                  }
                >
                  <span className="opacity-80">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <div
          className="text-[11px]"
          style={{ color: 'rgba(247,246,242,0.22)', fontFamily: "'DM Mono', monospace" }}
        >
          API: localhost:5000
        </div>
      </div>
    </aside>
  );
}
