# Native SIP + Charging Beta

This public beta explores a minimal real-time path using native OpenSIPS and CGRateS capabilities.

## Baseline

- OpenSIPS 3.6.9 LTS
- CGRateS
- Synthetic accounts and destinations only

## Runtime principle

```text
SIP endpoint
    |
    v
OpenSIPS
  - transaction handling
  - dialog tracking
  - routing/failover
  - CGRateS authorization/accounting
    |
    +----> CGRateS
            - authorization
            - SessionS
            - RALs
            - debit/balance
            - cost/CDR
```

Application/control-plane systems should not be required for an established SIP dialog to terminate cleanly.

## Beta invariants

1. Authorization failure is fail-closed.
2. A successful SIP dialog maps to one charging session.
3. Retransmissions must not create duplicate charging sessions.
4. Dialog termination must close accounting without an application-side state machine.
5. Routing failure before answer must end as a failed attempt, not an orphan session.
6. Monitoring observes the runtime; it is not a second lifecycle authority.

## Public-repository rule

All examples use loopback, TEST-NET addresses, synthetic identities and placeholder credentials. No production topology or commercial data belongs here.
