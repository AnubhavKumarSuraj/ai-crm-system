# AI CRM System: Current Architecture State

This document reflects the repository as inspected on May 5, 2026. It is code-first: the live implementation in `backend/` and `frontend/shopcrm/` is the source of truth. Older planning documents under `docs/` are useful background, but some are stale.

## 1. Executive Summary

ShopCRM is now a full-stack CRM MVP with customer management, campaign workflows, message traceability, and real provider-backed outreach paths.

Current working product areas:

1. Public-facing entry pages for landing, onboarding, and a demo business route.
2. Auth-less CRM app shell under `/app`.
3. Customer management backed by PostgreSQL/Supabase.
4. Campaign creation, campaign triggering, and AI campaign sending.
5. Message history with source badges, provider metadata, and delivery status.
6. Inactive-customer recovery with AI/fallback message generation and Twilio WhatsApp Sandbox sending.
7. Scheduled backend automation scaffolding for inactive recovery and daily summaries.
8. Operational logs for major automation and campaign events.

Important current limitations:

- There is no authentication, tenant isolation, user management, or role-based access.
- Message delivery is not unified behind one provider abstraction. Inactive recovery uses Twilio WhatsApp; AI campaign sending uses Telegram; campaign trigger fallback still records WhatsApp rows locally.
- Repeated recovery or campaign actions can create duplicate messages because idempotency is not implemented.
- Frontend state is still a blend of backend data and local UI state in some flows.

## 2. Current Tech Stack

| Layer | Current Stack |
|---|---|
| Frontend | React 18, React Router 6, Create React App, Tailwind CSS, PostCSS, custom CSS variables |
| Backend | Node.js, Express 5, CommonJS modules |
| Database | PostgreSQL/Supabase via `pg` and raw SQL |
| Messaging Providers | Twilio WhatsApp Sandbox, Telegram Bot API |
| AI | Google Generative AI SDK for recovery message generation |
| Automation | `node-cron` scheduler module under `backend/src/automation` |
| Tooling | npm, nodemon, dotenv, manual DB scripts |

Backend dependencies now include `twilio`, `@google/generative-ai`, `pg`, `express`, `cors`, `dotenv`, `node-cron`, and supporting packages.

## 3. Repository Layout

```text
ai-crm-system/
+-- ARCHITECTURE_CURRENT_STATE.md
+-- backend/
|   +-- config/
|   |   +-- db.js
|   +-- db/
|   |   +-- schema.sql
|   |   +-- migrations/
|   |       +-- 001_add_message_source_tracking.sql
|   |       +-- 002_add_message_provider_tracking.sql
|   +-- scripts/
|   |   +-- checkDb.js
|   |   +-- initDb.js
|   |   +-- migrate_campaigns.js
|   |   +-- migrate_telegram.js
|   +-- src/
|   |   +-- app.js
|   |   +-- automation/
|   |   |   +-- config.js
|   |   |   +-- crmApi.js
|   |   |   +-- scheduler.js
|   |   |   +-- jobs/
|   |   |   |   +-- dailySummaryJob.js
|   |   |   |   +-- inactiveRecoveryJob.js
|   |   |   +-- services/
|   |   |   |   +-- automationService.js
|   |   |   +-- utils/
|   |   |       +-- cronLogger.js
|   |   +-- controllers/
|   |   |   +-- automationController.js
|   |   |   +-- campaignController.js
|   |   |   +-- customerController.js
|   |   |   +-- logController.js
|   |   |   +-- messageController.js
|   |   +-- routes/
|   |   |   +-- automationRoutes.js
|   |   |   +-- campaignRoutes.js
|   |   |   +-- customerRoutes.js
|   |   |   +-- logRoutes.js
|   |   |   +-- messageRoutes.js
|   |   +-- services/
|   |       +-- automationService.js
|   |       +-- campaignService.js
|   |       +-- customerService.js
|   |       +-- geminiService.js
|   |       +-- logService.js
|   |       +-- messageService.js
|   |       +-- telegramService.js
|   |       +-- whatsappService.js
|   +-- .env
|   +-- package.json
|   +-- server.js
+-- frontend/
|   +-- shopcrm/
|       +-- public/
|       +-- src/
|           +-- App.js
|           +-- components/
|           |   +-- Badge.jsx
|           |   +-- Button.jsx
|           |   +-- Card.jsx
|           |   +-- Input.jsx
|           |   +-- Layout.jsx
|           |   +-- Modal.jsx
|           |   +-- Navbar.jsx
|           |   +-- SourceBadge.jsx
|           |   +-- StatsCard.jsx
|           |   +-- Toast.jsx
|           +-- hooks/
|           |   +-- useToast.js
|           +-- pages/
|           |   +-- BusinessDemo.jsx
|           |   +-- Campaigns.jsx
|           |   +-- Customers.jsx
|           |   +-- Dashboard.jsx
|           |   +-- LandingPage.jsx
|           |   +-- Messages.jsx
|           |   +-- Onboarding.jsx
|           +-- services/
|           |   +-- api.js
|           +-- utils/
|               +-- dummyData.js
|               +-- helpers.js
+-- docs/
```

