const test = require("node:test");
const assert = require("node:assert/strict");
const {
  nextInterval,
  parseSrs,
  dueItems,
  dueTopics,
  applySession,
  DAY_MS,
} = require("../src/lib/srsQueue");

const t0 = Date.UTC(2026, 7, 13, 10, 0, 0);

test("intervals grow 1 → 3 → 7 → 14 and then stay at 14", () => {
  assert.equal(nextInterval(0), 1);
  assert.equal(nextInterval(1), 3);
  assert.equal(nextInterval(3), 7);
  assert.equal(nextInterval(7), 14);
  assert.equal(nextInterval(14), 14);
});

test("a missed topic enters the queue due tomorrow, not today", () => {
  const next = applySession([], "python", [{ topic: "recursion", correct: false }], t0);
  assert.equal(next.length, 1);
  assert.equal(next[0].topic, "recursion");
  assert.equal(next[0].intervalDays, 1);
  assert.equal(next[0].due, t0 + DAY_MS);
  assert.deepEqual(dueTopics(next, t0, "python"), []);
  assert.deepEqual(dueTopics(next, t0 + DAY_MS, "python"), ["recursion"]);
});

test("a clean follow-up grows the interval; another miss resets to 1 day", () => {
  let list = applySession([], "hedva1", [{ topic: "limits", correct: false }], t0);
  list = applySession(list, "hedva1", [{ topic: "limits", correct: true }], t0 + DAY_MS);
  assert.equal(list[0].intervalDays, 3);
  assert.equal(list[0].reps, 1);
  assert.equal(list[0].due, t0 + DAY_MS + 3 * DAY_MS);
  list = applySession(list, "hedva1", [{ topic: "limits", correct: false }], t0 + 10 * DAY_MS);
  assert.equal(list[0].intervalDays, 1);
  assert.equal(list[0].reps, 0);
});

test("a perfect new topic is not added — the queue is only for misses", () => {
  const next = applySession([], "python", [{ topic: "lists", correct: true }], t0);
  assert.deepEqual(next, []);
});

test("courses do not leak into each other's due list", () => {
  let list = applySession([], "python", [{ topic: "loops", correct: false }], t0);
  list = applySession(list, "arch", [{ topic: "cache", correct: false }], t0);
  const due = dueItems(list, t0 + DAY_MS, "python");
  assert.equal(due.length, 1);
  assert.equal(due[0].topic, "loops");
});

test("parseSrs drops garbage instead of throwing", () => {
  assert.deepEqual(parseSrs("nope"), []);
  assert.deepEqual(parseSrs(null), []);
  assert.equal(parseSrs(JSON.stringify([{ courseId: "python", topic: "x", due: t0 }])).length, 1);
});
