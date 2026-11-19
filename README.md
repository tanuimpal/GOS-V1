# Growth By TI — GOS

GOS (Growth Operating System) is intended to help businesses diagnose, strategize,
execute, measure and improve. This package implements the **technical foundation,
Master and Client Dashboard frontends, Phase 2.1 backend foundation, secure Razorpay
monthly billing, and the Meta social connection/ingestion foundation**. Business intelligence
pages retain fictional demo data. Billing and Social Connections use protected APIs and
separate PostgreSQL schemas. Production login/session issuance and real provider journeys
remain activation blockers.

## Current phase

**Shared dashboard visual enhancement:** the existing Master/Client styles now use a navy
theme, purple-blue actions, teal positive indicators and a larger type hierarchy. Billing and
Social Connections inherit the same tokens. This focused frontend amendment preserves the
backend/database work and the 60-day roadmap. See the [visual design report](docs/dashboard-visual-design.md)
for implemented changes, verification and remaining browser/accessibility checks.

**Authorized Meta social addition after billing.** Existing architecture, dashboards and
Razorpay flows are preserved. Social adds migration 0003, Facebook Login for Business,
session-bound OAuth/selection, encrypted tokens, tenant RLS, manual sync with a private worker,
verified source observations and a fresh-data KPI adapter. Client Marketing → Social Connections
and the protected Master Integrations section use real APIs. No real Meta account has been
connected in this workspace. This does not complete general authentication, ingestion/KPI,
AI or automation phases, and the 60-day roadmap is unchanged.
See the [Meta setup runbook](docs/meta-social-setup.md), [social completion report](docs/social-completion.md),
[billing runbook](docs/billing-setup.md) and [overall status](docs/implementation-status.md).

The supplied workspace originally contained nine architecture documents and the briefs,
with no application source, package manager or Git repository. This is a new standalone
foundation, not a migration of an unseen external application. The original attachments
are preserved outside the distributed source package.

## Stack and architecture

- Node.js 24 LTS and npm; exact dependency versions in package.json/package-lock.json.
- Next.js App Router with React and TypeScript; same-origin REST endpoints under `/api/v1`.
- Server-only PostgreSQL adapters using `pg`; reviewed identity, billing and social migrations, no ORM.
- Node's test runner via `tsx`, Playwright, ESLint and Prettier.

The existing readiness path is frontend/HTTP client → route/controller → service →
repository → database adapter. Liveness deliberately does not depend on a database.
The existing business dashboard paths are page → shared cancellable resource hook → typed MasterService
or ClientService → demo adapter → fictional fixtures. No KPI, Growth Score or business intelligence calculation
exists in the frontend; only presentation, filtering, sorting and pagination occur there.

Billing follows page → validated HTTP client → authorized controller → billing service →
repository/transaction-scoped PostgreSQL, with the official Razorpay REST API at its
provider boundary. `/client/billing` and `/master/billing` use no demo data fallback.
Unauthenticated visitors see a sign-in-required message; this source has no login adapter.
Run `npm run billing:migrate`, `billing:sync-plans`, `billing:process-webhooks` and
`billing:reconcile` only after completing the runbook's environment/identity prerequisites.
`npm run test:billing-ui` verifies real app/SQL billing flows using isolated test accounts;
it does not contact Razorpay. No live recurring payments are claimed.

| Directory                                                              | Responsibility                                                                                 |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `app/`                                                                 | Next.js route adapters, layouts, root error/loading pages and global CSS                       |
| `frontend/`                                                            | Shared components, Master/Client page content, layouts, navigation, typed API client and hooks |
| `backend/`                                                             | Environment, HTTP middleware/validation, error taxonomy, structured logs and domain services   |
| `backend/access/`                                                      | Opaque contexts, fail-closed general resolver and verified billing stored-session adapter      |
| `backend/domains/`                                                     | Working health/info and billing services; retained 24-domain extension catalog                 |
| `database/`                                                            | PostgreSQL adapters, billing/identity migrations, RLS and transactions                         |
| `shared/`                                                              | Response contracts and minimal schema-aligned structural types                                 |
| `agents/`, `integrations/`, `automation/`                              | Documented extension points; no executable engines                                             |
| `tests/unit/`, `tests/components/`, `tests/integration/`, `tests/e2e/` | Service and component contracts, API/data-port tests and browser flows                         |
| `scripts/`                                                             | Safe database connectivity check                                                               |
| `docs/`                                                                | Nine architecture documents; current evidence in implementation-status.md                      |

