# ODIN Beta Portal

Public control-center UI for the native OpenSIPS + CGRateS beta.

## Stack

- Next.js 16.3.x
- React 19
- TypeScript
- App Router

## Data adapters

The portal never connects directly to PostgreSQL, Redis, OpenSIPS management interfaces or CGRateS RPC.

It uses server-side adapters:

- FTI operational API -> active calls, sessions, health, RA status
- ODIN Analytics API -> CDR/ASR/ACD/PDD/historical reporting

Both adapters have safe synthetic/mock defaults for public DEV.

## Run

```bash
cd portal
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## API bridges

- `GET /api/health`
- `GET /api/fti/overview`
- `GET /api/fti/calls`
- `GET /api/fti/revenue-assurance`
- `GET /api/analytics/summary`
- `GET /api/analytics/hourly`

Keep secrets and internal endpoint mappings in private/local environment files.
