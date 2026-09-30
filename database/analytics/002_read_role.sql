-- DEV template.
-- Usage:
--   psql analytics -v reader_password="'<local-secret>'" -f 002_read_role.sql

SELECT format(
    'CREATE ROLE analytics_reader LOGIN PASSWORD %L',
    :'reader_password'
)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'analytics_reader'
)
\gexec

GRANT CONNECT ON DATABASE analytics TO analytics_reader;
GRANT USAGE ON SCHEMA public TO analytics_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_reader;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO analytics_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT ON TABLES TO analytics_reader;
