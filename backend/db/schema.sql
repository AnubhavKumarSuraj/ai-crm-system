CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    last_visit DATE,
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('manual', 'automated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    channel TEXT CHECK (channel IN ('whatsapp', 'email')),
    status TEXT CHECK (status IN ('sent', 'failed', 'pending')),
    source TEXT,
    source_label TEXT,
    provider TEXT,
    provider_message_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS source TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS source_label TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS provider TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS provider_message_id TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS error_message TEXT;

COMMENT ON COLUMN messages.source IS 'internal type: campaign_trigger, inactive_recovery, ai_campaign, scheduled_campaign';
COMMENT ON COLUMN messages.source_label IS 'human readable label';

CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_messages_customer_id ON messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON messages(campaign_id);

ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS audience TEXT,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

