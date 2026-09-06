# Threat model — auth-schema & arrays (DRAFT)

**Status:** DRAFT. Local browser unlock codes are not a security boundary against a motivated attacker who can edit DevTools.

## Assets
- Entitlement record in `localStorage` (`pp_unlock_v1`).
- Paid feature gates (`PAID_FEATURES`).
- Allowlisted arrays (feature names, course ids) checked via `assertAuthorizedArray`.

## TOP-5 scenarios → tests
1. **Tampered unlock checksum** → `access.test.js` flipped checksum rejected.
2. **WhatsApp-wrapped / garbage paste** → extract/decode does not throw; Hebrew errors.
3. **Course mismatch** → student code for course A cannot use paid features on course B.
4. **Unauthorized array value** → `assertAuthorizedArray` returns `{ error: "forbidden" }` without echoing the bad value.
5. **Unknown feature name** → `assertPaidFeatureName` returns forbidden; UI should not invent gates.

## Non-goals
- Server-side billing proof.
- Stopping a user who patches `canUse` in the browser.
- Cross-device sync.

## Residual risk
Anyone who can open the mint UI can mint codes — documented caveat in `mintBatch`.
