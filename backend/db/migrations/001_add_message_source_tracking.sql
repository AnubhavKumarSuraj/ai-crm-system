ALTER TABLE messages
ADD COLUMN IF NOT EXISTS source TEXT;

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS source_label TEXT;

COMMENT ON COLUMN messages.source IS 'internal type: campaign_trigger, inactive_recovery, ai_campaign, scheduled_campaign';
COMMENT ON COLUMN messages.source_label IS 'human readable label';
