const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// copyText lives inline in index.html. Pull it out with its helpers and run
// it against a fake navigator/document, so the promise "the page only says
// copied when the browser reported a copy" is tested exactly as shipped.
function loadCopyText(env) {
  // The clone may check out CRLF; normalise so the line-anchored regexps match.
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8").replace(/\r\n/g, "\n");
  const msg = html.match(/var COPY_BLOCKED_MSG = .*;\n/);
  const copy = html.match(/function copyText\(value, msgEl, okText, srcEl\) \{[\s\S]*?\n\}/);
  const fallback = html.match(/function fallbackCopy\(value\) \{[\s\S]*?\n\}/);
  assert.ok(msg && copy && fallback, "copyText, fallbackCopy or COPY_BLOCKED_MSG is missing from index.html");
  const ctx = { navigator: env.navigator, document: env.document };
  vm.runInNewContext(msg[0] + copy[0] + "\n" + fallback[0] + "\nthis.copyText = copyText; this.MSG = COPY_BLOCKED_MSG;", ctx);
  return ctx;
}

function fakeDocument(execResult) {
  const calls = [];
  const body = {
    children: [],
    appendChild(el) { this.children.push(el); },
    removeChild(el) { this.children = this.children.filter((x) => x !== el); },
  };
  return {
    body,
    calls,
    createElement() {
      return { value: "", style: {}, setAttribute() {}, select() { calls.push("ta.select"); } };
    },
    execCommand(name) {
      calls.push("exec:" + name);
      if (execResult instanceof Error) throw execResult;
      return execResult;
    },
  };
}

function fakeField() {
  return { log: [], focus() { this.log.push("focus"); }, select() { this.log.push("select"); } };
}

const tick = () => new Promise((r) => setImmediate(r));

test("async clipboard success reports the ok text", async () => {
  const written = [];
  const doc = fakeDocument(false);
  const ctx = loadCopyText({
    navigator: { clipboard: { writeText: (v) => { written.push(v); return Promise.resolve(); } } },
    document: doc,
  });
  const msgEl = { textContent: "", style: {} };
  ctx.copyText("PP1.abc", msgEl, "ok!", fakeField());
  await tick();
  assert.deepEqual(written, ["PP1.abc"]);
  assert.equal(msgEl.textContent, "ok!");
  assert.deepEqual(doc.calls, [], "no execCommand fallback when the clipboard API worked");
});

test("clipboard rejection falls back to execCommand and still reports ok when it copied", async () => {
  const doc = fakeDocument(true);
  const ctx = loadCopyText({
    navigator: { clipboard: { writeText: () => Promise.reject(new Error("NotAllowedError")) } },
    document: doc,
  });
  const msgEl = { textContent: "", style: {} };
  ctx.copyText("PP1.abc", msgEl, "ok!", fakeField());
  await tick();
  assert.equal(msgEl.textContent, "ok!");
  assert.deepEqual(doc.calls, ["ta.select", "exec:copy"]);
  assert.equal(doc.body.children.length, 0, "the helper textarea is removed again");
});

test("when both paths fail the page does not claim a copy; the source field is selected for manual Ctrl+C", async () => {
  const doc = fakeDocument(false);
  const ctx = loadCopyText({
    navigator: { clipboard: { writeText: () => Promise.reject(new Error("blocked")) } },
    document: doc,
  });
  const msgEl = { textContent: "", style: {} };
  const field = fakeField();
  ctx.copyText("PP1.abc", msgEl, "ok!", field);
  await tick();
  assert.equal(msgEl.textContent, ctx.MSG);
  assert.notEqual(msgEl.textContent, "ok!");
  assert.deepEqual(field.log, ["focus", "select"]);
  assert.ok(ctx.MSG.indexOf("Ctrl+C") !== -1, "the blocked message tells the user how to copy manually");
});

test("no clipboard API, execCommand throws, no source field: the value is shown inline", () => {
  const doc = fakeDocument(new Error("not supported"));
  const ctx = loadCopyText({ navigator: {}, document: doc });
  const msgEl = { textContent: "", style: {} };
  ctx.copyText("https://example.test/#PP1.abc", msgEl, "ok!");
  assert.ok(msgEl.textContent.startsWith(ctx.MSG));
  assert.ok(msgEl.textContent.indexOf("https://example.test/#PP1.abc") !== -1);
  assert.equal(msgEl.style.whiteSpace, "pre-wrap");
});

test("a navigator.clipboard getter that throws (sandboxed iframe) is treated as missing", () => {
  const doc = fakeDocument(true);
  const navigator = {};
  Object.defineProperty(navigator, "clipboard", { get() { throw new Error("SecurityError"); } });
  const ctx = loadCopyText({ navigator, document: doc });
  const msgEl = { textContent: "", style: {} };
  ctx.copyText("PP1.abc", msgEl, "ok!");
  assert.equal(msgEl.textContent, "ok!");
  assert.deepEqual(doc.calls, ["ta.select", "exec:copy"]);
});

test("every copy button that has a text field passes it for the manual fallback", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const calls = html.match(/copyText\([^;]*\);/g) || [];
  const withField = calls.filter((c) => /, out\);$/.test(c));
  assert.ok(calls.length >= 3, "expected the share-code, share-link and invite copy buttons");
  assert.equal(withField.length, 2, "share code and share link copies pass the textarea");
});
