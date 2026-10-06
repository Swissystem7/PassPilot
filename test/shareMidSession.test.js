// A share link opened while a session is running (hashchange in an open
// tab, PR #16) jumps straight to the imported results. The page script runs
// here inside a vm with a tiny DOM stub, fake intervals and a fake clock.
// Regression: the abandoned session's interval kept ticking behind the
// results, and an expiring marathon clock then finished the abandoned run,
// saved it to history and replaced the imported diagnosis on screen.
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const html = readFileSync(join(root, "index.html"), "utf8");

function stubEl(id) {
  const classes = new Set();
  return {
    id,
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
      toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)),
      contains: (c) => classes.has(c),
    },
    style: { setProperty() {}, cssText: "", display: "" },
    attrs: {},
    setAttribute(k, v) { this.attrs[k] = v; },
    removeAttribute(k) { delete this.attrs[k]; },
    getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; },
    textContent: "",
    innerHTML: "",
    value: "",
    options: [],
    disabled: false,
    open: false,
    title: "",
    focus() {},
    click() {},
    select() {},
    addEventListener() {},
    querySelectorAll() { return []; },
    querySelector() { return null; },
    scrollIntoView() {},
    appendChild() {},
    removeChild() {},
  };
}

function makeStorage() {
  const bag = new Map();
  return {
    getItem: (k) => (bag.has(k) ? bag.get(k) : null),
    setItem: (k, v) => bag.set(k, String(v)),
    removeItem: (k) => bag.delete(k),
  };
}

// Walk the page's script tags by index, not by regexp: CodeQL reads any
// script-tag regexp as an HTML sanitiser and fails the PR (js/bad-tag-filter).
function scriptBlocks(src) {
  const blocks = [];
  let from = 0;
  for (;;) {
    const open = src.indexOf("<script", from);
    if (open < 0) break;
    const openEnd = src.indexOf(">", open);
    const close = src.indexOf("</script>", openEnd);
    assert.ok(openEnd > open && close > openEnd, "unterminated script tag in index.html");
    const tag = src.slice(open, openEnd + 1);
    const srcAt = tag.indexOf('src="');
    const file = srcAt < 0 ? null : tag.slice(srcAt + 5, tag.indexOf('"', srcAt + 5));
    blocks.push({ src: file, body: src.slice(openEnd + 1, close) });
    from = close + "</script>".length;
  }
  return blocks;
}

