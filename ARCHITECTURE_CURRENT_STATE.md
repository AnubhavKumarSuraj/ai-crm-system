# AI CRM System: Current Architecture State

This document is based on the current repository contents as inspected on April 20, 2026. It is intentionally code-first: the source of truth is the live implementation in `backend/` and `frontend/`, not the older planning documents under `docs/`.

## 1. Executive Summary

AI CRM System is currently an MVP full-stack CRM for small businesses with three primary working product areas:

1. Customer management
2. Campaign creation and triggering
3. Operational logging and inactive-customer automation

What the product does today:

- Allows users to add, list, filter, and delete customers from a React UI backed by Express and PostgreSQL.
- Allows users to create campaigns in the UI and trigger campaigns through the backend.
- Supports two campaign trigger modes in the backend:
  - `webhook` mode: dispatches campaign trigger requests to an `n8n` webhook when available.
  - `local` mode: falls back to direct database inserts into the `messages` table if the webhook is unavailable.
- Supports a backend-only automation endpoint to create reminder messages for customers inactive for 30+ days.
- Records operational events in a `logs` table for campaign triggers and inactive reminder runs.

What the product does not fully do yet:

- It does not have authentication, tenant isolation, user management, or role-based access.
- It does not yet expose a complete production workflow for message delivery, AI generation, or campaign/job monitoring.
- The frontend is only partially connected to backend data. Customers are real-time from the backend; campaigns and logs are still partly local or dummy-driven.

## 2. Current Tech Stack

| Layer | Current Stack |
|---|---|
| Frontend | React 18, React Router 6, Create React App (`react-scripts`), Tailwind CSS, PostCSS, custom CSS variables |
| Backend | Node.js, Express 5, CommonJS modules, native `fetch` for webhook calls |
| Database | PostgreSQL hosted via Supabase connection pooler, raw SQL via `pg` |
| Tooling | npm, nodemon, dotenv, ad hoc DB scripts (`db:check`, `db:init`) |

Additional runtime observations:

- Backend DB access is direct SQL through `pg`, without ORM or formal migration tooling.
- The current backend implementation relies on native Node runtime features like `fetch` and `AbortSignal.timeout`.
- Frontend build tooling is CRA-based, not Vite or Next.js.

## 3. Full Folder Architecture

```text
ai-crm-system/
+-- automation/                              # Present but currently empty
+-- backend/
|   +-- config/
|   |   +-- db.js                           # Shared PostgreSQL pool + startup connectivity probe
|   +-- db/
|   |   +-- schema.sql                      # Current SQL schema source of truth
|   +-- scripts/
|   |   +-- checkDb.js                      # Connectivity/schema inspection script
|   |   +-- initDb.js                       # Applies schema.sql manually
|   +-- src/
|   |   +-- app.js                          # Express app composition and route mounting
|   |   +-- controllers/
|   |   |   +-- automationController.js
|   |   |   +-- campaignController.js
|   |   |   +-- customerController.js
|   |   |   +-- logController.js
|   |   +-- routes/
|   |   |   +-- automationRoutes.js
|   |   |   +-- campaignRoutes.js
|   |   |   +-- customerRoutes.js
|   |   |   +-- logRoutes.js
|   |   +-- services/
|   |       +-- automationService.js
|   |       +-- campaignService.js
|   |       +-- customerService.js
|   |       +-- logService.js
|   +-- .env                                # Runtime config: port, DB URL, n8n webhook URL
|   +-- package.json
|   +-- server.js                           # Entry point
|   +-- test_db.js                          # Ad hoc diagnostic script, not integrated into npm scripts
|   +-- server-test.out.log                 # Local generated artifact
|   +-- server-test.err.log                 # Local generated artifact
+-- docs/                                   # Legacy planning/reference docs, not runtime source of truth
+-- frontend/
|   +-- shopcrm/
|       +-- build/                          # Generated frontend build artifact
|       +-- public/
|       |   +-- index.html
|       +-- src/
|       |   +-- components/
|       |   |   +-- Badge.jsx
|       |   |   +-- Button.jsx
|       |   |   +-- Card.jsx
|       |   |   +-- Input.jsx
|       |   |   +-- Layout.jsx
|       |   |   +-- Modal.jsx
|       |   |   +-- Navbar.jsx
|       |   |   +-- StatsCard.jsx
|       |   |   +-- Toast.jsx
|       |   +-- hooks/
|       |   |   +-- useToast.js
|       |   +-- pages/
|       |   |   +-- Campaigns.jsx
|       |   |   +-- Customers.jsx
|       |   |   +-- Dashboard.jsx
|       |   +-- services/
|       |   |   +-- api.js
|       |   +-- utils/
|       |   |   +-- dummyData.js
|       |   |   +-- helpers.js
|       |   +-- {components,pages,services,utils,hooks}/   # Empty accidental directory
|       |   +-- App.js
|       |   +-- index.css
|       |   +-- index.js
|       +-- package.json
|       +-- postcss.config.js
|       +-- tailwind.config.js
|       +-- README.md                       # Partially stale relative to current implementation
|       +-- frontend-start-*.out.log       # Local generated artifact
|       +-- frontend-start-*.err.log       # Local generated artifact
+-- scripts/                                # Present but currently empty
+-- .gitignore
```