## Setup

Install Node.js 24, then from the project directory:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` for the copy step.
Visit [http://127.0.0.1:3000](http://127.0.0.1:3000). Development binds to loopback by
default. Open [http://127.0.0.1:3000/master](http://127.0.0.1:3000/master) for the
advisor preview; it redirects to `/master/overview`. Open `/client` for the owner-facing
dashboard; it redirects to `/client/overview`. Both are public: use fictional data only.

## Master Dashboard

| Route                     | Implemented frontend                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/master`                 | Redirect to Overview                                                                                 |
| `/master/overview`        | Attention, critical signals, opportunities, portfolio health, recommendations/AI activity, execution |
| `/master/clients`         | Search, status/tier/health filters, sorting, pagination and client links                             |
| `/master/clients/:id`     | Fourteen advisory sections and records scoped to the selected fictional client                       |
| `/master/kpis`            | Values supplied by the service, trends, periods and quality filters                                  |
| `/master/signals`         | Six categories, severity, evidence and affected KPIs                                                 |
| `/master/opportunities`   | Ranked example opportunities, as required by the sidebar                                             |
| `/master/agents`          | Four future agents and explicitly fictional activity                                                 |
| `/master/recommendations` | Six preview statuses, filters and read-only example dialogs                                          |
| `/master/tasks`           | Four task statuses, filters and read-only details                                                    |
| `/master/automations`     | Sample workflow states and schedule fields                                                           |
| `/master/integrations`    | Nine future providers; all Not connected / Coming soon                                               |
| `/master/reports`         | Six report outlines; no report generation                                                            |
| `/master/settings`        | Ten future configuration sections; no settings mutations                                             |

The persistent demo banner and source/date/period footer identify every populated view.
Open **Workspace status** in the top bar to select Sample portfolio, Loading, Error or
Empty. This setting persists only within the mounted Master layout; reloading restores
the sample portfolio. Reset preview opens a confirmation and changes only local state.
Find client, sidebar links, filters, pagination, dialogs and mobile navigation work.
There are no pretend approval, execution, connection, editing or generation controls.