function bootPage() {
  const els = new Map();
  const intervals = new Map();
  const listeners = {};
  let nextId = 1;
  const clock = { now: 1_800_000_000_000 };
  const storage = makeStorage();
  const document = {
    title: "",
    activeElement: null,
    body: stubEl("body"),
    getElementById: (id) => {
      if (!els.has(id)) els.set(id, stubEl(id));
      return els.get(id);
    },
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => stubEl(tag),
    addEventListener() {},
    execCommand() {},
  };
  const sandbox = {
    console,
    Buffer,
    btoa: globalThis.btoa,
    atob: globalThis.atob,
    document,
    localStorage: storage,
    location: { hash: "" },
    navigator: {},
    addEventListener: (name, fn) => { listeners[name] = fn; },
    setInterval: (fn, ms) => {
      const id = nextId++;
      intervals.set(id, { fn, ms });
      return id;
    },
    clearInterval: (id) => { intervals.delete(id); },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  vm.runInContext("Date.now = function () { return __now(); };", ctx);
  sandbox.__now = () => clock.now;

  const blocks = scriptBlocks(html);
  const srcTags = blocks.filter((b) => b.src).map((b) => b.src);
  assert.ok(srcTags.length > 10, "expected the page to load its src/lib modules");
  srcTags.forEach((rel) => {
    vm.runInContext(readFileSync(join(root, rel), "utf8"), ctx, { filename: rel });
  });
  const inline = blocks.find((b) => !b.src);
  assert.ok(inline, "inline page script not found");
  vm.runInContext(inline.body, ctx, { filename: "index.html" });
  assert.equal(typeof listeners.hashchange, "function", "the page must listen for hashchange");

  const g = (expr) => vm.runInContext(expr, ctx);
  const history = () => JSON.parse(storage.getItem(g("HIST_KEY")) || "[]");
  // A share link opened in this tab: the hash changes and the page routes it.
  const openShareLink = (code) => {
    sandbox.location.hash = "#" + code;
    listeners.hashchange();
  };
  return { g, clock, intervals, history, storage, el: document.getElementById, openShareLink };
}

function unlockStaff(page) {
  const code = page.g("encodeUnlock({ kind: 'staff', courseId: '*' })");
  page.el("redeemIn").value = code;
  page.g("applyRedeem()");
  assert.equal(page.g("paidNow()"), true, "staff code must unlock the marathon");
}

function shareCodeFor(page, courseId) {
  return page.g("encodeDiagnosis({ courseId: '" + courseId + "', kind: 'quiz', rows: [{ topic: Object.keys(course().quizTopics)[0], correct: false }] })");
}

test("a share link opened mid-marathon abandons the run: no clock, no late save", () => {
  const page = bootPage();
  unlockStaff(page);
  page.g("setCourse('hedva1')");
  page.g("startMarathon()");
  assert.equal(page.g("state.kind"), "marathon");
  assert.equal(page.g("state.screen"), "quiz");
  page.g("answerQuiz(0)");
  page.g("nextQuiz()");
  assert.equal(page.intervals.size, 1, "the marathon is ticking before the link arrives");
  const total = page.g("state.marathon.totalMinutes");

  page.openShareLink(shareCodeFor(page, "hedva1"));
  assert.equal(page.g("state.screen"), "results");
  assert.equal(page.g("state.imported"), true);
  assert.equal(page.el("resultTitle").textContent, "אבחון שנפתח מקוד");
  assert.equal(page.intervals.size, 0, "the abandoned run must not keep an interval alive");
  assert.equal(page.g("state.marathonEndsAt"), 0, "no marathon clock survives the imported results");
  assert.equal(page.g("state.marathon"), null);

  // Even a browser that fires a stale interval late finds nothing to finish.
  page.clock.now += (total + 1) * 60_000;
  page.g("tick()");
  assert.equal(page.g("state.screen"), "results");
  assert.equal(page.el("resultTitle").textContent, "אבחון שנפתח מקוד", "the imported diagnosis stays on screen");
  assert.equal(page.history().length, 0, "the abandoned marathon is not saved to history");
});

test("a share link opened mid-quiz stops the stopwatch and swaps the answers", () => {
  const page = bootPage();
  page.g("setCourse('hedva1')");
  page.g("startTopicDrill(Object.keys(course().quizTopics)[0])");
  assert.equal(page.g("state.screen"), "quiz");
  assert.equal(page.intervals.size, 1);

  page.openShareLink(shareCodeFor(page, "hedva1"));
  assert.equal(page.g("state.screen"), "results");
  assert.equal(page.intervals.size, 0, "the stopwatch must not tick behind the results");
  assert.equal(page.g("state.startedAt"), 0);
  assert.equal(page.g("state.answers.length"), 1, "the results show the shared rows, not the drill");
  assert.equal(page.history().length, 0);
});

test("a share link opened from the start screen still loads as before", () => {
  const page = bootPage();
  page.g("setCourse('hedva1')");
  assert.equal(page.intervals.size, 0);
  page.openShareLink(shareCodeFor(page, "hedva1"));
  assert.equal(page.g("state.screen"), "results");
  assert.equal(page.g("state.imported"), true);
  assert.equal(page.g("state.courseId"), "hedva1");
  assert.equal(page.el("shareInMsg").textContent, "נטען אבחון לקורס hedva1.");
});