### Folder Notes

- `backend/` is the actual runtime backend and contains the cleanest architectural pattern in the repo.
- `frontend/shopcrm/` is the actual product frontend.
- `docs/` contains older documentation, but current code has already diverged from at least some of it.
- `automation/` and root `scripts/` are placeholders today and do not contribute runtime behavior.
- The repository includes a few local-generated log files and an empty malformed frontend directory, which are signs of incomplete housekeeping.

## 4. Backend Architecture

### `server.js` Role

`backend/server.js` is the runtime entry point. Its responsibility is intentionally narrow:

- import the configured Express app from `src/app.js`
- determine the HTTP port from `process.env.PORT` or default to `5000`
- start the HTTP listener

Architecturally, this is a good separation: the server bootstrap is isolated from application composition.

One caveat:

- `server.js` itself does not call `dotenv.config()`. Environment loading happens indirectly because `app.js` pulls in routes, which pull in services, which eventually import `config/db.js`. That works today, but it is brittle because startup config depends on DB-module side effects.

### `app.js` Role

`backend/src/app.js` is the application composition layer. It:

- creates the Express application
- mounts global middleware
  - `cors()`
  - `express.json()`
- defines the root health-ish endpoint `GET /`
- mounts feature routes under `/api`

Current mounted route groups:

- `/api/customers`
- `/api/campaigns`
- `/api/logs`
- `/api/automation`

### Route Layer

Each feature has its own route file. The route layer is thin and maps HTTP endpoints to controllers:

- `customerRoutes.js`
- `campaignRoutes.js`
- `logRoutes.js`
- `automationRoutes.js`

This keeps URL structure and transport concerns separated from business logic.

### Controller Layer

Controllers are responsible for:

- request parsing
- lightweight validation
- service invocation
- response formatting
- status code mapping
- try/catch error handling

This pattern is implemented consistently across the codebase.

Examples:

- `customerController.js` validates `days` for inactive-customer queries and converts service results into JSON responses.
- `campaignController.js` validates campaign type and trigger target.
- `logController.js` validates `event_type` and `details`.
- `automationController.js` is minimal and delegates almost entirely to the service layer.

### Service Layer

Services contain the actual business logic and SQL queries. This is where most of the real backend behavior lives.

Current service responsibilities:

- `customerService.js`
  - insert customer
  - read all customers
  - query inactive customers
  - delete customer
- `campaignService.js`
  - create campaign
  - list campaigns latest-first
  - try n8n webhook dispatch
  - fall back to local message creation if webhook fails
  - log trigger activity
