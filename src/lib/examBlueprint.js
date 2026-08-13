// PassPilot — exam-structure maps and diagnosis (no pass-probability).
// Known official facts are tagged. Equal splits are tagged as assumptions.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const AFEKA_PASS = 60;

  const BLUEPRINTS = Object.freeze({
    python: {
      courseId: "python",
      title: "פייתון 10016",
      examLabel: "מועד ב׳ · 4 בלוקי כתיבת קוד",
      totalPoints: 100,
      passOfficial: AFEKA_PASS,
      pointMapNote:
        "אין מפתח נקודות רשמי בריפו. מניחים 25 נקודות לכל בלוק — הנחה שווה לשקיפות, לא ציון מועד.",
      blocks: [
        { id: "q1", topic: "recursion", label: "שאלה 1 · רקורסיה", points: 25, source: "assumed-equal" },
        { id: "q2", topic: "strings", label: "שאלה 2 · מחרוזות", points: 25, source: "assumed-equal" },
        { id: "q3", topic: "lists", label: "שאלה 3 · רשימות", points: 25, source: "assumed-equal" },
        { id: "q4", topic: "dictionaries", label: "שאלה 4 · מילונים", points: 25, source: "assumed-equal" },
      ],
    },
    arch: {
      courseId: "arch",
      title: "ארגון המחשב 10145",
      examLabel: "מועד יחיד · מבחן 18.8.2026",
      totalPoints: 100,
      passOfficial: AFEKA_PASS,
      pointMapNote:
        "שאלה 11 = 44 נקודות (מחוברת הלימוד). 55–60% מהמבחן הם datapath + pipeline + מטמון. יתרת הליבה (~16) ויתרת המבחן (~40) פוצלו בין הנושאים — פירוק שקוף, לא מפתח רשמי.",
      blocks: [
        { id: "q11", topic: "datapath", label: "שאלה 11 · Datapath", points: 44, source: "booklet" },
        { id: "pipe", topic: "pipeline", label: "Pipeline והשהיות (יתרת הליבה)", points: 8, source: "cluster-estimate" },
        { id: "cache", topic: "cache", label: "זיכרון מטמון (יתרת הליבה)", points: 8, source: "cluster-estimate" },
        { id: "fmt", topic: "formats", label: "פורמטי פקודות ורגיסטרים", points: 13, source: "remainder-split" },
        { id: "mem", topic: "memory", label: "זיכרון, יישור וסדר בתים", points: 13, source: "remainder-split" },
        { id: "num", topic: "numbers", label: "ייצוג מספרים ומשלים ל-2", points: 14, source: "remainder-split" },
      ],
    },
    hedva1: {
      courseId: "hedva1",
      title: "חדו״א 1 · 90901",
      examLabel: "מועד ב׳ · מהלכים מכניים שנושאים נקודות",
      totalPoints: 100,
      passOfficial: AFEKA_PASS,
      pointMapNote:
        "אין מפתח נקודות פומבי. 25 נקודות לכל נושא מועד — הנחה שווה לשקיפות, לא ציון מועד.",
      blocks: [
        { id: "lim", topic: "limits", label: "גבולות ורציפות", points: 25, source: "assumed-equal" },
        { id: "der", topic: "deriv", label: "נגזרות וכללי גזירה", points: 25, source: "assumed-equal" },
        { id: "an", topic: "analysis", label: "חקירת פונקציה", points: 25, source: "assumed-equal" },
        { id: "int", topic: "integrals", label: "אינטגרלים ושיטות", points: 25, source: "assumed-equal" },
      ],
    },
    hedva2: {
      courseId: "hedva2",
      title: "חדו״א 2 · 90902",
      examLabel: "מועד ב׳ · מהלכים מכניים שנושאים נקודות",
      totalPoints: 100,
      passOfficial: AFEKA_PASS,
      pointMapNote:
        "אין מפתח נקודות פומבי. 25 נקודות לכל נושא מועד — הנחה שווה לשקיפות, לא ציון מועד.",
      blocks: [
        { id: "imp", topic: "improper", label: "אינטגרלים לא אמיתיים", points: 25, source: "assumed-equal" },
        { id: "ser", topic: "series", label: "טורים והתכנסות", points: 25, source: "assumed-equal" },
        { id: "mv", topic: "multivar", label: "פונקציות רב-משתניות", points: 25, source: "assumed-equal" },
        { id: "cx", topic: "complex", label: "מספרים מרוכבים", points: 25, source: "assumed-equal" },
      ],
    },
  });

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

  function cloneBlueprint(bp) {
    if (!bp || typeof bp !== "object") return null;
    return {
      courseId: bp.courseId || "python",
      title: bp.title || "",
      examLabel: bp.examLabel || "",
      totalPoints: Number(bp.totalPoints) || 0,
      passOfficial: bp.passOfficial || AFEKA_PASS,
      pointMapNote: bp.pointMapNote || "",
      blocks: (Array.isArray(bp.blocks) ? bp.blocks : []).map(function (b) {
        return {
          id: b.id,
          topic: b.topic,
          label: b.label,
          points: b.points,
          source: b.source,
        };
      }),
    };
  }

  function parseCoordinatorBlueprint(raw, fallbackCourseId) {
    const errors = [];
    const warnings = [];
    if (raw == null || String(raw).trim() === "") {
      return { ok: false, errors: ["חסר JSON"], warnings: warnings, blueprint: null };
    }
    let data;
    try {
      data = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (e) {
      return { ok: false, errors: ["JSON לא תקין"], warnings: warnings, blueprint: null };
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false, errors: ["השורש חייב להיות אובייקט"], warnings: warnings, blueprint: null };
    }
    const courseId = data.courseId || fallbackCourseId || "python";
    const incoming = Array.isArray(data.blocks) ? data.blocks : [];
    if (!incoming.length) errors.push("חסרה רשימת blocks");
    const blocks = [];
    incoming.forEach(function (b, i) {
      if (!b || typeof b !== "object") {
        errors.push("בלוק " + (i + 1) + " אינו אובייקט");
        return;
      }
      const topic = typeof b.topic === "string" ? b.topic.trim() : "";
      const points = Number(b.points);
      if (!topic) errors.push("בלוק " + (i + 1) + " חסר topic");
      if (!Number.isFinite(points) || points <= 0) errors.push("בלוק " + (i + 1) + " חייב points חיובי");
      blocks.push({
        id: (b.id != null && String(b.id).trim() !== "") ? String(b.id) : ("b" + (i + 1)),
        topic: topic,
        label: (typeof b.label === "string" && b.label.trim()) ? b.label.trim() : topic,
        points: points,
        source: b.source || "coordinator",
      });
    });
    const totalPoints = blocks.reduce(function (s, b) { return s + (Number.isFinite(b.points) ? b.points : 0); }, 0);
    if (data.totalPoints != null && Number(data.totalPoints) !== totalPoints) {
      warnings.push("totalPoints המוצהר (" + data.totalPoints + ") שונה מסכום הבלוקים (" + totalPoints + ")");
    }
    if (totalPoints && Math.abs(totalPoints - 100) > 0.05) {
      warnings.push("סכום הנקודות הוא " + totalPoints + " ולא 100 — המפה תישמר כמו שהודבקה");
    }
    if (errors.length) return { ok: false, errors: errors, warnings: warnings, blueprint: null };
    const blueprint = {
      courseId: courseId,
      title: (typeof data.title === "string" && data.title.trim()) ? data.title.trim() : courseId,
      examLabel: (typeof data.examLabel === "string" && data.examLabel.trim()) ? data.examLabel.trim() : "מפה שהודבקה",
      totalPoints: totalPoints,
      passOfficial: AFEKA_PASS,
      pointMapNote: (typeof data.pointMapNote === "string" && data.pointMapNote.trim())
        ? data.pointMapNote.trim()
        : "מפה שהודבקה על ידי רכז הקורס בדפדפן הזה. זו לא חתימה רשמית של אפקה ולא מפתח מועד.",
      blocks: blocks,
    };
    return { ok: true, errors: [], warnings: warnings, blueprint: blueprint };
  }

  function compactBlueprint(bp) {
    if (!bp) return null;
    return {
      c: bp.courseId,
      t: bp.title,
      e: bp.examLabel,
      n: bp.pointMapNote,
      k: (bp.blocks || []).map(function (b) {
        return [b.id, b.topic, b.label, b.points, b.source || "coordinator"];
      }),
    };
  }

  function expandBlueprint(compact, fallbackCourseId) {
    if (!compact || typeof compact !== "object") return null;
    const rows = Array.isArray(compact.k) ? compact.k : [];
    if (!rows.length) return null;
    const blocks = rows.map(function (r, i) {
      if (Array.isArray(r)) {
        return {
          id: r[0] || ("b" + (i + 1)),
          topic: r[1] || "",
          label: r[2] || r[1] || "",
          points: Number(r[3]) || 0,
          source: r[4] || "coordinator",
        };
      }
      return {
        id: r.id || ("b" + (i + 1)),
        topic: r.topic || "",
        label: r.label || r.topic || "",
        points: Number(r.points) || 0,
        source: r.source || "coordinator",
      };
    }).filter(function (b) { return b.topic && b.points > 0; });
    if (!blocks.length) return null;
    const totalPoints = blocks.reduce(function (s, b) { return s + b.points; }, 0);
    return {
      courseId: compact.c || fallbackCourseId || "python",
      title: compact.t || compact.c || fallbackCourseId || "python",
      examLabel: compact.e || "מפה שהודבקה",
      totalPoints: totalPoints,
      passOfficial: AFEKA_PASS,
      pointMapNote: compact.n || "מפה שהגיעה עם קוד האבחון. זו לא חתימה רשמית של אפקה.",
      blocks: blocks,
    };
  }

  function diagnoseCourse(courseId, rows, overlay) {
    const bp = overlay || BLUEPRINTS[courseId] || BLUEPRINTS.python;
    const stats = topicStats(rows);
    const blocks = bp.blocks.map(function (b) {
      const s = stats[b.topic];
      const accuracy = s && s.n ? s.ok / s.n : null;
      const expected = accuracy == null ? null : Math.round(accuracy * b.points * 10) / 10;
      const lost = accuracy == null ? null : Math.round((1 - accuracy) * b.points * 10) / 10;
      return {
        id: b.id,
        topic: b.topic,
        label: b.label,
        points: b.points,
        source: b.source,
        attempts: s ? s.n : 0,
        accuracy: accuracy,
        expected: expected,
        lost: lost,
        sample: sampleQuality(s ? s.n : 0),
      };
    });
    const withLoss = blocks.filter(function (b) {
      return b.lost != null && b.lost > 0;
    });
    const costliest = (withLoss.length ? withLoss : blocks.slice())
      .slice()
      .sort(function (a, b) {
        const la = a.lost != null ? a.lost : a.points;
        const lb = b.lost != null ? b.lost : b.points;
        return lb - la;
      })
      .slice(0, 3);
    const expectedTotal = blocks.reduce(function (sum, b) {
      return sum + (b.expected == null ? 0 : b.expected);
    }, 0);
    const lostTotal = blocks.reduce(function (sum, b) {
      return sum + (b.lost == null ? 0 : b.lost);
    }, 0);
    const untested = blocks.filter(function (b) {
      return b.attempts === 0;
    });
    const thinCount = blocks.filter(function (b) {
      return b.sample === "thin";
    }).length;
    return {
      blueprint: bp,
      blocks: blocks,
      costliest: costliest,
      expectedTotal: Math.round(expectedTotal * 10) / 10,
      lostTotal: Math.round(lostTotal * 10) / 10,
      untestedCount: untested.length,
      thinCount: thinCount,
      hasAnswers: (rows || []).length > 0,
    };
  }

  function sampleQuality(n) {
    const k = Number(n) || 0;
    if (k <= 0) return "none";
    if (k < 2) return "thin";
    if (k < 4) return "ok";
    return "solid";
  }

  // Same gain/effort the 55-path and the 90-minute plan both read.
  // Untested accuracy is treated as 0 — no invented credit.
  function scoreBlocks(blocks) {
    return (Array.isArray(blocks) ? blocks : []).map(function (b) {
      const raw = b && b.accuracy;
      const acc = raw == null || !Number.isFinite(Number(raw)) ? 0 : Math.min(1, Math.max(0, Number(raw)));
      const pts = b && Number.isFinite(Number(b.points)) ? Number(b.points) : 0;
      const have = Math.round(acc * pts * 10) / 10;
      const gain = Math.round((pts - have) * 10) / 10;
      const effort = Math.round(Math.max(0.5, (1 - acc) * Math.max(1, pts / 20)) * 10) / 10;
      const value = effort > 0 ? Math.round((gain / effort) * 100) / 100 : 0;
      return {
        id: b && b.id,
        topic: b && b.topic,
        label: b && b.label,
        points: pts,
        accuracy: b && b.accuracy,
        attempts: b && b.attempts ? b.attempts : 0,
        sample: b && b.sample ? b.sample : sampleQuality(b && b.attempts),
        have: have,
        gain: gain,
        effort: effort,
        value: value,
      };
    });
  }

  // Greedy by points recovered per hour. Not an optimal knapsack; the steps
  // are meant to be readable on the page. Untested blocks count as 0 secured.
  function pickSecurePath(blocks, target) {
    const goal = Number(target);
    const items = scoreBlocks(blocks);
    const secured = Math.round(items.reduce(function (sum, it) { return sum + it.have; }, 0) * 10) / 10;
    const remaining = items.filter(function (it) { return it.gain > 0.05; })
      .sort(function (a, b) { return b.value - a.value || b.gain - a.gain; });
    const picked = [];
    let total = secured;
    const steps = [{
      kind: "start",
      total: secured,
      text: "מובטח לפי דיוק נוכחי × משקל בלוק: " + secured + " נקודות. יעד: " + goal + ".",
    }];
    for (let i = 0; i < remaining.length; i++) {
      if (total + 0.01 >= goal) break;
      const it = remaining[i];
      picked.push(it);
      total = Math.round((total + it.gain) * 10) / 10;
      steps.push({
        kind: "pick",
        label: it.label,
        gain: it.gain,
        effort: it.effort,
        value: it.value,
        total: total,
        text: "לוקחים «" + it.label + "»: +" + it.gain + " נק׳ תמורת ~" + it.effort +
          " שעות (" + it.value + " נק׳/שעה) → " + total,
      });
    }
    return {
      target: goal,
      secured: secured,
      total: total,
      reached: total + 0.01 >= goal,
      picked: picked,
      steps: steps,
      shortfall: Math.max(0, Math.round((goal - total) * 10) / 10),
      effortHours: Math.round(picked.reduce(function (sum, it) { return sum + it.effort; }, 0) * 10) / 10,
    };
  }

  const MARATHON_HOURS = 16;

  function allocateMarathonHours(blocks, totalHours) {
    const hours = Number(totalHours) > 0 ? Number(totalHours) : MARATHON_HOURS;
    const rows = (Array.isArray(blocks) ? blocks : []).map(function (b) {
      var weight = b.lost != null ? b.lost : b.points * 0.5;
      return {
        id: b.id,
        topic: b.topic,
        label: b.label,
        points: b.points,
        lost: b.lost,
        weight: weight,
      };
    });
    const sum = rows.reduce(function (s, r) { return s + r.weight; }, 0) || 1;
    const out = rows.map(function (r) {
      return {
        id: r.id,
        topic: r.topic,
        label: r.label,
        points: r.points,
        lost: r.lost,
        hours: Math.round((r.weight / sum) * hours * 10) / 10,
      };
    }).sort(function (a, b) { return b.hours - a.hours; });
    const drift = Math.round((hours - out.reduce(function (s, r) { return s + r.hours; }, 0)) * 10) / 10;
    if (out.length && drift !== 0) {
      out[0].hours = Math.round((out[0].hours + drift) * 10) / 10;
    }
    return out;
  }

  function marathonPrompts(costliest, blocks) {
    var src = (costliest || []).slice();
    if (src.length < 3 && Array.isArray(blocks)) {
      blocks.slice().sort(function (a, b) { return b.points - a.points; }).forEach(function (b) {
        if (src.length >= 3) return;
        if (!src.some(function (x) { return x.topic === b.topic; })) src.push(b);
      });
    }
    return src.slice(0, 3).map(function (b) {
      var pts = b.points != null ? b.points + " נק׳" : "בלוק במבנה";
      return "בבלוק «" + b.label + "» (" + pts + ") — תפתרו איתי פריט אחד בסגנון המועד ותסגרו את הטעות שחזרה בבוחן.";
    });
  }

  return {
    AFEKA_PASS: AFEKA_PASS,
    FLOOR_55: 55,
    MARATHON_HOURS: MARATHON_HOURS,
    BLUEPRINTS: BLUEPRINTS,
    topicStats: topicStats,
    cloneBlueprint: cloneBlueprint,
    parseCoordinatorBlueprint: parseCoordinatorBlueprint,
    compactBlueprint: compactBlueprint,
    expandBlueprint: expandBlueprint,
    diagnoseCourse: diagnoseCourse,
    sampleQuality: sampleQuality,
    scoreBlocks: scoreBlocks,
    pickSecurePath: pickSecurePath,
    allocateMarathonHours: allocateMarathonHours,
    marathonPrompts: marathonPrompts,
  };
});
