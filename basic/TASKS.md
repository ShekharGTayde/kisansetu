# AgriPact: Agent Task File (Core Flow Scope)

**Scope of this build:** role-specific login (Farmer / Buyer), buyer publishes crop requirements, farmer browses them and negotiates, both agree and a contract is built and accepted. Nothing else.

**Out of scope (do not build):** admin panel, user document verification, OTP/SMS/email, land management, crop progress, delivery, quality, payments, disputes, ratings, weather, i18n, analytics, realtime sockets.

## Current Status Board (agent keeps this updated)

| Field | Value |
|---|---|
| Current task | Complete |
| Last completed | T-024: Direct farmer crop marketplace |
| Completed / Total | 24 / 24 |
| Phase in progress | Complete |
| Blocked tasks | none |

> `client/` and `server/` folders verified with tooling, scripts, ESLint, and test suite.

## How the agent must use this file

**Session start:** read `AGENTS.md`, then `MEMORY.md`, then this Status Board. Do not re-analyze the whole repo; open only files the current task touches.

**While working:**
1. Do tasks strictly in serial order. Never start a task until its `Depends on` tasks are `[x]`.
2. Mark the task `[~]` before coding (only one `[~]` at a time) and update the Status Board.
3. One task = one commit: `T-0XX: short title`.
4. Never skip **Verify**. API envelope: `{ success, data, error }`.
5. If blocked, mark `[!]`, log under **Blockers**, and stop unless a later task has all dependencies done.

**After each task (mandatory):** pass Verify, tick `[x]`, add a Progress Log line, advance the Status Board, update `MEMORY.md` (files, models, routes, pages, decisions), then commit.

Legend: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked

## Core flow (for reference)

1. User registers/logs in as **farmer** or **buyer**; each lands on their own dashboard.
2. **Buyer** creates a requirement listing (crop, quantity, quality, price, delivery date/place).
3. **Farmer** browses/searches listings and submits an offer.
4. Farmer and buyer **negotiate** with counter-proposals (price, quantity, delivery date).
5. One side accepts the latest proposal, and a **contract** is generated from the agreed terms.
6. Both parties confirm the contract; it becomes **active** and locked. Either can download it.

## Target structure

```
client/src/{components,pages,context,services,routes}
server/src/{config,models,controllers,routes,middleware,services,validators,utils}
server/tests/
```

---

## Phase 0: Setup

- [x] **T-001: Verify existing client/server and tooling**
  - Depends on: none
  - Do: inspect existing `client/` (React + Vite) and `server/` (Node + Express); fill gaps only: ESLint/Prettier, `.gitignore`, `.env.example` (PORT, MONGO_URI, JWT_SECRET, CLIENT_URL), npm scripts (`dev`, `lint`, `test`). Record real structure and commands in `MEMORY.md`.
  - Verify: both apps start; lint passes.

- [x] **T-002: Server skeleton and database**
  - Depends on: T-001
  - Do: Express app with helmet, cors, JSON parser, request logger; MongoDB connection (Mongoose) with fail-fast config; central error handler; 404 handler; response helpers; `GET /api/v1/health`. Set up Jest + Supertest + mongodb-memory-server.
  - Verify: health returns 200; bad JSON returns standard error envelope; sample test passes.

---

## Phase 1: Role-based Authentication

- [x] **T-003: User model**
  - Depends on: T-002
  - Do: `User` schema: `name`, `email` (unique), `phone`, `passwordHash`, `role` (`farmer` | `buyer`), `location` (district/state text), role extras (`farmDetails` for farmer: crops grown; `businessName` for buyer), timestamps. Never return `passwordHash`.
  - Verify: model tests for required fields, unique email, invalid role rejected.

- [x] **T-004: Register and login API**
  - Depends on: T-003
  - Do: `POST /auth/register` (role chosen at signup, validation), `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`. bcrypt hashing; JWT access token (add refresh only if simple). Role stored in token.
  - Verify: tests for duplicate email, wrong password, invalid role, `me` with and without token.

- [x] **T-005: Auth and role middleware**
  - Depends on: T-004
  - Do: `authenticate` and `authorize('farmer'|'buyer')` middleware; ownership helper; apply to a sample route for each role.
  - Verify: 401 without token; 403 for wrong role.

- [x] **T-006: Frontend foundation**
  - Depends on: T-005
  - Do: React Router, API client (axios with token header and 401 handling), `AuthContext` (user, role, login, logout), `ProtectedRoute` with role check, layout with role-aware navbar.
  - Verify: unauthenticated users redirected to login; wrong role redirected to own dashboard.

