# Automation Module

This module runs backend automations without calling the backend over HTTP.
It reuses the existing customer, campaign, and log services directly.

## Current job

- `inactiveRecoveryJob`: runs every day at `9:00 AM` by default and triggers the inactive customer recovery campaign.

## Environment variables

- `DB_URL=<supabase-connection-string>`
- `AUTOMATION_ENABLED=true`
- `AUTOMATION_TIMEZONE=Asia/Kolkata`
- `AUTOMATION_INACTIVE_RECOVERY_ENABLED=true`
- `AUTOMATION_INACTIVE_RECOVERY_CRON=0 9 * * *`
- `AUTOMATION_INACTIVE_DAYS=30`
- `AUTOMATION_INACTIVE_CAMPAIGN_ID=<campaign-uuid>`

For local verification, temporarily set:

- `AUTOMATION_INACTIVE_RECOVERY_CRON=* * * * *`

## Manual trigger

Existing route:

- `POST /api/automation/remind-inactive`

Optional request body overrides:

```json
{
  "campaign_id": "uuid",
  "days": 30
}
```

## Quick test plan

1. Copy `backend/.env.example` to `backend/.env` and replace the placeholder values.
2. Run `npm start` from `backend/`.
3. Watch for:
   - `[CRON] Inactive recovery job scheduled.`
   - `[CRON] START Inactive recovery job started.`
4. Test the manual endpoint with `POST /api/automation/remind-inactive`.