Generated artifacts such as frontend `build/`, local logs, graph output, and ad hoc diagnostics should not be treated as architecture source of truth.

## 4. Backend Architecture

### Entry Point

`backend/server.js` imports the Express app, starts the automation scheduler, and listens on `PORT` or `5000`.

### Express App

`backend/src/app.js` configures:

- `cors`
- JSON request parsing
- health check at `GET /`
- route mounts:
  - `/api/customers`
  - `/api/campaigns`
  - `/api/logs`
  - `/api/automation`
  - `/api/messages`

### Controllers

Controllers validate request inputs and convert service results into JSON responses:

- `customerController.js`: customer CRUD and inactive-customer lookup.
- `campaignController.js`: campaign creation, campaign trigger, and AI campaign send.
- `messageController.js`: message list and message summary counts.
- `logController.js`: list/create operational logs.
- `automationController.js`: inactive recovery endpoint.

### Services

Service responsibilities:

- `customerService.js`: raw SQL for customer list, create, delete, and inactive filtering.
- `campaignService.js`:
  - campaign creation/listing
  - campaign trigger fallback/webhook behavior
  - source-label assignment for message rows
  - AI campaign delivery via Telegram
- `automationService.js`:
  - inactive-customer recovery
  - AI/fallback message generation
  - Twilio WhatsApp send
  - message insert with provider metadata
  - recovery result counts and logging
- `messageService.js`:
  - returns newest-first message history
  - exposes message source/provider fields
  - returns summary counts for recovery, campaign, and AI messages
- `whatsappService.js`:
  - loads `backend/.env` explicitly
  - normalizes phone numbers into `whatsapp:+...`
  - validates Twilio runtime config
  - calls `client.messages.create`
  - logs Twilio call boundaries and error stacks
  - applies a configurable send timeout
- `telegramService.js`:
  - wraps Telegram Bot API calls
  - supports text and photo sending
  - returns normalized success/error objects
- `geminiService.js`:
  - generates short recovery messages
  - callers fall back to static copy if Gemini fails
- `logService.js`: centralizes inserts and reads from `logs`.

### Automation Subsystem

`backend/src/automation` is separate from the manual `/api/automation/remind-inactive` service path.

- `scheduler.js` starts registered cron jobs.
- `jobs/inactiveRecoveryJob.js` schedules inactive recovery using configured cron/timezone.
- `jobs/dailySummaryJob.js` exists but is disabled by default.
- `automation/services/automationService.js` calls back into backend services via `crmApi.js` and records automation logs.

This subsystem is useful scaffolding, but the manual frontend recovery button currently calls the main service at `backend/src/services/automationService.js`.

## 5. Backend API Surface

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Health check returning `API Running` |
| `GET` | `/api/customers` | List customers |
| `POST` | `/api/customers` | Create customer |
| `DELETE` | `/api/customers/:id` | Delete customer |
| `GET` | `/api/customers/inactive?days=30` | List inactive customers |
| `GET` | `/api/campaigns` | List campaigns |
| `POST` | `/api/campaigns` | Create campaign |
| `POST` | `/api/campaigns/trigger` | Trigger an existing campaign to all or inactive customers |
| `POST` | `/api/campaigns/send-ai` | Create and send an AI campaign via Telegram |
| `GET` | `/api/messages` | List message history, newest first |
| `GET` | `/api/messages/summary` | Return source-count summary metrics |
| `GET` | `/api/logs` | List operational logs |
| `POST` | `/api/logs` | Create operational log |
| `POST` | `/api/automation/remind-inactive` | Run inactive recovery with Twilio WhatsApp sending |

The frontend API layer still exposes placeholder functions for `/api/ai/generate-message` and `/api/messages/send`, but those backend routes are not currently mounted.

## 6. Database Architecture

