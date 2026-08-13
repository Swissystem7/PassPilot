// בדיקת אמת לתוכנית הלימוד: node selftest.mjs
// המנוע אחד — אותו src/lib/engine.js שהדף טוען.
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const { parseExamDate, futureSlots, generateInitialStudyPlan } = require("./src/lib/engine.js");

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

const day = (offset) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const topics = [
  { name: "רקורסיה", estimatedHoursTotal: 4 },
  { name: "מחרוזות", estimatedHoursTotal: 3 },
];
const build = (examDate) => {
  const exam = parseExamDate(examDate);
  return generateInitialStudyPlan(examDate, topics, futureSlots(exam.days));
};

// תאריך חסר / לא תקין / שעבר — אזהרה כנה, ובכל זאת תוכנית שמישה
for (const [value, status] of [[null, "missing"], ["", "missing"], ["לא-תאריך", "invalid"], [day(-3), "past"]]) {
  const r = build(value);
  assert.equal(r.examStatus, status, `סטטוס שגוי עבור ${value}`);
  assert.equal(r.daysToExam, null);
  assert.ok(r.warnings.length, "חסרה אזהרה");
  assert.ok(r.plan.length, "תוכנית ריקה למרות אופק ברירת מחדל");
}

// המבחן משפיע בפועל: קרוב = פחות ימים ויותר שעות ביום
const soon = build(day(2)), far = build(day(10));
assert.equal(soon.daysToExam, 2);
assert.equal(far.daysToExam, 10);
assert.equal(soon.plan.length, 2, "תוכנית קרובה חייבת לעצור לפני יום המבחן");
assert.ok(soon.plan.every((p) => p.date < day(2)), "אין לתכנן ביום המבחן");
assert.ok(soon.plan[0].hours > far.plan[0].hours, "קרוב למבחן חייב להיות אינטנסיבי יותר");
assert.ok(soon.plan.every((p) => p.type === "review"), "קרוב למבחן = חזרה בלבד");
assert.ok(far.plan.some((p) => p.type === "practice"), "רחוק מהמבחן = גם תרגול");

// שינוי תאריך משנה תוכנית (הרגרסיה המקורית: examDate היה פרמטר מת)
assert.notDeepEqual(soon.plan, far.plan);

// המבחן היום — חזרה אחת, לא תוכנית ריקה
const today = build(day(0));
assert.equal(today.daysToExam, 0);
assert.equal(today.plan.length, 1);
assert.equal(today.plan[0].date, day(0));

// אין הבטחת שווא: כשאין זמן לכל השעות הנדרשות, אומרים זאת
assert.ok(soon.warnings.some((w) => w.includes("נדרשות")), "חסרה אזהרת חוסר זמן");
// ולא מקצים יותר שעות ממה שהנושא דורש
const perTopic = far.plan.reduce((acc, p) => ({ ...acc, [p.topic]: (acc[p.topic] || 0) + p.hours }), {});
for (const t of topics) assert.ok((perTopic[t.name] || 0) <= t.estimatedHoursTotal + 0.01, `חריגה בשעות ${t.name}`);

// אופק ארוך נחתך ל-14 ימים ומדווח על כך
const long = build(day(60));
assert.equal(long.plan.length <= 14, true);
assert.ok(long.warnings.some((w) => w.includes("14")), "חסר דיווח על חיתוך האופק");

// שומר-אמת: אסור להחזיר ל-UI הסתברות מעבר לא מכוילת
const banned = [
  "סיכוי מעבר",
  "סיכויי המעבר",
  "calculateInitialPassProbability",
  "calibratePassProbability",
  "validatePassProbability",
  "probabilityBar",
  'id="probability"',
];
const honestyFiles = [
  ["index.html", html],
  ["src/lib/planner.js", readFileSync(new URL("./src/lib/planner.js", import.meta.url), "utf8")],
  ["src/lib/engine.js", readFileSync(new URL("./src/lib/engine.js", import.meta.url), "utf8")],
  ["src/lib/tonight.js", readFileSync(new URL("./src/lib/tonight.js", import.meta.url), "utf8")],
  ["src/lib/cohort.js", readFileSync(new URL("./src/lib/cohort.js", import.meta.url), "utf8")],
  ["src/lib/blueprintStore.js", readFileSync(new URL("./src/lib/blueprintStore.js", import.meta.url), "utf8")],
  ["src/lib/topicExplain.js", readFileSync(new URL("./src/lib/topicExplain.js", import.meta.url), "utf8")],
  ["src/lib/marathon.js", readFileSync(new URL("./src/lib/marathon.js", import.meta.url), "utf8")],
  ["src/lib/coursePack.js", readFileSync(new URL("./src/lib/coursePack.js", import.meta.url), "utf8")],
  ["src/lib/analytics.js", readFileSync(new URL("./src/lib/analytics.js", import.meta.url), "utf8")],
  ["src/lib/access.js", readFileSync(new URL("./src/lib/access.js", import.meta.url), "utf8")],
  ["src/lib/offer.js", readFileSync(new URL("./src/lib/offer.js", import.meta.url), "utf8")],
];
const offences = [];
honestyFiles.forEach(([name, text]) => {
  text.split("\n").forEach((line, i) => {
    for (const phrase of banned) if (line.includes(phrase)) offences.push(`${name}:${i + 1} — "${phrase}"`);
  });
});
assert.deepEqual(offences, [], `נמצאה טענת הסתברות מעבר לא מכוילת:\n${offences.join("\n")}`);

assert.equal(existsSync(join(here, "lib")), false, "תיקיית lib/ הישנה עדיין קיימת");
assert.equal(existsSync(join(here, ".github", "workflows")), false, ".github/workflows/ אסור בריפו הזה");

// החוזה מול שלושת המשתמשים חייב להישאר בדף — לא מודול יתום
for (const token of [
  'id="tonightBox"',
  'id="cohortIn"',
  'id="mapBuilder"',
  'id="inviteCopyBtn"',
  'id="marathonBtn"',
  'id="coursePackIn"',
  'id="topicExplain"',
  'id="startAnalytics"',
  'id="offerSheet"',
  'id="unionSheet"',
  'id="redeemIn"',
  'id="staffTools"',
  'id="howSteps"',
  'id="quizKeys"',
  'lang="he"',
  'dir="rtl"',
  "src/lib/tonight.js",
  "src/lib/cohort.js",
  "src/lib/blueprintStore.js",
  "src/lib/topicExplain.js",
  "src/lib/marathon.js",
  "src/lib/coursePack.js",
  "src/lib/analytics.js",
  "src/lib/access.js",
  "src/lib/offer.js",
]) {
  assert.ok(html.includes(token), "חסר בדף: " + token);
}

const startAt = html.indexOf('id="startBtn"');
const staffAt = html.indexOf('id="staffTools"');
assert.ok(startAt > 0 && staffAt > startAt, "כפתור הבוחן חייב להופיע לפני כלי המדריך");

console.log("selftest: כל הבדיקות עברו");
