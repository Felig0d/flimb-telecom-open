#!/usr/bin/env bash
set -euo pipefail

echo "FLIMB Telecom Open - isolated beta preflight"
echo

for cmd in opensips cgr-engine curl ss; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '%-12s %s\n' "$cmd" "FOUND"
  else
    printf '%-12s %s\n' "$cmd" "MISSING"
  fi
done

echo
if command -v opensips >/dev/null 2>&1; then
  opensips -V 2>/dev/null | head -n 2 || true
fi

if command -v cgr-engine >/dev/null 2>&1; then
  cgr-engine -version 2>/dev/null || true
fi

echo
echo "Listening sockets of interest:"
ss -lntup 2>/dev/null | grep -E ':(5060|5090|2012|2014)\b' || true

echo
echo "No changes were made."
