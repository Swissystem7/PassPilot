# 72h auth-schema regression — PassPilot (synthetic only)

**Purpose:** Document a RED → GREEN drill for auth-schema / entitlement deny-path bugs without production data.

**Scope:** Local / synthetic fixtures only. No real student PII, no live unlock codes from production, no network minting.

## Preconditions

- Prefer applying `PassPilot-partb-v2.patch` first so `src/lib/access.js` exports `forbidden` / `assertAuthorizedArray`.
- If those exports are absent, treat the drill as **SKIP** (document-only) until partb-v2 lands.

## RED (reproduce)

1. Create a **synthetic** allowlist, e.g. `["report", "marathon"]`.
2. Call `assertAuthorizedArray(["report", "admin-backdoor"], allowlist)` (or equivalent).
3. **Fail the build** if the deny payload echoes the bad value (`admin-backdoor`) or returns a non-uniform error shape.
4. Optionally corrupt a synthetic unlock checksum and confirm reject-without-leak.

## GREEN (fix)

1. Deny responses are uniform: `{ ok: false, error: "foridden", code: ... }`.
2. Bad array values / unknown feature names never appear in the error string.
3. `node --test` (and `selftest.mjs` if present) stays green on synthetic fixtures only.

## Out of scope

- Server billing proof, DevTools attackers who patch `canUse`, cross-device sync.
- Shipping real course unlock codes in the regression script.

## Optional follow-ups (not in this patch)

- `test/forbidden_smoke.test.js` that skips when `forbidden` is not exported.
- `scripts/demo_forbidden.sh` that `node -e` requires `access.js` helpers or exits 0 with `SKIP`.
