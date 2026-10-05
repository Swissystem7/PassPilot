# READY_FOR_PUSH — PassPilot (DRAFT)

**Status:** DRAFT checklist only.

**LOCAL_ONLY reminder:** product truth remains LOCAL_ONLY (synthetic fixtures / local entitlement demos). No network minting, no production unlock codes, no live student PII.

Does **not** authorize a git push by itself.

## ACCEPT criteria (checklist DRAFT)

- [ ] **Lenovo + Dell green** — local self-test exits 0 on both machines with an identical summary line
- [ ] **No network self-test** — self-test path makes zero network calls
- [ ] **Dell + examiner** — walkthrough on the Dell box with an examiner present (local demo only; still LOCAL_ONLY)

Prefer `scripts/local_self_test.sh` when present; otherwise `npm test` + selftest.

## Non-goals

- This file is not a release gate in CI
- Passing the checklist does not resolve name-collision / domain UNKNOWN questions
