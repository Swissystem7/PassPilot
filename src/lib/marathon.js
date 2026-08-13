// PassPilot — timed exam-structure simulation ("מצב מרתון").
// Walks every blueprint block under one clock. Not the official seating,
// not a pass forecast. Minutes follow the point map; leftover seconds
// are parked on the heaviest block so the sum matches the budget.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DEFAULT_CODE_MINUTES = 180;
  const DEFAULT_MCQ_MINUTES = 120;
  const DEFAULT_MCQ_COUNT = 16;

  function sibling(name, exportName, options, optionKey) {
    if (options && typeof options[optionKey] === "function") return options[optionKey];
    if (typeof globalThis !== "undefined" && typeof globalThis[exportName] === "function") {
      return globalThis[exportName];
    }
    if (typeof require === "function") return require("./" + name)[exportName];
    throw new Error(exportName + " missing");
  }

  function defaultMinutes(mode) {
    return mode === "code" ? DEFAULT_CODE_MINUTES : DEFAULT_MCQ_MINUTES;
  }

  function detectMode(course) {
    const c = course || {};
    if (c.hasExam && Array.isArray(c.examItems) && c.examItems.length &&
        Array.isArray(c.examBlocks) && c.examBlocks.length) {
      return "code";
    }
    return "mcq";
  }

  function allocateMinutes(blocks, totalMinutes) {
    const hours = Number(totalMinutes) > 0 ? Number(totalMinutes) : DEFAULT_MCQ_MINUTES;
    const rows = (Array.isArray(blocks) ? blocks : []).map(function (b) {
      return {
        id: b && b.id,
        topic: b && b.topic,
        label: b && b.label,
        points: b && Number(b.points) > 0 ? Number(b.points) : 0,
      };
    }).filter(function (b) { return b.topic && b.points > 0; });
    const sum = rows.reduce(function (s, r) { return s + r.points; }, 0) || 1;
    const out = rows.map(function (r) {
      return {
        id: r.id,
        topic: r.topic,
        label: r.label,
        points: r.points,
        minutes: Math.max(1, Math.round((r.points / sum) * hours)),
      };
    });
    const drift = hours - out.reduce(function (s, r) { return s + r.minutes; }, 0);
    if (out.length && drift !== 0) {
      const heaviest = out.slice().sort(function (a, b) { return b.points - a.points; })[0];
      heaviest.minutes = Math.max(1, heaviest.minutes + drift);
    }
    return out;
  }

  function countsForBlocks(blocks, totalQuestions) {
    const rows = Array.isArray(blocks) ? blocks : [];
    const total = Number(totalQuestions) > 0 ? Number(totalQuestions) : DEFAULT_MCQ_COUNT;
    const sum = rows.reduce(function (s, b) { return s + (Number(b.points) || 0); }, 0) || 1;
    const out = rows.map(function (b) {
      return {
        id: b.id,
        topic: b.topic,
        label: b.label,
        points: b.points,
        count: Math.max(1, Math.round(((Number(b.points) || 0) / sum) * total)),
      };
    });
    const drift = total - out.reduce(function (s, r) { return s + r.count; }, 0);
    if (out.length && drift !== 0) {
      const heaviest = out.slice().sort(function (a, b) { return b.points - a.points; })[0];
      heaviest.count = Math.max(1, heaviest.count + drift);
    }
    return out;
  }

  function remainingMs(endsAt, now) {
    const end = Number(endsAt) || 0;
    const t = Number(now) || 0;
    return Math.max(0, end - t);
  }

  function formatCountdown(ms) {
    const sec = Math.max(0, Math.floor(Number(ms) / 1000));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = function (n) { return String(n).padStart(2, "0"); };
    if (h > 0) return pad(h) + ":" + pad(m) + ":" + pad(s);
    return pad(m) + ":" + pad(s);
  }

  function clockState(endsAt, now) {
    const left = remainingMs(endsAt, now);
    return {
      remainingMs: left,
      expired: left <= 0,
      warn: left > 0 && left <= 5 * 60 * 1000,
      label: formatCountdown(left),
    };
  }

  function buildMarathon(input) {
    const opts = input || {};
    const course = opts.course || {};
    const bp = opts.blueprint || {};
    const blocks = Array.isArray(bp.blocks) ? bp.blocks : [];
    if (!blocks.length) {
      return { ok: false, error: "אין מפת מבנה לקורס — אי אפשר לבנות סימולציית מרתון.", spec: null };
    }
    const mode = opts.mode || detectMode(course);
    const totalMinutes = Number(opts.minutes) > 0 ? Number(opts.minutes) : defaultMinutes(mode);
    const seed = opts.seed == null ? 1 : (opts.seed | 0);
    const timed = allocateMinutes(blocks, totalMinutes);
    const caveat = "סימולציית מבנה מתוזמנת לפי מפת הנקודות. זה לא שעון המועד הרשמי ולא תחזית ציון. ציון עובר באפקה הוא 60.";

    if (mode === "code") {
      const pickExam = sibling("engine", "pickExamBlocks", opts, "pickExamBlocks");
      const picked = pickExam(course.examBlocks || [], course.examItems || [], seed);
      const items = (picked || []).filter(function (p) { return p && p.item; }).map(function (p) {
        const slot = timed.filter(function (t) { return t.topic === p.topic; })[0];
        return {
          mode: "code",
          topic: p.topic,
          title: p.title,
          emphasis: p.emphasis,
          item: p.item,
          number: p.number,
          blockLabel: (slot && slot.label) || p.title,
          blockMinutes: slot ? slot.minutes : null,
        };
      });
      if (!items.length) {
        return { ok: false, error: "אין פריטי כתיבת קוד לסימולציה.", spec: null };
      }
      return {
        ok: true,
        error: "",
        spec: {
          kind: "marathon",
          mode: "code",
          totalMinutes: totalMinutes,
          blocks: timed,
          items: items,
          caveat: caveat,
        },
      };
    }

    const pick = sibling("engine", "pickQuiz", opts, "pickQuiz");
    const counts = countsForBlocks(blocks, opts.questionCount || DEFAULT_MCQ_COUNT);
    const bank = Array.isArray(course.questions) ? course.questions : [];
    const items = [];
    counts.forEach(function (slot, i) {
      const chosen = pick(bank, [slot.topic], "", slot.count, seed + i * 17) || [];
      chosen.forEach(function (q) {
        const copy = {};
        Object.keys(q).forEach(function (k) { copy[k] = q[k]; });
        copy.blockLabel = slot.label;
        copy.blockId = slot.id;
        copy.blockMinutes = slot.minutes;
        copy.mode = "mcq";
        items.push(copy);
      });
    });
    if (!items.length) {
      return { ok: false, error: "אין שאלות רב-ברירה לבלוקים שבמפה.", spec: null };
    }
    return {
      ok: true,
      error: "",
      spec: {
        kind: "marathon",
        mode: "mcq",
        totalMinutes: totalMinutes,
        blocks: timed,
        items: items,
        caveat: caveat,
      },
    };
  }

  return {
    DEFAULT_CODE_MINUTES: DEFAULT_CODE_MINUTES,
    DEFAULT_MCQ_MINUTES: DEFAULT_MCQ_MINUTES,
    DEFAULT_MCQ_COUNT: DEFAULT_MCQ_COUNT,
    defaultMinutes: defaultMinutes,
    detectMode: detectMode,
    allocateMinutes: allocateMinutes,
    countsForBlocks: countsForBlocks,
    remainingMs: remainingMs,
    formatCountdown: formatCountdown,
    clockState: clockState,
    buildMarathon: buildMarathon,
  };
});
