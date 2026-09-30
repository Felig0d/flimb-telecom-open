import asyncio
import json
from datetime import datetime
from decimal import Decimal
from typing import Any

import nats
import psycopg

from .settings import settings


INSERT_SQL = """
INSERT INTO analytics_cdr (
    source_event_id,
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
)
VALUES (
    %(source_event_id)s,
    %(call_id)s,
    %(cgrid)s,
    %(tenant_ref)s,
    %(account_ref)s,
    %(supplier_ref)s,
    %(route_ref)s,
    %(direction)s,
    %(started_at)s,
    %(answered_at)s,
    %(ended_at)s,
    %(duration_seconds)s,
    %(billable_seconds)s,
    %(pdd_ms)s,
    %(sip_final_code)s,
    %(answered)s,
    %(sell_cost)s,
    %(buy_cost)s,
    %(ra_state)s,
    %(disconnect_reason)s,
    %(source_system)s
)
ON CONFLICT (source_event_id) DO NOTHING
"""


def parse_time(value: str | None):
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def normalize(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "source_event_id": payload["eventId"],
        "call_id": payload["callId"],
        "cgrid": payload.get("cgrid"),
        "tenant_ref": payload.get("tenantRef"),
        "account_ref": payload.get("accountRef"),
        "supplier_ref": payload.get("supplierRef"),
        "route_ref": payload.get("routeRef"),
        "direction": payload.get("direction", "outbound"),
        "started_at": parse_time(payload["startedAt"]),
        "answered_at": parse_time(payload.get("answeredAt")),
        "ended_at": parse_time(payload.get("endedAt")),
        "duration_seconds": int(payload.get("durationSeconds", 0)),
        "billable_seconds": int(payload.get("billableSeconds", 0)),
        "pdd_ms": payload.get("pddMs"),
        "sip_final_code": payload.get("sipFinalCode"),
        "answered": bool(payload.get("answered", False)),
        "sell_cost": Decimal(str(payload["sellCost"])) if payload.get("sellCost") is not None else None,
        "buy_cost": Decimal(str(payload["buyCost"])) if payload.get("buyCost") is not None else None,
        "ra_state": payload.get("raState", "unknown"),
        "disconnect_reason": payload.get("disconnectReason"),
        "source_system": payload.get("sourceSystem", "unknown"),
    }


async def handle(message):
    try:
        payload = json.loads(message.data.decode("utf-8"))
        row = normalize(payload)

        async with await psycopg.AsyncConnection.connect(
            settings.analytics_write_database_url
        ) as conn:
            async with conn.cursor() as cur:
                await cur.execute(INSERT_SQL, row)
            await conn.commit()

        await message.ack()
    except Exception:
        await message.nak()
        raise


async def main() -> None:
    nc = await nats.connect(settings.nats_url)
    js = nc.jetstream()

    await js.subscribe(
        settings.nats_cdr_subject,
        durable=settings.nats_cdr_durable,
        cb=handle,
        manual_ack=True,
    )

    try:
        while True:
            await asyncio.sleep(3600)
    finally:
        await nc.drain()


if __name__ == "__main__":
    asyncio.run(main())
