# ODIN Beta Portal

Public, synthetic control-center UI for the native OpenSIPS + CGRateS beta.

## Stack

- Next.js 16.3.6
- React 19.3
- TypeScript
- App Router
- no UI framework dependency

## Run

```bash
cd portal
npm install
npm run dev
```

Open http://localhost:3000.

Health:

```text
GET /api/health
```

## Current data

All dashboard values are synthetic placeholders. The portal is intentionally disconnected from production systems.

## Next integration

Replace the synthetic values with a small read-only telemetry API for:

- OpenSIPS service health
- CGRateS service health
- active SIP dialogs
- active charging sessions
- RPC latency/errors
- START/END latency
- orphan correlation
- CDR / Revenue Assurance status

Keep operational writes and sensitive configuration out of the public beta.
