const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

test("the leftover pass-probability kit is gone from the repo", () => {
  assert.equal(fs.existsSync(path.join(root, "lib")), false);
  assert.equal(fs.existsSync(path.join(root, ".github", "workflows")), false);
  const planner = require("../src/lib/planner");
  assert.equal(typeof planner.calculateInitialPassProbability, "undefined");
  assert.equal(typeof planner.generateInitialStudyPlan, "undefined");
});

test("running product files do not ship an uncalibrated pass-probability", () => {
  const banned = [
    "calculateInitialPassProbability",
    "calibratePassProbability",
    "validatePassProbability",
    'id="probability"',
    "probabilityBar",
  ];
  const files = [
    "index.html",
    "src/lib/planner.js",
    "src/lib/engine.js",
    "src/lib/examBlueprint.js",
    "src/lib/access.js",
    "src/lib/offer.js",
    "src/lib/tonight.js",
    "src/lib/marathon.js",
  ];
  const hits = [];
  files.forEach((rel) => {
    const text = read(rel);
    banned.forEach((phrase) => {
      if (text.includes(phrase)) hits.push(rel + " → " + phrase);
    });
  });
  assert.deepEqual(hits, []);
});

test("the page is Hebrew RTL with a skip link and a first-screen start button before staff tools", () => {
  const html = read("index.html");
  assert.match(html, /<html lang="he" dir="rtl">/);
  assert.match(html, /class="skip-link"[^>]*href="#main"/);
  assert.match(html, /id="startBtn"/);
  const startBtn = html.indexOf('id="startBtn"');
  const staff = html.indexOf('id="staffTools"');
  assert.ok(startBtn > 0, "missing start button");
  assert.ok(staff > 0, "missing staff tools grouping");
  assert.ok(startBtn < staff, "primary start must sit above instructor tools");
});
