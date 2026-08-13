const test = require("node:test");
const assert = require("node:assert/strict");
const { getCourse } = require("../src/lib/banks");
const { BLUEPRINTS } = require("../src/lib/examBlueprint");
const {
  allocateMinutes,
  countsForBlocks,
  detectMode,
  defaultMinutes,
  clockState,
  formatCountdown,
  buildMarathon,
  DEFAULT_CODE_MINUTES,
  DEFAULT_MCQ_MINUTES,
} = require("../src/lib/marathon");

test("minutes follow the point map and still sum to the budget", () => {
  const rows = allocateMinutes(BLUEPRINTS.arch.blocks, 120);
  const datapath = rows.find((r) => r.topic === "datapath");
  const cache = rows.find((r) => r.topic === "cache");
  assert.ok(datapath.minutes > cache.minutes, "Q11 must get more clock than cache");
  assert.equal(rows.reduce((s, r) => s + r.minutes, 0), 120);
});

test("python is a code marathon; hedva is mcq; defaults match the mode", () => {
  assert.equal(detectMode(getCourse("python")), "code");
  assert.equal(detectMode(getCourse("hedva1")), "mcq");
  assert.equal(defaultMinutes("code"), DEFAULT_CODE_MINUTES);
  assert.equal(defaultMinutes("mcq"), DEFAULT_MCQ_MINUTES);
});

test("a python marathon walks every code block under one caveat", () => {
  const built = buildMarathon({
    course: getCourse("python"),
    blueprint: BLUEPRINTS.python,
    seed: 7,
    minutes: 180,
  });
  assert.equal(built.ok, true);
  assert.equal(built.spec.mode, "code");
  assert.equal(built.spec.items.length, 4);
  assert.equal(built.spec.blocks.length, 4);
  assert.ok(built.spec.items.every((it) => it.item && it.item.referenceSolution));
  assert.match(built.spec.caveat, /לא שעון המועד הרשמי/);
  assert.match(built.spec.caveat, /לא תחזית ציון/);
  assert.doesNotMatch(built.spec.caveat, /סיכוי מעבר/);
});

test("an arch marathon gives datapath more items than a remainder topic", () => {
  const built = buildMarathon({
    course: getCourse("arch"),
    blueprint: BLUEPRINTS.arch,
    seed: 3,
    minutes: 120,
    questionCount: 16,
  });
  assert.equal(built.ok, true);
  assert.equal(built.spec.mode, "mcq");
  const byTopic = {};
  built.spec.items.forEach((q) => { byTopic[q.topic] = (byTopic[q.topic] || 0) + 1; });
  assert.ok(byTopic.datapath > byTopic.cache);
  assert.ok(built.spec.items.every((q) => q.explanation && q.options));
  const counts = countsForBlocks(BLUEPRINTS.arch.blocks, 16);
  assert.equal(counts.reduce((s, r) => s + r.count, 0), 16);
});

test("no blueprint and an empty bank are rejected in Hebrew", () => {
  assert.equal(buildMarathon({ course: getCourse("python"), blueprint: { blocks: [] } }).ok, false);
  const empty = buildMarathon({
    course: { questions: [], hasExam: false },
    blueprint: BLUEPRINTS.hedva1,
  });
  assert.equal(empty.ok, false);
  assert.match(empty.error, /אין שאלות|אין פריט/);
});

test("the clock warns under five minutes and expires at zero", () => {
  const now = 1_000_000;
  const ok = clockState(now + 10 * 60 * 1000, now);
  assert.equal(ok.expired, false);
  assert.equal(ok.warn, false);
  const warn = clockState(now + 4 * 60 * 1000, now);
  assert.equal(warn.warn, true);
  assert.equal(warn.expired, false);
  const done = clockState(now - 1, now);
  assert.equal(done.expired, true);
  assert.equal(done.label, "00:00");
  assert.equal(formatCountdown(3661000), "01:01:01");
});
