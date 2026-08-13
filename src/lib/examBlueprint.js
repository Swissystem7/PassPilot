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
      examLabel: "מועד יחיד · מבחן 18.8",
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

  function diagnoseCourse(courseId, rows) {
    const bp = BLUEPRINTS[courseId] || BLUEPRINTS.python;
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
    return {
      blueprint: bp,
      blocks: blocks,
      costliest: costliest,
      expectedTotal: Math.round(expectedTotal * 10) / 10,
      lostTotal: Math.round(lostTotal * 10) / 10,
      untestedCount: untested.length,
      hasAnswers: (rows || []).length > 0,
    };
  }

  // Greedy by points recovered per hour. Not an optimal knapsack; the steps
  // are meant to be readable on the page. Untested blocks count as 0 secured.
  function pickSecurePath(blocks, target) {
    const goal = Number(target);
    const items = (Array.isArray(blocks) ? blocks : []).map(function (b) {
      const acc = b.accuracy == null ? 0 : b.accuracy;
      const have = Math.round(acc * b.points * 10) / 10;
      const gain = Math.round((b.points - have) * 10) / 10;
      const effort = Math.round(Math.max(0.5, (1 - acc) * Math.max(1, b.points / 20)) * 10) / 10;
      const value = effort > 0 ? Math.round((gain / effort) * 100) / 100 : 0;
      return {
        id: b.id,
        topic: b.topic,
        label: b.label,
        points: b.points,
        accuracy: b.accuracy,
        have: have,
        gain: gain,
        effort: effort,
        value: value,
      };
    });
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
    return rows.map(function (r) {
      return {
        id: r.id,
        topic: r.topic,
        label: r.label,
        points: r.points,
        lost: r.lost,
        hours: Math.round((r.weight / sum) * hours * 10) / 10,
      };
    }).sort(function (a, b) { return b.hours - a.hours; });
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
    diagnoseCourse: diagnoseCourse,
    pickSecurePath: pickSecurePath,
    allocateMarathonHours: allocateMarathonHours,
    marathonPrompts: marathonPrompts,
  };
});
