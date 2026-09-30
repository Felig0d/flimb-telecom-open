# ODIN database

ODIN owns **telecom control-plane configuration**, not customer master data and not the real-time charging session state.

The initial public schema contains generic examples for:

- organization references received from Central
- telecom account bindings
- suppliers
- gateways
- route sets
- routes
- provisioning outbox
- audit events

## Explicitly not stored here

- SSO passwords/tokens
- ERP/customer master data
- CGRateS live sessions
- CGRateS balances as source of truth
- OpenSIPS dialog state
- media state

Those belong to their authoritative systems.
