const test = require("node:test");
const assert = require("node:assert/strict");
const planner = require("../src/lib/planner");
const { weakTopicRanker } = planner;

const answer = (topic, correct, secondsSpent) => ({ topic, correct, secondsSpent });

test("the topic answered wrong most often ranks first", () => {
  const ranked = weakTopicRanker([
    answer("algebra", false, 30), answer("algebra", false, 30),
    answer("geometry", true, 30), answer("geometry", true, 30),
  ]);
  assert.equal(ranked[0].topic, "algebra");
  assert.equal(ranked[0].errorRate, 1);
});

test("a topic answered correctly but very slowly still scores above zero", () => {
  const ranked = weakTopicRanker([
    answer("slow", true, 300),
    answer("fast", true, 5),
  ]);
  const slow = ranked.find((r) => r.topic === "slow");
  assert.ok(slow.score > 0, "slowness must carry weight even with no errors");
  assert.ok(slow.score > ranked.find((r) => r.topic === "fast").score);
});

test("errors outweigh slowness", () => {
  const ranked = weakTopicRanker([
    answer("wrongButFast", false, 1),
    answer("rightButSlow", true, 600),
  ]);
  assert.equal(ranked[0].topic, "wrongButFast");
});

test("malformed rows are dropped instead of breaking the ranking", () => {
  const ranked = weakTopicRanker([
    answer("algebra", false, 30),
    null,
    { topic: "algebra", correct: false },
    { topic: 42, correct: false, secondsSpent: 10 },
    { topic: "algebra", correct: false, secondsSpent: -5 },
  ]);
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].attempts, 1);
});

test("an empty result set ranks nothing rather than throwing", () => {
  assert.deepEqual(weakTopicRanker([]), []);
});

test("non-array input is rejected loudly", () => {
  assert.throws(() => weakTopicRanker(null), TypeError);
  assert.throws(() => weakTopicRanker("algebra"), TypeError);
});

test("equal scores break ties alphabetically, so the list is stable", () => {
  const ranked = weakTopicRanker([answer("beta", false, 10), answer("alpha", false, 10)]);
  assert.deepEqual(ranked.map((r) => r.topic), ["alpha", "beta"]);
});

test("planner no longer exports a pass-probability or a second study planner", () => {
  assert.equal("calculateInitialPassProbability" in planner, false);
  assert.equal("generateInitialStudyPlan" in planner, false);
  assert.equal(typeof planner.weakTopicRanker, "function");
});