- [x] **T-007: Register/Login UI and role dashboards**
  - Depends on: T-006
  - Do: Register page (role selector Farmer/Buyer, role-specific fields), Login page, `FarmerDashboard` and `BuyerDashboard` placeholders with navigation to later features; redirect to the right dashboard after login.
  - Verify: register as each role then login lands on the correct dashboard; token persists on refresh.

---

## Phase 2: Buyer Requirement Listings

- [x] **T-008: Listing model**
  - Depends on: T-005
  - Do: `RequirementListing` schema: `buyerId`, `crop`, `variety`, `quantity`, `unit`, `qualitySpec` (grade, moisture/notes), `priceTerms` (`pricePerUnit` or min/max), `deliveryLocation`, `deliveryDate` (or window), `paymentTerms` (text), `validTill`, `status` (`open` | `paused` | `closed` | `fulfilled`), timestamps. Indexes on crop, status, location.
  - Verify: model validation tests (positive quantity, future dates).

- [x] **T-009: Buyer listing API**
  - Depends on: T-008
  - Do: buyer-only `POST /listings`, `PUT /listings/:id`, `PATCH /listings/:id/status` (pause/close), `GET /listings/mine`; only owner can modify; editing blocked once an offer is accepted.
  - Verify: farmer gets 403; buyer cannot edit another buyer's listing.

- [x] **T-010: Farmer browse and search API**
  - Depends on: T-009
  - Do: `GET /listings` (any logged-in user; default `open` and not expired) with filters: crop, location, min/max price, quantity range, delivery date; pagination and sort (newest, price). `GET /listings/:id` detail.
  - Verify: filter combination and pagination tests; closed/expired listings hidden.

- [x] **T-011: Buyer listing UI**
  - Depends on: T-007, T-009
  - Do: create/edit listing form, "My Listings" page with status controls, listing detail page for buyer.
  - Verify: create, edit, pause, close flow works in UI.

- [x] **T-012: Farmer browse UI**
  - Depends on: T-007, T-010
  - Do: listings page with search and filters, listing cards, detail page with "Make Offer" button.
  - Verify: filters change results; detail loads from card.

---

## Phase 3: Offers and Negotiation

- [x] **T-013: Offer model and submit API**
  - Depends on: T-010
  - Do: `Offer` schema: `listingId`, `farmerId`, `buyerId`, `proposedPrice`, `quantity`, `deliveryDate`, `note`, `status` (`negotiating` | `accepted` | `rejected` | `withdrawn`), `lastProposalBy`, timestamps. Farmer-only `POST /listings/:id/offers`; one active offer per farmer per listing; quantity cannot exceed listing remaining quantity.
  - Verify: duplicate and over-quantity tests; buyer cannot submit offers.

- [x] **T-014: Negotiation (counter-proposal) API**
  - Depends on: T-013
  - Do: append-only `NegotiationEntry` (`offerId`, `senderId`, `senderRole`, `price`, `quantity`, `deliveryDate`, `message`, `timestamp`); `POST /offers/:id/counter` with turn-taking (a party cannot counter their own latest proposal); `GET /offers/:id/history`; access limited to the two parties. Entries cannot be edited or deleted.
  - Verify: turn-taking, immutability, and access-control tests.

- [x] **T-015: Accept, reject, withdraw**
  - Depends on: T-014
  - Do: `POST /offers/:id/accept` (only the party who did NOT make the latest proposal), `/reject`, `/withdraw` (farmer). Accepting freezes the agreed terms (latest proposal) on the offer and reduces listing remaining quantity; listing becomes `fulfilled` when quantity is fully committed.
  - Verify: only the correct party can accept; terms snapshot equals latest proposal; quantity math tests.

- [x] **T-016: Offers and negotiation UI**
  - Depends on: T-011, T-012, T-015
  - Do: farmer "Make Offer" form and "My Offers" page; buyer "Offers on this listing" view with comparison table; shared negotiation thread page (history, counter form, Accept/Reject buttons shown only when allowed); simple polling every few seconds for updates.
  - Verify: two sessions (buyer and farmer) complete a negotiation to acceptance.

---

## Phase 4: Contract

- [x] **T-017: Contract model and generation**
  - Depends on: T-015
  - Do: `Contract` schema: `contractNo` (unique, e.g. `AGP-2026-000123`), `offerId`, `listingId`, `farmerId`, `buyerId`, `terms` snapshot (crop, variety, quantity, unit, price, total amount, quality spec, delivery location/date, payment terms), `status` (`pending_confirmation` | `active` | `cancelled`), `confirmedBy` (farmer/buyer timestamps), `createdAt`. Auto-create when an offer is accepted.
  - Verify: contract terms equal accepted terms; `contractNo` unique; total = price x quantity.

