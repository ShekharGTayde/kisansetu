# KisanSetu / AgriPact

KisanSetu connects farmers and institutional buyers before sowing. Buyers publish crop requirements, farmers submit offers, both parties negotiate, and accepted terms become a dual-confirmed contract.

## Run locally

1. Install dependencies for each application:

   ```powershell
   npm install --prefix client
   npm install --prefix server
   ```

   The repository root contains only development scripts, so it does not need a
   `node_modules` directory.
2. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and `JWT_SECRET`.
3. Start both applications:

   ```powershell
   npm run dev
   ```

   The client runs at `http://localhost:5173` and the API at `http://localhost:5000`.

4. Create repeatable demo data:

   ```powershell
   npm run seed:demo
   ```

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Farmer | farmer@kisansetu.in | Farmer@123 |
| Buyer | buyer@itcagri.com | Buyer@123 |

## Core API

All API responses use `{ success, data, error }` and are prefixed with `/api/v1`.

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `POST /listings`, `GET /listings`, `GET /listings/mine`
- `POST /listings/:id/offers`, `GET /offers/mine`
- `POST /offers/:id/counter`, `GET /offers/:id/history`
- `POST /offers/:id/accept|reject|withdraw`
- `GET /contracts/mine`, `GET /contracts/:id`
- `POST /contracts/:id/confirm`, `GET /contracts/:id/pdf`
- `GET /crops`, `POST /crops` (farmer listings)
- `POST /crops/:id/orders` (buyer direct purchase request)
- `GET /crops/orders/mine`, `PATCH /crops/orders/:id/status`

Mutating endpoints require a bearer access token and enforce role and ownership checks server-side.

## Direct crop marketplace

Farmers can list crops available now or expected later, including quantity, unit, price, location, and quality notes. Buyers can reserve a quantity with a direct purchase request. Payment is not processed in this release; the request remains pending until the farmer accepts or rejects it. Rejected requests restore the reserved quantity.

## Verification

```powershell
npm run lint
npm run build:client
npm test
```

The test suite uses `mongodb-memory-server`; on a clean machine its MongoDB binary download may require network access.
