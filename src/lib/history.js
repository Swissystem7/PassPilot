// PassPilot — per-course session history. No DOM. Storage is injected.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const HIST_KEY = "passpilot.history.v1";
  const HIST_MAX = 20;

  function byTopic(rows) {
    const acc = {};
    (Array.isArray(rows) ? rows : []).forEach(function (a) {
      if (!a || typeof a.topic !== "string") return;
      const t = acc[a.topic] || (acc[a.topic] = { n: 0, ok: 0 });
      t.n += 1;
      if (a.correct) t.ok += 1;
    });
    return acc;
  }

  function makeRecord(rows, courseId, kind, ts) {
    const list = Array.isArray(rows) ? rows : [];
    const correct = list.filter(function (a) { return a && a.correct; }).length;
    const total = list.length;
    return {
      ts: ts || Date.now(),
      courseId: courseId || "python",
      kind: kind || "quiz",
      total: total,
      correct: correct,
      pct: total ? Math.round(correct / total * 100) : 0,
      topics: byTopic(list)
    };
  }

  function appendRecord(list, rec, max) {
    const cap = max > 0 ? max : HIST_MAX;
    const next = (Array.isArray(list) ? list : []).concat(rec);
    return next.slice(-cap);
  }

  function forCourse(list, courseId) {
    const id = courseId || "python";
    return (Array.isArray(list) ? list : []).filter(function (r) {
      return (r.courseId || "python") === id;
    });
  }

  function clearCourse(list, courseId) {
    const id = courseId || "python";
    return (Array.isArray(list) ? list : []).filter(function (r) {
      return (r.courseId || "python") !== id;
    });
  }

  function parseStored(raw) {
    if (raw == null || raw === "") return [];
    try {
      const v = typeof raw === "string" ? JSON.parse(raw) : raw;
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }

  function summarize(list) {
    const rows = Array.isArray(list) ? list : [];
    if (!rows.length) {
      return { count: 0, best: 0, first: null, last: null, delta: null, topics: {} };
    }
    const best = rows.reduce(function (m, r) { return r.pct > m ? r.pct : m; }, 0);
    const first = rows[0].pct;
    const last = rows[rows.length - 1].pct;
    const topics = {};
    rows.forEach(function (r) {
      Object.keys(r.topics || {}).forEach(function (k) {
        const a = topics[k] || (topics[k] = { n: 0, ok: 0 });
        a.n += r.topics[k].n;
        a.ok += r.topics[k].ok;
      });
    });
    return {
      count: rows.length,
      best: best,
      first: first,
      last: last,
      delta: rows.length > 1 ? last - first : null,
      topics: topics
    };
  }

  return {
    HIST_KEY: HIST_KEY,
    HIST_MAX: HIST_MAX,
    byTopic: byTopic,
    makeRecord: makeRecord,
    appendRecord: appendRecord,
    forCourse: forCourse,
    clearCourse: clearCourse,
    parseStored: parseStored,
    summarize: summarize
  };
});
