# ODIN telecom metrics

The analytics/control-center layer should expose telecom metrics without becoming part of the real-time lifecycle.

## Traffic

- attempts
- answered calls
- failed calls
- active calls
- CPS
- concurrent calls

## Quality / routing

- ASR = answered / attempts
- ACD = total connected duration / answered calls
- PDD = INVITE to first meaningful progress/answer according to the selected definition
- SIP final response distribution
- gateway availability
- route/supplier ASR
- route/supplier ACD
- route/supplier PDD

## Charging

- active CGRateS sessions
- START latency p50/p95/p99
- END latency p50/p95/p99
- disconnect latency
- prepaid denials
- zero-balance disconnect count
- orphan session count

## Commercial / RA

- SELL
- BUY
- gross margin
- SELL missing
- BUY missing
- RA divergence count
- open CDR count

## Correlation

Metrics and CDR projections should preserve stable references such as:

- Call-ID
- CGRID
- tenant/account reference
- supplier reference
- route reference

Do not expose sensitive internal identifiers to public clients unless explicitly required by the private deployment.
