// PassPilot — two-tap confirmation for destructive buttons. No DOM. The clock is injected.
// First press arms the button for a few seconds; a second press inside that
// window confirms; the arm expires on its own. No modal, no window.confirm.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const ARM_MS = 6000;

  function createConfirm(opts) {
    const o = opts || {};
    const ttl = typeof o.ttlMs === "number" && o.ttlMs > 0 ? o.ttlMs : ARM_MS;
    let armedAt = null;

    function armed(now) {
      if (armedAt == null) return false;
      const t = typeof now === "number" ? now : Date.now();
      if (t < armedAt || t - armedAt >= ttl) {
        armedAt = null;
        return false;
      }
      return true;
    }

    function press(now) {
      const t = typeof now === "number" ? now : Date.now();
      if (armed(t)) {
        armedAt = null;
        return "confirmed";
      }
      armedAt = t;
      return "armed";
    }

    function disarm() {
      armedAt = null;
    }

    return { ttlMs: ttl, armed: armed, press: press, disarm: disarm };
  }

  function armedLabel(label) {
    const base = String(label == null ? "" : label).trim();
    return base ? "בטוח? לחיצה נוספת — " + base : "בטוח? לחיצה נוספת תאשר";
  }

  function armedHint(ttlMs) {
    const ms = typeof ttlMs === "number" && ttlMs > 0 ? ttlMs : ARM_MS;
    const sec = Math.max(1, Math.round(ms / 1000));
    return "לחיצה נוספת תוך " + sec + " שניות תבצע את הפעולה. בלי לחיצה — מתבטל מעצמו.";
  }

  return {
    ARM_MS: ARM_MS,
    createConfirm: createConfirm,
    armedLabel: armedLabel,
    armedHint: armedHint
  };
});
