# ADR-0001 — Data ownership and PostgreSQL-first architecture

Status: Accepted for DEV/Beta.

## Decision

The platform uses explicit data ownership and avoids ad-hoc SQLite databases in the core path.

| Domain | Authority | Persistence |
|---|---|---|
| Identity / SSO | Authentik | Dedicated PostgreSQL database |
| Commercial customer master | Flimb Central / ERP | Dedicated PostgreSQL database |
| Telecom control plane | ODIN | Dedicated PostgreSQL database |
| SIP runtime configuration | OpenSIPS | Dedicated PostgreSQL database |
| Charging StorDB | CGRateS | Dedicated PostgreSQL database |
| Charging DataDB | CGRateS | Dedicated Redis instance/database |
| Portal | ODIN Portal | No business database |
| Event transport | NATS JetStream | Native JetStream storage |

A single PostgreSQL cluster may host the databases during DEV, but each domain keeps its own database, role and migration lifecycle.

## Rules

1. One domain has one authority.
2. No service writes directly into another service's domain tables.
3. Cross-domain integration uses APIs/events, not shared-table coupling.
4. OpenSIPS and CGRateS keep their native schemas.
5. ODIN stores references to Central entities, not a second customer master.
6. SQLite is allowed only for disposable developer tests, never as an architectural dependency.
7. Schema changes are versioned and repeatable.
8. Runtime call termination must not depend on the control-plane database being available.
