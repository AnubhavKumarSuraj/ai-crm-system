import React, { useState } from 'react';
import { useApp } from '../components/Layout';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input, { FormField, Select, Textarea } from '../components/Input';
import { localId, todayISO, sleep, daysSince, formatDate } from '../utils/helpers';
import * as api from '../services/api';

// ─── Create Campaign Modal ────────────────────────────────────────────────────
function CreateCampaignModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm]     = useState({ name: '', message: '', type: 'manual' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Campaign name is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      let campaign = { ...form };
      if (api.USE_DUMMY_DATA) {
        await sleep(400);
        campaign.id      = localId('p');
        campaign.created = todayISO();
      } else {
        const res = await api.createCampaign(form);
        campaign.id      = res.campaign_id;
        campaign.created = todayISO();
      }
      onSuccess(campaign);
      setForm({ name: '', message: '', type: 'manual' });
      onClose();
    } catch (err) {
      setErrors({ submit: 'Failed to create campaign. Check backend connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Campaign">
      <Modal.Body>
        <div className="space-y-3.5">
          <FormField label="Campaign Name *" error={errors.name}>
            <Input placeholder="e.g. Diwali Festival Offer" value={form.name} onChange={set('name')} />
          </FormField>
          <FormField label="Message *" error={errors.message}>
            <Textarea
              placeholder="Hi {name}, we have a special offer for you…"
              value={form.message}
              onChange={set('message')}
              rows={3}
            />
            <span className="text-[11px]" style={{ color: 'var(--text3)' }}>
              Use &#123;name&#125; as a placeholder for the customer's name.
            </span>
          </FormField>
          <FormField label="Campaign Type">
            <Select value={form.type} onChange={set('type')}>
              <option value="manual">Manual</option>
              <option value="automated">Automated</option>
            </Select>
          </FormField>
        </div>
        {errors.submit && (
          <p className="mt-3 text-xs" style={{ color: 'var(--danger)' }}>{errors.submit}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="default" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating…' : 'Create Campaign'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ─── Trigger Campaign Modal ───────────────────────────────────────────────────
function TriggerCampaignModal({ isOpen, onClose, campaign, customers, onSuccess }) {
  const [target, setTarget]   = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  if (!campaign) return null;

  const estimate = target === 'inactive'
    ? customers.filter((c) => daysSince(c.last_visit) > 30).length
    : customers.length;

  const handleClose = () => {
    setResult(null);
    setError('');
    setTarget('all');
    onClose();
  };

  const handleTrigger = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let sent = 0;
      if (api.USE_DUMMY_DATA) {
        await sleep(700);
        sent = estimate;
      } else {
        const res = await api.triggerCampaign({ campaign_id: campaign.id, target });
        sent = res.messages_sent;
      }
      setResult(sent);
      onSuccess(campaign.name, sent, target);
    } catch (err) {
      setError('Failed to send. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Trigger Campaign">
      <Modal.Body>
        <div className="font-semibold text-sm mb-1">{campaign.name}</div>
        <div
          className="text-sm mb-4 p-3 rounded-lg border"
          style={{
            background: 'var(--surface2)',
            borderColor: 'var(--border)',
            color: 'var(--text2)',
            lineHeight: 1.6,
          }}
        >
          {campaign.message}
        </div>

        <FormField label="Send To">
          <div className="flex gap-2 mt-1">
            {['all', 'inactive'].map((val) => (
              <button
                key={val}
                onClick={() => setTarget(val)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={
                  target === val
                    ? { background: 'var(--primary)', color: 'var(--primary-fg)', borderColor: 'var(--primary)' }
                    : { background: 'var(--surface)', color: 'var(--text2)', borderColor: 'var(--border2)' }
                }
              >
                {val === 'all' ? 'All Customers' : 'Inactive Only'}
              </button>
            ))}
          </div>
        </FormField>

        <p className="text-xs mt-3" style={{ color: 'var(--text3)' }}>
          Will send to approximately <strong>{estimate}</strong> customer{estimate !== 1 ? 's' : ''}
        </p>

        {result !== null && (
          <p className="mt-3 text-sm font-medium" style={{ color: 'var(--success)' }}>
            ✓ Sent to {result} customer{result !== 1 ? 's' : ''} successfully!
          </p>
        )}
        {error && (
          <p className="mt-3 text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={handleClose}>
          {result !== null ? 'Close' : 'Cancel'}
        </Button>
        {result === null && (
          <Button variant="hero" onClick={handleTrigger} disabled={loading}>
            <SendIcon />
            {loading ? 'Sending…' : 'Send Campaign'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

// ─── Campaigns Page ───────────────────────────────────────────────────────────
export default function Campaigns() {
  const { campaigns, setCampaigns, customers, showToast, addLog } = useApp();
  const [createOpen, setCreateOpen]   = useState(false);
  const [triggerCamp, setTriggerCamp] = useState(null);

  const handleCreate = (campaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
    showToast(`Campaign "${campaign.name}" created`, 'success');
    addLog('Campaign Created', campaign.name, 'success');
  };

  const handleTriggerSuccess = (name, sent, target) => {
    showToast(`Sent to ${sent} customers`, 'success');
    addLog('Campaign Triggered', `${name} → ${target} (${sent} sent)`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Campaigns</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="default" onClick={() => setCreateOpen(true)}>
          <PlusIcon /> Create Campaign
        </Button>
      </div>

      {/* Campaign grid */}
      {campaigns.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 opacity-30">📢</div>
          <p className="text-sm font-medium" style={{ color: 'var(--text2)' }}>No campaigns yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>Create your first campaign to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3.5">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onTrigger={() => setTriggerCamp(c)}
            />
          ))}
        </div>
      )}

      <CreateCampaignModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreate}
      />

      <TriggerCampaignModal
        isOpen={!!triggerCamp}
        onClose={() => setTriggerCamp(null)}
        campaign={triggerCamp}
        customers={customers}
        onSuccess={handleTriggerSuccess}
      />
    </div>
  );
}

function CampaignCard({ campaign, onTrigger }) {
  return (
    <div
      className="bg-surface border rounded-lg p-4 flex flex-col gap-3 transition-colors"
      style={{ borderColor: 'var(--border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border2)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-tight">{campaign.name}</span>
        <Badge variant={campaign.type === 'manual' ? 'info' : 'accent'}>{campaign.type}</Badge>
      </div>

      <p
        className="text-xs leading-relaxed flex-1"
        style={{
          color: 'var(--text2)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {campaign.message}
      </p>

      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[11px]" style={{ color: 'var(--text3)' }}>
          {campaign.created ? formatDate(campaign.created) : ''}
        </span>
        <Button variant="hero" size="sm" onClick={onTrigger}>
          <SendIcon /> Trigger
        </Button>
      </div>
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

function SendIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3L2 7l4 2 2 5 2-4 4-7z"/>
    </svg>
  );
}
