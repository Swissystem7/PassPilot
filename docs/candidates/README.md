# PassPilot candidates — FACT / INFERENCE / UNKNOWN

Local-only notes for change-sets. No push/merge implied.

## FACT
- Repo ships unlock/entitlement helpers in `src/lib/access.js` with unit tests + `selftest.mjs`.
- Client-side PPU1 codes; no server payment proof (documented in code comments).
- Package description: Afeka exam-structure diagnosis demo.
- Name "PassPilot" is crowded externally (multiple unrelated products) — see research 2026-09-06.

## INFERENCE
- Strongest reusable slice is an **authorization / entitlement validation layer** with deterministic local tests (regression harness), not a cloud IdP.
- Uniform `forbidden` responses reduce accidental payload leaks in deny paths.

## UNKNOWN
- Whether the long-term product is exam UX, auth harness, local vault, or other (owner decision).
- Institutional partner, pricing, licensed course content, pilot.
- Whether "AI product" framing applies.

## ACCEPT before push (local)
- `scripts/local_self_test.sh` exits 0 on Lenovo and Dell with identical summary line.
- `test/test_manifest.json` matches disk.
- No network calls in the self-test path.
