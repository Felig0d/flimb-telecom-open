# ODIN Analytics API

Read-only service for CDR exploration and telecom metrics.

## Responsibilities

- ASR / ACD / PDD reporting
- CDR search
- supplier/route metrics
- SELL/BUY/margin reporting
- RA reporting

## Non-responsibilities

This service does not:

- authorize calls
- start/terminate CGRateS sessions
- decide SIP dialog state
- write to OpenSIPS or CGRateS runtime stores

## Run

```bash
cd analytics
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8086
```

Point `ANALYTICS_DATABASE_URL` at the analytics projection or approved read replica.

The browser/portal should consume this API rather than PostgreSQL directly.
