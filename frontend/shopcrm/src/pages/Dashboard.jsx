import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../components/Layout';
import StatsCard from '../components/StatsCard';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';
import SourceBadge from '../components/SourceBadge';
import Button from '../components/Button';
import { daysSince, customerStatus } from '../utils/helpers';
import * as api from '../services/api';

const statusVariant = {
  active: 'success',
  inactive: 'warn',
  dormant: 'neutral',
};

const sourceLabelFromLog = (log) => {
  const text = `${log.event_type || log.event || ''} ${log.details || ''}`.toLowerCase();

  if (text.includes('inactive') || text.includes('recovery')) {
    return 'Recovery';
  }

  if (text.includes('scheduled')) {
    return 'Scheduled';
  }

  if (text.includes('ai')) {
    return 'AI Promo';
  }

  if (text.includes('campaign')) {
    return 'Campaign';
  }

  return 'Legacy';
};

export default function Dashboard() {
  const { customers, campaigns, showToast, addLog } = useApp();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);

  const active = customers.filter(
    (c) => daysSince(c.last_visit) <= 30
  ).length;

  const inactive = customers.length - active;

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await api.getLogs();
      setLogs(res.data || res.logs || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Calculate Retention %
  const retentionPercent = customers.length ? Math.round((active / customers.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-3 pb-4">
      {/* 1. STATS CARDS (TOP ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          label="Total Customers"
          value={customers.length.toLocaleString()}
          noteBadge="+12%"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />

        <StatsCard
          label="Active vs Inactive"
          value={<div className="flex flex-col gap-1 w-full"><span className="text-2xl font-bold text-gray-900">{retentionPercent}%</span><div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${retentionPercent}%` }}></div></div></div>}
          note="Retention"
          icon={<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />

        <StatsCard
          label="Messages Sent"
          value="1.2M"
          note="THIS MONTH"
          icon={<svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />

        <StatsCard
          label="Total Campaigns"
          value={campaigns.length.toLocaleString()}
          note={`${campaigns.filter(c => c.type === 'automated').length} currently live`}
          icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
        />
      </div>

      {/* 3. MAIN ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Chart (70%) */}
        <Card className="lg:col-span-8 px-5 py-4 flex flex-col border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200 rounded-xl bg-white">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Retention Outreach</h3>
              <p className="text-xs text-gray-400 mt-0.5">Volume of recovery messages over the last 30 days</p>
            </div>
            <select className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200/80 rounded-md px-3 py-1.5 focus:ring-1 focus:ring-indigo-500/20 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="flex-1 flex items-end gap-1.5 w-full group pt-2 h-64">
            {[40, 25, 60, 85, 45, 30, 70, 45, 50, 95, 65].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-lg transition-all duration-300 cursor-pointer hover:opacity-90 hover:scale-y-[1.03] origin-bottom ${i % 3 === 0 ? 'bg-indigo-500' : 'bg-indigo-200'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </Card>

        {/* Right Status (30%) */}
        <Card className="lg:col-span-4 px-5 py-4 border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200 rounded-xl flex flex-col bg-white">
          <h3 className="text-base font-semibold text-gray-800">Customer Status</h3>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">Segment distribution</p>

          <div className="space-y-4 flex-1">
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-700 mb-1.5">
                <span>Active</span>
                <span className="text-gray-400 font-normal">{active.toLocaleString()} ({retentionPercent}%)</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${retentionPercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-gray-700 mb-1.5">
                <span>At Risk</span>
                <span className="text-gray-400 font-normal">0 (0%)</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-gray-700 mb-1.5">
                <span>Inactive</span>
                <span className="text-gray-400 font-normal">{inactive.toLocaleString()} ({100 - retentionPercent}%)</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-300 rounded-full transition-all duration-1000" style={{ width: `${100 - retentionPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-3 bg-indigo-50/50 rounded-lg p-2.5 flex items-start gap-2 border border-indigo-50">
            <svg className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <p className="text-[11px] text-indigo-900/70 font-medium leading-relaxed">
              Focus on the <strong className="text-indigo-600">0% At Risk</strong> customers to maximize LTV this month.
            </p>
          </div>
        </Card>
      </div>

      {/* 4. BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Campaigns */}
        <Card className="border border-gray-100/80 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 rounded-xl bg-white">
          <div className="px-4 py-3 border-b border-gray-100/50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Recent Campaigns</h3>
            <span className="text-xs font-medium text-gray-400 cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => navigate('/app/campaigns')}>View all</span>
          </div>

          <div className="p-3 divide-y divide-gray-100">
            {(!Array.isArray(campaigns) || campaigns.length === 0) ? (
              <div className="text-center py-8 text-xs text-gray-400">No campaigns found</div>
            ) : (
              campaigns.slice(0, 3).map((c) => (
                <div key={c.id} className="p-2.5 hover:bg-gray-50/80 rounded-lg transition-all duration-200 flex items-center justify-between group cursor-pointer border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <div className="font-medium text-[13px] text-gray-900">{c.name}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">{c.message}</div>
                    </div>
                  </div>
                  <Badge variant={c.type === 'automated' ? 'success' : 'neutral'} className="text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {c.type === 'automated' ? 'ACTIVE' : 'DRAFT'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Activity Logs */}
        <Card className="border border-gray-100/80 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 rounded-xl bg-white">
          <div className="px-4 py-3 border-b border-gray-100/50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Recent Activity</h3>
            <span className="text-gray-400">...</span>
          </div>

          <div className="p-4">
            {(!Array.isArray(logs) || logs.length === 0) ? (
              <div className="text-center py-8 text-xs text-gray-400">No activity yet</div>
            ) : (
              <div className="relative border-l border-gray-100 ml-3 space-y-5">
                {logs.slice(0, 3).map((log, idx) => (
                  <div key={log.id || idx} className="relative pl-6 group">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-400 ring-4 ring-white group-hover:scale-110 transition-transform duration-200"></div>
                    <div className="text-sm">
                      <span className="text-gray-900 font-medium">{log.event_type || log.event}</span>
                      <span className="text-gray-400"> {log.details}</span>
                    </div>
                    <div className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">
                      {log.time || 'Just now'} • System Event
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function EmptyState({ icon, text, sub }) {
  return (
    <div className="text-center py-10">
      <div className="text-3xl mb-2 opacity-40">
        {icon}
      </div>

      <div
        className="text-sm font-medium"
        style={{ color: 'var(--text2)' }}
      >
        {text}
      </div>

      {sub && (
        <div
          className="text-xs mt-1"
          style={{ color: 'var(--text3)' }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
