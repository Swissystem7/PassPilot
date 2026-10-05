#!/usr/bin/env bash
# PassPilot local self-test. Offline only. Exit 0 green, 1 red.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mapfile -t TEST_FILES < <(find test -maxdepth 1 -name "*.test.js" | sort)
if [[ ${#TEST_FILES[@]} -eq 0 ]]; then
  echo "no test files" >&2
  exit 1
fi

TAP_OUT="$(mktemp)"
set +e
node --test "${TEST_FILES[@]}" >"$TAP_OUT" 2>&1
UNIT_EC=$?
set -e

PASS="$(grep -c '^ok ' "$TAP_OUT" || true)"
FAIL="$(grep -c '^not ok ' "$TAP_OUT" || true)"
TOTAL=$((PASS + FAIL))

set +e
node selftest.mjs >/dev/null 2>&1
SELF_EC=$?
set -e

if [[ "$UNIT_EC" -ne 0 || "$SELF_EC" -ne 0 || "$FAIL" -ne 0 ]]; then
  echo "${PASS}/${TOTAL} + regressions FAILED" >&2
  tail -n 40 "$TAP_OUT" >&2 || true
  rm -f "$TAP_OUT"
  exit 1
fi

echo "${PASS}/${TOTAL} + regressions PASSED"
rm -f "$TAP_OUT"
exit 0
