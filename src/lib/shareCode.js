// PassPilot — shareable diagnosis code. No DOM, no names, no server.
// The union can WhatsApp a PP1.… code; anyone who pastes it reconstructs
// topic accuracy + optional coordinator map. Timing is not in the code.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PREFIX = "PP1";

  function rowsToTriples(rows) {
    const acc = {};
    (Array.isArray(rows) ? rows : []).forEach(function (a) {
      if (!a || typeof a.topic !== "string") return;
      const t = acc[a.topic] || (acc[a.topic] = { n: 0, ok: 0 });
      t.n += 1;
      if (a.correct) t.ok += 1;
    });
    return Object.keys(acc).sort().map(function (k) {
      return [k, acc[k].n, acc[k].ok];
    });
  }

  function triplesToRows(triples) {
    const rows = [];
    (Array.isArray(triples) ? triples : []).forEach(function (tr) {
      if (!Array.isArray(tr) || typeof tr[0] !== "string" || !tr[0]) return;
      const n = Math.max(0, Math.floor(Number(tr[1]) || 0));
      const ok = Math.max(0, Math.min(n, Math.floor(Number(tr[2]) || 0)));
      for (let i = 0; i < n; i++) {
        rows.push({ topic: tr[0], correct: i < ok, secondsSpent: 0 });
      }
    });
    return rows;
  }

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

  function extractCode(raw) {
    const compact = String(raw == null ? "" : raw).replace(/\s+/g, "");
    const m = compact.match(/PP1\.[A-Za-z0-9_-]+\.[0-9a-fA-F]{4}/);
    return m ? m[0] : "";
  }

  function encodeDiagnosis(input) {
    const src = input || {};
    const payload = {
      v: 1,
      c: src.courseId || src.c || "python",
      d: src.examDate || src.d || "",
      k: src.kind || src.k || "quiz",
      t: Array.isArray(src.t) ? src.t : rowsToTriples(src.rows || src.answers || []),
    };
    if (src.b) payload.b = src.b;
    const body = toB64url(JSON.stringify(payload));
    return PREFIX + "." + body + "." + checksum4(body);
  }

  function decodeDiagnosis(raw) {
    const code = extractCode(raw);
    if (!code) return { ok: false, error: "לא נמצא קוד שמתחיל ב־PP1.", payload: null };
    const parts = code.split(".");
    if (parts.length !== 3 || parts[0] !== PREFIX) {
      return { ok: false, error: "מבנה הקוד אינו PP1.", payload: null };
    }
    const body = parts[1];
    const sum = parts[2].toLowerCase();
    if (checksum4(body) !== sum) {
      return { ok: false, error: "הקוד פגום (בדיקת שלמות נכשלה).", payload: null };
    }
    let data;
    try {
      data = JSON.parse(fromB64url(body));
    } catch (e) {
      return { ok: false, error: "פענוח הקוד נכשל.", payload: null };
    }
    if (!data || typeof data !== "object") {
      return { ok: false, error: "הקוד אינו מכיל אבחון.", payload: null };
    }
    if (data.v != null && Number(data.v) !== 1) {
      return { ok: false, error: "גרסת קוד לא נתמכת.", payload: null };
    }
    if (typeof data.c !== "string" || !data.c.trim()) {
      return { ok: false, error: "חסר מזהה קורס בקוד.", payload: null };
    }
    if (data.t != null && !Array.isArray(data.t)) {
      return { ok: false, error: "טבלת הנושאים בקוד אינה תקינה.", payload: null };
    }
    const payload = {
      v: 1,
      courseId: data.c.trim(),
      examDate: typeof data.d === "string" ? data.d : "",
      kind: data.k === "exam" ? "exam" : "quiz",
      triples: Array.isArray(data.t) ? data.t : [],
      rows: triplesToRows(data.t),
      blueprint: data.b || null,
    };
    return { ok: true, error: null, payload: payload };
  }

  return {
    PREFIX: PREFIX,
    rowsToTriples: rowsToTriples,
    triplesToRows: triplesToRows,
    checksum4: checksum4,
    extractCode: extractCode,
    encodeDiagnosis: encodeDiagnosis,
    decodeDiagnosis: decodeDiagnosis,
  };
});
