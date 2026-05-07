import React from 'react';

export default function StatsCard({ label, value, note, icon, noteBadge }) {
  return (
    <div className="bg-white border border-gray-100/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 flex flex-col relative overflow-hidden group">
      <div className="flex items-start justify-between mb-2">
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-indigo-500 group-hover:scale-105 transition-all duration-200">
          {icon}
        </div>
        {noteBadge && (
          <div className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {noteBadge}
          </div>
        )}
      </div>
      
      <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </div>
      
      <div className="text-3xl font-bold text-gray-900 tracking-tight flex items-end gap-2">
        {value}
        {note && <span className="text-[12px] font-medium text-gray-400 mb-0.5">{note}</span>}
      </div>
    </div>
  );
}
