# Tests

Synthetic and reproducible tests only.

## Order

1. preflight
2. public safety scan
3. OpenSIPS syntax/config validation
4. CGRateS config validation/start
5. basic SIP dialog
6. charging lifecycle
7. routing/failover
8. failure injection
9. restart tests
10. longer soak/load tests

The complete scenario list is in `TEST_MATRIX.md`.

## Evidence

For each test preserve only synthetic evidence:

- SIP response codes
- synthetic Call-ID
- CGRateS session count
- synthetic balance before/after
- CDR count
- start/end timestamps
- error/timeout counters

Do not commit evidence from production systems.
