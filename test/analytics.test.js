const test = require("node:test");
const assert = require("node:assert/strict");
const { makeRecord, appendRecord } = require("../src/lib/history");
const { BLUEPRINTS } = require("../src/lib/examBlueprint");
const { analyzeProgress, kindCounts } = require("../src/lib/analytics");

const rec = (courseId, kind, ts, rows) => makeRecord(rows, courseId, kind, ts);

test("early vs late accuracy is computed per topic and does not mix courses", () => {
  let list = [];
  list = appendRecord(list, rec("python", "quiz", 1, [
    { topic: "loops", correct: false },
    { topic: "strings", correct: true },
  ]));
  list = appendRecord(list, rec("arch", "quiz", 2, [
    { topic: "datapath", correct: false },
  ]));
  list = appendRecord(list, rec("python", "marathon", 3, [
    { topic: "loops", correct: true },
    { topic: "strings", correct: false },
  ]));
  const py = analyzeProgress(list, "python", BLUEPRINTS.python);
  assert.equal(py.count, 2);
  assert.equal(py.kinds.quiz, 1);
  assert.equal(py.kinds.marathon, 1);
  const loops = py.topics.find((t) => t.topic === "loops");
  const strings = py.topics.find((t) => t.topic === "strings");
  assert.equal(loops.earlyRate, 0);
  assert.equal(loops.lateRate, 100);
  assert.equal(loops.delta, 100);
  assert.equal(loops.improved, true);
  assert.equal(strings.worsened, true);
  assert.equal(py.topics.some((t) => t.topic === "datapath"), false);
  assert.match(py.caveat, /לא תחזית ציון/);
  assert.doesNotMatch(py.caveat, /סיכוי מעבר/);
});

test("untested blueprint blocks stay listed instead of receiving credit", () => {
  const list = [rec("python", "quiz", 1, [{ topic: "recursion", correct: true }])];
  const out = analyzeProgress(list, "python", BLUEPRINTS.python);
  const topics = out.untested.map((b) => b.topic).sort();
  assert.deepEqual(topics, ["dictionaries", "lists", "strings"]);
  assert.ok(out.untested.every((b) => b.points > 0));
});

test("kindCounts buckets marathon separately from the 10016 code exam", () => {
  const counts = kindCounts([
    { kind: "quiz" },
    { kind: "exam" },
    { kind: "marathon" },
    { kind: "marathon" },
    { kind: "imported" },
  ]);
  assert.deepEqual(counts, { quiz: 1, exam: 1, marathon: 2, other: 1 });
});

test("an empty course history is honest and empty", () => {
  const out = analyzeProgress([], "hedva1", BLUEPRINTS.hedva1);
  assert.equal(out.count, 0);
  assert.deepEqual(out.improved, []);
  assert.equal(out.untested.length, 4);
});
