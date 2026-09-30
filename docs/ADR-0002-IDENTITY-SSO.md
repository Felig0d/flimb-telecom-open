# ADR-0002 — Identity and SSO

Status: Accepted for DEV/Beta.

## Decision

Authentik remains the single interactive identity provider.

Applications use OIDC. They do not implement independent username/password stores.

## Boundaries

Authentik owns:

- authentication
- MFA
- identity lifecycle
- OIDC sessions/tokens

Flimb Central owns:

- organization membership
- commercial/product access
- business roles

ODIN consumes stable claims/references and enforces technical permissions.

## Target claims

Keep the public contract generic:

- `sub`
- organization reference
- role/permission claims
- product access claims

Do not place mutable commercial state or secrets inside long-lived tokens.

## Portal

The ODIN portal authenticates through Authentik and calls ODIN server-side APIs. Browser code never connects directly to PostgreSQL, Redis, OpenSIPS management APIs or CGRateS RPC endpoints.
