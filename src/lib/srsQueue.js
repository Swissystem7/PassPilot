// PassPilot — spaced review queue for missed topics. No DOM.
// Intervals grow 1 → 3 → 7 → 14 days after a clean session.
// This is not Anki and not FSRS; it only tracks topics this demo already grades.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SRS_KEY = "passpilot.srs.v1";
  const DAY_MS = 86400000;
  const INTERVALS = [1, 3, 7, 14];

  function nextInterval(days) {
    const n = Number(days) || 0;
    for (let i = 0; i < INTERVALS.length; i++) {
      if (n < INTERVALS[i]) return INTERVALS[i];
    }
    return INTERVALS[INTERVALS.length - 1];
  }

  function parseSrs(raw) {
    if (raw == null || raw === "") return [];
    try {
      const v = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!Array.isArray(v)) return [];
      return v.filter(function (item) {
        return item && typeof item.topic === "string" && typeof item.courseId === "string";
      }).map(function (item) {
        return {
          courseId: item.courseId,
          topic: item.topic,
          reps: Number(item.reps) || 0,
          intervalDays: Number(item.intervalDays) || 1,
          due: Number(item.due) || 0,
          last: Number(item.last) || 0,
          n: Number(item.n) || 0,
          ok: Number(item.ok) || 0,
        };
      });
    } catch (e) {
      return [];
    }
  }

  function topicStats(rows) {
    const acc = {};
    (Array.isArray(rows) ? rows : []).forEach(function (a) {
      if (!a || typeof a.topic !== "string") return;
      const t = acc[a.topic] || (acc[a.topic] = { n: 0, ok: 0 });
      t.n += 1;
      if (a.correct) t.ok += 1;
    });
    return acc;
  }

  function findIndex(list, courseId, topic) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].courseId === courseId && list[i].topic === topic) return i;
    }
    return -1;
  }

  function dueItems(list, now, courseId) {
    const ts = Number(now) || 0;
    return (Array.isArray(list) ? list : []).filter(function (item) {
      if (courseId && item.courseId !== courseId) return false;
      return item.due <= ts;
    }).sort(function (a, b) {
      return a.due - b.due || a.topic.localeCompare(b.topic);
    });
  }

  function dueTopics(list, now, courseId) {
    return dueItems(list, now, courseId).map(function (item) { return item.topic; });
  }

  function applySession(list, courseId, rows, now) {
    const ts = Number(now) || 0;
    const id = courseId || "python";
    const stats = topicStats(rows);
    const next = (Array.isArray(list) ? list : []).slice();
    Object.keys(stats).forEach(function (topic) {
      const s = stats[topic];
      const missed = s.ok < s.n;
      const idx = findIndex(next, id, topic);
      const prev = idx >= 0 ? next[idx] : null;
      if (missed) {
        const item = {
          courseId: id,
          topic: topic,
          reps: 0,
          intervalDays: 1,
          due: ts + DAY_MS,
          last: ts,
          n: (prev ? prev.n : 0) + s.n,
          ok: (prev ? prev.ok : 0) + s.ok,
        };
        if (idx >= 0) next[idx] = item;
        else next.push(item);
        return;
      }
      if (!prev) return;
      const grown = nextInterval(prev.intervalDays);
      next[idx] = {
        courseId: id,
        topic: topic,
        reps: prev.reps + 1,
        intervalDays: grown,
        due: ts + grown * DAY_MS,
        last: ts,
        n: prev.n + s.n,
        ok: prev.ok + s.ok,
      };
    });
    return next;
  }

  return {
    SRS_KEY: SRS_KEY,
    DAY_MS: DAY_MS,
    INTERVALS: INTERVALS,
    nextInterval: nextInterval,
    parseSrs: parseSrs,
    dueItems: dueItems,
    dueTopics: dueTopics,
    applySession: applySession,
  };
});
