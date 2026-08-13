const test = require("node:test");
const assert = require("node:assert/strict");
const { weakTopicRanker } = require("../src/lib/planner");

test("a single error on a slow topic still ranks above a fast perfect topic", () => {
  const ranked = weakTopicRanker([
    { topic: "recursion", correct: false, secondsSpent: 40 },
    { topic: "strings", correct: true, secondsSpent: 5 },
    { topic: "strings", correct: true, secondsSpent: 6 },
  ]);
  assert.equal(ranked[0].topic, "recursion");
  assert.equal(ranked[0].errorRate, 1);
  assert.ok(ranked[0].score > ranked.find((r) => r.topic === "strings").score);
});

test("equal error rates break ties by topic name so the list is stable", () => {
  const ranked = weakTopicRanker([
    { topic: "lists", correct: false, secondsSpent: 10 },
    { topic: "functions", correct: false, secondsSpent: 10 },
  ]);
  assert.deepEqual(ranked.map((r) => r.topic), ["functions", "lists"]);
});
