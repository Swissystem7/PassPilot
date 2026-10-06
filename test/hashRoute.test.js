const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { encodeDiagnosis } = require("../src/lib/shareCode");
const { encodeUnlock } = require("../src/lib/access");

// hashRoute lives inline in index.html (the page is one script). Pull the
// function out and run it on its own so the routing rule is tested exactly
// as shipped, without a browser.
function loadHashRoute() {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const m = html.match(/function hashRoute\(hash\) \{[\s\S]*?\n\}/);
  assert.ok(m, "hashRoute is missing from index.html");
  const ctx = {};
  vm.runInNewContext(m[0] + "\nthis.hashRoute = hashRoute;", ctx);
  // Objects born in the vm context have a foreign prototype; copy the fields
  // so deepEqual compares values, not realms.
  return function (hash) {
    const r = ctx.hashRoute(hash);
    return { kind: r.kind, code: r.code };
  };
}

test("a #PP1 share link routes to share and a #PPU1 code routes to redeem", () => {
  const hashRoute = loadHashRoute();
  const share = encodeDiagnosis({ courseId: "10145", kind: "exam", rows: [{ topic: "stack", correct: false }] });
  const redeem = encodeUnlock({ courseId: "10145" });
  assert.deepEqual(hashRoute("#" + share), { kind: "share", code: share });
  assert.deepEqual(hashRoute("#" + redeem), { kind: "redeem", code: redeem });
});

test("the letters PPU1 inside a share code body do not hijack it into redeem", () => {
  const hashRoute = loadHashRoute();
  // The body is base64url, so PPU1 can occur there by chance; only a code that
  // starts with PPU1. at a boundary is a redeem code.
  const code = "PP1.abcPPU1def.1a2b";
  assert.equal(hashRoute("#" + code).kind, "share");
  assert.equal(hashRoute("#PPU1.PP1abc.1a2b").kind, "redeem");
});

test("percent-encoding, whitespace and unrelated anchors are handled", () => {
  const hashRoute = loadHashRoute();
  const share = encodeDiagnosis({ courseId: "python", rows: [] });
  assert.equal(hashRoute("#" + encodeURIComponent(share)).code, share);
  assert.equal(hashRoute("#" + share.slice(0, 10) + "%0A " + share.slice(10)).code, share);
  assert.deepEqual(hashRoute("#main"), { kind: "none", code: "" });
  assert.deepEqual(hashRoute(""), { kind: "none", code: "" });
  assert.deepEqual(hashRoute("#%E0%A4%A"), { kind: "none", code: "" });
});

test("a link opened in an already-open tab is routed too (hashchange)", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(html, /window\.addEventListener\("hashchange", bootFromHash\)/);
  assert.ok(html.indexOf("bootFromHash();") < html.indexOf('addEventListener("hashchange"'));
});
