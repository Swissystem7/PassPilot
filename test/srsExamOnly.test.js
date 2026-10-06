const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const srs = require("../src/lib/srsQueue");
const { COURSES } = require("../src/lib/banks");

const NL = String.fromCharCode(10);
const t0 = Date.UTC(2026, 7, 13, 10, 0, 0);

// renderSrsBox and startSrsQuiz live inline in index.html. Slice the two
// functions out by name (indexOf, no regexp over the page) and run them with a
// fake DOM so the page behaviour is tested exactly as shipped.
function sliceFunction(html, name) {
  const start = html.indexOf("function " + name + "() {");
  assert.ok(start >= 0, name + " is missing from index.html");
  const end = html.indexOf(NL + "}" + NL, start);
  return html.slice(start, end + 2);
}

function makeEl(id) {
  const classes = {};
  return {
    id: id,
    value: "",
    textContent: "",
    innerHTML: "",
    disabled: false,
    classList: {
      add(c) { classes[c] = true; },
      remove(c) { delete classes[c]; },
      contains(c) { return !!classes[c]; },
    },
  };
}

function makePage(options) {
  // a CRLF checkout must slice the same as an LF one
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8").split(String.fromCharCode(13)).join("");
  const code = sliceFunction(html, "renderSrsBox") + NL + sliceFunction(html, "startSrsQuiz") + NL +
    "this.renderSrsBox = renderSrsBox; this.startSrsQuiz = startSrsQuiz;";
  const els = {};
  ["srsBox", "srsList", "srsStartBtn", "startStatus", "count"].forEach(function (id) { els[id] = makeEl(id); });
  const boxes = Object.keys(COURSES.python.quizTopics).map(function (key) {
    return { value: key, checked: false };
  });
  const calls = { startQuiz: 0 };
  const ctx = {
    $: function (id) { return els[id]; },
    document: {
      querySelectorAll: function (sel) {
        assert.equal(sel, "#topics input");
        return boxes;
      },
    },
    state: { courseId: "python" },
    Date: { now: function () { return options.now; } },
    readSrs: function () { return options.list; },
    dueItems: srs.dueItems,
    splitByQuiz: srs.splitByQuiz,
    course: function () { return COURSES.python; },
    labels: function () { return COURSES.python.labelTopics; },
    esc: function (s) { return String(s); },
    setStatus: function (id, text) { els[id].textContent = text || ""; },
    startQuiz: function () { calls.startQuiz += 1; },
  };
  vm.runInNewContext(code, ctx);
  return { ctx: ctx, els: els, boxes: boxes, calls: calls };
}

test("an exam-only due topic does not leave the review button as a dead end", () => {
  // The student missed the python dictionaries block; there are no quiz
  // questions for it, so the quiz button used to check nothing and stop with
  // the generic pick-a-topic message while the box kept listing the topic.
  const list = srs.applySession([], "python", [{ topic: "dictionaries", correct: false }], t0);
  const page = makePage({ list: list, now: t0 + srs.DAY_MS });
  page.ctx.renderSrsBox();
  assert.equal(page.els.srsBox.classList.contains("hidden"), false);
  assert.ok(page.els.srsList.innerHTML.indexOf("אין שאלות בוחן") >= 0, "the row explains why it cannot be drilled");
  assert.equal(page.els.srsStartBtn.disabled, true);
  assert.ok(page.els.srsStartBtn.textContent.indexOf("מבנה המבחן") >= 0);

  page.ctx.startSrsQuiz();
  assert.equal(page.calls.startQuiz, 0);
  assert.ok(page.els.startStatus.textContent.indexOf("אין שאלות בוחן") >= 0);
  assert.notEqual(page.els.startStatus.textContent, "בחרו לפחות נושא אחד");
});

test("a mixed due list drills only the quiz topics and keeps the button live", () => {
  let list = srs.applySession([], "python", [{ topic: "dictionaries", correct: false }], t0);
  list = srs.applySession(list, "python", [{ topic: "recursion", correct: false }], t0);
  const page = makePage({ list: list, now: t0 + srs.DAY_MS });
  page.ctx.renderSrsBox();
  assert.equal(page.els.srsStartBtn.disabled, false);
  assert.equal(page.els.srsStartBtn.textContent, "תרגול הנושאים שבתוקף");

  page.ctx.startSrsQuiz();
  assert.equal(page.calls.startQuiz, 1);
  assert.deepEqual(
    page.boxes.filter((b) => b.checked).map((b) => b.value),
    ["recursion"]
  );
  assert.equal(page.els.count.value, "5");
});

test("nothing due today still says so and hides the box", () => {
  const list = srs.applySession([], "python", [{ topic: "recursion", correct: false }], t0);
  const page = makePage({ list: list, now: t0 });
  page.ctx.renderSrsBox();
  assert.equal(page.els.srsBox.classList.contains("hidden"), true);
  page.ctx.startSrsQuiz();
  assert.equal(page.calls.startQuiz, 0);
  assert.equal(page.els.startStatus.textContent, "אין נושאים בתוקף היום");
});
