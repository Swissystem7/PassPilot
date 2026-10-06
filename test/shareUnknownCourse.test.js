const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { encodeDiagnosis } = require("../src/lib/shareCode");

// loadShareCode lives inline in index.html. The decoder only validates the
// shape of a PP1 code, so the page must refuse a code whose course is not
// installed in this browser instead of falling back to Python and drawing
// the diagnosis against the wrong point map.

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function pull(name) {
  const re = new RegExp("function " + name + "\\([^)]*\\) \\{[\\s\\S]*?\\n\\}");
  const m = html.match(re);
  assert.ok(m, name + " is missing from index.html");
  return m[0];
}

function run(code, installed) {
  const nodes = {
    shareIn: { value: code },
    shareInMsg: { textContent: "" },
    startStatus: { textContent: "" },
    examDate: { value: "" },
  };
  const calls = { setCourse: [], renderResults: [], overlays: 0 };
  const ctx = {
    $: function (id) { return nodes[id] || null; },
    decodeDiagnosis: require("../src/lib/shareCode").decodeDiagnosis,
    allCourses: function () { return installed; },
    setStatus: function (id, text) { if (nodes[id]) nodes[id].textContent = text || ""; },
    setCourse: function (id) { calls.setCourse.push(id); },
    renderResults: function (rows, opts) { calls.renderResults.push({ rows: rows, opts: opts }); },
    expandBlueprint: function () { return null; },
    putOverlay: function (o) { return o; },
    builtinAsEdits: function () { return []; },
    persistOverlays: function () { calls.overlays++; },
    state: { courseId: "python", kind: "quiz", answers: [], imported: false, overlays: {}, mapDrafts: {} },
  };
  vm.runInNewContext(pull("loadShareCode") + "\nloadShareCode();", ctx);
  return { nodes: nodes, calls: calls, state: ctx.state };
}

test("a code for a course that is not installed is refused with a Hebrew message", () => {
  const code = encodeDiagnosis({ courseId: "logic", kind: "quiz", rows: [{ topic: "and", correct: false }] });
  const out = run(code, { python: { title: "פייתון" } });
  assert.equal(out.calls.setCourse.length, 0, "must not switch course");
  assert.equal(out.calls.renderResults.length, 0, "must not render a diagnosis");
  assert.equal(out.state.imported, false);
  assert.match(out.nodes.shareInMsg.textContent, /logic/);
  assert.match(out.nodes.shareInMsg.textContent, /אינו מותקן/);
  // bootFromHash runs on the start screen where shareInMsg is off-screen, so
  // the same text also lands in the start status line.
  assert.equal(out.nodes.startStatus.textContent, out.nodes.shareInMsg.textContent);
});

test("a code for an installed course still loads as an imported diagnosis", () => {
  const code = encodeDiagnosis({ courseId: "logic", kind: "exam", rows: [{ topic: "and", correct: true }] });
  const out = run(code, { python: { title: "פייתון" }, logic: { title: "לוגיקה" } });
  assert.deepEqual(out.calls.setCourse, ["logic"]);
  assert.equal(out.calls.renderResults.length, 1);
  assert.equal(out.calls.renderResults[0].opts.imported, true);
  assert.equal(out.calls.renderResults[0].opts.save, false);
  assert.equal(out.state.kind, "exam");
  assert.equal(out.state.imported, true);
  assert.match(out.nodes.shareInMsg.textContent, /נטען אבחון/);
});

test("a builtin course id is always installed", () => {
  const code = encodeDiagnosis({ courseId: "python", kind: "quiz", rows: [] });
  const out = run(code, { python: { title: "פייתון" } });
  assert.deepEqual(out.calls.setCourse, ["python"]);
  assert.equal(out.calls.renderResults.length, 1);
});
