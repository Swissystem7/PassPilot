const test = require("node:test");
const assert = require("node:assert/strict");
const {
  PREFIX,
  FREE_QUIZ_MAX,
  extractUnlock,
  encodeUnlock,
  decodeUnlock,
  mintBatch,
  redeemUnlock,
  readUnlock,
  clearUnlock,
  hasPaidAccess,
  canUse,
  clampQuizCount,
  lockReason,
} = require("../src/lib/access");

function memoryStore() {
  const bag = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(bag, k) ? bag[k] : null),
    setItem: (k, v) => { bag[k] = String(v); },
    removeItem: (k) => { delete bag[k]; },
  };
}

test("encode/decode survives WhatsApp wrapping", () => {
  const code = encodeUnlock({
    union: "afeka",
    term: "2026b",
    courseId: "python",
    kind: "student",
    serial: "S007",
  });
  assert.match(code, /^PPU1\.[A-Za-z0-9_-]+\.[0-9a-f]{4}$/);
  assert.equal(code.slice(0, 4), PREFIX);
  const wrapped = "הקוד שלי:\n" + code.slice(0, 18) + "\n" + code.slice(18);
  assert.equal(extractUnlock(wrapped), code);
  const decoded = decodeUnlock(wrapped);
  assert.equal(decoded.ok, true);
  assert.equal(decoded.payload.courseId, "python");
  assert.equal(decoded.payload.term, "2026b");
  assert.equal(decoded.payload.kind, "student");
  assert.equal(decoded.payload.serial, "S007");
});

test("a flipped checksum is rejected", () => {
  const code = encodeUnlock({ courseId: "arch", serial: "1" });
  const broken = code.slice(0, -1) + (code.slice(-1) === "a" ? "b" : "a");
  const decoded = decodeUnlock(broken);
  assert.equal(decoded.ok, false);
  assert.match(decoded.error, /שלמות|פגום/);
});

test("redeem stores entitlement and unlocks paid features for that course", () => {
  const store = memoryStore();
  const code = encodeUnlock({ courseId: "hedva2", term: "2026b", serial: "S002" });
  const out = redeemUnlock(code, store);
  assert.equal(out.ok, true);
  assert.equal(hasPaidAccess(out.store, "hedva2"), true);
  assert.equal(hasPaidAccess(out.store, "python"), false);
  assert.equal(canUse("report", out.store, "hedva2"), true);
  assert.equal(canUse("report", out.store, "python"), false);
  assert.equal(canUse("quizOverFree", readUnlock(store), "hedva2"), true);
  assert.equal(clampQuizCount(20, out.store, "hedva2"), 20);
});

test("staff code unlocks every course; free user is capped", () => {
  const store = memoryStore();
  assert.equal(canUse("marathon", readUnlock(store), "python"), false);
  assert.equal(clampQuizCount(15, readUnlock(store), "python"), FREE_QUIZ_MAX);
  const staff = encodeUnlock({ kind: "staff", courseId: "*", serial: "STAFF" });
  redeemUnlock(staff, store);
  const rec = readUnlock(store);
  assert.equal(canUse("marathon", rec, "arch"), true);
  assert.equal(canUse("cohort", rec, "hedva1"), true);
  clearUnlock(store);
  assert.equal(canUse("report", readUnlock(store), "arch"), false);
});

test("mintBatch makes unique student codes plus one staff code", () => {
  const batch = mintBatch({ count: 3, term: "2026b", courseId: "python" });
  assert.equal(batch.students.length, 3);
  assert.equal(batch.staff.kind, "staff");
  const codes = batch.students.map((s) => s.code).concat(batch.staff.code);
  assert.equal(new Set(codes).size, 4);
  batch.students.forEach((s) => {
    const d = decodeUnlock(s.code);
    assert.equal(d.ok, true);
    assert.equal(d.payload.courseId, "python");
    assert.equal(d.payload.kind, "student");
  });
  assert.match(batch.caveat, /הוכחת תשלום/);
});

test("garbage paste does not throw and lockReason is Hebrew", () => {
  assert.equal(decodeUnlock("").ok, false);
  assert.equal(decodeUnlock("PP1.abc.ffff").ok, false);
  assert.match(lockReason("report"), /קוד מימוש/);
});
