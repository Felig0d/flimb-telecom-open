# PostgreSQL functional HA lab

Purpose: validate HA behavior on one DEV host before moving to separate machines.

## Topology

```text
Host PostgreSQL primary
  127.0.0.1:5432
        |
        | streaming replication
        v
Docker PostgreSQL standby
  127.0.0.1:5433
```

Use separate data directories/volumes.

## What this validates

- WAL streaming
- replication lag
- promotion
- application reconnect
- rejoin/rebuild
- fencing procedures
- split-brain prevention
- migration compatibility after failover

## What this does not validate

- physical host failure
- independent storage failure
- independent network failure
- real multi-host quorum

## Guardrails

- Never run both nodes writable intentionally.
- Promotion must be explicit in the first phase.
- The old primary must be fenced before accepting writes on the promoted node.
- Keep DEV synthetic only.
- Do not reuse production credentials or WAL archives.

## Later

Once the functional lab passes, move the same contracts to separate VPS nodes and introduce an HA manager such as Patroni with an independent distributed consensus layer.
