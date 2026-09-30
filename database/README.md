# Database architecture

The DEV/Beta database layout is PostgreSQL-first.

```text
PostgreSQL cluster
├── authentik
├── flimb_central
├── odin
├── opensips
├── cgrates
└── analytics

Redis
└── CGRateS DataDB

NATS JetStream
└── provisioning / domain events
```

Each database has a separate owner/role and migration lifecycle even when all databases share one DEV PostgreSQL cluster.

## Read-plane

Dashboards, CDR search, ASR/ACD/PDD and historical reports use the Analytics API backed by `analytics` or an approved read replica.

Runtime services keep writing to their authoritative stores.

## DEV functional HA

```text
PostgreSQL PRIMARY
- native host installation
- 5432

PostgreSQL STANDBY
- Docker
- 5433
- separate volume
```

This validates streaming replication, promotion, reconnect, rejoin and split-brain protections. It does not validate physical-host HA.

See `database/ha-lab/README.md`.
