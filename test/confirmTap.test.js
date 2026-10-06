const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createConfirm, armedLabel, armedHint, ARM_MS } = require("../src/lib/confirmTap");

// Four buttons wipe browser-only data with no undo: session history, a pasted
// course pack, a pasted exam map and the redeemed access code. One stray tap
// used to delete on the spot. They now take two taps inside a short window.

test("first press arms, second press inside the window confirms, then it is disarmed again", () => {
  const c = createConfirm({ ttlMs: 6000 });
  assert.equal(c.armed(1000), false);
  assert.equal(c.press(1000), "armed");
  assert.equal(c.armed(1001), true);
  assert.equal(c.press(4000), "confirmed");
  assert.equal(c.armed(4001), false);
  assert.equal(c.press(4002), "armed", "after a confirm the next press starts over");
});

test("an arm expires on its own; a late press only re-arms", () => {
  const c = createConfirm({ ttlMs: 6000 });
  c.press(1000);
  assert.equal(c.armed(6999), true);
  assert.equal(c.armed(7000), false);
  assert.equal(c.press(7000), "armed");
  assert.equal(c.press(13500), "armed", "the second window expired as well");
});

test("disarm cancels a pending arm and a clock that jumps backwards never confirms", () => {
  const c = createConfirm();
  assert.equal(c.ttlMs, ARM_MS);
  c.press(5000);
  c.disarm();
  assert.equal(c.press(5001), "armed");
  assert.equal(c.press(100), "armed", "an earlier timestamp cannot confirm");
});

test("bad ttl falls back to the default and the Hebrew copy carries the button label", () => {
  assert.equal(createConfirm({ ttlMs: -5 }).ttlMs, ARM_MS);
  assert.equal(createConfirm({ ttlMs: "x" }).ttlMs, ARM_MS);
  assert.match(armedLabel("מחיקת ההיסטוריה"), /^בטוח\? .*מחיקת ההיסטוריה$/);
  assert.match(armedLabel(""), /^בטוח\?/);
  assert.match(armedHint(6000), /6 שניות/);
  assert.match(armedHint(0), new RegExp(Math.round(ARM_MS / 1000) + " שניות"));
});

// --- the page helper, run as shipped against a stub button ------------------

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function pull(name) {
  const re = new RegExp("function " + name + "\\([^)]*\\) \\{[\\s\\S]*?\\n\\}");
  const m = html.match(re);
  assert.ok(m, name + " is missing from index.html");
  return m[0];
}

function stubButton(label) {
  const attrs = {};
  return {
    textContent: label,
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null; },
    setAttribute(k, v) { attrs[k] = String(v); },
    removeAttribute(k) { delete attrs[k]; },
  };
}

function pageContext() {
  const timers = [];
  let now = 10000;
  const ctx = {
    createConfirm, armedLabel, armedHint, ARM_MS,
    Date: { now: () => now },
    setTimeout(fn, ms) { timers.push({ fn, ms }); return timers.length; },
    clearTimeout(id) { if (id) timers[id - 1] = null; },
    String, Object,
  };
  vm.runInNewContext(pull("confirmTap"), ctx);
  return {
    confirmTap: ctx.confirmTap,
    tick(ms) { now += ms; },
    fireTimers() { timers.splice(0).forEach((t) => { if (t) t.fn(); }); },
  };
}

test("one tap relabels the button and explains, the second tap within the window returns true", () => {
  const page = pageContext();
  const btn = stubButton("מחיקת ההיסטוריה");
  const msg = { textContent: "" };
  assert.equal(page.confirmTap(btn, msg), false, "a single tap must not delete");
  assert.equal(btn.textContent, armedLabel("מחיקת ההיסטוריה"));
  assert.equal(msg.textContent, armedHint(ARM_MS));
  page.tick(2000);
  assert.equal(page.confirmTap(btn, msg), true);
  assert.equal(btn.textContent, "מחיקת ההיסטוריה", "label is restored after confirming");
  assert.equal(msg.textContent, "", "the hint is cleared");
});

test("an abandoned tap restores the label when the window closes and the next tap only re-arms", () => {
  const page = pageContext();
  const btn = stubButton("הסרת המימוש מהדפדפן");
  const msg = { textContent: "" };
  page.confirmTap(btn, msg);
  page.tick(ARM_MS + 100);
  page.fireTimers();
  assert.equal(btn.textContent, "הסרת המימוש מהדפדפן");
  assert.equal(msg.textContent, "");
  assert.equal(page.confirmTap(btn, msg), false, "expired arm does not count as a confirm");
});

test("a missing button or message element does not break the handler", () => {
  const page = pageContext();
  assert.equal(page.confirmTap(null, null), true, "no button: behave as before");
  const btn = stubButton("חזרה למפה המובנית");
  assert.equal(page.confirmTap(btn, null), false);
  assert.equal(page.confirmTap(btn, null), true);
});

test("all four destructive handlers go through confirmTap and the script is loaded", () => {
  assert.match(html, /<script src="src\/lib\/confirmTap\.js"><\/script>/);
  assert.match(html, /confirmTap\(btn, \$\("clearHistoryMsg"\)\)/);
  assert.match(html, /confirmTap\(\$\("coursePackDeleteBtn"\), msg\)/);
  assert.match(html, /confirmTap\(\$\("redeemClearBtn"\), \$\("redeemMsg"\)\)/);
  assert.match(html, /confirmTap\(\$\("bpResetBtn"\), \$\("bpMsg"\)\)/);
  assert.doesNotMatch(html, /window\.confirm\(|[^.\w]confirm\(/, "no blocking confirm dialogs");
});
