# Database architecture

The DEV/Beta database layout is PostgreSQL-first.

```text
PostgreSQL cluster
├── authentik
├── flimb_central
├── odin
├── opensips
└── cgrates

Redis
└── CGRateS DataDB

NATS JetStream
└── provisioning / domain events
```

## Important

The public repository contains only generic schemas and synthetic examples.

No production credentials, topology, customer records or commercial data belong here.

## DEV functional HA

The intended first HA exercise is:

```text
PostgreSQL PRIMARY
- native host installation
- port 5432

PostgreSQL STANDBY
- Docker container
- port 5433
- separate volume
```

This validates streaming replication, promotion, rejoin, application reconnect and split-brain protections. It does **not** validate host-level HA because both instances share one physical machine.

See `database/ha-lab/README.md`.
