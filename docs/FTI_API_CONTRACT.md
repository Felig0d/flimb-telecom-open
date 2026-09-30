# ODIN ↔ FTI API contract

The public portal uses a small stable contract so the UI does not need to know the internal FTI service topology.

## Principle

```text
ODIN Portal
   |
   v
Next.js server-side API bridge
   |
   v
FTI API / gateway
   |
   +--> SIP telemetry
   +--> charging telemetry
   +--> CDR / RA
   +--> service health
```

The browser never receives private FTI credentials.

## Public contract

### GET /api/fti/overview

Returns:

- active calls
- active charging sessions
- orphan session count
- open CDR count
- RA state
- critical alert count
- START/END p99 latency
- service health list

### GET /api/fti/calls

Returns sanitized call summaries using a stable ID plus operational states.

### GET /api/fti/revenue-assurance

Returns RA status, divergence count, orphan count, open CDR count and check timestamp.

## Integration strategy

The server-side adapter reads path mappings from environment variables. A private deployment can point these mappings at existing FTI APIs or at a small gateway without changing the portal components.

Do not hard-code internal FTI hostnames, credentials, route names or topology in the public repository.

## Future endpoints

Add behind the same adapter pattern:

- routing summary
- CGRateS session detail
- gateway health
- balances
- CDR detail
- alerts
- HA state
- service metrics

Prefer additive, versioned contracts so the portal does not need to be rewritten when the underlying runtime changes.
