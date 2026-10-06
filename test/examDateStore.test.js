const test = require("node:test");
const assert = require("node:assert/strict");
const {
  EXAM_DATE_KEY,
  parseDates,
  todayIso,
  putExamDate,
  getExamDate,
  loadExamDates,
  saveExamDates,
} = require("../src/lib/examDateStore");

function memStorage(initial) {
  const bag = Object.assign({}, initial || {});
  return {
    getItem: (k) => (k in bag ? bag[k] : null),
    setItem: (k, v) => { bag[k] = String(v); },
    bag,
  };
}

function plusDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return todayIso(d);
}

test("the exam date is kept per course and survives a reload", () => {
  const storage = memStorage();
  let store = putExamDate({}, "python", plusDays(5));
  store = putExamDate(store, "hedva1", plusDays(9));
  assert.equal(saveExamDates(storage, store), true);
  const back = loadExamDates(storage);
  assert.equal(getExamDate(back, "python"), plusDays(5));
  assert.equal(getExamDate(back, "hedva1"), plusDays(9));
  assert.equal(getExamDate(back, "arch"), "", "a course without a date stays empty");
});

test("switching course does not leak the Python date into Hedva", () => {
  const store = putExamDate({}, "python", plusDays(3));
  assert.equal(getExamDate(store, "hedva1"), "");
});

test("a date that already passed is not restored", () => {
  const store = putExamDate({}, "python", "2026-01-10");
  assert.equal(getExamDate(store, "python", new Date(2026, 0, 11)), "");
  assert.equal(getExamDate(store, "python", new Date(2026, 0, 10)), "2026-01-10", "exam day itself still counts");
});

test("clearing the field removes the stored date", () => {
  let store = putExamDate({}, "python", plusDays(2));
  store = putExamDate(store, "python", "");
  assert.deepEqual(store, {});
  store = putExamDate(store, "python", "not-a-date");
  assert.deepEqual(store, {});
});

test("garbage in localStorage is ignored instead of throwing", () => {
  assert.deepEqual(parseDates("{broken"), {});
  assert.deepEqual(parseDates("[]"), {});
  assert.deepEqual(parseDates(JSON.stringify({ python: 42, arch: "2026-12-01", x: "12/01/2026" })), { arch: "2026-12-01" });
  assert.deepEqual(loadExamDates(null), {});
  assert.deepEqual(loadExamDates({}), {});
  const throwing = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
  assert.deepEqual(loadExamDates(throwing), {});
  assert.equal(saveExamDates(throwing, {}), false);
});

test("the storage key is versioned and separate from history", () => {
  assert.match(EXAM_DATE_KEY, /^passpilot\.examDate\.v\d+$/);
});

test("index.html loads the store before the first course is selected and saves on change", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(html, /<script src="src\/lib\/examDateStore\.js"><\/script>/);
  const load = html.indexOf("loadStoredExamDates();");
  const firstCourse = html.indexOf('setCourse("python");\nbind();') >= 0
    ? html.indexOf('setCourse("python");\nbind();')
    : html.indexOf('setCourse("python");\r\nbind();');
  assert.ok(load > 0, "boot never loads stored exam dates");
  assert.ok(firstCourse > load, "stored dates must load before setCourse restores the field");
  assert.match(html, /getExamDate\(state\.examDates, id\)/, "setCourse restores the per-course date");
  assert.match(html, /addEventListener\("change", function \(\) \{\s*persistExamDate\(\);/, "change persists the date");
});
