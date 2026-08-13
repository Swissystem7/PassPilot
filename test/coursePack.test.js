const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseCoursePack,
  packToCourse,
  putPack,
  dropPack,
  parseStore,
  loadPacks,
  savePacks,
  isBuiltinId,
  EXAMPLE_PACK,
  PACK_STORE,
} = require("../src/lib/coursePack");

test("the example pack becomes a runnable custom course", () => {
  const parsed = parseCoursePack(EXAMPLE_PACK);
  assert.equal(parsed.ok, true, parsed.errors && parsed.errors.join(" · "));
  assert.equal(parsed.pack.custom, true);
  assert.equal(parsed.pack.questions.length, 4);
  assert.equal(parsed.pack.blueprint.totalPoints, 100);
  const course = packToCourse(parsed.pack);
  assert.equal(course.hasExam, false);
  assert.equal(course.quizTopics.sets, "קבוצות");
  assert.ok(course.questions[0].explanation.length >= 8);
});

test("builtin ids and a question without a worked solution are rejected", () => {
  assert.equal(isBuiltinId("python"), true);
  const overwrite = parseCoursePack({
    id: "python",
    title: "לא",
    quizTopics: { loops: "לולאות" },
    questions: [{
      topic: "loops", question: "x", options: ["a", "b"], answerIdx: 0, explanation: "פתרון ארוך מספיק",
    }],
  });
  assert.equal(overwrite.ok, false);
  assert.ok(overwrite.errors.some((e) => e.includes("מובנה")));

  const thin = parseCoursePack({
    id: "thin-pack",
    title: "דק",
    quizTopics: { a: "א" },
    questions: [{ topic: "a", question: "?", options: ["1", "2"], answerIdx: 0, explanation: "קצר" }],
  });
  assert.equal(thin.ok, false);
  assert.ok(thin.errors.some((e) => e.includes("פתרון עבודה")));
});

test("missing topics, bad answerIdx, and broken JSON fail in Hebrew", () => {
  assert.equal(parseCoursePack("{").ok, false);
  assert.equal(parseCoursePack("[]").ok, false);
  const badIdx = parseCoursePack({
    id: "bad-idx",
    title: "שגיאה",
    quizTopics: { a: "א" },
    questions: [{ topic: "a", question: "?", options: ["1", "2"], answerIdx: 4, explanation: "פתרון עבודה ארוך" }],
  });
  assert.equal(badIdx.ok, false);
  const unknown = parseCoursePack({
    id: "unknown-topic",
    title: "שגיאה",
    quizTopics: { a: "א" },
    questions: [{ topic: "z", question: "?", options: ["1", "2"], answerIdx: 0, explanation: "פתרון עבודה ארוך" }],
  });
  assert.equal(unknown.ok, false);
});

test("a pack without a map gets an equal split and an honest warning", () => {
  const parsed = parseCoursePack({
    id: "equal-map",
    title: "בלי מפה",
    quizTopics: { a: "א", b: "ב" },
    questions: [
      { topic: "a", question: "A?", options: ["1", "2"], answerIdx: 0, explanation: "פתרון עבודה לא־א" },
      { topic: "b", question: "B?", options: ["1", "2"], answerIdx: 1, explanation: "פתרון עבודה לא־ב" },
    ],
  });
  assert.equal(parsed.ok, true);
  assert.equal(parsed.pack.blueprint.totalPoints, 100);
  assert.ok(parsed.warnings.some((w) => w.includes("חלוקה שווה")));
});

test("store put/drop ignores builtin ids and survives garbage", () => {
  const parsed = parseCoursePack(EXAMPLE_PACK);
  let store = putPack({}, parsed.pack);
  store = putPack(store, { id: "python", questions: [] });
  assert.equal(!!store["logic-demo"], true);
  assert.equal(store.python, undefined);
  store = dropPack(store, "logic-demo");
  assert.deepEqual(store, {});
  assert.deepEqual(parseStore("nope"), {});
  assert.deepEqual(parseStore({ python: { id: "python", questions: [] } }), {});
});

test("load/save round-trip through an injected storage", () => {
  const bag = {};
  const storage = {
    getItem: (k) => bag[k] || null,
    setItem: (k, v) => { bag[k] = v; },
  };
  const parsed = parseCoursePack(EXAMPLE_PACK);
  const saved = savePacks(storage, putPack({}, parsed.pack));
  assert.equal(saved, true);
  assert.ok(bag[PACK_STORE]);
  const loaded = loadPacks(storage);
  assert.equal(loaded["logic-demo"].title, EXAMPLE_PACK.title);
});
