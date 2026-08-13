const test = require("node:test");
const assert = require("node:assert/strict");
const {
  rowsToTriples,
  triplesToRows,
  extractCode,
  encodeDiagnosis,
  decodeDiagnosis,
} = require("../src/lib/shareCode");

test("rows collapse to sorted topic triples and expand without inventing extra hits", () => {
  const triples = rowsToTriples([
    { topic: "strings", correct: true },
    { topic: "recursion", correct: false },
    { topic: "recursion", correct: true },
    null,
    { topic: 3, correct: true },
  ]);
  assert.deepEqual(triples, [
    ["recursion", 2, 1],
    ["strings", 1, 1],
  ]);
  const rows = triplesToRows(triples);
  assert.equal(rows.filter((r) => r.topic === "recursion").length, 2);
  assert.equal(rows.filter((r) => r.topic === "recursion" && r.correct).length, 1);
  assert.equal(rows.every((r) => r.secondsSpent === 0), true);
});

test("encode/decode survives WhatsApp wrapping and ignores surrounding text", () => {
  const code = encodeDiagnosis({
    courseId: "arch",
    examDate: "2026-08-18",
    kind: "quiz",
    rows: [
      { topic: "datapath", correct: false },
      { topic: "datapath", correct: false },
      { topic: "cache", correct: true },
    ],
  });
  assert.match(code, /^PP1\.[A-Za-z0-9_-]+\.[0-9a-f]{4}$/);
  const wrapped = "הקוד שלי:\n" + code.slice(0, 20) + "\n" + code.slice(20) + "  תודה";
  assert.equal(extractCode(wrapped), code);
  const decoded = decodeDiagnosis(wrapped);
  assert.equal(decoded.ok, true);
  assert.equal(decoded.payload.courseId, "arch");
  assert.equal(decoded.payload.examDate, "2026-08-18");
  assert.equal(decoded.payload.kind, "quiz");
  assert.deepEqual(decoded.payload.triples, [
    ["cache", 1, 1],
    ["datapath", 2, 0],
  ]);
});

test("a flipped checksum is rejected instead of loading a fake diagnosis", () => {
  const code = encodeDiagnosis({ courseId: "python", rows: [{ topic: "lists", correct: true }] });
  const broken = code.slice(0, -1) + (code.slice(-1) === "a" ? "b" : "a");
  const decoded = decodeDiagnosis(broken);
  assert.equal(decoded.ok, false);
  assert.match(decoded.error, /שלמות|פגום/);
});

test("empty or garbage paste does not throw and does not invent a course", () => {
  assert.equal(decodeDiagnosis("").ok, false);
  assert.equal(decodeDiagnosis("hello").ok, false);
  assert.equal(decodeDiagnosis(null).ok, false);
});

test("a marathon session stays a marathon after a WhatsApp round-trip", () => {
  const code = encodeDiagnosis({
    courseId: "python",
    kind: "marathon",
    rows: [{ topic: "recursion", correct: false }],
  });
  const decoded = decodeDiagnosis(code);
  assert.equal(decoded.ok, true);
  assert.equal(decoded.payload.kind, "marathon");
});

test("unknown kinds collapse to quiz instead of inventing a session type", () => {
  const code = encodeDiagnosis({ courseId: "arch", kind: "imported", rows: [] });
  assert.equal(decodeDiagnosis(code).payload.kind, "quiz");
});

test("custom blueprint travels with the code so the union sees the same map", () => {
  const code = encodeDiagnosis({
    courseId: "python",
    kind: "quiz",
    rows: [{ topic: "recursion", correct: false }],
    b: { c: "python", t: "מועד מותאם", e: "רכז", n: "הודבק", k: [["q1", "recursion", "רקורסיה", 40, "coordinator"]] },
  });
  const decoded = decodeDiagnosis(code);
  assert.equal(decoded.ok, true);
  assert.equal(decoded.payload.blueprint.t, "מועד מותאם");
  assert.equal(decoded.payload.blueprint.k[0][3], 40);
});
