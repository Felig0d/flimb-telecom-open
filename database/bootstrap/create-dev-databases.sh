#!/usr/bin/env bash
set -euo pipefail

: "${PGHOST:=127.0.0.1}"
: "${PGPORT:=5432}"
: "${PGUSER:=postgres}"

domains=(authentik flimb_central odin opensips cgrates analytics)

for domain in "${domains[@]}"; do
  role="${domain}_app"
  password_var="$(printf '%s_APP_PASSWORD' "${domain^^}")"
  password="${!password_var:-}"

  if [[ -z "$password" ]]; then
    echo "Missing ${password_var}"
    exit 1
  fi

  echo "Ensuring role: $role"
  psql -v ON_ERROR_STOP=1     -v role_name="$role"     -v role_password="$password"     postgres <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'role_name', :'role_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'role_name')
\gexec
SQL

  echo "Ensuring database: $domain"
  psql -v ON_ERROR_STOP=1     -v db_name="$domain"     -v owner_name="$role"     postgres <<'SQL'
SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'owner_name')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'db_name')
\gexec
SQL
done

echo "Applying ODIN schema"
PGDATABASE=odin PGUSER=odin_app PGPASSWORD="$ODIN_APP_PASSWORD"   psql -v ON_ERROR_STOP=1 -f database/odin/001_init.sql

echo "Applying Analytics schemas"
PGDATABASE=analytics PGUSER=analytics_app PGPASSWORD="$ANALYTICS_APP_PASSWORD"   psql -v ON_ERROR_STOP=1 -f database/analytics/001_init.sql

PGDATABASE=analytics PGUSER=analytics_app PGPASSWORD="$ANALYTICS_APP_PASSWORD"   psql -v ON_ERROR_STOP=1 -f database/analytics/003_metrics_enrichment.sql

cat <<'EOF'

Bootstrap complete.

Next:
- initialize Authentik with its native migrations
- initialize OpenSIPS with its native PostgreSQL schema tooling
- initialize CGRateS StorDB with its native migration tooling
- initialize Flimb Central from its own repository migrations
- create analytics_reader with database/analytics/002_read_role.sql
EOF