- `logService.js`
  - list logs
  - create logs
  - support both pool-level and transaction-level log inserts
- `automationService.js`
  - create reminder messages for inactive customers
  - write an automation log

The service layer already uses transactions where the workflow spans multiple writes, which is the right pattern for this stage.

### DB Connection Layer

`backend/config/db.js` is the shared database connection layer. It:

- loads environment variables via `dotenv`
- reads `DB_URL`
- builds a shared `pg.Pool`
- enables SSL with `rejectUnauthorized: false`
- runs a one-time startup connectivity query

This module is the single DB access foundation for the service layer.

### All Currently Implemented Backend APIs

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | Basic runtime check returning `API Running` |
| `GET` | `/api/customers` | Return all customers |
| `POST` | `/api/customers` | Create customer |
| `GET` | `/api/customers/inactive?days=30` | Return inactive customers older than threshold |
| `DELETE` | `/api/customers/:id` | Delete customer |
| `GET` | `/api/campaigns` | Return campaigns latest first |
| `POST` | `/api/campaigns` | Create campaign |
| `POST` | `/api/campaigns/trigger` | Trigger campaign via n8n webhook or local fallback |
| `GET` | `/api/logs` | Return logs latest first |
| `POST` | `/api/logs` | Insert log entry |
| `POST` | `/api/automation/remind-inactive` | Create reminder messages for inactive customers |

### Important Backend Observations

- `campaignService.triggerCampaign()` is the most advanced workflow in the codebase. It first tries `N8N_WEBHOOK_URL`, then falls back to local SQL-based message creation if webhook delivery fails.
- When webhook mode succeeds, the service logs the event but does not create local message rows or know downstream send counts. The response therefore returns `messages_sent: 0` with `mode: "webhook"`.
- When fallback mode runs, message inserts happen locally and a log row is written in the same transaction.
- The backend currently has no routes for `/api/ai/generate-message` or `/api/messages/send`, even though the frontend API layer defines client functions for them.

## 5. Frontend Architecture

### Overall Structure

The frontend is a React SPA mounted under `frontend/shopcrm/`. It uses:

- `BrowserRouter` for page routing
- a lightweight React Context store inside `Layout.jsx`
- a reusable UI component library built from local components
- a centralized API wrapper in `src/services/api.js`

### Pages

Current routed pages:

| Route | Component | Purpose |
|---|---|---|
| `/dashboard` | `Dashboard.jsx` | Top-level overview with counts and recent lists |
| `/customers` | `Customers.jsx` | Customer CRUD UI for add/list/filter/delete |
| `/campaigns` | `Campaigns.jsx` | Campaign creation and campaign trigger UI |

There is no dedicated page yet for:

- logs
- automation operations
- message delivery history
- AI message generation

### Components

The component system is organized as reusable primitives:

| Component | Role |
|---|---|
| `Layout.jsx` | App shell, context provider, global state holder |
| `Navbar.jsx` | Left navigation |
| `Card.jsx` | Shared container pattern with header/content/footer helpers |
| `Button.jsx` | Variant-based action button |
| `Input.jsx` | Shared input, select, textarea, and field wrapper |
| `Modal.jsx` | Shared dialog shell |
| `Badge.jsx` | Status label |
| `StatsCard.jsx` | Dashboard metric card |
| `Toast.jsx` | Toast presentation |

The UI system is consistent and lightweight. Styling combines Tailwind utility classes with CSS custom properties from `index.css`.

### State Management

There is no Redux, Zustand, or React Query. Global state lives in `Layout.jsx` via `AppContext`.

Current global state members:

- `customers`
- `campaigns`
- `logs`
- `showToast`
- `addLog`

Actual data behavior today:

- `customers` are fetched once from the backend at layout mount using `getCustomers()`.
- `campaigns` are initialized from `DUMMY_CAMPAIGNS`, not fetched from the backend.
- `logs` are purely local UI state, not loaded from the backend `logs` table.

