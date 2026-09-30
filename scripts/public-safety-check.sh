#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

fail=0

patterns=(
  'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY'
  'password[[:space:]]*=[[:space:]]*[^<"$]'
  'token[[:space:]]*=[[:space:]]*[^<"$]'
  'secret[[:space:]]*=[[:space:]]*[^<"$]'
)

for pattern in "${patterns[@]}"; do
  if grep -RInE --exclude-dir=.git --exclude='public-safety-check.sh' "$pattern" .; then
    fail=1
  fi
done

if [[ "$fail" -ne 0 ]]; then
  echo "Potential sensitive material detected."
  exit 1
fi

echo "Public safety scan: PASS"
