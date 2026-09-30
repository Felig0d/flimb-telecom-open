-- DEV example only.
-- Usage:
--   psql -v repl_password="'<local-secret>'" -f primary-example.sql
--
-- Do not commit the actual password.

SELECT format(
    'CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD %L',
    :'repl_password'
)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'replicator'
)
\gexec

-- Also configure the primary server with values appropriate for your DEV host:
--
-- wal_level = replica
-- max_wal_senders = 10
-- max_replication_slots = 10
-- hot_standby = on
--
-- Add a narrowly scoped pg_hba.conf replication rule for the Docker network.
-- Never use a broad trust rule as a shortcut.
