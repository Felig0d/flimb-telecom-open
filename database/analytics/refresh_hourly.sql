INSERT INTO traffic_hourly (
    bucket_start,
    tenant_ref,
    supplier_ref,
    route_ref,
    attempts,
    answered,
    failed,
    total_connected_seconds,
    pdd_sum_ms,
    pdd_samples,
    sell_cost,
    buy_cost
)
SELECT
    date_trunc('hour', started_at) AS bucket_start,
    tenant_ref,
    supplier_ref,
    route_ref,
    count(*) AS attempts,
    count(*) FILTER (WHERE answered) AS answered,
    count(*) FILTER (WHERE NOT answered) AS failed,
    COALESCE(sum(duration_seconds) FILTER (WHERE answered), 0) AS total_connected_seconds,
    0 AS pdd_sum_ms,
    0 AS pdd_samples,
    COALESCE(sum(sell_cost), 0) AS sell_cost,
    COALESCE(sum(buy_cost), 0) AS buy_cost
FROM analytics_cdr
WHERE started_at >= now() - interval '48 hours'
GROUP BY 1, 2, 3, 4
ON CONFLICT (bucket_start, tenant_ref, supplier_ref, route_ref)
DO UPDATE SET
    attempts = EXCLUDED.attempts,
    answered = EXCLUDED.answered,
    failed = EXCLUDED.failed,
    total_connected_seconds = EXCLUDED.total_connected_seconds,
    pdd_sum_ms = EXCLUDED.pdd_sum_ms,
    pdd_samples = EXCLUDED.pdd_samples,
    sell_cost = EXCLUDED.sell_cost,
    buy_cost = EXCLUDED.buy_cost;
