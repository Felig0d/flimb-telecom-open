# Analytics event contracts

Analytics consumes normalized events. It does not scrape or mutate runtime state.

## telecom.cdr.closed.v1

Minimal public contract:

```json
{
  "eventId": "synthetic-event-id",
  "eventType": "telecom.cdr.closed.v1",
  "occurredAt": "2026-01-01T00:00:00Z",
  "callId": "synthetic-call-id",
  "cgrid": "synthetic-cgrid",
  "tenantRef": "demo",
  "accountRef": "demo-account",
  "supplierRef": "demo-supplier",
  "routeRef": "demo-route",
  "direction": "outbound",
  "startedAt": "2026-01-01T00:00:00Z",
  "answeredAt": "2026-01-01T00:00:02Z",
  "endedAt": "2026-01-01T00:01:02Z",
  "durationSeconds": 60,
  "billableSeconds": 60,
  "pddMs": 2000,
  "sipFinalCode": 200,
  "answered": true,
  "sellCost": 0.10,
  "buyCost": 0.06,
  "raState": "pass",
  "disconnectReason": "normal"
}
```

## Rules

- `eventId` is idempotency key.
- events are append-only facts.
- replaying the same event must not duplicate an analytics CDR.
- private deployments may add metadata, but must preserve backwards compatibility.
- analytics events never authorize or terminate live calls.
