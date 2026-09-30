#!/usr/bin/env bash
set -euo pipefail

python3 -m json.tool cgrates/config/10-native-beta.json >/dev/null

echo "JSON config check: PASS"
