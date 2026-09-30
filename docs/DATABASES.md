# Developer database blueprint

## PostgreSQL-first

No core component should silently introduce SQLite as a durable dependency.

```text
PostgreSQL
├── authentik      -> Authentik only
├── flimb_central  -> Central only
├── odin           -> ODIN control plane
├── opensips       -> OpenSIPS native schema
├── cgrates        -> CGRateS StorDB
└── analytics      -> ODIN read/analytics projection

Redis dedicated to CGRateS
└── CGRateS DataDB
```

The databases may share one PostgreSQL cluster in DEV. Ownership boundaries remain the same when they later move to separate clusters.

## Read-plane

Dashboards, CDR search, ASR/ACD/PDD and historical reports go through the Analytics API backed by the analytics database or approved replica.

## HA functional lab

Primary PostgreSQL runs natively on the DEV host. A Docker standby receives streaming replication.

This intentionally tests database behavior and application reconnect before introducing Kubernetes or a second VPS.

## Production evolution

The same logical boundaries can later move to independent PostgreSQL HA nodes, dedicated Redis HA and clustered NATS without changing application contracts.
