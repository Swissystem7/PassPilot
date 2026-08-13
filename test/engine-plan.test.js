const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseExamDate,
  futureSlots,
  generateInitialStudyPlan,
  DEFAULT_HORIZON_DAYS,
  MAX_HORIZON_DAYS,
} = require("../src/lib/engine");

const day = (offset) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
};

const topics = [
  { name: "רקורסיה", estimatedHoursTotal: 4 },
  { name: "מחרוזות", estimatedHoursTotal: 3 },
];

const build = (examDate) => {
  const exam = parseExamDate(examDate);
  return generateInitialStudyPlan(examDate, topics, futureSlots(exam.days));
};

test("missing exam date uses the default horizon and still plans", () => {
  const r = build(null);
  assert.equal(r.examStatus, "missing");
  assert.equal(r.daysToExam, null);
  assert.equal(r.plan.length, DEFAULT_HORIZON_DAYS);
  assert.ok(r.warnings.length);
});

test("a near exam stops before the exam day and packs more hours", () => {
  const soon = build(day(2));
  const far = build(day(10));
  assert.equal(soon.daysToExam, 2);
  assert.equal(soon.plan.length, 2);
  assert.ok(soon.plan.every((p) => p.date < day(2)));
  assert.ok(soon.plan[0].hours > far.plan[0].hours);
  assert.ok(soon.warnings.some((w) => w.includes("נדרשות")));
});

test("a 60-day horizon is cut to 14 days and reported", () => {
  const long = build(day(60));
  assert.ok(long.plan.length <= MAX_HORIZON_DAYS);
  assert.ok(long.warnings.some((w) => w.includes("14")));
});

test("an empty slot list warns in Hebrew, not English", () => {
  const r = generateInitialStudyPlan(day(10), topics, []);
  assert.equal(r.plan.length, 0);
  assert.ok(r.warnings.some((w) => /עברית|משבצות|ריקה/.test(w) || /[\u0590-\u05FF]/.test(w)));
  assert.equal(r.warnings.some((w) => /No available/.test(w)), false);
});

test("exam today yields a single local-date session", () => {
  const today = build(day(0));
  assert.equal(today.daysToExam, 0);
  assert.equal(today.plan.length, 1);
  assert.equal(today.plan[0].date, day(0));
});
