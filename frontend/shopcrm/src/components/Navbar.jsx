import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    section: 'Overview',
    links: [
      {
        to: '/app/dashboard',
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
        to: '/app/customers',
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
        to: '/app/campaigns',
        label: 'Campaigns',
        icon: (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 3L2 7l4 2 2 5 2-4 4-7z"/>
          </svg>
        ),
      },

      {
        to: '/app/messages',
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
      className="flex flex-col flex-shrink-0 border-r border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] bg-gradient-to-b from-[#0f172a] to-[#020617]"
      style={{ width: 260 }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <div className="text-[15px] font-semibold text-white tracking-tight leading-none">
              ShopCRM
            </div>
            <div className="text-[10px] mt-1.5 font-medium tracking-widest uppercase text-gray-500">
              Workspace
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <div className="text-[10px] font-medium uppercase tracking-widest px-3 mb-2.5 text-gray-500">
              {group.section}
            </div>
            <div className="space-y-1">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 relative group',
                      isActive
                        ? 'bg-white/5 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-indigo-500 rounded-r-full"></div>
                      )}
                      <span className={`transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'}`}>
                        {link.icon}
                      </span>
                      {link.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <div className="text-xs text-gray-500">
            System Online
          </div>
        </div>
      </div>
    </aside>
  );
}
