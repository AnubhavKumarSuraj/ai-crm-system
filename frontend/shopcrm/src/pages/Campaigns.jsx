import React, { useState } from 'react';
import { useApp } from '../components/Layout';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input, { FormField, Select, Textarea } from '../components/Input';
import {
  localId,
  todayISO,
  sleep,
  daysSince,
  formatDate,
} from '../utils/helpers';
import * as api from '../services/api';

function CreateCampaignModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    message: '',
    type: 'manual',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((current) => ({
      ...current,
      [key]: e.target.value,
    }));

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Campaign name is required';
    }

    if (!form.message.trim()) {
      nextErrors.message = 'Message is required';
    }

    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      let campaign = { ...form };

      if (api.USE_DUMMY_DATA) {
        await sleep(400);
        campaign.id = localId('p');
        campaign.created = todayISO();
      } else {
        const res = await api.createCampaign(form);
        campaign.id = res.campaign_id;
        campaign.created = todayISO();
      }

      onSuccess(campaign);
      setForm({ name: '', message: '', type: 'manual' });
      onClose();
    } catch (err) {
      setErrors({
        submit: 'Failed to create campaign. Check backend connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Campaign">
      <Modal.Body>
        <div className="space-y-3.5">
          <FormField label="Campaign Name *" error={errors.name}>
            <Input
              placeholder="Diwali Festival Offer"
              value={form.name}
              onChange={set('name')}
            />
          </FormField>

          <FormField label="Message *" error={errors.message}>
            <Textarea
              rows={3}
              value={form.message}
              onChange={set('message')}
              placeholder="Hi {name}, special offer for you..."
            />
          </FormField>

          <FormField label="Campaign Type">
            <Select value={form.type} onChange={set('type')}>
              <option value="manual">Manual</option>
              <option value="automated">Automated</option>
            </Select>
          </FormField>
        </div>

        {errors.submit && (
          <p className="mt-3 text-xs" style={{ color: 'var(--danger)' }}>
            {errors.submit}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function FestivalCampaignModal({ isOpen, onClose, onSuccess }) {
  const [festival, setFestival] = useState('Diwali');
  const [business, setBusiness] = useState('Gym');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await sleep(500);

    const campaign = {
      id: localId('ai'),
      name: `${festival} Special for ${business}`,
      message: `Hi {name}, celebrate ${festival} with our exclusive offers at our ${business}. Visit today and claim your festive benefits!`,
      type: 'automated',
      created: todayISO(),
    };

    onSuccess(campaign);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Festival Campaign">
      <Modal.Body>
        <div className="space-y-3.5">
          <FormField label="Festival">
            <Select value={festival} onChange={(e) => setFestival(e.target.value)}>
              <option>Diwali</option>
              <option>Holi</option>
              <option>Eid</option>
              <option>New Year</option>
            </Select>
          </FormField>

          <FormField label="Business Type">
            <Select value={business} onChange={(e) => setBusiness(e.target.value)}>
              <option>Gym</option>
              <option>Salon</option>
              <option>Clinic</option>
              <option>Store</option>
            </Select>
          </FormField>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="hero" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Campaign'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function TriggerCampaignModal({
  isOpen,
  onClose,
  campaign,
  customers,
  onSuccess,
}) {
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultMode, setResultMode] = useState(null);
  const [error, setError] = useState('');

  if (!campaign) return null;

  const estimate =
    target === 'inactive'
      ? customers.filter((customer) => daysSince(customer.last_visit) > 30).length
      : customers.length;

  const handleTrigger = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setResultMode(null);

    try {
      let sent = estimate;
      let mode = 'local';

      if (!api.USE_DUMMY_DATA) {
        const res = await api.triggerCampaign({
          campaign_id: campaign.id,
          target,
        });

        sent = res.messages_sent;
        mode = res.mode || 'local';
      }

      setResult(sent);
      setResultMode(mode);
      onSuccess(campaign.name, sent, target, mode);
    } catch (err) {
      setError(err.message || 'Failed to trigger campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trigger Campaign">
      <Modal.Body>
        <div className="font-semibold text-sm mb-2">{campaign.name}</div>
        <p className="text-sm mb-4">{campaign.message}</p>

        <FormField label="Send To">
          <Select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="all">All Customers</option>
            <option value="inactive">Inactive Only</option>
          </Select>
        </FormField>

        <p className="mt-3 text-xs" style={{ color: 'var(--text3)' }}>
          Estimated recipients: {estimate}
        </p>

        {result !== null && (
          <p className="mt-3 text-sm" style={{ color: 'var(--success)' }}>
            {resultMode === 'webhook'
              ? `Queued ${result} message row${result !== 1 ? 's' : ''} for automation`
              : `Sent to ${result} customer${result !== 1 ? 's' : ''}`}
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>

        {result === null && (
          <Button variant="hero" onClick={handleTrigger} disabled={loading}>
            {loading ? 'Sending...' : 'Send Campaign'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default function Campaigns() {
  const {
    campaigns,
    setCampaigns,
    customers,
    showToast,
    addLog,
  } = useApp();

  const [createOpen, setCreateOpen] = useState(false);
  const [festivalOpen, setFestivalOpen] = useState(false);
  const [triggerCamp, setTriggerCamp] = useState(null);

  const handleCreate = (campaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
    showToast(`Campaign "${campaign.name}" created`, 'success');
    addLog('Campaign Created', campaign.name, 'success');
  };

  const handleFestivalCreate = async (campaign) => {
    try {
      let savedCampaign = campaign;

      if (!api.USE_DUMMY_DATA) {
        const res = await api.createCampaign({
          name: campaign.name,
          message: campaign.message,
          type: 'automated',
        });

        savedCampaign = {
          ...campaign,
          id: res.campaign_id,
        };
      }

      setCampaigns((prev) => [savedCampaign, ...prev]);
      showToast('AI Festival Campaign Saved', 'success');
      addLog('AI Campaign Generated', campaign.name, 'success');
    } catch (error) {
      showToast('Failed to save campaign', 'error');
    }
  };

  const handleTriggerSuccess = (name, sent, target, mode) => {
    showToast(
      mode === 'webhook'
        ? `Queued ${sent} messages for automation`
        : `Sent to ${sent} customers`,
      'success'
    );

    addLog(
      'Campaign Triggered',
      `${name} -> ${target} (${sent} sent, ${mode})`,
      'success'
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Campaigns</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="hero" onClick={() => setFestivalOpen(true)}>
            AI Festival
          </Button>
          <Button variant="default" onClick={() => setCreateOpen(true)}>
            + Create Campaign
          </Button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16">No campaigns yet</div>
      ) : (
        <div className="grid grid-cols-3 gap-3.5">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onTrigger={() => setTriggerCamp(campaign)}
            />
          ))}
        </div>
      )}

      <CreateCampaignModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreate}
      />

      <FestivalCampaignModal
        isOpen={festivalOpen}
        onClose={() => setFestivalOpen(false)}
        onSuccess={handleFestivalCreate}
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
    <Card>
      <CardHeader
        title={campaign.name}
        action={
          <Badge variant={campaign.type === 'manual' ? 'info' : 'accent'}>
            {campaign.type}
          </Badge>
        }
      />

      <div className="space-y-3">
        <p className="text-sm">{campaign.message}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--text3)' }}>
            {campaign.created ? formatDate(campaign.created) : ''}
          </span>

          <Button size="sm" variant="hero" onClick={onTrigger}>
            Trigger
          </Button>
        </div>
      </div>
    </Card>
  );
}
