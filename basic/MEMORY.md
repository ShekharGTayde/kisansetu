# AgriPact: Agent Memory

Living project memory. **Read this instead of re-analyzing the project.** Update it at the end of every task (see rules at the bottom). Keep it short, factual, and current; edit entries in place rather than appending duplicates.

Last updated: 2026-10-27 | After task: T-003 | Updated by: agent

---

## 1. Project Snapshot (stable)

- **Name:** AgriPact / KisanSetu, a pre-crop contract farming platform connecting farmers and buyers before sowing.
- **Build scope (current):** role-based login (farmer/buyer) -> buyer posts requirement listing -> farmer browses and submits offer -> both negotiate with counter-proposals -> agreement generates a contract -> both confirm -> contract active, PDF download.
- **Out of scope for now:** admin panel, verification/OTP, land management, crop progress, delivery, quality, payments, disputes, ratings, weather, i18n, analytics, sockets (use polling).
- **Roles:** `farmer`, `buyer` only.
- **Stack:** MongoDB + Mongoose, Express, React (Vite), Node. Socket.IO for realtime. JWT auth (access + refresh).
- **Scope docs:** PRD (FR-/NFR- IDs), `TASKS.md` (ordered build plan, 23 tasks), `AGENTS.md` (how to work).
- **Phases:** Setup T-001 to T-002, Auth T-003 to T-007, Listings T-008 to T-012, Offers/Negotiation T-013 to T-016, Contract T-017 to T-021, Finish T-022 to T-023.

## 2. Current State (agent updates every task)

| Item | Value |
|---|---|
| Current task | T-004: Register and login API |
| Last completed task | T-003: User model |
| Tasks done | 3 / 23 |
| Repo state | User model created with farmer/buyer roles, safe JSON transformation, bcrypt hashing, and test suite |
| Known broken / failing | none |

## 3. Repo Map (record real paths as they are created)

```
client/
  src/
    App.jsx               -> Interactive biophilic landing with flow tabs & live health indicator
    index.css             -> Design tokens (Cormorant Garamond, Plus Jakarta Sans, Forest Green #1b3b22)
    main.jsx              -> Vite React root
  public/
    images/hero-hills.jpg -> Misty pine hills background asset
  vite.config.js          -> Vite config with Tailwind & proxy to :5000
server/
  src/
    config/
      db.js               -> Mongoose connection manager with fail-fast options
    models/
      User.js             -> User schema with farmer/buyer roles, extras, bcrypt hashing
    utils/
      response.js         -> Standard API envelope helpers (sendSuccess, sendError)
    app.js                -> Express app with helmet, cors, standard envelope, central 404 and error handlers
    server.js             -> MongoDB connector and Port 5000 listener
  tests/
    db.test.js            -> MongoMemoryServer connect/disconnect unit tests
    health.test.js        -> Jest + Supertest health route, 404 & malformed JSON envelope tests
    user.model.test.js    -> User schema validation, unique email & role unit tests
  eslint.config.js        -> ESLint 9 flat configuration
  .env.example            -> Environment variables template
```

Key files (agent: add one line per important file; remove if deleted):

| Path | Purpose |
|---|---|
| `client/src/App.jsx` | Landing hero, floating navbar, requirement browser, and contract flow |
| `client/src/index.css` | Biophilic design tokens and typography |
| `server/src/config/db.js` | MongoDB connection with fail-fast config |
| `server/src/models/User.js` | User schema with farmer/buyer roles and secure password hashing |
| `server/src/utils/response.js` | Standard API response helpers |
| `server/src/app.js` | Express app configuration and error handling envelope |
| `server/src/server.js` | Backend server bootstrapper with MongoDB connection |
| `server/tests/db.test.js` | Database connect and disconnect tests |
| `server/tests/health.test.js` | Health check & envelope unit tests |
| `server/tests/user.model.test.js` | User model unit test suite |

## 4. Conventions (follow these; do not re-decide)

- **API prefix:** `/api/v1`. Resource names plural, kebab-case.
- **Response envelope:** `{ success: boolean, data: any, error: { code, message, details? } | null }`.
- **Auth:** JWT access token in `Authorization: Bearer` (role inside token); refresh token optional.
- **RBAC:** `authenticate` then `authorize('farmer'|'buyer')`; ownership checks in service layer; only the two parties can see an offer or contract.
- **Validation:** Joi or Zod on every endpoint (pick one in T-003 and record it in section 5).
- **IDs/codes:** Mongo ObjectId for ids; `contractNo` human-readable, unique.
- **Money/units:** INR, stored as integer paise (1 INR = 100 paise); metric units (kg, quintal, hectare/acre with explicit unit field).
- **Never hard delete** contracts or negotiation entries.
- **Append-only:** `NegotiationEntry` is immutable; contract terms are read-only once `active`.
- **Negotiation rule:** a party cannot counter their own latest proposal; only the other party can accept.
- **Commits:** `T-0XX: short title`, one task per commit.
- **Tests:** every route has Supertest coverage; business rules have unit tests.

