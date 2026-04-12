import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../components/Layout';
import StatsCard from '../components/StatsCard';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { daysSince, formatDate, customerStatus } from '../utils/helpers';

const statusVariant = { active: 'success', inactive: 'warn', dormant: 'neutral' };

export default function Dashboard() {
  const { customers, campaigns } = useApp();
  const navigate = useNavigate();

  const active   = customers.filter((c) => daysSince(c.last_visit) <= 30).length;
  const inactive = customers.length - active;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5">
        <StatsCard label="Total Customers" value={customers.length} note="all time"                       dotColor="var(--info)"    />
        <StatsCard label="Active"           value={active}           note="visited in last 30 days"        dotColor="var(--success)" />
        <StatsCard label="Inactive"         value={inactive}         note="not visited in 30+ days"        dotColor="var(--warn)"    />
        <StatsCard label="Campaigns"        value={campaigns.length} note="created"                        dotColor="var(--accent)"  />
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-2 gap-4">

        {/* Recent customers */}
        <Card>
          <CardHeader
            title="Recent Customers"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}>
                View all →
              </Button>
            }
          />
          {customers.length === 0 ? (
            <EmptyState icon="👥" text="No customers yet" sub="Add your first customer" />
          ) : (
            <div className="overflow-auto">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 6).map((c) => (
                    <tr key={c.id}>
                      <td className="font-medium">{c.name}</td>
                      <td style={{ color: 'var(--text2)', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{c.phone}</td>
                      <td>
                        <Badge variant={statusVariant[customerStatus(c.last_visit)]}>
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

        {/* Recent campaigns */}
        <Card>
          <CardHeader
            title="Recent Campaigns"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/campaigns')}>
                View all →
              </Button>
            }
          />
          {campaigns.length === 0 ? (
            <EmptyState icon="📢" text="No campaigns yet" sub="Create your first campaign" />
          ) : (
            <div className="p-4 space-y-2">
              {campaigns.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg"
                  style={{ background: 'var(--surface2)' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--text3)' }}>{c.message}</div>
                  </div>
                  <Badge variant={c.type === 'manual' ? 'info' : 'accent'}>{c.type}</Badge>
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
      <div className="text-3xl mb-2 opacity-40">{icon}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--text2)' }}>{text}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{sub}</div>}
    </div>
  );
}
