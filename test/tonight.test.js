const test = require("node:test");
const assert = require("node:assert/strict");
const { diagnoseCourse, scoreBlocks } = require("../src/lib/examBlueprint");
const {
  headingFor,
  filterTonightBlocks,
  planTonight,
  focusFromDiagnosis,
  TONIGHT_HOURS,
  HEAVY_UNTESTED,
} = require("../src/lib/tonight");

test("the night before, untested small blocks stay closed and Q11 stays open", () => {
  const blocks = [
    { topic: "formats", label: "פורמטים", points: 13, attempts: 0, accuracy: null },
    { topic: "datapath", label: "שאלה 11", points: 44, attempts: 0, accuracy: null },
    { topic: "cache", label: "מטמון", points: 8, attempts: 2, accuracy: 0.5 },
  ];
  const kept = filterTonightBlocks(blocks, 1);
  assert.deepEqual(kept.map((b) => b.topic).sort(), ["cache", "datapath"]);
  assert.equal(HEAVY_UNTESTED, 40);
});

test("a 90-minute budget stops even when more blocks remain", () => {
  const diag = diagnoseCourse("python", [
    { topic: "recursion", correct: false },
    { topic: "strings", correct: false },
    { topic: "lists", correct: false },
    { topic: "dictionaries", correct: false },
  ]);
  const plan = planTonight(diag.blocks, { hours: 1.5, daysToExam: 3 });
  const used = plan.actions.reduce((s, a) => s + a.hours, 0);
  assert.ok(used <= TONIGHT_HOURS + 0.01, "budget overflow: " + used);
  assert.ok(plan.actions.length >= 1);
  assert.ok(plan.stop.includes("דקות"));
  assert.match(plan.caveat, /לא תחזית ציון/);
  assert.ok(plan.leftover.length + plan.actions.length >= 2);
});

test("exam-today heading and stop rule are Hebrew and honest", () => {
  assert.match(headingFor(0), /היום/);
  assert.match(headingFor(1), /מחר/);
  const diag = diagnoseCourse("arch", [{ topic: "datapath", correct: false }]);
  const plan = planTonight(diag.blocks, { daysToExam: 0 });
  assert.match(plan.heading, /היום/);
  assert.ok(plan.actions.some((a) => a.topic === "datapath"));
});

test("a fully secured map yields a review action, not invented loss", () => {
  const blocks = [
    { topic: "a", label: "A", points: 50, accuracy: 1, attempts: 3, sample: "ok" },
    { topic: "b", label: "B", points: 50, accuracy: 1, attempts: 3, sample: "ok" },
  ];
  const plan = planTonight(blocks, { hours: 1.5, daysToExam: 0 });
  assert.equal(plan.actions.length, 1);
  assert.equal(plan.actions[0].gain, 0);
  assert.match(plan.actions[0].why, /חזרה/);
});

test("thin samples are labeled instead of treated as a solid map", () => {
  const items = scoreBlocks([
    { topic: "recursion", label: "רקורסיה", points: 25, accuracy: 0, attempts: 1, sample: "thin" },
  ]);
  assert.equal(items[0].sample, "thin");
  const plan = planTonight(items, { daysToExam: 4 });
  assert.match(plan.actions[0].why, /מדגם דק/);
});

test("focusFromDiagnosis uses lost points, not a flat 2/1.5/1 ladder", () => {
  const diag = diagnoseCourse("arch", [{ topic: "datapath", correct: false }]);
  const focus = focusFromDiagnosis(diag);
  assert.ok(focus[0].estimatedHoursTotal >= 2);
  assert.match(focus[0].name, /Datapath|שאלה 11/i);
});
