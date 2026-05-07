import React, { useState, useMemo } from 'react';
import { useApp } from '../components/Layout';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input, { FormField, Select } from '../components/Input';
import { daysSince, formatDate, customerStatus, localId, todayISO, sleep } from '../utils/helpers';
import * as api from '../services/api';

const statusVariant = { active: 'success', inactive: 'warn', dormant: 'neutral' };

// ─── Add Customer Form ────────────────────────────────────────────────────────
function AddCustomerModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', last_visit: todayISO() });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      let customer = { ...form };
      if (api.USE_DUMMY_DATA) {
        await sleep(400);
        customer.id = localId('c');
      } else {
        const res = await api.addCustomer(form);
        customer.id = res.customer_id;
      }
      onSuccess(customer);
      setForm({ name: '', phone: '', email: '', last_visit: todayISO() });
      onClose();
    } catch (err) {
      setErrors({ submit: 'Failed to add customer. Check backend connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Customer">
      <Modal.Body>
        <div className="grid grid-cols-2 gap-3.5">
          <FormField label="Full Name *" error={errors.name}>
            <Input placeholder="Ravi Kumar" value={form.name} onChange={set('name')} />
          </FormField>
          <FormField label="Phone *" error={errors.phone}>
            <Input placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <Input type="email" placeholder="ravi@email.com" value={form.email} onChange={set('email')} />
          </FormField>
          <FormField label="Last Visit">
            <Input type="date" value={form.last_visit} onChange={set('last_visit')} />
          </FormField>
        </div>
        {errors.submit && (
          <p className="mt-3 text-xs" style={{ color: 'var(--danger)' }}>{errors.submit}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="default" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding…' : 'Add Customer'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ─── Customers Page ───────────────────────────────────────────────────────────
export default function Customers() {
  const { customers, setCustomers, showToast, addLog } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [selected, setSelected] = useState([]);

  const stats = useMemo(() => {
    const list = Array.isArray(customers) ? customers : [];
    let active = 0, atRisk = 0, inactive = 0;
    list.forEach(c => {
      const d = daysSince(c?.last_visit || todayISO());
      if (d <= 45) active++;
      else if (d <= 90) atRisk++;
      else inactive++;
    });
    return { total: list.length, active, atRisk, inactive, highRisk: atRisk + inactive };
  }, [customers]);

  const filtered = useMemo(() => {
    return (Array.isArray(customers) ? customers : []).filter((c) => {
      const q = (search || '').toLowerCase();
      const matchQ = !q || (c?.name || '').toLowerCase().includes(q) || (c?.phone || '').includes(q) || (c?.email || '').toLowerCase().includes(q);
      const d = daysSince(c?.last_visit || todayISO());
      const matchF =
        filter === 'all' ||
        (filter === 'active' && d <= 30) ||
        (filter === 'at-risk' && d > 30 && d <= 60) ||
        (filter === 'inactive' && d > 60);
      return matchQ && matchF;
    });
  }, [customers, search, filter]);

  const handleAdd = (customer) => {
    setCustomers((prev) => [customer, ...prev]);
    showToast(`${customer.name} added`, 'success');
    addLog('Customer Added', customer.name, 'success');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;

    try {
      if (api.USE_DUMMY_DATA) {
        await sleep(400);
      } else {
        await api.deleteCustomer(id);
      }

      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast(`${name} removed`, 'success');
      addLog('Customer Removed', name, 'success');
    } catch (err) {
      showToast(`Failed to remove ${name}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-sm mt-1 text-gray-500 font-medium">
            Manage your {stats.total} customer{stats.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="hero" className="px-5 shadow-sm hover:shadow-md transition-shadow" onClick={() => setModalOpen(true)}>
          <PlusIcon /> Add Customer
        </Button>
      </div>

      {/* Insight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center gap-4 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">Total Customers</p>
            <h4 className="text-2xl font-semibold text-gray-900">{stats.total}</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Across all segments</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center gap-4 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">Active</p>
            <h4 className="text-2xl font-semibold text-gray-900">{stats.active}</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Visited in last 30 days</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center gap-4 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">At Risk</p>
            <h4 className="text-2xl font-semibold text-gray-900">{stats.atRisk}</h4>
            <p className="text-[10px] text-amber-500 mt-0.5 font-medium">Likely to churn soon</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center gap-4 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-0.5">Inactive</p>
            <h4 className="text-2xl font-semibold text-gray-900">{stats.inactive}</h4>
            <p className="text-[10px] text-indigo-500 mt-0.5 font-medium">Not visited in 60+ days</p>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      {stats.highRisk > 0 && (
        <div className="bg-indigo-100 border border-indigo-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">⚡</div>
            <div>
              <p className="text-base font-bold text-indigo-900 mb-1">
                {stats.highRisk} high-risk customer{stats.highRisk !== 1 ? 's' : ''} detected.
              </p>
              <p className="text-sm text-indigo-700 font-medium">
                Act now to prevent revenue loss.
              </p>
            </div>
          </div>
          <Button variant="hero" className="shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 px-6 py-3 text-sm font-bold whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white border-0">
            Recover Now
          </Button>
        </div>
      )}

      {/* Table card */}
      <Card className="shadow-sm border-gray-200 overflow-hidden rounded-xl">
        {/* Filters */}
        <CardHeader
          title=""
          className="border-b border-gray-100 bg-gray-50/30 px-6 py-4"
          action={
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <Input
                  placeholder="Search name, phone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 pl-9 rounded-lg border-gray-200 shadow-sm text-sm"
                />
              </div>
              <div className="flex bg-gray-100/80 p-1 rounded-lg">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${filter === 'all' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${filter === 'active' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('at-risk')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${filter === 'at-risk' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                  At Risk
                </button>
                <button
                  onClick={() => setFilter('inactive')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${filter === 'inactive' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                  Inactive
                </button>
              </div>
            </div>
          }
        />

        {selected.length > 0 && (
          <div className="bg-indigo-600 text-white rounded-xl px-6 py-3 mt-4 mb-2 mx-4 flex items-center justify-between shadow-md">
            <span className="font-semibold text-sm">{selected.length} customer{selected.length !== 1 ? 's' : ''} selected</span>

            <div className="flex items-center gap-3">
              <button onClick={() => setSelected([])} className="text-white/80 hover:text-white text-sm transition-colors">
                Clear
              </button>
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition">
                ⚡ Recover Selected
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto pb-4 px-2">
          <table className="w-full text-left border-separate" style={{ borderSpacing: '0 12px' }}>
            <thead>
              <tr>
                <th className="px-6 py-2 w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                    onChange={(e) => {
                      if (e.target.checked) setSelected(filtered.map(c => c.id));
                      else setSelected([]);
                    }}
                    checked={selected.length > 0 && selected.length === filtered.length}
                  />
                </th>
                <th className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(filtered) || filtered.length === 0) ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-sm text-gray-500 bg-gray-50/30">
                    <div className="flex flex-col items-center justify-center space-y-3">
                       <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                       <span>{search || filter !== 'all' ? 'No customers match your filters.' : 'No customers yet. Add your first one!'}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                (Array.isArray(filtered) ? filtered : []).map((c) => {
                  const d = daysSince(c?.last_visit || todayISO());
                  const isCritical = d > 90;
                  const isWarning = d > 45 && d <= 90;
                  const isActive = d <= 45;
                  
                  let rowColor = 'bg-white border-l-[4px] border-l-transparent';
                  if (isCritical) rowColor = 'bg-white border-l-[4px] border-l-red-500';
                  else if (isWarning) rowColor = 'bg-white border-l-[4px] border-l-amber-400';
                  
                  let statusBadge = null;
                  if (isActive) statusBadge = <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200/50">Active</span>;
                  else if (isCritical) statusBadge = <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-red-100 text-red-700 shadow-sm border border-red-200/50">Inactive • {d} days</span>;
                  else statusBadge = <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700 shadow-sm border border-amber-200/50">At Risk • {d} days</span>;

                  let avatarColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                  if (isCritical) avatarColor = 'bg-red-100 text-red-700 border-red-200';
                  else if (isWarning) avatarColor = 'bg-amber-100 text-amber-700 border-amber-200';

                  return (
                    <tr key={c?.id} className={`hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50/50 transition-all duration-300 group shadow-sm ${rowColor}`}>
                      <td className={`px-6 py-5 rounded-l-2xl border-y border-gray-100 ${rowColor.split(' ').slice(1).join(' ')}`}>
                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                          checked={selected.includes(c?.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelected([...selected, c.id]);
                            else setSelected(selected.filter(id => id !== c.id));
                          }}
                        />
                      </td>
                      <td className="px-4 py-5 border-y border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base border shadow-sm ${avatarColor}`}>
                            {(c?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{c?.name}</div>
                            <div className={`text-xs mt-0.5 font-medium flex items-center gap-1.5 ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-gray-500'}`}>
                              <span>{isCritical ? '⚠️ High risk' : isWarning ? '⚠️ Medium risk' : '✅ Safe'}</span>
                              <span className="text-gray-300">•</span>
                              <span>{d > 0 ? `Inactive for ${d} days` : 'Active today'}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium mt-0.5">Last contacted: Never</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 border-y border-gray-100">
                        <span className="text-sm font-semibold text-gray-700">{c.phone}</span>
                      </td>
                      <td className="px-6 py-5 border-y border-gray-100 text-sm text-gray-800 font-semibold">
                        {c?.last_visit ? formatDate(c.last_visit) : '—'}
                      </td>
                      <td className="px-6 py-5 border-y border-gray-100">
                        {statusBadge}
                      </td>
                      <td className="px-6 py-5 rounded-r-2xl border-y border-r border-gray-100 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {isCritical || isWarning ? (
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200">
                              Recover
                            </button>
                          ) : null}
                          <button className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg hover:scale-105 active:scale-95 shadow-sm transition-all duration-200">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddCustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleAdd}
      />
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 1v10M1 6h10" />
    </svg>
  );
}
