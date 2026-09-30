# FLIMB Telecom Open

Public experimental repository for native SIP, real-time charging and telecom analytics research.

## Baseline

- OpenSIPS 3.6.9 LTS
- CGRateS
- PostgreSQL-first data architecture
- Redis for CGRateS DataDB
- ODIN Portal / Analytics API
- synthetic identities, balances and destinations only

## Goal

Use native OpenSIPS + CGRateS capabilities in the real-time path and keep control-plane/analytics concerns outside call lifecycle.

```text
SIP UA
  |
  v
OpenSIPS  <---- bidirectional JSON-RPC ---->  CGRateS
  |
  +---- telemetry/CDR/events ----> Analytics API ----> ODIN Portal
```

## Repository

- `opensips/` — sanitized OpenSIPS examples
- `cgrates/` — sanitized CGRateS examples
- `database/` — PostgreSQL-first schemas and HA functional lab
- `analytics/` — read-only analytics API
- `portal/` — ODIN control-center UI
- `tests/` — synthetic regression matrix
- `scripts/` — safe local helper scripts
- `docs/` — architecture decisions and contracts

## Safety

This repository is public. Do not commit production topology, credentials, customer/supplier identifiers, commercial rules, private endpoints, CDRs, Call-IDs, incident evidence or operational runbooks.

See `docs/SECURITY.md`.

## Status

Development / Beta. Not for production use.
