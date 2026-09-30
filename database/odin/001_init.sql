BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id text NOT NULL UNIQUE,
    display_name text NOT NULL,
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','suspended','disabled')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS telecom_accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES organizations(id),
    external_product_id text NOT NULL,
    billing_mode text NOT NULL
        CHECK (billing_mode IN ('prepaid','postpaid')),
    technical_status text NOT NULL DEFAULT 'pending'
        CHECK (technical_status IN ('pending','active','suspended','disabled')),
    cgrates_tenant text NOT NULL,
    cgrates_account text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organization_id, external_product_id),
    UNIQUE (cgrates_tenant, cgrates_account)
);

CREATE TABLE IF NOT EXISTS suppliers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id text UNIQUE,
    name text NOT NULL,
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','disabled')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gateways (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid NOT NULL REFERENCES suppliers(id),
    name text NOT NULL,
    host text NOT NULL,
    port integer NOT NULL DEFAULT 5060 CHECK (port BETWEEN 1 AND 65535),
    transport text NOT NULL DEFAULT 'udp'
        CHECK (transport IN ('udp','tcp','tls')),
    priority integer NOT NULL DEFAULT 100,
    weight integer NOT NULL DEFAULT 1 CHECK (weight > 0),
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','disabled','draining')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (supplier_id, name)
);

CREATE TABLE IF NOT EXISTS route_sets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id text UNIQUE,
    name text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','disabled')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS routes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    route_set_id uuid NOT NULL REFERENCES route_sets(id) ON DELETE CASCADE,
    prefix text NOT NULL,
    gateway_id uuid NOT NULL REFERENCES gateways(id),
    priority integer NOT NULL DEFAULT 100,
    weight integer NOT NULL DEFAULT 1 CHECK (weight > 0),
    enabled boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (route_set_id, prefix, gateway_id)
);

CREATE TABLE IF NOT EXISTS account_route_sets (
    telecom_account_id uuid NOT NULL REFERENCES telecom_accounts(id) ON DELETE CASCADE,
    route_set_id uuid NOT NULL REFERENCES route_sets(id),
    priority integer NOT NULL DEFAULT 100,
    PRIMARY KEY (telecom_account_id, route_set_id)
);

CREATE TABLE IF NOT EXISTS provisioning_outbox (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type text NOT NULL,
    aggregate_id uuid NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    published_at timestamptz,
    attempts integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS provisioning_outbox_pending_idx
    ON provisioning_outbox (created_at)
    WHERE published_at IS NULL;

CREATE TABLE IF NOT EXISTS audit_events (
    id bigserial PRIMARY KEY,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    actor_subject text,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id text NOT NULL,
    correlation_id text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO schema_migrations(version)
VALUES ('001_init')
ON CONFLICT (version) DO NOTHING;

COMMIT;
