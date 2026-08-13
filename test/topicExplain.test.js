const test = require("node:test");
const assert = require("node:assert/strict");
const { noteFor, explainMisses, GENERIC } = require("../src/lib/topicExplain");

test("a known miss gets a builtin gist and a next move, not a pass claim", () => {
  const note = noteFor("python", "recursion");
  assert.equal(note.source, "builtin");
  assert.match(note.gist, /תנאי עצירה/);
  assert.match(note.nextMove, /מחסנית/);
  assert.doesNotMatch(note.gist, /סיכוי/);
});

test("an unknown topic stays generic instead of inventing a lecture", () => {
  const note = noteFor("python", "monads");
  assert.equal(note.source, "generic");
  assert.equal(note.gist, GENERIC.gist);
});

test("a pack note wins over the builtin text", () => {
  const note = noteFor("python", "loops", {
    loops: { gist: "הסבר מהחבילה", nextMove: "צעד מהחבילה" },
  });
  assert.equal(note.source, "pack");
  assert.equal(note.gist, "הסבר מהחבילה");
});

test("explainMisses lists only topics that were answered wrong, heaviest first", () => {
  const rows = [
    { topic: "loops", correct: false },
    { topic: "loops", correct: false },
    { topic: "strings", correct: true },
    { topic: "recursion", correct: false },
    null,
    { topic: 3, correct: false },
  ];
  const out = explainMisses(rows, "python", { loops: "לולאות", recursion: "רקורסיה" });
  assert.deepEqual(out.map((r) => r.topic), ["loops", "recursion"]);
  assert.equal(out[0].wrong, 2);
  assert.equal(out[0].n, 2);
  assert.equal(out[0].label, "לולאות");
  assert.ok(out[0].gist);
  assert.equal(out.some((r) => r.topic === "strings"), false);
});

test("a clean session yields no topic explanations", () => {
  assert.deepEqual(explainMisses([{ topic: "lists", correct: true }], "python"), []);
  assert.deepEqual(explainMisses([], "python"), []);
});
