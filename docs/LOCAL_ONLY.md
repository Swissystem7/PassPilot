# LOCAL_ONLY — PassPilot

**Product truth:** this repo is **LOCAL_ONLY**.

- Synthetic fixtures / local entitlement demos only
- No network minting of unlock codes
- No production unlock codes
- No live student PII
- History stays in `localStorage` on this browser

## Gate

Policy: no push of production unlock flows until READY_FOR_PUSH.
Stay LOCAL_ONLY until the DRAFT ACCEPT checklist is done.
Requires READY_FOR_PUSH before any remote publish.

## Non-goals
- Not a CI release gate by itself
- Name-collision questions remain separate
