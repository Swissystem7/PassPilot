// PassPilot — per-course coordinator maps in localStorage. No DOM.
// v1 stored a single map. v2 keys maps by courseId so switching courses
// does not silently apply a Python overlay to Hedva.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const BP_STORE_V1 = "passpilot.blueprint.v1";
  const BP_STORE_V2 = "passpilot.blueprint.v2";

  function sibling(name, exportName, options, optionKey) {
    if (options && typeof options[optionKey] === "function") return options[optionKey];
    if (typeof globalThis !== "undefined" && typeof globalThis[exportName] === "function") {
      return globalThis[exportName];
    }
    if (typeof require === "function") return require("./" + name)[exportName];
    throw new Error(exportName + " missing");
  }

  function emptyStore() {
    return {};
  }

  function looksLikeBlueprint(obj) {
    return !!(obj && typeof obj === "object" && !Array.isArray(obj) && Array.isArray(obj.blocks));
  }

  function parseStore(raw) {
    if (raw == null || raw === "") return emptyStore();
    try {
      const v = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!v || typeof v !== "object" || Array.isArray(v)) return emptyStore();
      if (looksLikeBlueprint(v)) {
        const id = v.courseId || "python";
        const one = {};
        one[id] = v;
        return one;
      }
      const out = {};
      Object.keys(v).forEach(function (k) {
        if (looksLikeBlueprint(v[k])) out[k] = v[k];
      });
      return out;
    } catch (e) {
      return emptyStore();
    }
  }

  function putOverlay(store, courseId, bp) {
    const next = Object.assign({}, store || {});
    const id = courseId || (bp && bp.courseId) || "python";
    if (!bp) {
      delete next[id];
      return next;
    }
    next[id] = bp;
    return next;
  }

  function dropOverlay(store, courseId) {
    return putOverlay(store, courseId, null);
  }

  function getOverlay(store, courseId) {
    const id = courseId || "python";
    const s = store || {};
    return s[id] || null;
  }

  function loadOverlays(storage, options) {
    const bag = storage || {};
    const get = typeof bag.getItem === "function" ? function (k) { return bag.getItem(k); } : function () { return null; };
    const v2 = parseStore(get(BP_STORE_V2));
    if (Object.keys(v2).length) return v2;
    const legacy = get(BP_STORE_V1);
    if (legacy == null || legacy === "") return emptyStore();
    const migrated = parseStore(legacy);
    if (Object.keys(migrated).length) return migrated;
    try {
      const parse = sibling("examBlueprint", "parseCoordinatorBlueprint", options, "parse");
      const parsed = parse(legacy);
      if (parsed && parsed.ok && parsed.blueprint) {
        return putOverlay({}, parsed.blueprint.courseId, parsed.blueprint);
      }
    } catch (e) {}
    return emptyStore();
  }

  function saveOverlays(storage, store) {
    if (!storage || typeof storage.setItem !== "function") return false;
    try {
      storage.setItem(BP_STORE_V2, JSON.stringify(store || {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function editsToBlueprint(courseId, title, examLabel, edits, options) {
    const parse = sibling("examBlueprint", "parseCoordinatorBlueprint", options, "parse");
    const blocks = (Array.isArray(edits) ? edits : []).map(function (e, i) {
      return {
        id: (e && e.id) || ("b" + (i + 1)),
        topic: e && e.topic,
        label: e && e.label,
        points: e && e.points,
        source: "coordinator",
      };
    });
    return parse({
      courseId: courseId || "python",
      title: title || courseId,
      examLabel: examLabel || "מפה שנבנתה בטופס הרכז",
      blocks: blocks,
    });
  }

  function builtinAsEdits(blueprint) {
    const bp = blueprint || {};
    return (Array.isArray(bp.blocks) ? bp.blocks : []).map(function (b) {
      return {
        id: b.id,
        topic: b.topic,
        label: b.label,
        points: b.points,
        source: b.source || "assumed-equal",
      };
    });
  }

  function pointsTotal(edits) {
    return (Array.isArray(edits) ? edits : []).reduce(function (s, e) {
      const n = Number(e && e.points);
      return s + (Number.isFinite(n) ? n : 0);
    }, 0);
  }

  return {
    BP_STORE_V1: BP_STORE_V1,
    BP_STORE_V2: BP_STORE_V2,
    emptyStore: emptyStore,
    parseStore: parseStore,
    putOverlay: putOverlay,
    dropOverlay: dropOverlay,
    getOverlay: getOverlay,
    loadOverlays: loadOverlays,
    saveOverlays: saveOverlays,
    editsToBlueprint: editsToBlueprint,
    builtinAsEdits: builtinAsEdits,
    pointsTotal: pointsTotal,
  };
});
