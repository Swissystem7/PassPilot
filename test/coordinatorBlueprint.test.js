const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseCoordinatorBlueprint,
  compactBlueprint,
  expandBlueprint,
  diagnoseCourse,
} = require("../src/lib/examBlueprint");

const sample = {
  courseId: "python",
  title: "פייתון 10016 · מועד א׳",
  examLabel: "מפתח מהרכז",
  blocks: [
    { id: "q1", topic: "recursion", label: "רקורסיה", points: 40 },
    { id: "q2", topic: "strings", label: "מחרוזות", points: 30 },
    { topic: "lists", points: 30 },
  ],
};

test("a valid coordinator map is accepted and tagged as pasted, not official", () => {
  const parsed = parseCoordinatorBlueprint(JSON.stringify(sample));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.blueprint.blocks.length, 3);
  assert.equal(parsed.blueprint.totalPoints, 100);
  assert.equal(parsed.blueprint.blocks[2].id, "b3");
  assert.equal(parsed.blueprint.blocks[0].source, "coordinator");
  assert.match(parsed.blueprint.pointMapNote, /הודבקה|רכז/);
  assert.equal(parsed.warnings.length, 0);
});

test("broken JSON and missing points are rejected with Hebrew errors", () => {
  assert.equal(parseCoordinatorBlueprint("{").ok, false);
  assert.equal(parseCoordinatorBlueprint("[]").ok, false);
  const bad = parseCoordinatorBlueprint({ blocks: [{ topic: "x", points: 0 }] });
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.some((e) => e.includes("points")));
});

test("a map that does not sum to 100 is kept, with an honest warning", () => {
  const parsed = parseCoordinatorBlueprint({
    courseId: "arch",
    blocks: [{ topic: "datapath", label: "Q11", points: 44 }],
  });
  assert.equal(parsed.ok, true);
  assert.equal(parsed.blueprint.totalPoints, 44);
  assert.ok(parsed.warnings.some((w) => w.includes("44")));
});

test("diagnoseCourse uses the overlay weights instead of the built-in 25/25/25/25", () => {
  const parsed = parseCoordinatorBlueprint(sample);
  const diag = diagnoseCourse("python", [{ topic: "recursion", correct: false }], parsed.blueprint);
  const rec = diag.blocks.find((b) => b.topic === "recursion");
  assert.equal(rec.points, 40);
  assert.equal(rec.lost, 40);
  const builtin = diagnoseCourse("python", [{ topic: "recursion", correct: false }]);
  const rec0 = builtin.blocks.find((b) => b.topic === "recursion");
  assert.equal(rec0.points, 25);
});

test("compact/expand round-trips a coordinator map inside a share payload", () => {
  const parsed = parseCoordinatorBlueprint(sample);
  const compact = compactBlueprint(parsed.blueprint);
  const again = expandBlueprint(compact, "python");
  assert.equal(again.blocks[0].points, 40);
  assert.equal(again.blocks[1].topic, "strings");
  assert.equal(again.courseId, "python");
});
