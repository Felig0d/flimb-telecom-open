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
        avg(pdd_ms) FILTER (WHERE pdd_ms IS NOT NULL) AS avg_pdd_ms,
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
        "avgPddMs": float(row["avg_pdd_ms"]) if row["avg_pdd_ms"] is not None else None,
        "sellCost": float(row["sell_cost"] or 0),
        "buyCost": float(row["buy_cost"] or 0),
        "grossMargin": float((row["sell_cost"] or 0) - (row["buy_cost"] or 0)),
        "raFailures": row["ra_failures"] or 0,
    }


@app.get("/v1/cdrs")
async def cdrs(
    limit: int = Query(default=100, ge=1),
    offset: int = Query(default=0, ge=0),
    supplier_ref: str | None = None,
    route_ref: str | None = None,
    account_ref: str | None = None,
):
    limit = min(limit, settings.analytics_max_page_size)

    clauses = []
    params: list[object] = []

    if supplier_ref:
        clauses.append("supplier_ref = %s")
        params.append(supplier_ref)
    if route_ref:
        clauses.append("route_ref = %s")
        params.append(route_ref)
    if account_ref:
        clauses.append("account_ref = %s")
        params.append(account_ref)

    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    sql = f"""
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
        pdd_ms,
        sip_final_code,
        answered,
        sell_cost,
        buy_cost,
        ra_state,
        disconnect_reason,
        source_system
    FROM analytics_cdr
    {where}
    ORDER BY started_at DESC
    LIMIT %s OFFSET %s
    """
    params.extend([limit, offset])

    async with connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(sql, params)
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
async def hourly_metrics(limit: int = Query(default=24, ge=1, le=24 * 30)):
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


async def grouped_metrics(group_column: str, window_minutes: int, limit: int):
    since = datetime.now(timezone.utc) - timedelta(minutes=window_minutes)
    sql = f"""
    SELECT
        {group_column} AS ref,
        count(*) AS attempts,
        count(*) FILTER (WHERE answered) AS answered,
        count(*) FILTER (WHERE NOT answered) AS failed,
        CASE WHEN count(*) > 0
             THEN count(*) FILTER (WHERE answered)::numeric / count(*)::numeric
             ELSE NULL END AS asr,
        CASE WHEN count(*) FILTER (WHERE answered) > 0
             THEN COALESCE(sum(duration_seconds) FILTER (WHERE answered), 0)::numeric
                  / count(*) FILTER (WHERE answered)::numeric
             ELSE NULL END AS acd_seconds,
        avg(pdd_ms) FILTER (WHERE pdd_ms IS NOT NULL) AS avg_pdd_ms,
        COALESCE(sum(sell_cost), 0) AS sell_cost,
        COALESCE(sum(buy_cost), 0) AS buy_cost
    FROM analytics_cdr
    WHERE started_at >= %s
      AND {group_column} IS NOT NULL
    GROUP BY {group_column}
    ORDER BY attempts DESC
    LIMIT %s
    """

    async with connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(sql, (since, limit))
            rows = await cur.fetchall()

    return {
        "windowMinutes": window_minutes,
        "items": [
            {
                **row,
                "asr": float(row["asr"]) if row["asr"] is not None else None,
                "acd_seconds": float(row["acd_seconds"]) if row["acd_seconds"] is not None else None,
                "avg_pdd_ms": float(row["avg_pdd_ms"]) if row["avg_pdd_ms"] is not None else None,
                "sell_cost": float(row["sell_cost"] or 0),
                "buy_cost": float(row["buy_cost"] or 0),
                "gross_margin": float((row["sell_cost"] or 0) - (row["buy_cost"] or 0)),
            }
            for row in rows
        ],
    }


@app.get("/v1/metrics/suppliers")
async def supplier_metrics(
    window_minutes: int = Query(default=60, ge=1, le=10080),
    limit: int = Query(default=50, ge=1, le=500),
):
    return await grouped_metrics("supplier_ref", window_minutes, limit)


@app.get("/v1/metrics/routes")
async def route_metrics(
    window_minutes: int = Query(default=60, ge=1, le=10080),
    limit: int = Query(default=50, ge=1, le=500),
):
    return await grouped_metrics("route_ref", window_minutes, limit)