The database is PostgreSQL/Supabase. `backend/db/schema.sql` is the base schema and includes idempotent `ALTER TABLE` statements for newer fields. `backend/db/migrations` contains focused SQL migrations for message source tracking and provider tracking.

### `customers`

Core fields:

- `id`
- `name`
- `phone`
- `email`
- `last_visit`
- `tags`
- `created_at`
- `telegram_chat_id`

`telegram_chat_id` is used by the Telegram AI campaign flow.

### `campaigns`

Core fields:

- `id`
- `name`
- `message`
- `type`
- `created_at`
- `image_url`
- `status`
- `audience`
- `sent_at`

`status`, `audience`, `image_url`, and `sent_at` support newer campaign demo and AI-send flows.

### `messages`

Core fields:

- `id`
- `customer_id`
- `campaign_id`
- `message`
- `channel`
- `status`
- `source`
- `source_label`
- `provider`
- `provider_message_id`
- `error_message`
- `sent_at`

Message traceability values currently include:

| Source | Label | Meaning |
|---|---|---|
| `campaign_trigger` | `Campaign` | User-triggered campaign row |
| `inactive_recovery` | `Recovery` | Inactive recovery WhatsApp row |
| `ai_campaign` | `AI Promo` | AI campaign row |
| `scheduled_campaign` | `Scheduled` | Scheduler-created campaign row |
| `legacy` | `Legacy` | API fallback for old rows with null source |

Provider metadata:

- Twilio WhatsApp recovery rows use `provider = 'twilio'`.
- Telegram AI campaign rows use `provider = 'telegram'`.
- `provider_message_id` stores Twilio SID or Telegram message ID when available.
- `error_message` stores delivery/provider failure details.

### `logs`

Core fields:

- `id`
- `event_type`
- `details`
- `created_at`

Logs are used for campaign triggers, recovery runs, skipped phone numbers, AI campaign sends, and scheduler events.

## 7. Frontend Architecture

### Routing

`frontend/shopcrm/src/App.js` defines public routes and app routes:

- `/` -> `LandingPage`
- `/onboarding` -> `Onboarding`
- `/business/demo-gym` -> `BusinessDemo`
- `/app` -> `Layout`
  - `/app/dashboard`
  - `/app/customers`
  - `/app/campaigns`
  - `/app/messages`

Legacy route redirects are kept:

- `/dashboard` -> `/app/dashboard`
- `/customers` -> `/app/customers`
- `/campaigns` -> `/app/campaigns`
- `/messages` -> `/app/messages`

### App Shell

`Layout.jsx` provides:

- navigation
- page title mapping
- global customer and campaign state
- toast system
- lightweight local log append helper

### Pages

- `LandingPage.jsx`: public entry page.
- `Onboarding.jsx`: onboarding experience.
- `BusinessDemo.jsx`: demo business route.
- `Dashboard.jsx`:
  - customer/campaign stats
  - inactive recovery button
  - recent customers
  - recent campaigns
  - recent logs with source-style badges
- `Customers.jsx`: customer list and management.
- `Campaigns.jsx`:
  - campaign creation
  - AI festival campaign UI
  - campaign trigger modal
  - passes source metadata for AI/manual campaign sends
- `Messages.jsx`:
  - message table
  - source type badge
  - provider column
  - delivery status/error details

### UI Components

The UI system uses small custom components:

- `Badge`
- `SourceBadge`
- `Button`
- `Card`
- `Input`
- `Modal`
- `Navbar`
- `StatsCard`
- `Toast`

`SourceBadge.jsx` maps message source labels to UI variants:

- `Recovery` -> orange/warn
- `Campaign` -> blue/info
- `Scheduled` -> purple
- `AI Promo` -> green/success
- `Legacy`/unknown -> gray/neutral

## 8. Key End-to-End Flows

### Inactive Recovery WhatsApp Flow

1. User clicks `Recover Inactive Customers` in `Dashboard.jsx`.
2. Frontend calls `api.runInactiveRecovery()`.
3. API sends `POST /api/automation/remind-inactive`.
4. `automationController.js` delegates to `services/automationService.js`.
5. Service queries customers inactive for 30+ days.
6. For each customer:
   - phone is normalized to `whatsapp:+...`
   - missing phone is skipped and logged
   - Gemini recovery copy is generated
   - fallback copy is used if Gemini fails
   - Twilio sends the WhatsApp message
   - `messages` row is inserted with status, source, provider, SID, and error details
