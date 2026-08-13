// PassPilot — progress across local sessions. No DOM, no pass-probability.
// Compares early vs late attempts per topic on this browser only.
// Untested blueprint blocks stay untested — no invented credit.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function sibling(name, exportName, options, optionKey) {
    if (options && typeof options[optionKey] === "function") return options[optionKey];
    if (typeof globalThis !== "undefined" && typeof globalThis[exportName] === "function") {
      return globalThis[exportName];
    }
    if (typeof require === "function") return require("./" + name)[exportName];
    throw new Error(exportName + " missing");
  }

  function kindCounts(rows) {
    const out = { quiz: 0, exam: 0, marathon: 0, other: 0 };
    (Array.isArray(rows) ? rows : []).forEach(function (r) {
      const k = r && r.kind;
      if (k === "quiz" || k === "exam" || k === "marathon") out[k] += 1;
      else out.other += 1;
    });
    return out;
  }

  function mergeTopics(sessions) {
    const acc = {};
    (Array.isArray(sessions) ? sessions : []).forEach(function (r, idx) {
      const half = idx < sessions.length / 2 ? "early" : "late";
      Object.keys((r && r.topics) || {}).forEach(function (topic) {
        const cell = r.topics[topic] || {};
        const t = acc[topic] || (acc[topic] = {
          n: 0, ok: 0, earlyN: 0, earlyOk: 0, lateN: 0, lateOk: 0,
        });
        const n = Number(cell.n) || 0;
        const ok = Number(cell.ok) || 0;
        t.n += n;
        t.ok += ok;
        if (half === "early") {
          t.earlyN += n;
          t.earlyOk += ok;
        } else {
          t.lateN += n;
          t.lateOk += ok;
        }
      });
    });
    return acc;
  }

  function rate(ok, n) {
    if (!n) return null;
    return Math.round((ok / n) * 100);
  }

  function analyzeProgress(list, courseId, blueprint, options) {
    const forCourse = sibling("history", "forCourse", options, "forCourse");
    const summarize = sibling("history", "summarize", options, "summarize");
    const rows = forCourse(list, courseId).slice().sort(function (a, b) {
      return (a.ts || 0) - (b.ts || 0);
    });
    const sum = summarize(rows);
    const kinds = kindCounts(rows);
    const merged = mergeTopics(rows);
    const topics = Object.keys(merged).map(function (topic) {
      const t = merged[topic];
      const early = rate(t.earlyOk, t.earlyN);
      const late = rate(t.lateOk, t.lateN);
      const overall = rate(t.ok, t.n);
      let delta = null;
      if (early != null && late != null) delta = late - early;
      return {
        topic: topic,
        n: t.n,
        ok: t.ok,
        rate: overall,
        earlyRate: early,
        lateRate: late,
        delta: delta,
        improved: delta != null && delta >= 10,
        worsened: delta != null && delta <= -10,
      };
    }).sort(function (a, b) {
      const da = a.delta == null ? -999 : a.delta;
      const db = b.delta == null ? -999 : b.delta;
      return da - db || a.n - b.n || a.topic.localeCompare(b.topic);
    });

    const improved = topics.filter(function (t) { return t.improved; })
      .sort(function (a, b) { return b.delta - a.delta; });
    const worsened = topics.filter(function (t) { return t.worsened; })
      .sort(function (a, b) { return a.delta - b.delta; });

    const bpBlocks = blueprint && Array.isArray(blueprint.blocks) ? blueprint.blocks : [];
    const untested = bpBlocks.filter(function (b) {
      return !merged[b.topic] || merged[b.topic].n === 0;
    }).map(function (b) {
      return { topic: b.topic, label: b.label, points: b.points };
    });

    return {
      count: sum.count,
      best: sum.best,
      first: sum.first,
      last: sum.last,
      delta: sum.delta,
      kinds: kinds,
      topics: topics,
      improved: improved,
      worsened: worsened,
      untested: untested,
      caveat: "היסטוריה מקומית בדפדפן הזה בלבד. דיוק מצטבר בין מפגשים — לא תחזית ציון ולא מודל מכויל. ציון עובר באפקה הוא 60.",
    };
  }

  return {
    kindCounts: kindCounts,
    mergeTopics: mergeTopics,
    analyzeProgress: analyzeProgress,
  };
});
