SHELL := /bin/bash

.PHONY: preflight safety json-check db-bootstrap analytics-schema analytics-refresh analytics-api ha-up ha-down ha-status

preflight:
	./scripts/preflight.sh

safety:
	./scripts/public-safety-check.sh

json-check:
	./scripts/json-check.sh

db-bootstrap:
	./database/bootstrap/create-dev-databases.sh

analytics-schema:
	psql "$${ANALYTICS_DATABASE_URL}" -v ON_ERROR_STOP=1 -f database/analytics/001_init.sql

analytics-refresh:
	psql "$${ANALYTICS_DATABASE_URL}" -v ON_ERROR_STOP=1 -f database/analytics/refresh_hourly.sql

analytics-api:
	cd analytics && uvicorn app.main:app --reload --port 8086

ha-up:
	docker compose --env-file database/ha-lab/.env -f database/ha-lab/docker-compose.yml up -d

ha-down:
	docker compose --env-file database/ha-lab/.env -f database/ha-lab/docker-compose.yml down

ha-status:
	docker compose --env-file database/ha-lab/.env -f database/ha-lab/docker-compose.yml ps