This means the frontend is only partially server-backed.

### `service/api.js`

`frontend/shopcrm/src/services/api.js` is the single HTTP abstraction used by the UI. It:

- sets `BASE_URL = 'http://localhost:5000/api'`
- wraps `fetch`
- normalizes JSON error handling
- exports per-endpoint functions

Implemented client functions:

- `addCustomer`
- `getCustomers`
- `deleteCustomer`
- `getInactiveCustomers`
- `createCampaign`
- `triggerCampaign`
- `generateMessage`
- `sendMessage`
- `getLogs`

Key mismatch:

- The client declares `generateMessage()` and `sendMessage()`, but the backend does not implement those endpoints today.
- The client does not currently export `getCampaigns()` or `createLog()`, even though the backend supports them.

### Reusable UI System

The UI system is a strength of the frontend. It uses:

- design tokens via CSS variables in `index.css`
- a small local design system for controls and layout
- consistent page-level composition using cards, modals, badges, and buttons

Tailwind usage is pragmatic rather than exhaustive. Many styles use Tailwind layout utilities combined with CSS variable-driven colors and spacing.

### Frontend Observations

- The frontend README is stale. It still describes the app as dummy-data-first, but `api.js` currently has `USE_DUMMY_DATA = false`.
- A malformed empty directory exists at `src/{components,pages,services,utils,hooks}`. It appears accidental and unused.
- Current UI logs are local-only and are not synchronized with the backend `logs` table.
- Campaign persistence is incomplete on the frontend. New campaigns are added to local React state, but campaigns are not rehydrated from the backend on refresh.

## 6. Database Architecture

The live schema is defined in `backend/db/schema.sql`.

### Tables

#### `customers`

Purpose:

- master record for CRM customers

Columns:

- `id UUID PRIMARY KEY`
- `name TEXT NOT NULL`
- `phone TEXT UNIQUE NOT NULL`
- `email TEXT`
- `last_visit DATE`
- `tags TEXT[]`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`

Observations:

- `tags` exists in the schema but is not currently used anywhere in backend or frontend code.

#### `campaigns`

Purpose:

- storage for message campaign definitions

Columns:

- `id UUID PRIMARY KEY`
- `name TEXT NOT NULL`
- `message TEXT NOT NULL`
- `type TEXT CHECK (manual, automated)`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`

#### `messages`

Purpose:

- ledger of generated or triggered outbound communication

Columns:

- `id UUID PRIMARY KEY`
- `customer_id UUID REFERENCES customers(id) ON DELETE CASCADE`
- `campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL`
- `message TEXT NOT NULL`
- `channel TEXT CHECK (whatsapp, email)`
- `status TEXT CHECK (sent, failed, pending)`
- `sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`

Current usage:

- local campaign trigger fallback inserts rows here
- inactive reminder automation inserts rows here

#### `logs`

Purpose:

- backend operational event tracking

Columns:

