BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS analytics_cdr (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_event_id text NOT NULL UNIQUE,
    call_id text NOT NULL,
    cgrid text,
    tenant_ref text,
    account_ref text,
    supplier_ref text,
    route_ref text,
    direction text NOT NULL DEFAULT 'outbound'
        CHECK (direction IN ('inbound','outbound')),
    started_at timestamptz NOT NULL,
    answered_at timestamptz,
    ended_at timestamptz,
    duration_seconds integer NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
    billable_seconds integer NOT NULL DEFAULT 0 CHECK (billable_seconds >= 0),
    sip_final_code integer,
    answered boolean NOT NULL DEFAULT false,
    sell_cost numeric(18,6),
    buy_cost numeric(18,6),
    ra_state text NOT NULL DEFAULT 'unknown'
        CHECK (ra_state IN ('pass','warn','fail','unknown')),
    ingested_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_cdr_started_idx
    ON analytics_cdr (started_at DESC);

CREATE INDEX IF NOT EXISTS analytics_cdr_supplier_started_idx
    ON analytics_cdr (supplier_ref, started_at DESC);

CREATE INDEX IF NOT EXISTS analytics_cdr_route_started_idx
    ON analytics_cdr (route_ref, started_at DESC);

CREATE TABLE IF NOT EXISTS traffic_hourly (
    bucket_start timestamptz NOT NULL,
    tenant_ref text,
    supplier_ref text,
    route_ref text,
    attempts bigint NOT NULL DEFAULT 0,
    answered bigint NOT NULL DEFAULT 0,
    failed bigint NOT NULL DEFAULT 0,
    total_connected_seconds bigint NOT NULL DEFAULT 0,
    pdd_sum_ms bigint NOT NULL DEFAULT 0,
    pdd_samples bigint NOT NULL DEFAULT 0,
    sell_cost numeric(20,6) NOT NULL DEFAULT 0,
    buy_cost numeric(20,6) NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket_start, tenant_ref, supplier_ref, route_ref)
);

CREATE VIEW traffic_hourly_metrics AS
SELECT
    bucket_start,
    tenant_ref,
    supplier_ref,
    route_ref,
    attempts,
    answered,
    failed,
    CASE WHEN attempts > 0
         THEN answered::numeric / attempts::numeric
         ELSE NULL END AS asr,
    CASE WHEN answered > 0
         THEN total_connected_seconds::numeric / answered::numeric
         ELSE NULL END AS acd_seconds,
    CASE WHEN pdd_samples > 0
         THEN pdd_sum_ms::numeric / pdd_samples::numeric
         ELSE NULL END AS avg_pdd_ms,
    sell_cost,
    buy_cost,
    sell_cost - buy_cost AS gross_margin
FROM traffic_hourly;

COMMIT;