- [x] **T-018: Contract confirmation and locking**
  - Depends on: T-017
  - Do: `POST /contracts/:id/confirm` for each party; when both have confirmed, status becomes `active` and terms become read-only (enforce in model hook/service); allow `cancel` only while `pending_confirmation`.
  - Verify: both-party confirmation required; edit attempt on active contract fails.

- [x] **T-019: Contract read APIs**
  - Depends on: T-018
  - Do: `GET /contracts/mine` (role-aware), `GET /contracts/:id` (parties only).
  - Verify: non-party gets 403/404.

- [x] **T-020: Contract PDF export**
  - Depends on: T-018
  - Do: `GET /contracts/:id/pdf` generating a clean PDF (contract number, parties, terms, confirmation timestamps); store SHA-256 of terms on the contract for integrity.
  - Verify: PDF downloads and matches contract data.

- [x] **T-021: Contract UI**
  - Depends on: T-016, T-019, T-020
  - Do: "My Contracts" list for both roles, contract detail page with status badge and confirm button, PDF download; notification-style banner on dashboards when a contract awaits confirmation.
  - Verify: accepted offer then contract appears for both; both confirm then status becomes Active.

---

## Phase 5: Finish

- [x] **T-022: End-to-end test and demo seed**
  - Depends on: T-021
  - Do: E2E test (Playwright or Cypress) for the full flow: register buyer and farmer, create listing, offer, counter, accept, confirm contract; `npm run seed:demo` with sample users and listings.
  - Verify: E2E passes; seed is idempotent.

- [x] **T-023: Hardening and docs**
  - Depends on: T-022
  - Do: review every route for validation, role and ownership checks, rate limit login; README with setup/run steps and demo accounts; Swagger or Postman collection; final `MEMORY.md` cleanup. Tag `v1.0.0`.
  - Verify: fresh clone follows README and runs the full flow.

---

## Post-release extension

- [x] **T-024: Direct farmer crop marketplace**
  - Depends on: T-023
  - Do: farmers list available or expected crops; buyers browse and place direct purchase requests; farmers accept/reject requests; reserve and restore quantities safely.
  - Verify: farmer crop listing, buyer direct order, farmer decision, role checks, and client build/lint.

## Progress Log
2026-10-27 | T-024 | Added direct farmer crop marketplace with available/expected crop listings, buyer purchase requests, farmer accept/reject workflow, quantity reservation, role checks, and responsive UI.
2026-10-27 | T-008 | Built RequirementListing Mongoose model with validation, future dates, remainingQuantity tracking, indexes, and Jest unit test suite.
2026-10-27 | T-023 | Completed offer and contract UI, contract PDF export, API flow E2E coverage, idempotent demo seed, login rate limiting, and setup/API documentation.
2026-10-27 | T-011/T-012 | Added buyer requirement creation/management and farmer marketplace browse/detail/offer screens with responsive accessible UI.
2026-10-27 | T-015 | Added protected listing browse/management APIs, offer submission and append-only counter-proposals, turn-taking decisions, quantity accounting, and automatic contract creation.
2026-10-27 | T-007 | Created role-aware RegisterPage, LoginPage with 1-click demo logins, FarmerDashboard and BuyerDashboard with statistics and action links, and idempotent database seed script.
2026-10-27 | T-006 | Implemented frontend foundation with React Router, axios API client with Bearer header & 401 handling, AuthContext, ProtectedRoute with role checks, and role-aware floating pill navbar and Layout.
2026-10-27 | T-005 | Built JWT authenticate and role-based authorize('farmer'|'buyer') middleware with isOwner helper and verified 401/403 access control with Supertest.
2026-10-27 | T-004 | Implemented /api/v1/auth routes (register, login, me, logout), Zod input validation, JWT token creation with role payload, duplicate email check, and comprehensive Supertest suite.
2026-10-27 | T-003 | Created User Mongoose model with role-based schemas (farmer/buyer), farmDetails & businessName extras, bcrypt password hashing, safe toJSON exclusions, and unit test suite.
2026-10-27 | T-002 | Implemented Mongoose connection with fail-fast config, standard response envelope helpers, central error & 404 handlers, malformed JSON body handling, and test suite with Jest, Supertest & mongodb-memory-server.
2026-10-26 | T-001 | Verified client (React+Vite) & server (Express). Created exact organic biophilic theme with Cormorant Garamond italic serif & Plus Jakarta Sans, floating pill navbar, Jest & ESLint configs. Verified lint and test passing.

<!-- Agent: append one line per completed task: YYYY-MM-DD | T-0XX | notes / deviations -->

## Blockers

<!-- Agent: task ID, the question, and what was assumed (if anything) -->
