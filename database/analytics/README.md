# ODIN Analytics database

The analytics database is a read-optimized projection. It is not an authority for SIP or charging lifecycle.

## Responsibilities

- CDR search/indexing
- hourly/daily traffic aggregates
- ASR
- ACD
- PDD
- call attempt / answer / failure counts
- SIP response-code distributions
- supplier/route quality metrics
- SELL/BUY/RA projections for reporting
- historical correlation by synthetic/stable call identifiers

## Data flow

```text
OpenSIPS / CGRateS / ODIN
        |
        | events / normalized ingestion
        v
analytics PostgreSQL
        |
        v
Analytics API
        |
        v
ODIN Portal / Central
```

A read replica of transactional PostgreSQL may serve simple reporting, but long-term analytics should use its own projection schema so reporting queries do not depend on native service tables.

## Rule

Never use analytics state to decide whether a live SIP dialog or charging session exists.
