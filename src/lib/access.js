// PassPilot — client-side unlock for the union diagnostic add-on.
// No server, no payment proof. A valid PPU1 code unlocks paid surfaces
// in this browser. Anyone who can open the union one-pager can mint a
// code; that is documented, not hidden.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PREFIX = "PPU1";
  const STORE_KEY = "pp_unlock_v1";
  const FREE_QUIZ_MAX = 5;
  const PAID_FEATURES = {
    marathon: true,
    exam: true,
    report: true,
    path55: true,
    marathonCard: true,
    tonight: true,
    shareOut: true,
    cohort: true,
    quizOverFree: true,
  };

  function checksum4(s) {
    let h = 5381;
    const str = String(s);
    for (let i = 0; i < str.length; i++) {
      h = (((h << 5) + h) + str.charCodeAt(i)) >>> 0;
    }
    return (h >>> 0).toString(16).padStart(8, "0").slice(-4);
  }

  function toB64url(str) {
    const input = String(str);
    let b64;
    if (typeof Buffer !== "undefined") {
      b64 = Buffer.from(input, "utf8").toString("base64");
    } else {
      const bytes = unescape(encodeURIComponent(input));
      b64 = btoa(bytes);
    }
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function fromB64url(b64) {
    let pad = String(b64).replace(/-/g, "+").replace(/_/g, "/");
    while (pad.length % 4) pad += "=";
    if (typeof Buffer !== "undefined") {
      return Buffer.from(pad, "base64").toString("utf8");
    }
    return decodeURIComponent(escape(atob(pad)));
  }

  function extractUnlock(raw) {
    const compact = String(raw == null ? "" : raw).replace(/\s+/g, "");
    const m = compact.match(/PPU1\.[A-Za-z0-9_-]+\.[0-9a-fA-F]{4}/);
    return m ? m[0] : "";
  }

  function normalizeCourse(c) {
    const id = String(c == null ? "*" : c).trim();
    return id || "*";
  }

  function normalizeTerm(t) {
    const term = String(t == null ? "" : t).trim();
    return term || "2026b";
  }

  function encodeUnlock(input) {
    const src = input || {};
    const payload = {
      v: 1,
      u: typeof src.union === "string" && src.union.trim() ? src.union.trim() : "afeka",
      t: normalizeTerm(src.term || src.t),
      c: normalizeCourse(src.courseId || src.c),
      k: src.kind === "staff" || src.k === "staff" ? "staff" : "student",
      n: Math.max(1, Math.floor(Number(src.seats || src.n) || 1)),
      s: String(src.serial || src.s || "1"),
    };
    const body = toB64url(JSON.stringify(payload));
    return PREFIX + "." + body + "." + checksum4(body);
  }

  function decodeUnlock(raw) {
    const code = extractUnlock(raw);
    if (!code) return { ok: false, error: "לא נמצא קוד מימוש שמתחיל ב־PPU1.", payload: null };
    const parts = code.split(".");
    if (parts.length !== 3 || parts[0] !== PREFIX) {
      return { ok: false, error: "מבנה הקוד אינו PPU1.", payload: null };
    }
    if (checksum4(parts[1]) !== parts[2].toLowerCase()) {
      return { ok: false, error: "הקוד פגום (בדיקת שלמות נכשלה).", payload: null };
    }
    let data;
    try {
      data = JSON.parse(fromB64url(parts[1]));
    } catch (e) {
      return { ok: false, error: "פענוח הקוד נכשל.", payload: null };
    }
    if (!data || typeof data !== "object") {
      return { ok: false, error: "הקוד אינו מכיל מימוש.", payload: null };
    }
    if (data.v != null && Number(data.v) !== 1) {
      return { ok: false, error: "גרסת קוד לא נתמכת.", payload: null };
    }
    const payload = {
      v: 1,
      union: typeof data.u === "string" && data.u.trim() ? data.u.trim() : "afeka",
      term: normalizeTerm(data.t),
      courseId: normalizeCourse(data.c),
      kind: data.k === "staff" ? "staff" : "student",
      seats: Math.max(1, Math.floor(Number(data.n) || 1)),
      serial: String(data.s || "1"),
      code: code,
    };
    return { ok: true, error: null, payload: payload };
  }

  function mintBatch(input) {
    const src = input || {};
    const count = Math.max(0, Math.min(80, Math.floor(Number(src.count) || 0)));
    const term = normalizeTerm(src.term);
    const courseId = normalizeCourse(src.courseId);
    const union = typeof src.union === "string" && src.union.trim() ? src.union.trim() : "afeka";
    const students = [];
    for (let i = 1; i <= count; i++) {
      const serial = "S" + String(i).padStart(3, "0");
      students.push({
        serial: serial,
        kind: "student",
        code: encodeUnlock({
          union: union,
          term: term,
          courseId: courseId,
          kind: "student",
          seats: 1,
          serial: serial,
        }),
      });
    }
    const staff = {
      serial: "STAFF",
      kind: "staff",
      code: encodeUnlock({
        union: union,
        term: term,
        courseId: "*",
        kind: "staff",
        seats: 1,
        serial: "STAFF",
      }),
    };
    return {
      term: term,
      courseId: courseId,
      union: union,
      students: students,
      staff: staff,
      caveat: "בלי שרת הקוד אינו הוכחת תשלום. האגודה מפיצה אותו אחרי גבייה אצלה (PayPal בדפי המרתון). מי שמייצר קוד בדף הזה עוקף את הגבול — זה ידוע.",
    };
  }

  function emptyStore() {
    return { entitlement: null, redeemedAt: "" };
  }

  function readUnlock(storage) {
    if (!storage || typeof storage.getItem !== "function") return emptyStore();
    try {
      const raw = storage.getItem(STORE_KEY);
      if (!raw) return emptyStore();
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object" || !data.entitlement) return emptyStore();
      return {
        entitlement: data.entitlement,
        redeemedAt: typeof data.redeemedAt === "string" ? data.redeemedAt : "",
      };
    } catch (e) {
      return emptyStore();
    }
  }

  function writeUnlock(storage, record) {
    if (!storage || typeof storage.setItem !== "function") return record || emptyStore();
    const rec = record || emptyStore();
    storage.setItem(STORE_KEY, JSON.stringify(rec));
    return rec;
  }

  function clearUnlock(storage) {
    if (storage && typeof storage.removeItem === "function") storage.removeItem(STORE_KEY);
    return emptyStore();
  }

  function redeemUnlock(raw, storage) {
    const decoded = decodeUnlock(raw);
    if (!decoded.ok) return { ok: false, error: decoded.error, store: readUnlock(storage) };
    const rec = {
      entitlement: decoded.payload,
      redeemedAt: new Date().toISOString().slice(0, 10),
    };
    writeUnlock(storage, rec);
    return { ok: true, error: null, store: rec };
  }

  function courseMatches(entitlement, courseId) {
    if (!entitlement) return false;
    if (entitlement.kind === "staff") return true;
    if (!entitlement.courseId || entitlement.courseId === "*") return true;
    return entitlement.courseId === String(courseId || "");
  }

  function hasPaidAccess(store, courseId) {
    const rec = store && store.entitlement ? store : null;
    const ent = rec ? rec.entitlement : (store && store.courseId ? store : null);
    return !!(ent && courseMatches(ent, courseId));
  }

  function canUse(feature, store, courseId) {
    if (!PAID_FEATURES[feature]) return true;
    return hasPaidAccess(store, courseId);
  }

  function clampQuizCount(n, store, courseId) {
    const want = Math.max(1, Math.floor(Number(n) || FREE_QUIZ_MAX));
    if (canUse("quizOverFree", store, courseId)) return want;
    return Math.min(want, FREE_QUIZ_MAX);
  }

  function lockReason(feature) {
    const map = {
      marathon: "מצב מרתון הוא חלק מתוספת האבחון לאגודה.",
      exam: "מצב מבחן 10016 הוא חלק מתוספת האבחון.",
      report: "דוח מרחק ממבנה המבחן נפתח עם קוד מימוש מהאגודה.",
      path55: "מסלול 55 נפתח עם קוד מימוש מהאגודה.",
      marathonCard: "כרטיס הכניסה למרתון נפתח עם קוד מימוש מהאגודה.",
      tonight: "כרטיס הלילה נפתח עם קוד מימוש מהאגודה.",
      shareOut: "קוד אבחון לשיתוף נפתח עם קוד מימוש מהאגודה.",
      cohort: "תדריך כיתה נפתח עם קוד מימוש מהאגודה.",
      quizOverFree: "בלי קוד מימוש הבוחן החינמי מוגבל ל־" + FREE_QUIZ_MAX + " שאלות.",
    };
    return map[feature] || "הפיצ׳ר הזה דורש קוד מימוש מהאגודה.";
  }

  return {
    PREFIX: PREFIX,
    STORE_KEY: STORE_KEY,
    FREE_QUIZ_MAX: FREE_QUIZ_MAX,
    PAID_FEATURES: PAID_FEATURES,
    checksum4: checksum4,
    extractUnlock: extractUnlock,
    encodeUnlock: encodeUnlock,
    decodeUnlock: decodeUnlock,
    mintBatch: mintBatch,
    readUnlock: readUnlock,
    writeUnlock: writeUnlock,
    clearUnlock: clearUnlock,
    redeemUnlock: redeemUnlock,
    courseMatches: courseMatches,
    hasPaidAccess: hasPaidAccess,
    canUse: canUse,
    clampQuizCount: clampQuizCount,
    lockReason: lockReason,
  };
});
