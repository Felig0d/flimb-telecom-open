# CGRateS

Public beta workspace for native CGRateS charging/session behavior.

## First phase

The sample overlay enables:

- RALs
- SessionS
- CDRs
- bidirectional JSON-RPC
- periodic prepaid debit
- stored session costs

The first phase deliberately leaves stale-session TTL and channel synchronization disabled until SIP liveness semantics are proven.

## Design rule

CGRateS owns financial session lifecycle. Application code should consume results for reporting/reconciliation rather than become another session-state authority.

Do not commit real accounts, balances, tariffs, credentials, internal endpoints or operational evidence.
