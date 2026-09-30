# FLIMB Telecom Open

Public experimental repository for native SIP and real-time charging research.

## Baseline

- OpenSIPS 3.6.9 LTS
- CGRateS
- Synthetic identities, balances and destinations only

## Goal

Exercise native OpenSIPS + CGRateS capabilities with as little application-side lifecycle orchestration as possible.

```text
SIP UA
  |
  v
OpenSIPS  <---- bidirectional JSON-RPC ---->  CGRateS
  |                                         SessionS / RALs / CDRs
  v
synthetic upstream
```

## Repository

- `opensips/` — sanitized OpenSIPS examples
- `cgrates/` — sanitized CGRateS examples
- `tests/` — synthetic regression matrix
- `scripts/` — safe local helper scripts
- `docs/` — architecture and development notes

## Safety

This repository is public. Do not commit production topology, credentials, customer/supplier identifiers, commercial rules, private endpoints, CDRs, Call-IDs, incident evidence or operational runbooks.

See `docs/SECURITY.md`.

## Status

Development / Beta. Not for production use.
