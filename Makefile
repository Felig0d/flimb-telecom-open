SHELL := /bin/bash

.PHONY: preflight safety

preflight:
	./scripts/preflight.sh

safety:
	./scripts/public-safety-check.sh
