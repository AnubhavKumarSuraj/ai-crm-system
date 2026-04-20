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
  const [form, setForm]     = useState({ name: '', phone: '', email: '', last_visit: todayISO() });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
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
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q   = search.toLowerCase();
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || '').toLowerCase().includes(q);
      const d   = daysSince(c.last_visit);
      const matchF =
        filter === 'all' ||
        (filter === 'active'   && d <= 30) ||
        (filter === 'inactive' && d >  30);
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Customers</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
            {customers.length} customer{customers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="default" onClick={() => setModalOpen(true)}>
          <PlusIcon /> Add Customer
        </Button>
      </div>

      {/* Table card */}
      <Card>
        {/* Filters */}
        <CardHeader
          title=""
          action={
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search name, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52"
              />
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-40"
              >
                <option value="all">All customers</option>
                <option value="active">Active (≤30 days)</option>
                <option value="inactive">Inactive (30+ days)</option>
              </Select>
            </div>
          }
        />

        <div className="overflow-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10" style={{ color: 'var(--text3)' }}>
                    {search || filter !== 'all' ? 'No customers match your filters.' : 'No customers yet. Add your first one!'}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium">{c.name}</td>
                    <td>
                      <span
                        className="px-1.5 py-0.5 rounded text-[12px] border"
                        style={{
                          background: 'var(--surface2)',
                          borderColor: 'var(--border)',
                          color: 'var(--text2)',
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {c.phone}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text2)' }}>{c.email || '—'}</td>
                    <td style={{ color: 'var(--text2)' }}>{c.last_visit ? formatDate(c.last_visit) : '—'}</td>
                    <td>
                      <Badge variant={statusVariant[customerStatus(c.last_visit)]}>
                        {customerStatus(c.last_visit)}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(c.id, c.name)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))
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
      <path d="M6 1v10M1 6h10"/>
    </svg>
  );
}
