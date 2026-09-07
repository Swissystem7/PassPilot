# Candidate 3703b9 — local-only unlock (synthetic)

**Id:** `3703b9` (synthetic short id for this note)
**Theme:** Local-only unlock / entitlement UX (no server minting)
**Status:** RESEARCH note only — not a shipped product SKU

## FACT

- PassPilot ships client-side unlock / access helpers under `src/lib/access.js` with unit tests (repo tree).
- In-repo commercial research (`PassPilot-2026-09-06` brief): product truth includes **LOCAL_ONLY**; name "PassPilot" is used by ≥4 unrelated products.
- No `docs/candidates/` tree existed on pristine `main` before this note (only `docs/archive/`).

## INFERENCE

- A reusable wedge is a **local authorization / entitlement regression harness** (deterministic deny paths, checksum tamper, uniform `forbidden`) rather than a hosted unlock SaaS.
- Positioning as exam or driving PassPilot is risky without a trademark/domain decision — lean internal name or rename later.

## UNKNOWN

- Whether owner wants Authorization Regression Harness vs local vault vs other domain.
- First customer: self/lab / on-prem teams / startups / none.
- Whether any real unlock codes will ever leave LOCAL_ONLY synthetic fixtures.

## Standalone

This file is self-contained documentation. It does not require other Part B patches to apply or to read.
