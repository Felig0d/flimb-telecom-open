# Native SIP + Charging Beta

## Baseline

- OpenSIPS 3.6.9 LTS
- CGRateS
- synthetic data only

## Runtime boundary

```text
OpenSIPS
  - SIP transactions
  - Record-Route / in-dialog routing
  - dialog lifecycle
  - gateway routing/failover
  - CGRateS authorization/accounting adapter
        |
        v
CGRateS
  - SessionS
  - RALs
  - prepaid/postpaid charging
  - debit / balance
  - cost / CDR
  - native disconnect
```

Application/control-plane software is intentionally excluded from the real-time lifecycle in this beta.

## Invariants

1. Authorization/charging failure is fail-closed.
2. Monitoring failure alone does not terminate a healthy call.
3. SIP dialog identity and charging identity remain stable for the call.
4. Successful dialog -> one charging session.
5. Dialog end -> charging session termination.
6. Retransmission/re-INVITE does not create a second charging session.
7. Gateway routing state is not required to terminate an established charging session.
8. A failed attempt before financial start ends as failed, not pending.

## Native behavior being exercised

OpenSIPS `cgrates_acc()` is dialog-aware: it prepares accounting on the initial INVITE, starts the CGRateS session when the call is answered with 2xx and ends the session when the dialog terminates.

OpenSIPS can maintain multiple CGRateS engine connections for failover. CGRateS SessionS uses bidirectional agent connections when it needs to send requests back toward the SIP side.

## Out of scope for the first beta

- production cutover
- production HA
- real customer data
- automatic promotion/fencing
- custom financial state machine
- application-side winner arming
- application-side START/TERMINATE queues
