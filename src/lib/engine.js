// PassPilot — one study-plan + session engine.
// Loaded by index.html and required by selftest.mjs. No DOM here.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DEFAULT_HORIZON_DAYS = 5;
  const MAX_HORIZON_DAYS = 14;

  function formatLocalDate(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function parseExamDate(value) {
    if (value == null || String(value).trim() === "") {
      return { status: "missing", days: DEFAULT_HORIZON_DAYS, daysToExam: null };
    }
    const raw = String(value).trim();
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
      return { status: "invalid", days: DEFAULT_HORIZON_DAYS, daysToExam: null };
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const dayNum = Number(match[3]);
    const exam = new Date(year, month - 1, dayNum);
    exam.setHours(0, 0, 0, 0);
    if (exam.getFullYear() !== year || exam.getMonth() !== month - 1 || exam.getDate() !== dayNum) {
      return { status: "invalid", days: DEFAULT_HORIZON_DAYS, daysToExam: null };
    }
    const today = startOfToday();
    const diff = Math.round((exam.getTime() - today.getTime()) / 86400000);
    if (diff < 0) {
      return { status: "past", days: DEFAULT_HORIZON_DAYS, daysToExam: null };
    }
    return { status: "ok", days: diff, daysToExam: diff };
  }

  function futureSlots(horizonDays) {
    const count = horizonDays === 0 ? 1 : Math.max(0, Number(horizonDays) || 0);
    const slots = [];
    for (let i = 0; i < count; i++) {
      const d = startOfToday();
      d.setDate(d.getDate() + i);
      slots.push({ day: formatLocalDate(d), startHour: 18, endHour: 19 });
    }
    return slots;
  }

  function generateInitialStudyPlan(examDate, topics, slots) {
    const parsed = parseExamDate(examDate);
    const warnings = [];
    const examStatus = parsed.status;
    const daysToExam = parsed.daysToExam;
    const list = Array.isArray(topics) ? topics : [];
    const incoming = Array.isArray(slots) ? slots : [];
    if (examStatus === "missing") warnings.push("לא צוין תאריך מבחן — נבנתה תוכנית ל־" + DEFAULT_HORIZON_DAYS + " ימים");
    else if (examStatus === "invalid") warnings.push("תאריך המבחן אינו תקין — נבנתה תוכנית ל־" + DEFAULT_HORIZON_DAYS + " ימים");
    else if (examStatus === "past") warnings.push("תאריך המבחן כבר עבר — נבנתה תוכנית ל־" + DEFAULT_HORIZON_DAYS + " ימים");
    if (daysToExam != null && daysToExam > MAX_HORIZON_DAYS) {
      warnings.push("האופק נחתך ל-14 ימים");
    }
    const usable = incoming.slice(0, MAX_HORIZON_DAYS);
    const plan = [];
    if (!list.length || !usable.length) {
      warnings.push("אין משבצות פנויות בלוח — נבנתה תוכנית ריקה");
      return { plan: plan, warnings: warnings, examStatus: examStatus, daysToExam: daysToExam };
    }
    const remaining = new Map(list.map(function (t) { return [t.name, Number(t.estimatedHoursTotal) || 0]; }));
    const ordered = list.slice().sort(function (a, b) { return b.estimatedHoursTotal - a.estimatedHoursTotal; });
    const totalNeeded = list.reduce(function (sum, t) { return sum + (Number(t.estimatedHoursTotal) || 0); }, 0);
    const closeness = daysToExam == null ? DEFAULT_HORIZON_DAYS : daysToExam;
    const hoursPerDay = closeness === 0 ? 2 : Math.min(3, 6 / Math.max(closeness, 1));
    const reviewOnly = daysToExam != null && daysToExam <= 2;
    let index = 0;
    for (let s = 0; s < usable.length; s++) {
      let topic = null;
      for (let k = 0; k < ordered.length; k++) {
        const cand = ordered[index % ordered.length];
        index++;
        if ((remaining.get(cand.name) || 0) > 0) { topic = cand; break; }
      }
      if (!topic) break;
      const rem = remaining.get(topic.name);
      const hours = Math.min(hoursPerDay, rem);
      if (hours <= 0) break;
      plan.push({
        date: usable[s].day,
        topic: topic.name,
        hours: Math.round(hours * 1000) / 1000,
        type: reviewOnly || s < 2 ? "review" : "practice"
      });
      remaining.set(topic.name, rem - hours);
    }
    const allocated = plan.reduce(function (sum, p) { return sum + p.hours; }, 0);
    if (allocated + 0.01 < totalNeeded) {
      warnings.push("נדרשות " + totalNeeded + " שעות, ונותרו רק " + (Math.round(allocated * 10) / 10) + " בלוח הזמנים");
    }
    return { plan: plan, warnings: warnings, examStatus: examStatus, daysToExam: daysToExam };
  }

  function mulberry32(seed) {
    let s = seed | 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(list, seed) {
    const r = list.slice();
    const rnd = mulberry32(seed);
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = r[i];
      r[i] = r[j];
      r[j] = tmp;
    }
    return r;
  }

  function pickQuiz(bank, topics, difficulty, count, seed) {
    const diff = difficulty === "" || difficulty == null ? null : +difficulty;
    const pool = (bank || []).filter(function (q) {
      return topics.indexOf(q.topic) > -1 && (!diff || q.difficulty === diff);
    });
    return seededShuffle(pool, seed).slice(0, Math.min(count, pool.length));
  }

  function pickExamBlocks(blocks, items, seed) {
    const rnd = mulberry32(seed);
    return (blocks || []).map(function (b) {
      const pool = (items || []).filter(function (q) { return q.topic === b.topic; });
      const pick = pool.length ? pool[Math.floor(rnd() * pool.length)] : null;
      return { number: b.number, topic: b.topic, title: b.title, emphasis: b.emphasis, item: pick };
    });
  }

  function scoreRows(rows) {
    const list = Array.isArray(rows) ? rows : [];
    const correct = list.filter(function (a) { return a && a.correct; }).length;
    const total = list.length;
    const pct = total ? Math.round(correct / total * 100) : 0;
    return { correct: correct, total: total, pct: pct };
  }

  function focusFromRanked(ranked, labels) {
    const weak = ranked.filter(function (r) { return r.errorRate > 0; }).slice(0, 3);
    const src = weak.length ? weak : ranked.slice(0, 2);
    return src.map(function (r, i) {
      return {
        name: (labels && labels[r.topic]) || r.topic,
        estimatedHoursTotal: 2 - i * 0.5
      };
    });
  }

  function planFromExamDate(examDate, focus) {
    const parsed = parseExamDate(examDate);
    return generateInitialStudyPlan(examDate, focus, futureSlots(parsed.days));
  }

  return {
    DEFAULT_HORIZON_DAYS: DEFAULT_HORIZON_DAYS,
    MAX_HORIZON_DAYS: MAX_HORIZON_DAYS,
    formatLocalDate: formatLocalDate,
    startOfToday: startOfToday,
    parseExamDate: parseExamDate,
    futureSlots: futureSlots,
    generateInitialStudyPlan: generateInitialStudyPlan,
    mulberry32: mulberry32,
    seededShuffle: seededShuffle,
    pickQuiz: pickQuiz,
    pickExamBlocks: pickExamBlocks,
    scoreRows: scoreRows,
    focusFromRanked: focusFromRanked,
    planFromExamDate: planFromExamDate
  };
});
