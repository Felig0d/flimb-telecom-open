#!/usr/bin/env bash
set -euo pipefail

PRIMARY_HOST="${PRIMARY_HOST:-host.docker.internal}"
PRIMARY_PORT="${PRIMARY_PORT:-5432}"
REPL_USER="${REPL_USER:-replicator}"
PGDATA="${PGDATA:-/var/lib/postgresql/data}"

if [[ -z "${REPL_PASSWORD:-}" ]]; then
  echo "REPL_PASSWORD is required"
  exit 1
fi

if [[ ! -s "$PGDATA/PG_VERSION" ]]; then
  rm -rf "$PGDATA"/*
  export PGPASSWORD="$REPL_PASSWORD"
  pg_basebackup     -h "$PRIMARY_HOST"     -p "$PRIMARY_PORT"     -U "$REPL_USER"     -D "$PGDATA"     -Fp     -Xs     -P     -R
  unset PGPASSWORD
fi

exec docker-entrypoint.sh postgres
