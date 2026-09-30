# ODIN Analytics

Two deliberately separate processes:

- **API**: read-only CDR/metrics access for ODIN Portal and Central.
- **Consumer**: idempotent NATS event ingestion into the analytics projection.

## Responsibilities

- ASR / ACD / PDD
- CDR exploration
- supplier/route quality metrics
- SELL/BUY/margin reporting
- RA reporting

## Boundaries

This service never authorizes calls, starts/terminates CGRateS sessions or decides SIP dialog state.

The API can read from a PostgreSQL replica. The consumer writes only to the dedicated analytics projection database.

## API

```bash
cd analytics
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8086
```

## Consumer

```bash
python -m app.consumer
```

Events are defined in `docs/EVENT_CONTRACTS.md`. Replaying the same `eventId` is idempotent.

The browser consumes the API; it never connects to PostgreSQL directly.