7. Service returns counts:
   - `processed`
   - `sent`
   - `failed`
   - `skipped`
   - `message`
8. Dashboard toast displays the returned `message`.

### Campaign Trigger Flow

1. User triggers an existing campaign from `Campaigns.jsx`.
2. Frontend calls `POST /api/campaigns/trigger`.
3. Backend validates `campaign_id`, `target`, and optional `source`.
4. Service resolves message source:
   - explicit source if valid
   - automated campaigns default to `ai_campaign`
   - otherwise `campaign_trigger`
5. Backend tries `N8N_WEBHOOK_URL`.
6. If webhook succeeds:
   - local pending rows are recorded
   - mode is `webhook`
7. If webhook fails or is missing:
   - local sent rows are inserted
   - mode is `local`
8. A campaign log is written.

### AI Campaign Telegram Flow

1. Frontend calls `POST /api/campaigns/send-ai`.
2. Backend creates an automated campaign draft.
3. Backend selects customers with `telegram_chat_id`.
4. Telegram messages are sent one by one.
5. Message rows are inserted with:
   - `channel = 'telegram'`
   - `source = 'ai_campaign'`
   - `source_label = 'AI Promo'`
   - provider metadata
6. Campaign is marked sent.
7. Operational log is written.

### Message History Flow

1. `Messages.jsx` calls `GET /api/messages`.
2. Backend returns message rows newest-first.
3. API includes source/provider/delivery fields.
4. Frontend renders:
   - type badge
   - provider
   - status
   - delivery error if failed

## 9. Environment Variables

Important backend environment variables:

| Variable | Purpose |
|---|---|
| `DB_URL` | Supabase/PostgreSQL connection string |
| `PORT` | Optional backend port |
| `N8N_WEBHOOK_URL` | Optional campaign trigger webhook |
| `GEMINI_API_KEY` | Gemini recovery copy generation |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp sender, sandbox default is `whatsapp:+14155238886` |
| `TWILIO_SEND_TIMEOUT_MS` | Optional Twilio send timeout override |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token |
| `AUTOMATION_INACTIVE_DAYS` | Scheduler inactive threshold |
| `AUTOMATION_INACTIVE_CAMPAIGN_ID` | Scheduler campaign ID |

`whatsappService.js` and `telegramService.js` explicitly load `backend/.env` relative to their service directory to avoid cwd-related runtime misses.

## 10. Current Strengths

- Clear Express route/controller/service layering.
- Source/provider traceability exists for messages.
- Inactive recovery has real Twilio WhatsApp delivery.
- AI campaign sending has Telegram provider support.
- Provider failures are persisted in `messages.error_message`.
- Frontend message history exposes type, provider, and delivery status.
- SQL migrations exist for message source/provider evolution.
- Scheduler code is separated from request/response service logic.

## 11. Current Gaps and Risks

- No auth, tenancy, roles, or permissions.
- No idempotency for recovery, campaign trigger, or AI campaign send.
- Message sending is synchronous inside HTTP request handlers.
- No job queue, retry system, or delivery-status webhook reconciliation.
- Twilio statuses are stored as `sent` when the API accepts the message, even though Twilio may initially return `queued`.
- Campaign trigger fallback creates local rows but does not send via Twilio.
- Messaging provider abstractions are still provider-specific services, not a single polymorphic delivery layer.
- Frontend still has API functions for backend routes that are not implemented: `/api/ai/generate-message` and `/api/messages/send`.
- No automated backend or frontend tests are currently wired into npm scripts.
- No formal migration runner; `db:init` applies `schema.sql`, while focused migrations are manual SQL files.

## 12. Recommended Next Phase

1. Add idempotency keys or duplicate guards for recovery and campaign sends.
2. Move provider sending to a background job queue.
3. Add Twilio and Telegram delivery-status webhook endpoints.
4. Create a unified `deliveryService` interface for WhatsApp, Telegram, and future providers.
5. Add auth and tenant scoping before real multi-business use.
6. Remove or implement stale frontend API stubs.
7. Add integration tests for:
   - inactive recovery
   - message source/provider inserts
   - campaign trigger fallback
   - AI campaign sending
8. Add a proper migration runner and timestamped migration naming.

## Closing Assessment

The system has moved beyond a database-only CRM demo. It now has real outbound delivery paths, message traceability, source/provider badges, and operational logging. The next architecture step is to harden reliability: idempotency, background jobs, provider webhooks, and auth/tenant boundaries.
