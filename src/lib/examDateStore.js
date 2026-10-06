// PassPilot — remembers the exam date per course in localStorage. No DOM.
// History, the SRS queue and coordinator maps all survive a reload; the exam
// date did not, so the tonight card and the date-aware plan fell back to the
// default horizon on the next visit. Dates that already passed are dropped.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const EXAM_DATE_KEY = "passpilot.examDate.v1";
  const ISO = /^\d{4}-\d{2}-\d{2}$/;

  function parseDates(raw) {
    if (raw == null || raw === "") return {};
    try {
      const v = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!v || typeof v !== "object" || Array.isArray(v)) return {};
      const out = {};
      Object.keys(v).forEach(function (k) {
        if (typeof v[k] === "string" && ISO.test(v[k])) out[k] = v[k];
      });
      return out;
    } catch (e) {
      return {};
    }
  }

  function todayIso(now) {
    const d = now ? new Date(now) : new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function putExamDate(store, courseId, value) {
    const next = Object.assign({}, store || {});
    const id = courseId || "python";
    const iso = value == null ? "" : String(value).trim();
    if (!ISO.test(iso)) {
      delete next[id];
      return next;
    }
    next[id] = iso;
    return next;
  }

  // A date that already passed is not restored: the field stays empty and the
  // planner uses its default horizon instead of warning about a stale exam.
  function getExamDate(store, courseId, now) {
    const id = courseId || "python";
    const iso = (store || {})[id];
    if (typeof iso !== "string" || !ISO.test(iso)) return "";
    return iso < todayIso(now) ? "" : iso;
  }

  function loadExamDates(storage) {
    const bag = storage || {};
    if (typeof bag.getItem !== "function") return {};
    try {
      return parseDates(bag.getItem(EXAM_DATE_KEY));
    } catch (e) {
      return {};
    }
  }

  function saveExamDates(storage, store) {
    const bag = storage || {};
    if (typeof bag.setItem !== "function") return false;
    try {
      bag.setItem(EXAM_DATE_KEY, JSON.stringify(store || {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  return {
    EXAM_DATE_KEY: EXAM_DATE_KEY,
    parseDates: parseDates,
    todayIso: todayIso,
    putExamDate: putExamDate,
    getExamDate: getExamDate,
    loadExamDates: loadExamDates,
    saveExamDates: saveExamDates
  };
});
