# ADR-0004 — Analytics read-plane and PostgreSQL replicas

Status: Accepted for DEV/Beta.

## Decision

Operational writes and real-time SIP/charging remain on authoritative services and their primary stores.

Analytics, dashboards, CDR exploration and historical metrics must not load the primary transactional databases directly.

Use a dedicated read-plane:

```text
Primary transactional stores
        |
        | replication / events
        v
Read replica / analytics store
        |
        v
ODIN Analytics API
        |
        v
ODIN Portal / Central
```

## Important distinction

A PostgreSQL physical/logical replica is read-only for consumers.

Therefore:

- reads -> replica / analytics store
- writes / commands -> authoritative API / primary-owning service
- browser/client -> never connects directly to PostgreSQL

## Sources

The analytics plane may consume normalized data from:

- OpenSIPS operational facts
- CGRateS CDR/session/cost outputs
- ODIN routing/provisioning references
- Revenue Assurance results
- service/telemetry metrics

Prefer event/API contracts for cross-domain facts. Use database replication only for read scaling and reporting where ownership is already clear.

## Failure isolation

Analytics outage must not affect:

- SIP admission
- SIP dialog termination
- CGRateS SessionS
- prepaid debit
- native disconnect
- routing of already admitted calls

## DEV

The same-host PostgreSQL standby may be used to prove application read routing and failover behavior.

Production HA/read scaling later moves replicas to independent hosts without changing the API contract.
