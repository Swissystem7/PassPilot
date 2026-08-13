const test = require("node:test");
const assert = require("node:assert/strict");
const { COURSES, getCourse } = require("../src/lib/banks");

function assertQuestion(q, courseId, topics, where) {
  assert.equal(typeof q.question, "string", where + " missing question");
  assert.ok(q.question.trim(), where + " empty question");
  assert.ok(Array.isArray(q.options) && q.options.length >= 2, where + " options");
  assert.ok(Number.isInteger(q.answerIdx) && q.answerIdx >= 0 && q.answerIdx < q.options.length, where + " answerIdx");
  assert.equal(typeof q.explanation, "string", where + " explanation");
  assert.ok(q.explanation.trim().length >= 12, where + " needs a worked solution, not a letter");
  assert.ok(Object.prototype.hasOwnProperty.call(topics, q.topic), where + " unknown topic " + q.topic + " in " + courseId);
  assert.ok(q.difficulty === 1 || q.difficulty === 2 || q.difficulty === 3, where + " difficulty");
}

test("every builtin course has a usable bank and every item has a worked solution", () => {
  ["python", "arch", "hedva1", "hedva2"].forEach((id) => {
    const c = getCourse(id);
    assert.equal(c.id, id);
    assert.ok(c.questions.length >= 20, id + " bank too thin: " + c.questions.length);
    const perTopic = {};
    c.questions.forEach((q, i) => {
      assertQuestion(q, id, c.quizTopics, id + " q" + i);
      perTopic[q.topic] = (perTopic[q.topic] || 0) + 1;
    });
    Object.keys(c.quizTopics).forEach((topic) => {
      assert.ok((perTopic[topic] || 0) >= 6, id + " / " + topic + " has only " + (perTopic[topic] || 0) + " items");
    });
  });
});

test("python exam items cover every block with a reference solution", () => {
  const c = getCourse("python");
  assert.equal(c.hasExam, true);
  c.examBlocks.forEach((b) => {
    const pool = c.examItems.filter((it) => it.topic === b.topic);
    assert.ok(pool.length >= 4, "exam block " + b.topic + " too thin: " + pool.length);
  });
  c.examItems.forEach((it, i) => {
    assert.ok(it.prompt && it.referenceSolution && it.explanation, "exam item " + i);
    assert.ok(it.explanation.trim().length >= 12, "exam item " + i + " needs a worked note");
  });
});

test("switching courses does not leak python dictionaries onto hedva", () => {
  const h1 = getCourse("hedva1");
  assert.equal(h1.questions.some((q) => q.topic === "dictionaries"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(h1.quizTopics, "dictionaries"), false);
  assert.equal(COURSES.python.hasExam, true);
  assert.equal(COURSES.arch.hasExam, false);
});
