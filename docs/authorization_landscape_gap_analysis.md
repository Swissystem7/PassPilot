# Authorization landscape — gap analysis (PassPilot)

**Status:** local research note. Not a vendor recommendation.
**Freshness:** metrics below marked **UNVERIFIED** unless a primary source was checked in-session (2026-09-06 search not re-run for every row).

## Scope

PassPilot today ships **client-side unlock codes** (`src/lib/access.js`) with unit tests. This is an entitlement UX demo, not an authorization server. The interesting reusable slice is a **local authorization / entitlement regression harness** (deterministic deny paths, no network).

## High-level comparison

| System | Model (short) | Typical deploy | Where a *local regression harness* can still win |
|---|---|---|---|
| [OpenFGA](https://openfga.dev/) | Relationship/Zanzibar-style tuples | Service + store | Cold-start simplicity; no infra for CI of pure allowlist checks (**UNVERIFIED** ops cost) |
| [SpiceDB](https://authzed.com/docs/spicedb/getting-started) | Relationship graph (AuthZed) | Service + datastore | Same: tiny repos that only need array/feature allowlists offline (**UNVERIFIED**) |
| [Cerbos](https://cerbos.dev/) | Policy-as-code (YAML/JSON policies) | Sidecar / PDP | Local harness wins on **zero-daemon** unit tests in `node --test` (**UNVERIFIED** vs Cerbos `cerbos compile`) |
| [Oso](https://www.osohq.com/) | Polar policy language | Library / cloud variants | Local harness wins when the “policy” is a fixed feature map + checksummed codes, not a general language (**UNVERIFIED**) |
| [Casbin](https://casbin.org/) | ACL/RBAC/ABAC models + adapters | Library + adapter | Local harness wins for **forbidden-without-leak** deny shapes in a single JS file (**UNVERIFIED** vs Casbin model files) |

## 2–3 metrics where a local harness can win

1. **Time-to-first-green-test** — clone + `node --test` with no Docker/PDP (**UNVERIFIED** comparative benchmark; claim is directional).
2. **Deny-path leak surface** — assert responses are uniform `{ error: "forbidden" }` without echoing bad values (PassPilot partb-v2 direction); full PDP stacks optimize expressiveness first (**UNVERIFIED**).
3. **Offline / air-gapped CI** — no policy service health dependency for entitlement unit tests (**UNVERIFIED** vs remote PDP CI jobs).

## Non-goals

- Replacing OpenFGA/SpiceDB/Cerbos/Oso/Casbin for multi-tenant cloud products.
- Claiming PassPilot codes are a security boundary against DevTools attackers (see threat model DRAFT if present).

## Suggested follow-ups

- If partb-v2 lands (`forbidden`, `assertAuthorizedArray`), add `scripts/demo_forbidden.sh` that exercises deny paths offline.
- Keep this doc as landscape context; product decision is separate (`docs/passpilot_use_case_options.md`).