- `id UUID PRIMARY KEY`
- `event_type TEXT`
- `details TEXT`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`

Current usage:

- campaign webhook success logging
- campaign local fallback logging
- inactive reminder automation logging
- manual log creation endpoint

### Relationships

| From | To | Relationship |
|---|---|---|
| `messages.customer_id` | `customers.id` | Many messages belong to one customer |
| `messages.campaign_id` | `campaigns.id` | Many messages may belong to one campaign |

Behavioral implications:

- deleting a customer cascades and removes associated messages
- deleting a campaign sets `campaign_id` to `NULL` in `messages` rather than deleting messages
- `logs` are standalone and not relationally linked to users, customers, or campaigns

### Schema-Level Gaps

- There is no tenant model such as `businesses`, `accounts`, or `users`.
- There is no constraint for message uniqueness or automation idempotency.
- There is no scheduled job metadata table, webhook delivery table, or message provider audit model.

## 7. End-to-End Data Flow

### General Pattern

The dominant data path today is:

1. React page triggers an action
2. `src/services/api.js` calls the backend
3. Express route forwards to controller
4. Controller validates and delegates
5. Service executes SQL against PostgreSQL
6. JSON response returns to frontend
7. Frontend mutates local context state and shows a toast

### Customer Add Flow

1. User opens `Customers.jsx` add modal.
2. Form values are validated client-side for `name` and `phone`.
3. `api.addCustomer(form)` calls `POST /api/customers`.
4. `customerController.createCustomer()` delegates to `customerService.addCustomer()`.
5. `customerService.addCustomer()` inserts into `customers` and returns the generated ID.
6. Frontend prepends the new customer into local `customers` state.
7. Frontend shows a success toast and adds a local UI log entry.

Important note:

- The backend writes the customer to PostgreSQL.
- The UI log entry is not stored in the backend `logs` table.

### Delete Customer Flow

1. User clicks `Remove` in `Customers.jsx`.
2. UI confirms with `window.confirm`.
3. `api.deleteCustomer(id)` calls `DELETE /api/customers/:id`.
4. `customerController.deleteCustomer()` delegates to `customerService.deleteCustomer(id)`.
5. `customerService.deleteCustomer()` deletes the customer row and returns the deleted ID.
6. On success, the frontend removes that customer from local state.
7. Frontend shows a success toast and adds a local UI log entry.

Important note:

- Customer deletion is now backend-backed.
- Associated message rows will cascade-delete because of the DB foreign key.

### Campaign Trigger Flow

1. User opens `TriggerCampaignModal` in `Campaigns.jsx`.
2. User selects target `all` or `inactive`.
3. `api.triggerCampaign({ campaign_id, target })` calls `POST /api/campaigns/trigger`.
4. `campaignController.triggerCampaign()` validates the request and calls the service.
5. `campaignService.triggerCampaign()` loads the campaign from PostgreSQL.
6. Backend attempts an HTTP POST to `N8N_WEBHOOK_URL` with `campaign_id` and `target`.
7. If webhook succeeds:
   - backend writes a `Campaign Triggered` log row
   - backend returns `{ status: "success", messages_sent: 0, mode: "webhook" }`
8. If webhook fails:
   - backend opens a transaction
   - inserts one `messages` row per selected customer
   - writes a `Campaign Triggered` log row with fallback reason
   - commits transaction
   - returns `{ status: "success", messages_sent: <rowCount>, mode: "local" }`
9. Frontend shows a success toast and adds a local UI log entry.

Important note:

- The UI does not distinguish webhook success from local fallback in the displayed toast.
- On webhook success, the system currently does not track downstream execution state in the database.

## 8. Current Strengths

- The backend uses a clean and understandable `route -> controller -> service` architecture.
- Database access is centralized through a shared `pg` pool.
- Transaction handling is already used for multi-step workflows such as campaign fallback and inactive reminder automation.
- The UI has a coherent reusable component system with a clear visual language.
- Customer CRUD is genuinely connected end-to-end from React to PostgreSQL.
- Campaign trigger logic has graceful degradation through webhook fallback instead of hard-failing.
- Operational logging is starting to exist as a backend concern rather than only a UI concern.
- SQL schema is explicit and easy to inspect because it lives in a plain `schema.sql` file.

## 9. Current Gaps

### Product Gaps

- There is no authentication, authorization, or multi-business tenancy.
- There is no real message delivery provider integration beyond DB row creation and optional n8n webhook dispatch.
- There is no AI messaging implementation despite frontend API placeholders.
- There is no frontend logs page, automation control page, or message history page.

### Data Consistency Gaps

- `customers` are fetched from the backend, but `campaigns` are still initialized from `DUMMY_CAMPAIGNS`.
- `logs` shown in the frontend are local ephemeral entries, not backend log records.
- Repeated calls to `/api/automation/remind-inactive` will insert duplicate reminder messages because there is no idempotency check.
- Inactivity logic is duplicated in multiple services instead of being centralized.

### Architecture and Code Quality Gaps

- The frontend API layer contains dead contract stubs for `/ai/generate-message` and `/messages/send`.
- The backend package `main` field points to `index.js`, but the actual entry point is `server.js`.
- Environment loading is implicit through DB module side effects instead of explicit application bootstrap.
- The backend currently depends on modern Node runtime behavior for `fetch` and `AbortSignal.timeout` without an `engines` declaration.
- The repo contains stale README/docs relative to current behavior.
- The repo contains minor housekeeping issues:
  - empty `automation/` and root `scripts/`
  - empty malformed frontend directory
  - local run logs committed/untracked in working tree
  - encoding artifacts in comments and some UI strings

### Operational Gaps

- No automated test suite exists for backend or frontend.
- No centralized error middleware, request validation library, or structured logging pipeline exists.
- No CI/CD, deployment config, or environment separation is defined in the repository.
- `GET /api/customers` returns all customers without pagination, filtering, or sorting.
- Campaign trigger and reminder processing are synchronous HTTP workflows, not queued jobs.

## 10. Recommended Next Phase

The immediate next sprint should focus on converting the product from "partial MVP" to "coherent connected MVP".

### Sprint Priorities

1. Complete frontend/backend data alignment
   - fetch campaigns from `GET /api/campaigns`
   - fetch logs from `GET /api/logs`
   - remove or isolate dummy campaign state
   - add a real Logs page

2. Close contract gaps
   - either implement `/api/ai/generate-message` and `/api/messages/send`
   - or remove those frontend API functions until the backend exists

3. Harden automation behavior
   - make `/api/automation/remind-inactive` idempotent
   - prevent duplicate reminder creation for the same customer and time window
   - persist webhook dispatch status if campaign execution is delegated externally

4. Improve validation and error handling
   - add request schema validation
   - add central Express error middleware
   - normalize 4xx vs 5xx behavior consistently

5. Establish delivery confidence
   - add backend service tests for customer, campaign, and automation flows
   - add at least smoke-level frontend integration coverage

## 11. Scalability Suggestions

To evolve this project into a real SaaS platform, the architecture should move in the following direction.

### Multi-Tenant SaaS Foundations

- add `users`, `businesses`, and membership tables
- scope all business data by tenant ID
- introduce authentication and authorization
- enforce tenant-level access on every query

### Backend Evolution

- introduce a real background job system for campaign execution and reminders
- move long-running automation out of synchronous request/response handlers
- add delivery status tracking and retry semantics
- formalize migrations instead of relying on one `schema.sql` file

### Frontend Evolution

- move server state from ad hoc Context into a server-state library such as React Query or SWR
- separate UI state from backend state
- add optimistic updates only where there is backend confirmation and rollback logic

### Observability and Reliability

- add structured logging
- add metrics around campaign throughput, webhook success/failure, and automation runs
- add auditability for every outbound message row
- add health checks for DB and downstream automation dependencies

### Performance and Scale

- add pagination and query filters for customers, campaigns, and logs
- index additional access patterns as usage grows
- split provider integrations from core CRM logic behind adapter interfaces
- introduce rate limiting and job batching before large campaign sends

## Closing Assessment

The current codebase is a solid MVP foundation with a notably clean backend structure and a usable frontend shell. The strongest parts are the separation of backend concerns, the explicit SQL data model, and the working customer flow from UI to PostgreSQL. The biggest architectural gap is not correctness of the core pattern; it is consistency. The system is presently half-real and half-local: customers are real, while campaigns and logs are only partially real in the UI.

The next milestone should not be a broad feature explosion. It should be consolidation:

- finish connecting the existing data domains end-to-end
- remove stale or duplicate code paths
- harden automation behavior
- establish tenant-ready boundaries before further feature growth
