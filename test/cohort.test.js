const test = require("node:test");
const assert = require("node:assert/strict");
const { encodeDiagnosis } = require("../src/lib/shareCode");
const { diagnoseCourse, expandBlueprint } = require("../src/lib/examBlueprint");
const {
  extractStudentCodes,
  decodeMany,
  buildCohort,
  marathonInvite,
  shareLink,
  briefingForCourse,
} = require("../src/lib/cohort");

const pyMiss = encodeDiagnosis({
  courseId: "python",
  examDate: "2026-08-20",
  kind: "quiz",
  rows: [
    { topic: "recursion", correct: false },
    { topic: "strings", correct: true },
  ],
});
const pyMiss2 = encodeDiagnosis({
  courseId: "python",
  kind: "quiz",
  rows: [
    { topic: "recursion", correct: false },
    { topic: "lists", correct: false },
  ],
});
const archMiss = encodeDiagnosis({
  courseId: "arch",
  kind: "quiz",
  rows: [{ topic: "datapath", correct: false }],
});

test("WhatsApp wrap and surrounding text still yield two student codes", () => {
  const wrap = "הקוד שלי:\n" + pyMiss.slice(0, 18) + "\n" + pyMiss.slice(18) + "\nתודה\n" + pyMiss2;
  const codes = extractStudentCodes(wrap);
  assert.equal(codes.length, 2);
  assert.equal(codes[0], pyMiss);
  assert.equal(codes[1], pyMiss2);
});

test("two identical adjacent codes count as two students, not a paste glitch", () => {
  const blob = pyMiss + pyMiss;
  const codes = extractStudentCodes(blob);
  assert.equal(codes.length, 2);
  const many = decodeMany(blob);
  assert.equal(many.students.length, 2);
  assert.equal(many.errors.length, 0);
});

test("a flipped checksum is skipped and the valid roommate still counts", () => {
  const broken = pyMiss.slice(0, -1) + (pyMiss.slice(-1) === "a" ? "b" : "a");
  const many = decodeMany(pyMiss2 + "\n" + broken);
  assert.equal(many.students.length, 1);
  assert.equal(many.errors.length, 1);
  assert.match(many.errors[0], /שלמות|פגום/);
});

test("room briefing names the costliest shared miss and stays honest", () => {
  const cohort = buildCohort([pyMiss, pyMiss2, archMiss].join("\n"));
  assert.equal(cohort.ok, true);
  assert.equal(cohort.mixedCourses, true);
  assert.equal(cohort.nStudents, 3);
  const py = cohort.courses.find((c) => c.courseId === "python");
  const arch = cohort.courses.find((c) => c.courseId === "arch");
  assert.equal(py.n, 2);
  assert.equal(arch.n, 1);
  assert.equal(py.openers[0].topic, "recursion");
  assert.equal(py.openers[0].nMissed, 2);
  assert.match(py.briefing, /רקורסיה|recursion/);
  assert.match(arch.briefing, /Datapath|שאלה 11/);
  assert.match(cohort.caveat, /לא תחזית ציון/);
  assert.doesNotMatch(cohort.caveat, /סיכוי מעבר/);
});

test("instructor overlay wins over maps that arrived inside the codes", () => {
  const withMap = encodeDiagnosis({
    courseId: "python",
    rows: [{ topic: "recursion", correct: false }],
    b: { c: "python", t: "מועד מותאם", e: "רכז", n: "הודבק", k: [["q1", "recursion", "רקורסיה", 40, "coordinator"]] },
  });
  const overlay = {
    courseId: "python",
    title: "מפת הרכז בחדר",
    examLabel: "רכז",
    pointMapNote: "הודבקה",
    blocks: [{ id: "q1", topic: "recursion", label: "רקורסיה", points: 70, source: "coordinator" }],
    totalPoints: 70,
    passOfficial: 60,
  };
  const cohort = buildCohort(withMap, { overlays: { python: overlay } });
  const py = cohort.courses[0];
  assert.equal(py.mapSource, "instructor");
  assert.equal(py.blocks[0].points, 70);
});

test("invite and share link are copy-paste ready, without a name field", () => {
  const text = marathonInvite("פייתון 10016");
  assert.match(text, /PP1/);
  assert.match(text, /בלי שם/);
  assert.match(text, /10016/);
  assert.equal(shareLink(pyMiss), "https://swissystem7.github.io/PassPilot/#" + pyMiss);
  assert.equal(shareLink("nope").indexOf("#"), -1);
});

test("empty paste does not invent a classroom", () => {
  const cohort = buildCohort("שלום מדריך");
  assert.equal(cohort.ok, false);
  assert.equal(cohort.nStudents, 0);
});

test("briefingForCourse tells the instructor what to open with", () => {
  const text = briefingForCourse("arch", "ארגון המחשב 10145", 18, [
    { label: "שאלה 11 · Datapath", points: 44, nMissed: 14 },
    { label: "Pipeline", points: 8, nMissed: 9 },
  ], false);
  assert.match(text, /18 קודים/);
  assert.match(text, /14 סטודנטים/);
  assert.match(text, /שאלה 11/);
  assert.match(text, /Pipeline/);
});

test("diagnoseCourse is available to the roster and marks a one-shot as thin", () => {
  const diag = diagnoseCourse("python", [{ topic: "lists", correct: true }]);
  const lists = diag.blocks.find((b) => b.topic === "lists");
  assert.equal(lists.sample, "thin");
  assert.equal(diag.thinCount, 1);
  const unused = expandBlueprint;
  assert.equal(typeof unused, "function");
});
