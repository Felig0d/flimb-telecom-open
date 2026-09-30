-- DEV example only. Run with an appropriately privileged PostgreSQL role.
-- Replace the password before use.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'replicator') THEN
        CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'dev-only-change-me';
    END IF;
END
$$;

-- Also configure the primary server with values appropriate for your DEV host:
--
-- wal_level = replica
-- max_wal_senders = 10
-- max_replication_slots = 10
-- hot_standby = on
--
-- Add a narrowly scoped pg_hba.conf replication rule for the Docker network.
-- Do not copy broad trust rules into production.
