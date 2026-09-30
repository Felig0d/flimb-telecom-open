# OpenSIPS

Baseline: **OpenSIPS 3.6.9 LTS**.

The beta intentionally exercises native OpenSIPS behavior instead of application-side SIP lifecycle orchestration.

## Main example

`opensips.cfg.example` demonstrates:

- stateful transaction handling
- CANCEL transaction matching
- Record-Route / loose routing
- dialog-aware CGRateS accounting
- prepaid fail-closed authorization
- synthetic upstream routing

## Optional routing

`drouting-snippet.cfg.example` documents the intended native gateway-failover pattern using `do_routing()`, `next_routing()` and `failure_route`.

Do not add production topology, credentials or provider identifiers to this public repository.
