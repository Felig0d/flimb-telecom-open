# Flimb Central database boundary

Flimb Central is the commercial/customer master and integrates with ERP/financial systems.

Its schema and migrations live in the Central repository, not here.

Contract:

- Central owns organization/customer master data
- Central owns product subscriptions and commercial access
- ODIN stores stable external references only
- provisioning crosses the boundary through API/events
- ODIN does not duplicate ERP/customer master tables
