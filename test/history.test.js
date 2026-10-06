const test = require("node:test");
const assert = require("node:assert/strict");
const {
  byTopic,
  makeRecord,
  appendRecord,
  forCourse,
  clearCourse,
  parseStored,
  sanitizeRecord,
  summarize,
  HIST_MAX,
} = require("../src/lib/history");

const rows = (topic, ok) => [{ topic, correct: ok, secondsSpent: 4 }];

test("records carry courseId and do not mix courses in trends", () => {
  const py = makeRecord(rows("loops", true), "python", "quiz", 1);
  const arch = makeRecord(rows("datapath", false), "arch", "quiz", 2);
  const list = appendRecord(appendRecord([], py), arch);
  const onlyPy = forCourse(list, "python");
  const onlyArch = forCourse(list, "arch");
  assert.equal(onlyPy.length, 1);
  assert.equal(onlyPy[0].courseId, "python");
  assert.equal(onlyArch[0].topics.datapath.n, 1);
  assert.equal(summarize(onlyPy).best, 100);
  assert.equal(summarize(onlyArch).best, 0);
});

test("legacy rows without courseId count as python", () => {
  const legacy = { ts: 1, pct: 40, correct: 2, total: 5, topics: { loops: { n: 2, ok: 1 } } };
  const py = makeRecord(rows("lists", true), "python", "quiz", 2);
  const list = [legacy, py];
  assert.equal(forCourse(list, "python").length, 2);
  assert.equal(forCourse(list, "arch").length, 0);
});

test("clearCourse drops only that course and leaves the other", () => {
  const a = makeRecord(rows("loops", true), "python", "quiz", 1);
  const b = makeRecord(rows("datapath", true), "arch", "exam", 2);
  const kept = clearCourse([a, b], "python");
  assert.deepEqual(kept.map((r) => r.courseId), ["arch"]);
});

test("appendRecord caps length and parseStored is defensive", () => {
  let list = [];
  for (let i = 0; i < HIST_MAX + 5; i++) {
    list = appendRecord(list, makeRecord(rows("loops", i % 2 === 0), "python", "quiz", i));
  }
  assert.equal(list.length, HIST_MAX);
  assert.deepEqual(parseStored("not-json"), []);
  assert.deepEqual(parseStored(null), []);
  assert.deepEqual(parseStored("[]"), []);
});

test("summarize delta is last minus first of that course only", () => {
  const list = [
    makeRecord(rows("loops", false), "python", "quiz", 1),
    makeRecord(rows("datapath", true), "arch", "quiz", 2),
    makeRecord([{ topic: "loops", correct: true }, { topic: "lists", correct: true }], "python", "quiz", 3),
  ];
  const py = summarize(forCourse(list, "python"));
  assert.equal(py.count, 2);
  assert.equal(py.first, 0);
  assert.equal(py.last, 100);
  assert.equal(py.delta, 100);
  assert.equal(py.topics.loops.n, 2);
});

test("byTopic ignores malformed rows", () => {
  const acc = byTopic([
    { topic: "loops", correct: true },
    null,
    { topic: 3, correct: false },
    { topic: "loops", correct: false },
  ]);
  assert.equal(acc.loops.n, 2);
  assert.equal(acc.loops.ok, 1);
});

test("parseStored drops garbage rows so one bad entry cannot crash the start screen", () => {
  const good = makeRecord(rows("loops", true), "python", "quiz", 5);
  const raw = JSON.stringify([null, 1, "x", [], { topics: { a: null, b: { n: "2", ok: 1 } } }, good]);
  const list = parseStored(raw);
  assert.equal(list.length, 2);
  assert.deepEqual(list[0].topics, { b: { n: 2, ok: 1 } });
  assert.equal(list[0].pct, 0);
  assert.equal(list[0].courseId, undefined);
  assert.deepEqual(list[1], good);
  const py = forCourse(list, "python");
  assert.equal(py.length, 2);
  const sum = summarize(py);
  assert.equal(sum.count, 2);
  assert.equal(sum.best, 100);
  assert.equal(sum.topics.b.n, 2);
  assert.equal(sum.topics.loops.ok, 1);
});

test("sanitizeRecord coerces string numbers and derives a missing pct", () => {
  const r = sanitizeRecord({ ts: "7", courseId: "arch", total: "4", correct: "3", topics: [] });
  assert.equal(r.ts, 7);
  assert.equal(r.courseId, "arch");
  assert.equal(r.pct, 75);
  assert.deepEqual(r.topics, {});
  assert.equal(sanitizeRecord({ pct: "80" }).pct, 80);
  assert.equal(sanitizeRecord({ pct: "NaN" }).pct, 0);
  assert.equal(sanitizeRecord({ courseId: "" }).courseId, undefined);
});