## 5. Decisions Log (agent records any choice not fixed by PRD)

| Date | Task | Decision | Reason |
|---|---|---|---|
| 2026-10-26 | T-001 | Exact Theme & Font Reference | Theme: Organic Biophilic, Forest Green (`#1b3b22`), Cream (`#f7f8f5`), rolling pine mist hills; Typography: Google Fonts `Cormorant Garamond` (editorial serif with italics) + `Plus Jakarta Sans` (modern clean body sans). |
| 2026-10-26 | T-001 | Styling & UI Stack | React 19 + Vite 8 + Tailwind CSS v4 + Lucide React for consistent SVG icons (no emojis). |
| 2026-10-26 | T-001 | Validation Library | Zod chosen for robust TypeScript-ready runtime schema validation. |
| 2026-10-26 | T-001 | Testing & Linting Tooling | ESLint 9 (flat config) + oxlint (client) + Jest 29 ESM + Supertest. |
| 2026-10-27 | T-003 | Money Storage Format | Integer paise (INR * 100) chosen to eliminate floating point imprecision across prices and contracts. |

Open choices to settle early and record here: PDF library (pdfkit vs puppeteer in T-020).

## 6. Data Models Registry (add as models are built)

| Model | File | Key fields / notes | Added in |
|---|---|---|---|
| `User` | `server/src/models/User.js` | `name`, `email` (unique), `phone`, `passwordHash` (hidden in toJSON), `role` (`farmer`\|`buyer`), `location`, `farmDetails` (farmer), `businessName` (buyer) | T-003 |

Planned models: User (role farmer|buyer), RequirementListing, Offer, NegotiationEntry (append-only), Contract.

## 7. API Registry (add every route when created)

| Method | Path | Roles | Purpose | Task |
|---|---|---|---|---|
| GET | /api/v1/health | public | health check | T-001 |

## 8. Frontend Registry (pages/routes as built)

| Route | Page/file | Roles | Task |
|---|---|---|---|
| / | `client/src/App.jsx` | public | Landing page with floating navbar, biophilic hero, requirement marketplace preview, and live negotiation sandbox | T-001 |

## 9. Environment Variables

| Name | Used by | Notes |
|---|---|---|
| PORT | server | API port (default 5000) |
| MONGO_URI | server | MongoDB connection string |
| JWT_SECRET | server | access token secret |
| CLIENT_URL | server | CORS origin (default http://localhost:5173) |


## 10. Commands (verify and correct as setup completes)

| Purpose | Command |
|---|---|
| Install | `npm install` in root, `client/`, and `server/` |
| Run both (concurrent) | `npm run dev` (from root - runs server on :5000 and client on :5173) |
| Run server | `npm run dev:server` or `cd server && npm run dev` |
| Run client | `npm run dev:client` or `cd client && npm run dev` |
| Lint | `npm run lint` (runs both server and client linters) |
| Test | `npm test` (runs server Jest test suite) |
| Build client | `npm run build:client` |

## 11. Gotchas and Lessons Learned

- CSS import order: In modern Vite/CSS, Google Fonts `@import url(...)` must be placed before `@import "tailwindcss";` to avoid build warnings.
- Windows powershell CLI scripts with special characters (like emojis) in Python output should set `$env:PYTHONIOENCODING="utf-8"`.

## 12. Deviations from PRD/Tasks

- None.

## 13. Open Questions for the Human

- None currently.

## 14. Session Log (newest first; keep last ~15, summarize older)

| Date | Task | Summary |
|---|---|---|
| 2026-10-27 | T-003 | Created User Mongoose model with role-based schemas (farmer/buyer), farmDetails & businessName extras, bcrypt password hashing, safe toJSON exclusions, and unit test suite. Recorded integer paise decision for money storage. |
| 2026-10-27 | T-002 | Implemented Mongoose database connection manager with fail-fast options, standard response envelope helpers, central error & 404 handlers, malformed JSON body handling, and test suite with Jest, Supertest & mongodb-memory-server. |
| 2026-10-26 | T-001 | Initialized client and server scaffolding, verified tooling and scripts. Implemented exact organic biophilic landing UI matching the reference image with Cormorant Garamond serif, floating pill navbar, misty hills backdrop, and verified health API with Jest & Supertest. Both lint and tests pass cleanly. |

---

## Rules for maintaining this file

1. **Read first, scan less.** Start every session here; open only files relevant to the current task.
2. **Update at the end of every task**, in the same commit as the code: Current State, Repo Map, registries (models/API/pages/env), plus Decisions, Gotchas, or Deviations when applicable.
3. **Edit in place.** Change or delete outdated rows; never leave two conflicting entries.
4. **Record facts, not narration.** Paths, names, signatures, commands, decisions with reasons.
5. **Stay concise.** If a section grows beyond about 40 rows, summarize older items. Target: whole file readable in under 2 minutes.
6. **Trust but verify cheaply.** If something here contradicts the code you are touching, fix this file and note it in the Session Log.
7. **Never store secrets** (keys, passwords, tokens) here; only variable names.
