# Analytics API contract

Clients consume analytics through an API, not by connecting directly to database replicas.

## Read endpoints

Suggested stable contract:

- `GET /api/analytics/summary`
- `GET /api/analytics/cdrs`
- `GET /api/analytics/routes`
- `GET /api/analytics/suppliers`
- `GET /api/analytics/metrics?window=...`

These endpoints read from the analytics projection or a read replica.

## Writes

Any command or configuration change goes to the authoritative control-plane API.

Examples:

- create/update customer product settings -> Central / ODIN control API
- routing/provisioning change -> ODIN
- charging configuration -> supported CGRateS provisioning path

Never write through the analytics database or read replica.

## UI behavior

The ODIN portal may use the replica-backed Analytics API for dashboards and history while using authoritative APIs for live commands.

This keeps heavy reads away from the primary without creating a second writer.
