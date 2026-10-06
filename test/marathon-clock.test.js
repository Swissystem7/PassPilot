// Marathon clock in the page itself: the inline script of index.html runs
// inside a vm with a tiny DOM stub, fake timers and a fake clock. Regression
// for the double finish: when the clock ran out while the feedback was on
// screen, the next render finished the session twice and saved two history
// records. The clock must also keep running during the feedback.
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
function scriptBlocks(html) {
  const blocks = [];
  let from = 0;
  for (;;) {
    const open = html.indexOf("<script", from);
    if (open < 0) break;
    const openEnd = html.indexOf(">", open);
    const close = html.indexOf("</script>", openEnd);
    assert.ok(openEnd > open && close > openEnd, "unterminated script tag in index.html");
    const tag = html.slice(open, openEnd + 1);
    const srcAt = tag.indexOf('src="');
    const src = srcAt < 0 ? null : tag.slice(srcAt + 5, tag.indexOf('"', srcAt + 5));
    blocks.push({ src, body: html.slice(openEnd + 1, close) });
    from = close + "</script>".length;
  }
  return blocks;
}

function bootPage() {
  const els = new Map();
  const intervals = new Map();
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

  const g = (expr) => vm.runInContext(expr, ctx);
  const fireIntervals = () => {
    [...intervals.values()].forEach((it) => it.fn());
  };
  const history = () => JSON.parse(storage.getItem(g("HIST_KEY")) || "[]");
  return { g, clock, intervals, fireIntervals, history, storage, el: document.getElementById };
}

function unlockStaff(page) {
  const code = page.g("encodeUnlock({ kind: 'staff', courseId: '*' })");
  page.el("redeemIn").value = code;
  page.g("applyRedeem()");
  assert.equal(page.g("paidNow()"), true, "staff code must unlock the marathon");
}

test("marathon clock keeps running while the feedback is on screen", () => {
  const page = bootPage();
  unlockStaff(page);
  page.g("setCourse('hedva1')");
  page.g("startMarathon()");
  assert.equal(page.g("state.kind"), "marathon");
  assert.equal(page.g("state.screen"), "quiz");
  assert.equal(page.intervals.size, 1, "one ticking interval during the question");

  page.g("answerQuiz(0)");
  assert.equal(page.intervals.size, 1, "the marathon clock must not stop during the feedback");

  clock(page, 30_000);
  page.fireIntervals();
  assert.equal(page.g("state.screen"), "quiz", "30 seconds later the session is still open");
  assert.match(page.el("marathonClock").textContent, /נותרו/);

  clock(page, page.g("state.marathon.totalMinutes") * 60_000);
  page.fireIntervals();
  assert.equal(page.g("state.screen"), "results", "expiry during the feedback ends the session");
  assert.equal(page.g("state.marathonExpired"), true);
  assert.equal(page.intervals.size, 0, "no interval may survive the finished session");
  assert.equal(page.history().length, 1, "exactly one history record for one marathon");
  assert.equal(page.history()[0].kind, "marathon");
  assert.equal(page.history()[0].total, 1, "only the answered item counts; the rest stays untested");
});

test("rendering the next item after expiry finishes the session once, not twice", () => {
  const page = bootPage();
  unlockStaff(page);
  page.g("setCourse('hedva1')");
  page.g("startMarathon()");
  page.g("answerQuiz(0)");
  // Simulate a browser that never fired the feedback interval (tab throttled).
  page.intervals.clear();
  clock(page, page.g("state.marathon.totalMinutes") * 60_000 + 1_000);

  page.g("nextQuiz()");
  assert.equal(page.g("state.screen"), "results");
  assert.equal(page.intervals.size, 0, "renderQuizItem must not start an interval after tick() closed the session");
  page.fireIntervals();
  assert.equal(page.history().length, 1, "the finished marathon must be saved exactly once");
});

test("a code marathon that expires on the next block also finishes once", () => {
  const page = bootPage();
  unlockStaff(page);
  page.g("setCourse('python')");
  page.g("startMarathon()");
  assert.equal(page.g("state.screen"), "exam");
  page.el("codeAnswer").value = "def f(): pass";
  page.g("gradeExam(true)");
  assert.equal(page.g("state.index"), 1);
  page.intervals.clear();
  clock(page, page.g("state.marathon.totalMinutes") * 60_000 + 1_000);

  page.g("gradeExam(false)");
  assert.equal(page.g("state.screen"), "results");
  assert.equal(page.intervals.size, 0);
  page.fireIntervals();
  assert.equal(page.history().length, 1);
  assert.equal(page.history()[0].total, 2, "two graded blocks; the other two stay untested");
});

test("a plain quiz still stops its stopwatch on answer and has no marathon clock", () => {
  const page = bootPage();
  page.g("setCourse('hedva1')");
  page.g("startTopicDrill(Object.keys(course().quizTopics)[0])");
  assert.equal(page.g("state.kind"), "quiz");
  assert.equal(page.g("state.screen"), "quiz");
  assert.equal(page.intervals.size, 1);
  page.g("answerQuiz(0)");
  assert.equal(page.intervals.size, 0, "a quiz has no clock to keep alive during the feedback");
  assert.equal(page.g("marathonTick()"), false);
});

function clock(page, ms) {
  page.clock.now += ms;
}
