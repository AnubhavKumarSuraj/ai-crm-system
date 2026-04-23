import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../components/Layout';
import StatsCard from '../components/StatsCard';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { daysSince, customerStatus } from '../utils/helpers';
import * as api from '../services/api';

const statusVariant = {
  active: 'success',
  inactive: 'warn',
  dormant: 'neutral',
};

export default function Dashboard() {
  const { customers, campaigns, showToast, addLog } = useApp();
  const navigate = useNavigate();

  const [loadingRecover, setLoadingRecover] = useState(false);
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

  const handleRecoverInactive = async () => {
    setLoadingRecover(true);

    try {
      const res = await api.runInactiveRecovery();

      const processed = res.processed || 0;

      showToast(
        `${processed} inactive customers targeted`,
        'success'
      );

      addLog(
        'Recovery Automation',
        `${processed} inactive customers processed`,
        'success'
      );

      loadLogs();
    } catch (err) {
      showToast(
        'Failed to run recovery automation',
        'danger'
      );
    } finally {
      setLoadingRecover(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5">
        <StatsCard
          label="Total Customers"
          value={customers.length}
          note="all time"
          dotColor="var(--info)"
        />

        <StatsCard
          label="Active"
          value={active}
          note="visited in last 30 days"
          dotColor="var(--success)"
        />

        <StatsCard
          label="Inactive"
          value={inactive}
          note="not visited in 30+ days"
          dotColor="var(--warn)"
        />

        <StatsCard
          label="Campaigns"
          value={campaigns.length}
          note="created"
          dotColor="var(--accent)"
        />
      </div>

      {/* Automation */}
      <Card>
        <CardHeader
          title="Automation Center"
          action={
            <Button
              variant="hero"
              onClick={handleRecoverInactive}
              disabled={loadingRecover || inactive === 0}
            >
              {loadingRecover
                ? 'Running...'
                : `Recover ${inactive} Inactive Customers`}
            </Button>
          }
        />

        <div
          className="px-4 pb-4 text-sm"
          style={{ color: 'var(--text2)' }}
        >
          Detect customers inactive for 30+ days and create reminder outreach automatically.
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Customers */}
        <Card>
          <CardHeader
            title="Recent Customers"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/customers')}
              >
                View all →
              </Button>
            }
          />

          {customers.length === 0 ? (
            <EmptyState
              icon="👥"
              text="No customers yet"
              sub="Add your first customer"
            />
          ) : (
            <div className="overflow-auto">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>
                        <Badge
                          variant={
                            statusVariant[
                            customerStatus(c.last_visit)
                            ]
                          }
                        >
                          {customerStatus(c.last_visit)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Campaigns */}
        <Card>
          <CardHeader title="Recent Campaigns" />

          <div className="p-4 space-y-2">
            {campaigns.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg"
                style={{
                  background: 'var(--surface2)',
                }}
              >
                <div className="font-medium text-sm">
                  {c.name}
                </div>

                <div
                  className="text-xs mt-1"
                  style={{
                    color: 'var(--text3)',
                  }}
                >
                  {c.message}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader title="Recent Activity Logs" />

          {logs.length === 0 ? (
            <EmptyState
              icon="📄"
              text="No logs yet"
              sub="Actions will appear here"
            />
          ) : (
            <div className="p-4 space-y-2">
              {logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg"
                  style={{
                    background: 'var(--surface2)',
                  }}
                >
                  <div className="font-medium text-sm">
                    {log.event_type}
                  </div>

                  <div
                    className="text-xs mt-1"
                    style={{
                      color: 'var(--text3)',
                    }}
                  >
                    {log.details}
                  </div>
                </div>
              ))}
            </div>
          )}
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