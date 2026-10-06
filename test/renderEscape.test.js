const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { parseCoursePack } = require("../src/lib/coursePack");

// Instructor packs are pasted JSON: option text, topic labels and the course
// title come straight from the paste. index.html renders them through
// innerHTML, so they must go through esc() or `a<b` swallows the rest of the
// row and `<img onerror>` runs. These tests run the shipped render functions
// against a stub DOM with hostile pack text.

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function pull(name) {
  const re = new RegExp("function " + name + "\\([^)]*\\) \\{[\\s\\S]*?\\n\\}");
  const m = html.match(re);
  assert.ok(m, name + " is missing from index.html");
  return m[0];
}

function node() {
  return {
    innerHTML: "",
    textContent: "",
    value: "",
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {},
    focus() {},
  };
}

function makeContext(extra) {
  const nodes = {};
  const ctx = Object.assign({
    $: function (id) { return nodes[id] || (nodes[id] = node()); },
    document: {
      querySelectorAll() { return []; },
      querySelector() { return null; },
    },
    nodes: nodes,
    clearInterval() {},
    setInterval() { return 0; },
    Date: Date,
    Math: Math,
    String: String,
    Object: Object,
    Number: Number,
  }, extra);
  vm.runInNewContext(pull("esc"), ctx);
  return ctx;
}

const HOSTILE = "a<b && <img src=x onerror=alert(1)>";

test("coursePack keeps < and & in option text verbatim (so the page must escape)", () => {
  const res = parseCoursePack(JSON.stringify({
    id: "demo-esc",
    title: "T <b>bold</b>",
    topics: { loops: "Loops <i>x</i>" },
    questions: [{
      topic: "loops",
      question: "Which holds?",
      options: [HOSTILE, "a>b"],
      answerIdx: 0,
      explanation: "Because a is smaller than b here.",
    }],
  }));
  assert.ok(res.ok, "pack must parse: " + JSON.stringify(res.errors));
  assert.equal(res.pack.questions[0].options[0], HOSTILE);
  assert.equal(res.pack.quizTopics.loops, "Loops <i>x</i>");
  assert.equal(res.pack.title, "T <b>bold</b>");
});

test("renderQuizItem escapes answer options from a pasted pack", () => {
  const ctx = makeContext({
    state: { items: [{ topic: "loops", difficulty: 2, question: "Q\nbody", options: [HOSTILE, "a>b"], answerIdx: 0 }], index: 0 },
    labels: function () { return { loops: "Loops" }; },
    tick() {},
  });
  vm.runInNewContext(pull("renderQuizItem") + "\nthis.run = renderQuizItem;", ctx);
  ctx.run();
  const out = ctx.nodes.answers.innerHTML;
  assert.ok(out.includes("a&lt;b &amp;&amp; &lt;img src=x onerror=alert(1)&gt;"), out);
  assert.ok(!out.includes("<img"), "raw tag leaked into the answers list");
  assert.ok(out.includes("a&gt;b"), out);
});

test("renderTopics escapes topic labels and keys", () => {
  const ctx = makeContext({
    course: function () { return { quizTopics: { "x\"><s": "Loops <i>x</i>" } }; },
    diagnosisBlueprint: function () { return null; },
  });
  vm.runInNewContext(pull("renderTopics") + "\nthis.run = renderTopics;", ctx);
  ctx.run();
  const out = ctx.nodes.topics.innerHTML;
  assert.ok(out.includes("<span>Loops &lt;i&gt;x&lt;/i&gt;</span>"), out);
  assert.ok(out.includes('value="x&quot;&gt;&lt;s"'), out);
  assert.ok(!out.includes("<i>"), "raw tag leaked into the topic list");
});

test("renderCourseButtons escapes the pack title", () => {
  const ctx = makeContext({
    allCourses: function () { return { "demo-esc": { title: "T <b>bold</b>", custom: true } }; },
    setCourse() {},
  });
  ctx.nodes.courseButtons = Object.assign(node(), { querySelectorAll() { return []; } });
  vm.runInNewContext(pull("renderCourseButtons") + "\nthis.run = renderCourseButtons;", ctx);
  ctx.run();
  const out = ctx.nodes.courseButtons.innerHTML;
  assert.ok(out.includes("T &lt;b&gt;bold&lt;/b&gt; · הודבק"), out);
  assert.ok(!out.includes("<b>"), "raw tag leaked into the course buttons");
});

test("every pack-text interpolation in index.html goes through esc()", () => {
  // Static guard for the sites a stub DOM does not reach (results list,
  // study plan, exam block order). A regression here is a one-line revert.
  [
    /esc\(map\[r\.topic\] \|\| r\.topic\)/,
    /" · " \+ esc\(p\.topic\) \+ "<\/span>/,
    /">" \+ esc\(x\.title\) \+ "<\/span>"/,
    /esc\(catalog\[id\]\.title\)/,
    /esc\(names\[key\]\)/,
    /<\/span>" \+ esc\(o\) \+ "<\/button>"/,
  ].forEach(function (re) {
    assert.match(html, re);
  });
  assert.doesNotMatch(html, /<\/span>" \+ o \+ "<\/button>"/);
});
