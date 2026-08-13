const test = require("node:test");
const assert = require("node:assert/strict");
const { diagnoseCourse, pickSecurePath } = require("../src/lib/examBlueprint");

test("מסלול 55 picks highest points-per-hour blocks until the floor", () => {
  const diag = diagnoseCourse("python", [
    { topic: "recursion", correct: true },
    { topic: "strings", correct: false },
  ]);
  const path = pickSecurePath(diag.blocks, 55);
  assert.equal(path.secured, 25);
  assert.ok(path.reached);
  assert.ok(path.total >= 55);
  assert.ok(path.picked.length >= 1);
  assert.equal(path.picked[0].topic, "strings");
  assert.ok(path.picked.every((p) => p.value === path.picked[0].value || p.value <= path.picked[0].value));
  const values = path.picked.map((p) => p.value);
  for (let i = 1; i < values.length; i++) {
    assert.ok(values[i] <= values[i - 1] + 0.001);
  }
});

test("untested blocks count as zero secured, not invented credit", () => {
  const diag = diagnoseCourse("python", []);
  const path = pickSecurePath(diag.blocks, 55);
  assert.equal(path.secured, 0);
  assert.ok(path.picked.length >= 2);
  assert.ok(path.steps[0].text.includes("0"));
});

test("official 60 can require more blocks than the 55 floor", () => {
  const blocks = [
    { topic: "a", label: "A", points: 40, accuracy: 1 },
    { topic: "b", label: "B", points: 15, accuracy: 0 },
    { topic: "c", label: "C", points: 15, accuracy: 0 },
    { topic: "d", label: "D", points: 15, accuracy: 0 },
  ];
  const p55 = pickSecurePath(blocks, 55);
  const p60 = pickSecurePath(blocks, 60);
  assert.ok(p55.reached);
  assert.ok(p60.reached);
  assert.ok(p60.picked.length > p55.picked.length);
});

test("Q11 datapath loss is the first greedy pick on 10145", () => {
  const diag = diagnoseCourse("arch", [
    { topic: "datapath", correct: false },
    { topic: "cache", correct: true },
  ]);
  const path = pickSecurePath(diag.blocks, 55);
  assert.equal(path.picked[0].topic, "datapath");
  assert.ok(path.picked[0].gain > 20);
});
