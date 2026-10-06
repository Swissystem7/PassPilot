const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// answerHotkey lives inline in index.html (the page is one script). Pull the
// function out and run it on its own so the rule is tested exactly as shipped.
function loadAnswerHotkey() {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const m = html.match(/function answerHotkey\(ev\) \{[\s\S]*?\r?\n\}/);
  assert.ok(m, "answerHotkey is missing from index.html");
  const ctx = {};
  vm.runInNewContext(m[0] + "\nthis.answerHotkey = answerHotkey;", ctx);
  return ctx.answerHotkey;
}

function key(k, extra) {
  return Object.assign({ key: k, ctrlKey: false, altKey: false, metaKey: false, isComposing: false, target: { tagName: "BUTTON" } }, extra || {});
}

test("a plain digit 1-4 picks that answer; other keys do nothing", () => {
  const answerHotkey = loadAnswerHotkey();
  assert.equal(answerHotkey(key("1")), 1);
  assert.equal(answerHotkey(key("4")), 4);
  assert.equal(answerHotkey(key("5")), 0);
  assert.equal(answerHotkey(key("0")), 0);
  assert.equal(answerHotkey(key("a")), 0);
  assert.equal(answerHotkey(key("Enter")), 0);
  assert.equal(answerHotkey(null), 0);
});

test("Ctrl/Alt/Meta + digit is a browser shortcut (tab switch), not an answer", () => {
  const answerHotkey = loadAnswerHotkey();
  assert.equal(answerHotkey(key("2", { ctrlKey: true })), 0);
  assert.equal(answerHotkey(key("2", { altKey: true })), 0);
  assert.equal(answerHotkey(key("2", { metaKey: true })), 0);
  // Shift alone is not a browser chord; Shift+1 still reads as a hotkey only if
  // the key value is a digit, which the browser does not report for Shift+1.
  assert.equal(answerHotkey(key("!", { shiftKey: true })), 0);
});

test("a digit typed into a field or during IME composition is text, not an answer", () => {
  const answerHotkey = loadAnswerHotkey();
  assert.equal(answerHotkey(key("1", { target: { tagName: "INPUT" } })), 0);
  assert.equal(answerHotkey(key("1", { target: { tagName: "textarea" } })), 0);
  assert.equal(answerHotkey(key("1", { target: { tagName: "SELECT" } })), 0);
  assert.equal(answerHotkey(key("1", { target: { tagName: "DIV", isContentEditable: true } })), 0);
  assert.equal(answerHotkey(key("1", { isComposing: true })), 0);
  // No target at all (synthetic event) still works as a plain hotkey.
  assert.equal(answerHotkey(key("3", { target: null })), 3);
});

test("the quiz keydown handler routes through answerHotkey", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const handler = html.slice(html.indexOf('document.addEventListener("keydown"'));
  assert.match(handler, /var n = answerHotkey\(ev\);/);
  assert.doesNotMatch(handler, /ev\.key === "1" \|\| ev\.key === "2"/);
});
