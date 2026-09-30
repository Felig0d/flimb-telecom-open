BEGIN;

ALTER TABLE analytics_cdr
    ADD COLUMN IF NOT EXISTS pdd_ms integer
        CHECK (pdd_ms IS NULL OR pdd_ms >= 0);

ALTER TABLE analytics_cdr
    ADD COLUMN IF NOT EXISTS disconnect_reason text;

ALTER TABLE analytics_cdr
    ADD COLUMN IF NOT EXISTS source_system text NOT NULL DEFAULT 'unknown';

CREATE INDEX IF NOT EXISTS analytics_cdr_final_code_idx
    ON analytics_cdr (sip_final_code);

CREATE INDEX IF NOT EXISTS analytics_cdr_ra_state_idx
    ON analytics_cdr (ra_state);

COMMIT;
