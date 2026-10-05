# PassPilot — use-case options

**Status:** decision pending.

## Option A — Authorization / entitlement regression harness

Lean into deterministic local tests around unlock/entitlement helpers: checksum tamper, course mismatch, uniform `forbidden` denies, allowlisted arrays.

- Audience: portfolio + engineering interview demos; optional internal CI pattern.
- Offline: yes (`node --test`, optional `scripts/local_self_test.sh` when present).
- Not claiming: IdP replacement, server billing proof, or OpenFGA-scale relationship graphs.

## Option B — Exam-structure / cohort product path

Stay closer to Afeka exam-structure diagnosis UX (marathon, tonight, share codes, course packs).

- Audience: students / union coordinators.
- Requires: clearer partner, licensed content, and honesty about client-side codes.

## Decision

**Pending.** Landscape note: [authorization_landscape_gap_analysis.md](./authorization_landscape_gap_analysis.md). Prefer documenting Option A as the reusable slice until a partner commits to Option B.
