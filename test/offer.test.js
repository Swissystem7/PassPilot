const test = require("node:test");
const assert = require("node:assert/strict");
const {
  CHECKED_AT,
  ADDON_MIN,
  ADDON_MID,
  ADDON_MAX,
  MARATHON_TYPICAL,
  observedMarket,
  clampAddon,
  bundleRow,
  hypotheticalSplits,
  offerCopy,
} = require("../src/lib/offer");

test("observed market numbers are dated and do not invent a GOOL list price", () => {
  const m = observedMarket();
  assert.equal(m.checkedAt, CHECKED_AT);
  assert.equal(m.afekaMarathonTypical, MARATHON_TYPICAL);
  assert.equal(m.alonVideoCourse, 349);
  assert.equal(m.tuitionYearIls, 12017);
  assert.equal(m.creditsFullYear, 40);
  assert.ok(m.note.includes("לא נמצא"));
});

test("bundle at 30 ILS on a 270 marathon is under 15 percent", () => {
  const row = bundleRow({ marathonPrice: 270, addonPrice: 30, seats: 20 });
  assert.equal(row.ticket, 300);
  assert.equal(row.addonGross, 600);
  assert.equal(row.ticketGross, 6000);
  assert.ok(row.addonShareOfMarathonPct < 15);
  assert.equal(row.addonShareOfMarathonPct, 11.1);
});

test("addon outside 20-40 snaps to the trial midpoint", () => {
  assert.equal(clampAddon(19), ADDON_MID);
  assert.equal(clampAddon(41), ADDON_MID);
  assert.equal(clampAddon(20), ADDON_MIN);
  assert.equal(clampAddon(40), ADDON_MAX);
});

test("splits are labeled hypothetical and sum to the addon gross", () => {
  const splits = hypotheticalSplits(600);
  assert.equal(splits.length, 3);
  splits.forEach((s) => {
    assert.equal(s.hypothetical, true);
    assert.equal(s.unionIls + s.vendorIls, 600);
    assert.match(s.label, /תרחיש|קופון/);
  });
  const coupon = splits.find((s) => s.id === "coupon");
  assert.equal(coupon.unionIls, 0);
  assert.equal(coupon.vendorIls, 600);
});

test("offer copy refuses fake traction claims", () => {
  const copy = offerCopy();
  assert.equal(copy.recommended, 30);
  assert.ok(copy.notClaimed.some((line) => line.includes("אין משתמשים משלמים")));
  assert.ok(copy.whatPaid.some((line) => line.includes("דוח")));
  assert.ok(copy.whatFree.some((line) => line.includes("5")));
});
