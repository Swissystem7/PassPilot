Local tests (PassPilot)

No network. Run: ./scripts/local_self_test.sh
Expect: N/N + regressions PASSED (exit 0).
npm test = node --test then node selftest.mjs.
Update test/test_manifest.json when adding/removing test/*.test.js.
