import React from 'react';
import Badge from './Badge';

const sourceVariant = {
  Recovery: 'warn',
  Campaign: 'info',
  Scheduled: 'purple',
  'AI Promo': 'success',
  Legacy: 'neutral',
  Unknown: 'neutral',
};

export const sourceLabel = (label) => label || 'Legacy';

export default function SourceBadge({ label }) {
  const normalizedLabel = sourceLabel(label);

  return (
    <Badge variant={sourceVariant[normalizedLabel] || 'neutral'}>
      {normalizedLabel}
    </Badge>
  );
}