`frontend/types/master.ts` contains view models. `frontend/services/master-contract.ts`
defines the 14 read methods and queries. `frontend/services/mock/` owns the fixtures;
components never import them. `MasterProvider` selects the adapter and
`useMasterResource` handles cancellation, stale requests, retry and four data states.
Future HTTP integration implements `MasterService`, validates responses and translates
them into these models, then replaces the adapter in the provider. The existing `/api/v1`
versioning, backend authorization and KPI engine remain authoritative. The preview
statuses are presentation contracts, not new database enums or valid mutation payloads.
See [the API mapping](docs/api-specification.md#01-master-frontend-adapter-contract).

## Client Dashboard

The Client workspace answers five questions: how the business is doing, what changed,
what needs attention, where an opportunity exists and what to do next. It uses one fictional
Aarohi Retail business. Shared revenue, score and health examples agree with the Master
view; additional owner-facing examples demonstrate the requested page structures.

| Route                     | Implemented frontend                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/client`                 | Redirect to Overview                                                                                             |
| `/client/overview`        | Business health, current/previous Growth Score, changes, attention, opportunities and next actions               |
| `/client/marketing`       | Health, performance, acquisition, campaigns, audience, content, opportunities and suggested actions              |
| `/client/sales`           | Health, leads, qualification, conversion, pipeline, win rate, deal size, cycle, bottlenecks and actions          |
| `/client/operations`      | Health, fulfillment, delivery, capacity, productivity, complaints, bottlenecks and improvements                  |
| `/client/kpis`            | Twenty-four supplied measures across Marketing, Sales, Financial and Operations; search/category/quality filters |
| `/client/signals`         | Six signal categories with understandable descriptions, evidence, severity, date and status                      |
| `/client/opportunities`   | Ranked examples with directional impact, confidence, effort and priority                                         |
| `/client/recommendations` | Evidence, reasons, outcomes, all six owner-facing statuses and filters                                           |
| `/client/ai`              | Local question draft, seven suggested prompts, sample context, confidence, authored insights and sample history  |
| `/client/tasks`           | Required fields, recommendation links, all four statuses and filters                                             |
| `/client/automations`     | Planned workflows with separate availability/connection and no recorded or scheduled runs                        |
| `/client/reports`         | Six report structures and working outline dialogs; no generation or PDF export                                   |

Notifications and preview settings offer populated/loading/error/empty scenarios and a
confirmed local reset. Help, profile context, responsive navigation and read-only report
outlines work. The business selector and consequential actions are disabled with clear
explanations. AI questions only fill a local draft; nothing is sent or saved.

`frontend/types/client.ts` defines owner-facing read models. `client-contract.ts` defines
fifteen read methods, implemented by the bounded `mock/client-service.ts` adapter.
The provider is the adapter selection point. Currency and KPI/date display use the business
profile; score and change values are supplied, not computed. Tier configuration changes
summary density within this same architecture, never permissions or execution capability.
See [the Client API mapping](docs/api-specification.md#02-client-frontend-adapter-contract).

## Environment

| Variable       | Development                                                         | Staging/production runtime                                   |
| -------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| `ENVIRONMENT`  | `development` by default; `test` in tests                           | Explicit `staging` or `production` required by `npm start`   |
| `LOG_LEVEL`    | `info` default; debug/info/warn/error/silent supported              | Same allowed values; select an appropriate operational level |
| `DATABASE_URL` | Optional; no connection is attempted when absent                    | Required PostgreSQL URL supplied securely by the operator    |
| `DATABASE_SSL` | `disable` for a trusted local test server; `require` for remote TLS | `require`; certificate validation stays enabled              |

`API_ALLOWED_ORIGINS` is an optional comma-separated list of exact browser origins. Empty
blocks requests carrying Origin; same-origin GET requests without Origin remain supported.
The example includes local port 3000. For staging/production set the deployed UI's explicit
HTTPS origin; no paths, credentials or wildcards. No credentialed CORS is enabled.

The retained demos need no auth or AI keys. Billing and Meta require separate server-only
settings and the trusted session issuer documented in their runbooks. There are no public-prefixed secrets or
frontend database credentials. `.env.local` and all real env files are ignored.
URLs must not contain SSL query options; DATABASE_SSL is the single TLS control.
Do not use a production service/admin database credential for the runtime. Billing/social
include role checks and RLS migrations; deployment grants still require verification.

Build does not need a database credential. Starting the built application with `npm start`
does validate runtime environment and fails clearly for missing required configuration.
A configured URL is not proof of connectivity; readiness actually performs SELECT 1.
No production deployment has been performed or authorized by this task.

## Commands

| Command                        | Purpose                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `npm run dev`                  | Start the local development server on 127.0.0.1:3000                                               |
| `npm run build`                | Build the frontend and server routes; no database schema or deployment                             |
| `npm start`                    | Start the production build locally after valid runtime configuration                               |
| `npm test`                     | Unit, component and integration suites                                                             |
| `npm run test:unit`            | Foundation plus typed Master/Client service, query, state, formatting and navigation tests         |
| `npm run test:components`      | Reusable dashboard components, missing values, provenance, evidence, AI draft and disabled actions |
| `npm run test:integration`     | Real route/service composition and database-port contract tests                                    |
| `npm run test:e2e`             | Start an isolated dev server on port 3100 and run Chromium browser tests                           |
| `npm run lint`                 | ESLint with warnings treated as failures                                                           |
| `npm run type-check`           | Strict TypeScript checks                                                                           |
| `npm run format`               | Apply Prettier formatting to project files                                                         |
| `npm run format:check`         | Check formatting without writing                                                                   |
| `npm run verify`               | Lint, type-check, unit/component/integration tests and production build                            |
| `npm run db:check`             | Probe configured PostgreSQL, close its pool and report safe status                                 |
| `npm run social:migrate`       | Apply/check immutable migrations 0001–0003 with the private operator connection                    |
| `npm run social:process-syncs` | Drain up to 20 queued social batches on trusted scheduled compute                                  |
| `npm run test:social-ui`       | Authenticated local Next/SQL social browser flow with explicit Meta HTTP contract fixtures         |
| `npm run test:billing-ui`      | Authenticated local Next/SQL billing regression                                                    |

For browser tests, install the browser once:

```bash
npx playwright install chromium
npm run test:e2e
```

On Linux hosts that lack browser system libraries, Playwright documents
`npx playwright install --with-deps chromium`; this may require OS package privileges.
The source package does not bundle node_modules, browser binaries, build output or secrets.

## API contracts

| Route                                           | Behavior                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| `GET /api/v1`                                   | Backend metadata and actual route list; business features unavailable     |
| `GET /api/health`                               | Public liveness alias                                                     |
| `GET /api/v1/health/live`                       | Retained public liveness, no database claim                               |
| `GET /api/v1/health/ready`                      | 200 after a real SELECT 1 probe; otherwise safe 503                       |
| `/api/v1/billing/*`, `/api/v1/master/billing/*` | Protected subscription collections, history and provider verification     |
| `/api/v1/social/*`, `/api/v1/master/social/*`   | Protected social connection, OAuth, sync, source data and metadata review |
| Other `/api/*` and `/api/v1/*` paths            | JSON 404; business routes remain absent                                   |

GET routes support HEAD; unsupported methods return 405 with Allow. Valid explicitly
allowlisted CORS preflight returns 204 without invoking the service. Query/body and
caller-supplied tenant/user/role inputs are rejected on health/info routes. A fresh server
UUID correlates response headers, envelope and structured logs.

```json
{
  "success": true,
  "data": { "status": "ok", "service": "gos-api", "api_version": "v1" },
  "error": null,
  "meta": { "request_id": "server-generated-uuid", "as_of": "ISO-8601 timestamp" }
}
```

Errors use the same envelope with success:false, data:null and safe code/message/field_errors.
All responses are no-store, with API-specific security headers. Logs retain route/method,
status/duration and request IDs without bodies, query values, raw errors or secrets.

The shared JSON parser caps actual bytes at 16 KiB and requires strict domain validation.
Cursor/query contracts default to 25 items, cap at 100 and allow only reviewed filters/sorts.
General business cursor contracts remain planned; billing/social have scoped persisted lists. Local fixed rate buckets cap public
requests at 300/minute and readiness at 30/minute, returning 429/Retry-After. They reset on
restart and are not distributed/per-user production abuse protection. Full formats, errors,
CORS and the implemented/planned boundary are in [api-specification.md](docs/api-specification.md).

## Database and tests

With no DATABASE_URL, readiness returns `DATABASE_NOT_CONFIGURED`; this is expected.
An unreachable configured database returns `DATABASE_UNAVAILABLE`. Unit and adapter
integration tests do not imply a live database or RLS is working. The optional real
PostgreSQL test runs only when `TEST_DATABASE_URL` is explicitly supplied through the
environment; use `TEST_DATABASE_SSL=require` for a trusted remote TLS connection.
Neither test variable belongs in a frontend bundle or committed file.

The tests verify environment failure, error redaction, request handling, fixed-query
connection behavior and foundation UI/API flow. Master tests cover every route, four
data states, query behavior, scoped demo details, shared controls, dialogs, keyboard focus,
responsive layout and absence of business API calls. They do not certify future engines.
See [implementation-status.md](docs/implementation-status.md) for actual run results,
skips, build status and remaining limitations.

## Current limitations and next step

Managed login/session issuance, the complete business schema, business CRUD, general data ingestion,
KPI/signal engines, agents/context, Growth Score, recommendations/actions, automation and
production deployment are **not implemented**. Billing/social authorization, tenancy/RLS,
migrations, Razorpay integration and Meta connection/source ingestion code are implemented;
real provider activation remains pending. Toasts are local UI notices, not an external notification service.
Outside billing and the protected social views, Master records, values, scores, evidence snippets, activity
and status counts remain authored UI examples. They are not seed database rows, client
findings or generated AI output.
There is no mock login or trusted default tenant. Unknown demo client IDs render an
in-page not-found state; they are not a backend organization lookup or authorization check.

This delivery stops after the **Meta social foundation** task. Next recommended work is the
existing production authentication/session-issuance prerequisite, then one eligible Meta pilot:
configure the correct staging database/roles, HTTPS app, minimal permissions and private worker,
and verify consent → selection → sync → source data → disconnect. Local negative tenant tests
pass, but hosted enforcement and real provider authorization remain unverified. Do not start
another roadmap phase automatically. If an external GOS repository is supplied, reconcile
this standalone source with it before adoption.
