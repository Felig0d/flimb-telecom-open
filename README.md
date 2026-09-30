# FLIMB Telecom Open

Beta experimental para validar um runtime SIP/charging com o mínimo possível de lógica FTI no caminho crítico.

## Baseline

- OpenSIPS 3.6.9 LTS
- CGRateS
- Objetivo: explorar integração nativa OpenSIPS ↔ CGRateS
- ODIN fora do lifecycle realtime sempre que possível

## Princípio arquitetural

```text
OpenSIPS = SIP, routing, dialog, transactions
CGRateS  = authorization, SessionS, RALs, charging, cost, disconnect
ODIN     = control plane, commercial context, SELL/BUY, RA, audit
```

## Estrutura inicial

```text
opensips/
cgrates/
docs/
tests/
scripts/
```

## Estado

Projeto em fase DEV/Beta. Não usar em produção.
