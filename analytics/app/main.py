from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Query
from psycopg.rows import dict_row

from .db import close_pool, connection, open_pool
from .settings import settings


app = FastAPI(
    title="ODIN Analytics API",
    version="0.1.0",
    description="Read-only analytics API for synthetic DEV/Beta data.",
)


@app.on_event("startup")
async def startup() -> None:
    await open_pool()


@app.on_event("shutdown")
async def shutdown() -> None:
    await close_pool()


@app.get("/health")
async def health():
    async with connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute("SELECT 1 AS ok")
            row = await cur.fetchone()
    return {"status": "ok", "database": row["ok"] == 1}


@app.get("/v1/summary")
async def summary(window_minutes: int = Query(default=60, ge=1, le=10080)):
    since = datetime.now(timezone.utc) - timedelta(minutes=window_minutes)

    sql = """
    SELECT
        count(*) AS attempts,
        count(*) FILTER (WHERE answered) AS answered,
        count(*) FILTER (WHERE NOT answered) AS failed,
        COALESCE(sum(duration_seconds) FILTER (WHERE answered), 0) AS connected_seconds,
        COALESCE(sum(sell_cost), 0) AS sell_cost,
        COALESCE(sum(buy_cost), 0) AS buy_cost,
        count(*) FILTER (WHERE ra_state = 'fail') AS ra_failures
    FROM analytics_cdr
    WHERE started_at >= %s
    """

    async with connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(sql, (since,))
            row = await cur.fetchone()

    attempts = row["attempts"] or 0
    answered = row["answered"] or 0
    connected = row["connected_seconds"] or 0

    return {
        "windowMinutes": window_minutes,
        "attempts": attempts,
        "answered": answered,
        "failed": row["failed"] or 0,
        "asr": (answered / attempts) if attempts else None,
        "acdSeconds": (connected / answered) if answered else None,
        "sellCost": float(row["sell_cost"] or 0),
        "buyCost": float(row["buy_cost"] or 0),
        "grossMargin": float((row["sell_cost"] or 0) - (row["buy_cost"] or 0)),
        "raFailures": row["ra_failures"] or 0,
    }


@app.get("/v1/cdrs")
async def cdrs(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
):
    limit = min(limit, settings.analytics_max_page_size)

    sql = """
    SELECT
        id,
        call_id,
        cgrid,
        tenant_ref,
        account_ref,
        supplier_ref,
        route_ref,
        direction,
        started_at,
        answered_at,
        ended_at,
        duration_seconds,
        billable_seconds,
        sip_final_code,
        answered,
        sell_cost,
        buy_cost,
        ra_state
    FROM analytics_cdr
    ORDER BY started_at DESC
    LIMIT %s OFFSET %s
    """

    async with connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(sql, (limit, offset))
            rows = await cur.fetchall()

    return {
        "items": [
            {
                **row,
                "sell_cost": float(row["sell_cost"]) if row["sell_cost"] is not None else None,
                "buy_cost": float(row["buy_cost"]) if row["buy_cost"] is not None else None,
            }
            for row in rows
        ],
        "limit": limit,
        "offset": offset,
    }


@app.get("/v1/metrics/hourly")
async def hourly_metrics(
    limit: int = Query(default=24, ge=1, le=24 * 30),
):
    sql = """
    SELECT
        bucket_start,
        tenant_ref,
        supplier_ref,
        route_ref,
        attempts,
        answered,
        failed,
        asr,
        acd_seconds,
        avg_pdd_ms,
        sell_cost,
        buy_cost,
        gross_margin
    FROM traffic_hourly_metrics
    ORDER BY bucket_start DESC
    LIMIT %s
    """

    async with connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(sql, (limit,))
            rows = await cur.fetchall()

    return {"items": rows}
